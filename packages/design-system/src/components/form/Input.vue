<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { formInputVariants, type FormInputVariants } from './formInputVariants'

export interface InputProps extends /* @vue-ignore */ FormInputVariants {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  error?: boolean
  success?: boolean
  message?: string
  id?: string
  class?: string
}

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  disabled: false,
  readonly: false,
  error: false,
  success: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const classes = computed(() =>
  cn(
    formInputVariants({
      size: props.size,
      error: props.error,
      success: props.success && !props.error,
    }),
    props.class,
  ),
)

function onInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="w-full">
    <input
      :id="id"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :class="classes"
      :aria-invalid="error || undefined"
      :aria-describedby="error && message ? `${id}-error` : undefined"
      @input="onInput"
    />
    <p
      v-if="error && message"
      :id="id ? `${id}-error` : undefined"
      class="mt-1.5 text-sm text-destructive"
    >
      {{ message }}
    </p>
  </div>
</template>