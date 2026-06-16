<script setup lang="ts">
import { useId } from 'vue'
import { cn } from '@/lib/utils'
import Label from './Label.vue'

export interface FormFieldProps {
  label?: string
  helper?: string
  error?: string
  success?: boolean
  required?: boolean
  class?: string
}

const props = defineProps<FormFieldProps>()
const fieldId = useId()
</script>

<template>
  <div :class="cn('space-y-2', props.class)">
    <Label v-if="label" :for="fieldId">
      {{ label }}<span v-if="required" class="ml-0.5 text-destructive">*</span>
    </Label>
    <slot :id="fieldId" />
    <p v-if="error" class="text-sm text-destructive">
      {{ error }}
    </p>
    <p v-else-if="helper" :class="cn('text-sm', success ? 'text-success' : 'text-muted-foreground')">
      {{ helper }}
    </p>
  </div>
</template>
