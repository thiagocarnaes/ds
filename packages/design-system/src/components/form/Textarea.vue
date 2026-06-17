<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { formTextareaVariants, type FormInputVariants } from './formInputVariants'

export interface TextareaProps extends /* @vue-ignore */ FormInputVariants {
  size?: FormInputVariants['size']
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  error?: boolean
  message?: string
  id?: string
  class?: string
}

const props = withDefaults(defineProps<TextareaProps>(), {
  modelValue: '',
  disabled: false,
  readonly: false,
  error: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const classes = computed(() =>
  cn(formTextareaVariants({ size: props.size, error: props.error }), props.class),
)

function onInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}
</script>

<template>
  <div class="w-full">
    <textarea
      :id="id"
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
