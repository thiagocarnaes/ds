<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg'

export interface SpinnerProps {
  size?: SpinnerSize
  color?: string
  ariaLabel?: string
  class?: string
}

const props = withDefaults(defineProps<SpinnerProps>(), {
  size: 'md',
  color: '#00D4FF',
  ariaLabel: 'Loading',
})

const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'size-3 border',
  sm: 'size-4 border-2',
  md: 'size-6 border-2',
  lg: 'size-8 border-[3px]',
}

const spinnerStyle = computed(() => ({
  borderColor: 'rgba(255,255,255,0.08)',
  borderTopColor: props.color,
  boxShadow: `0 0 12px ${props.color}40`,
}))
</script>

<template>
  <span
    role="status"
    :aria-label="ariaLabel"
    :class="cn('inline-flex animate-spin rounded-full', sizeClasses[size], props.class)"
    :style="spinnerStyle"
  />
</template>
