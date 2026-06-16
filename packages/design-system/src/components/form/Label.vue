<script setup lang="ts">
import { cn } from '@/lib/utils'

export interface LabelProps {
  /** Associates the label with a form control id. */
  for?: string
  class?: string
}

const props = defineProps<LabelProps>()
</script>

<template>
  <label
    :for="props.for"
    :class="cn('text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70', props.class)"
  >
    <slot />
  </label>
</template>
