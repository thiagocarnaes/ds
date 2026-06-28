<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { Check, ChevronDown, Search, X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

export interface SelectOption {
  label: string
  value: string
}

export interface SelectProps {
  modelValue?: string | string[]
  options: SelectOption[]
  multiple?: boolean
  searchable?: boolean
  disabled?: boolean
  placeholder?: string
  id?: string
  class?: string
}

const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: '',
  multiple: false,
  searchable: true,
  disabled: false,
  placeholder: 'Select an option...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[]]
}>()

const open = ref(false)
const query = ref('')
const triggerRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLInputElement | null>(null)
const panelStyle = ref({ top: '0px', left: '0px', width: '0px' })

const selectedValues = computed<string[]>(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) ? props.modelValue : []
  }
  return typeof props.modelValue === 'string' && props.modelValue ? [props.modelValue] : []
})

const selectedOptions = computed(() =>
  props.options.filter((option) => selectedValues.value.includes(option.value)),
)

const filteredOptions = computed(() => {
  const term = query.value.trim().toLowerCase()
  if (!term) return props.options
  return props.options.filter((option) => option.label.toLowerCase().includes(term))
})

const singleLabel = computed(
  () => props.options.find((option) => option.value === selectedValues.value[0])?.label ?? '',
)

function isSelected(value: string): boolean {
  return selectedValues.value.includes(value)
}

function updatePanelPosition(): void {
  if (!triggerRef.value) return
  const rect = triggerRef.value.getBoundingClientRect()
  panelStyle.value = {
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
  }
}

function toggleOpen(): void {
  if (props.disabled) return
  open.value = !open.value
}

function selectOption(value: string): void {
  if (props.multiple) {
    const next = isSelected(value)
      ? selectedValues.value.filter((item) => item !== value)
      : [...selectedValues.value, value]
    emit('update:modelValue', next)
    return
  }

  emit('update:modelValue', value)
  open.value = false
  query.value = ''
}

function removeTag(value: string): void {
  if (!props.multiple) return
  emit(
    'update:modelValue',
    selectedValues.value.filter((item) => item !== value),
  )
}

function clearAll(): void {
  if (!props.multiple) return
  emit('update:modelValue', [])
}

function onDocumentClick(event: MouseEvent): void {
  if (!open.value) return
  const target = event.target as Node
  if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return
  open.value = false
  query.value = ''
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && open.value) {
    open.value = false
    query.value = ''
  }
}

watch(open, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    updatePanelPosition()
    if (props.searchable) {
      searchRef.value?.focus()
    }
    return
  }
  query.value = ''
})

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', updatePanelPosition)
  window.addEventListener('scroll', updatePanelPosition, true)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', updatePanelPosition)
  window.removeEventListener('scroll', updatePanelPosition, true)
})
</script>

<template>
  <div :class="cn('relative w-full', props.class)">
    <div
      ref="triggerRef"
      :id="id"
      role="combobox"
      :aria-expanded="open"
      aria-haspopup="listbox"
      :class="
        cn(
          'flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-lg border bg-input-background px-3 py-2 text-sm transition-all',
          open ? 'border-primary shadow-[0_0_0_1px_rgba(0,212,255,0.25)]' : 'border-border',
          disabled && 'cursor-not-allowed opacity-50',
        )
      "
      @click="toggleOpen"
    >
      <Search v-if="searchable" :size="14" class="shrink-0 text-muted-foreground" />

      <div class="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
        <template v-if="multiple">
          <span
            v-for="option in selectedOptions"
            :key="option.value"
            class="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/12 px-2 py-0.5 text-xs font-medium text-primary"
            @click.stop
          >
            {{ option.label }}
            <button
              type="button"
              class="rounded p-0.5 text-primary/80 transition-colors hover:bg-primary/20 hover:text-primary"
              :aria-label="`Remove ${option.label}`"
              @click.stop="removeTag(option.value)"
            >
              <X :size="10" stroke-width="2.5" />
            </button>
          </span>
          <span v-if="selectedOptions.length === 0" class="text-muted-foreground">
            {{ placeholder }}
          </span>
        </template>
        <span
          v-else
          class="truncate"
          :class="singleLabel ? 'text-foreground' : 'text-muted-foreground'"
        >
          {{ singleLabel || placeholder }}
        </span>
      </div>

      <ChevronDown
        :size="14"
        class="shrink-0 text-muted-foreground transition-transform duration-200"
        :class="{ 'rotate-180': open }"
      />
    </div>

    <Teleport to="body">
      <div
        v-if="open"
        ref="panelRef"
        role="presentation"
        class="fixed z-[--ds-z-dropdown] overflow-hidden rounded-lg border border-primary bg-popover text-sm shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
        :style="panelStyle"
        @click.stop
      >
        <div v-if="searchable" class="border-b border-border/60 px-3 py-2.5">
          <input
            ref="searchRef"
            v-model="query"
            type="text"
            placeholder="Search..."
            class="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div
          role="listbox"
          :aria-multiselectable="multiple || undefined"
          class="max-h-44 overflow-y-auto py-1"
        >
          <button
            v-for="option in filteredOptions"
            :key="option.value"
            type="button"
            role="option"
            :aria-selected="isSelected(option.value)"
            class="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-primary/8"
            :class="isSelected(option.value) ? 'text-primary' : 'text-foreground'"
            @click="selectOption(option.value)"
          >
            <span>{{ option.label }}</span>
            <Check
              v-if="isSelected(option.value)"
              :size="14"
              class="shrink-0 text-primary"
              stroke-width="2.5"
            />
          </button>
          <p
            v-if="filteredOptions.length === 0"
            class="px-3 py-4 text-center text-xs text-muted-foreground"
          >
            No results found
          </p>
        </div>

        <div
          v-if="multiple"
          class="flex items-center justify-between border-t border-border/60 px-3 py-2 text-xs"
        >
          <span class="text-muted-foreground">{{ selectedValues.length }} selected</span>
          <button
            type="button"
            class="font-medium text-destructive transition-opacity hover:opacity-80"
            :disabled="selectedValues.length === 0"
            @click.stop="clearAll"
          >
            Clear all
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
