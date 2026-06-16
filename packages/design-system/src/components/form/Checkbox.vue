<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { cn } from '@/lib/utils'

export interface CheckboxProps {
  modelValue?: boolean
  indeterminate?: boolean
  /** Alias for `indeterminate`. */
  isIndeterminate?: boolean
  label?: string
  /** When checked, next click returns to indeterminate instead of unchecked. */
  cycleIndeterminate?: boolean
  disabled?: boolean
  id?: string
  class?: string
}

const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: false,
  indeterminate: false,
  isIndeterminate: false,
  cycleIndeterminate: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:indeterminate': [value: boolean]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const isIndeterminate = computed(() => props.indeterminate || props.isIndeterminate)

const visualState = computed<'unchecked' | 'checked' | 'indeterminate'>(() => {
  if (isIndeterminate.value) return 'indeterminate'
  if (props.modelValue) return 'checked'
  return 'unchecked'
})

const inputChecked = computed(() => visualState.value === 'checked')

const boxStyle = computed(() => {
  if (visualState.value === 'unchecked') {
    return {
      backgroundColor: 'transparent',
      borderColor: '#2A4560',
      boxShadow: 'none',
    }
  }
  return {
    backgroundColor: '#00D4FF',
    borderColor: '#00D4FF',
    boxShadow: '0 0 14px rgba(0, 212, 255, 0.45)',
  }
})

const labelClass = computed(() =>
  visualState.value === 'unchecked' ? 'text-[#4D6A87]' : 'text-[#7BA3C8]',
)

function syncNativeIndeterminate(): void {
  if (inputRef.value) {
    inputRef.value.indeterminate = isIndeterminate.value
    inputRef.value.checked = inputChecked.value
  }
}

watch([isIndeterminate, () => props.modelValue], () => {
  nextTick(syncNativeIndeterminate)
}, { immediate: true })

function onToggle(event: MouseEvent): void {
  if (props.disabled) return
  event.preventDefault()

  if (isIndeterminate.value) {
    emit('update:indeterminate', false)
    emit('update:modelValue', true)
    return
  }

  if (props.modelValue) {
    if (props.cycleIndeterminate) {
      emit('update:modelValue', false)
      emit('update:indeterminate', true)
      return
    }
    emit('update:modelValue', false)
    return
  }

  emit('update:modelValue', true)
}
</script>

<template>
  <label
    :class="cn('inline-flex w-full cursor-pointer items-center gap-3', disabled && 'cursor-not-allowed opacity-50', props.class)"
  >
    <span class="relative inline-flex size-[18px] shrink-0">
      <input
        ref="inputRef"
        :id="id"
        type="checkbox"
        :checked="inputChecked"
        :disabled="disabled"
        class="absolute inset-0 z-10 m-0 cursor-pointer opacity-0"
        @click="onToggle"
      />
      <span
        class="pointer-events-none flex size-[18px] items-center justify-center rounded-[4px] border transition-all"
        :style="boxStyle"
        aria-hidden="true"
      >
        <svg
          v-if="visualState === 'indeterminate'"
          viewBox="0 0 12 12"
          class="size-3.5"
          fill="none"
          aria-hidden="true"
        >
          <rect x="2.5" y="5.25" width="7" height="1.5" rx="0.75" fill="white" />
        </svg>
        <svg
          v-else-if="visualState === 'checked'"
          viewBox="0 0 12 12"
          class="size-3.5"
          fill="none"
          stroke="white"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M2.5 6.5 5 9l4.5-5.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </span>
    <span v-if="label || $slots.default" :class="cn('text-sm', labelClass)">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
