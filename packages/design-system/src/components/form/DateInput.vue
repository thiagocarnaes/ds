<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import {
  buildCalendarMonthGrid,
  dateInputPlaceholder,
  formatIsoForLocale,
  formatMonthYear,
  getWeekdayLabels,
  parseIsoDate,
  parseLocaleDateInput,
  toIsoDate,
} from '@/lib/dateUtils'
import { formInputVariants, type FormInputVariants } from './formInputVariants'

export interface DateInputProps extends /* @vue-ignore */ FormInputVariants {
  size?: FormInputVariants['size']
  modelValue?: string
  locale?: string
  disabled?: boolean
  clearLabel?: string
  todayLabel?: string
  id?: string
  class?: string
  'aria-label'?: string
}

const props = withDefaults(defineProps<DateInputProps>(), {
  modelValue: '',
  locale: 'en',
  disabled: false,
  size: 'md',
  clearLabel: undefined,
  todayLabel: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const rootRef = ref<HTMLElement | null>(null)
const open = ref(false)
const displayValue = ref('')
const viewDate = ref(new Date())

const resolvedClearLabel = computed(() =>
  props.clearLabel ?? (props.locale === 'pt-BR' ? 'Limpar' : 'Clear'),
)
const resolvedTodayLabel = computed(() =>
  props.todayLabel ?? (props.locale === 'pt-BR' ? 'Hoje' : 'Today'),
)
const placeholder = computed(() => dateInputPlaceholder(props.locale))
const weekdayLabels = computed(() => getWeekdayLabels(props.locale))

const inputClasses = computed(() =>
  cn(
    formInputVariants({
      size: props.size,
      error: false,
      success: false,
    }),
    'w-full pr-9',
  ),
)

const monthLabel = computed(() =>
  formatMonthYear(viewDate.value.getFullYear(), viewDate.value.getMonth(), props.locale),
)

const calendarDays = computed(() =>
  buildCalendarMonthGrid(
    viewDate.value.getFullYear(),
    viewDate.value.getMonth(),
    props.modelValue,
    props.locale,
  ),
)

function syncDisplayFromModel(): void {
  displayValue.value = props.modelValue ? formatIsoForLocale(props.modelValue, props.locale) : ''
}

function syncViewFromModel(): void {
  const parsed = props.modelValue ? parseIsoDate(props.modelValue) : null
  viewDate.value = parsed ?? new Date()
}

watch(
  () => [props.modelValue, props.locale] as const,
  () => {
    syncDisplayFromModel()
    syncViewFromModel()
  },
  { immediate: true },
)

watch(
  () => props.disabled,
  (isDisabled) => {
    if (isDisabled) closeCalendar()
  },
)

function emitValue(iso: string): void {
  emit('update:modelValue', iso)
  syncDisplayFromModel()
}

function onDisplayInput(event: Event): void {
  displayValue.value = (event.target as HTMLInputElement).value
}

function commitDisplayValue(): void {
  const parsed = parseLocaleDateInput(displayValue.value, props.locale)
  if (parsed === null) {
    syncDisplayFromModel()
    return
  }
  emitValue(parsed)
  if (parsed) {
    const date = parseIsoDate(parsed)
    if (date) viewDate.value = date
  }
}

function toggleCalendar(): void {
  if (props.disabled) return
  open.value = !open.value
  if (open.value) syncViewFromModel()
}

function closeCalendar(): void {
  open.value = false
}

function selectDay(iso: string): void {
  emitValue(iso)
  closeCalendar()
}

function clearValue(): void {
  emitValue('')
  closeCalendar()
}

function selectToday(): void {
  emitValue(toIsoDate(new Date()))
  viewDate.value = new Date()
  closeCalendar()
}

function shiftMonth(delta: number): void {
  const next = new Date(viewDate.value)
  next.setMonth(next.getMonth() + delta)
  viewDate.value = next
}

function onDocumentPointerDown(event: MouseEvent): void {
  if (!open.value) return
  const target = event.target as Node
  if (rootRef.value?.contains(target)) return
  closeCalendar()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && open.value) closeCalendar()
}

onMounted(() => {
  document.addEventListener('mousedown', onDocumentPointerDown)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', onDocumentPointerDown)
  document.removeEventListener('keydown', onKeydown)
})

function dayButtonClass(day: { inMonth: boolean; isSelected: boolean; isToday: boolean }): string {
  return cn(
    'inline-flex size-8 items-center justify-center rounded-md text-xs transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
    day.isSelected
      ? 'bg-primary text-primary-foreground shadow-[0_0_10px_rgba(0,212,255,0.35)]'
      : day.isToday
        ? 'border border-primary/40 text-primary'
        : day.inMonth
          ? 'text-foreground hover:bg-accent hover:text-accent-foreground'
          : 'text-muted-foreground/40 hover:bg-accent/50 hover:text-muted-foreground',
  )
}
</script>

<template>
  <div ref="rootRef" class="relative w-full" :class="props.class">
    <input
      :id="id"
      type="text"
      inputmode="numeric"
      autocomplete="off"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClasses"
      :aria-label="props['aria-label']"
      @input="onDisplayInput"
      @blur="commitDisplayValue"
      @keydown.enter.prevent="commitDisplayValue"
    />
    <button
      type="button"
      class="absolute top-1/2 right-1 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="disabled"
      :aria-label="props['aria-label']"
      :aria-expanded="open"
      @click.stop="toggleCalendar"
    >
      <Calendar :size="14" aria-hidden="true" />
    </button>

    <div
      v-if="open"
      class="absolute top-[calc(100%+0.375rem)] right-0 z-[10000] w-full min-w-[16.5rem] rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
      @click.stop
    >
      <div class="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          class="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          :aria-label="locale === 'pt-BR' ? 'Mês anterior' : 'Previous month'"
          @click="shiftMonth(-1)"
        >
          <ChevronLeft :size="16" aria-hidden="true" />
        </button>
        <p class="text-sm font-medium capitalize">{{ monthLabel }}</p>
        <button
          type="button"
          class="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          :aria-label="locale === 'pt-BR' ? 'Próximo mês' : 'Next month'"
          @click="shiftMonth(1)"
        >
          <ChevronRight :size="16" aria-hidden="true" />
        </button>
      </div>

      <div class="mb-1 grid grid-cols-7 gap-1">
        <span
          v-for="(label, index) in weekdayLabels"
          :key="`${label}-${index}`"
          class="flex size-8 items-center justify-center text-[11px] font-medium uppercase text-muted-foreground"
        >
          {{ label }}
        </span>
      </div>

      <div class="grid grid-cols-7 gap-1">
        <button
          v-for="day in calendarDays"
          :key="day.iso"
          type="button"
          :class="dayButtonClass(day)"
          @click="selectDay(day.iso)"
        >
          {{ day.day }}
        </button>
      </div>

      <div class="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
        <button
          type="button"
          class="text-xs font-medium text-primary transition-opacity hover:opacity-80"
          @click="clearValue"
        >
          {{ resolvedClearLabel }}
        </button>
        <button
          type="button"
          class="text-xs font-medium text-primary transition-opacity hover:opacity-80"
          @click="selectToday"
        >
          {{ resolvedTodayLabel }}
        </button>
      </div>
    </div>
  </div>
</template>
