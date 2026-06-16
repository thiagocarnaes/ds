<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

export interface ProgressProps {
  value?: number
  indeterminate?: boolean
  class?: string
}

const props = withDefaults(defineProps<ProgressProps>(), {
  value: 0,
  indeterminate: false,
})

const clampedValue = computed(() => Math.min(100, Math.max(0, props.value)))
</script>

<template>
  <div
    role="progressbar"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-valuenow="indeterminate ? undefined : clampedValue"
    :class="cn('relative h-2 w-full overflow-hidden rounded-full bg-muted', props.class)"
  >
    <div
      :class="
        cn(
          'h-full bg-primary transition-all',
          indeterminate && 'w-1/3 animate-[progress-indeterminate_1.5s_ease-in-out_infinite]',
        )
      "
      :style="indeterminate ? undefined : { width: `${clampedValue}%` }"
    />
  </div>
</template>

<style scoped>
@keyframes progress-indeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}
</style>
