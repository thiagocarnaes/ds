<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { cn } from '@/lib/utils'
import { formInputVariants, type FormInputVariants } from './formInputVariants'

export interface InputProps {
  size?: FormInputVariants['size'] | 'default'
  modelValue?: string
  type?: 'text' | 'email' | 'password' | 'search' | 'date'
  placeholder?: string
  minLength?: number
  maxLength?: number
  disabled?: boolean
  readonly?: boolean
  error?: boolean
  success?: boolean
  message?: string
  id?: string
  lang?: string
  class?: string
}

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  readonly: false,
  error: false,
  success: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const slots = useSlots()

const hasBefore = computed(() => !!slots.elemBefore)
const hasAfter = computed(() => !!slots.elemAfter)

// Map the ADS 'default' size alias to 'md', and 'compact' stays as 'compact'
const resolvedSize = computed(() => {
  if (props.size === 'default') return 'md'
  return props.size as FormInputVariants['size']
})

const classes = computed(() =>
  cn(
    formInputVariants({
      size: resolvedSize.value,
      error: props.error,
      success: props.success && !props.error,
    }),
    hasBefore.value && 'pl-9',
    hasAfter.value && 'pr-9',
    props.class,
  ),
)

function onInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="w-full">
    <div class="relative flex w-full items-center">
      <span
        v-if="$slots.elemBefore"
        class="absolute left-3 flex items-center pointer-events-none text-muted-foreground"
      >
        <slot name="elemBefore" />
      </span>
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :minlength="minLength"
        :maxlength="maxLength"
        :disabled="disabled"
        :readonly="readonly"
        :lang="lang"
        :class="classes"
        :aria-invalid="error || undefined"
        :aria-describedby="error && message ? `${id}-error` : undefined"
        @input="onInput"
      />
      <span
        v-if="$slots.elemAfter"
        class="absolute right-3 flex items-center pointer-events-none text-muted-foreground"
      >
        <slot name="elemAfter" />
      </span>
    </div>
    <p
      v-if="error && message"
      :id="id ? `${id}-error` : undefined"
      class="mt-1.5 text-sm text-destructive"
    >
      {{ message }}
    </p>
  </div>
</template>
