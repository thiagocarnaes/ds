<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

export interface SwitchProps {
  modelValue?: boolean
  disabled?: boolean
  id?: string
  class?: string
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: false,
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const checked = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const trackClass = computed(() => (props.size === 'sm' ? 'h-4 w-8 p-0.5' : 'h-5 w-9 p-0.5'))
const thumbClass = computed(() => (props.size === 'sm' ? 'size-3' : 'size-4'))

function toggle(): void {
  if (props.disabled) return
  checked.value = !checked.value
}
</script>

<template>
  <button
    :id="id"
    type="button"
    role="switch"
    :aria-checked="checked"
    :disabled="disabled"
    :class="
      cn(
        'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
        trackClass,
        checked ? 'justify-end bg-primary' : 'justify-start bg-switch-background',
        props.class,
      )
    "
    @click="toggle"
  >
    <span
      :class="cn('pointer-events-none block shrink-0 rounded-full bg-white shadow-sm', thumbClass)"
      aria-hidden="true"
    />
  </button>
</template>
