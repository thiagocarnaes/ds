<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { cn } from '@/lib/utils'

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg'

export interface SpinnerProps {
  size?: SpinnerSize
  color?: string
  glow?: boolean
  ariaLabel?: string
  class?: string
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<SpinnerProps>(), {
  size: 'md',
  color: 'var(--primary)',
  glow: true,
  ariaLabel: 'Loading',
})

const attrs = useAttrs()

/** Vue does not map aria-label on components to ariaLabel — read attrs explicitly. */
const resolvedAriaLabel = computed(() => {
  const fromAttr = attrs['aria-label']
  if (typeof fromAttr === 'string' && fromAttr.length > 0) return fromAttr
  return props.ariaLabel
})

const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'size-3 border',
  sm: 'size-4 border-2',
  md: 'size-6 border-2',
  lg: 'size-8 border-[3px]',
}

const spinnerStyle = computed(() => ({
  borderColor: 'color-mix(in srgb, var(--foreground) 12%, transparent)',
  borderTopColor: props.color,
  ...(props.glow ? { boxShadow: `0 0 12px color-mix(in srgb, ${props.color} 25%, transparent)` } : {}),
}))
</script>

<template>
  <span
    role="status"
    :aria-label="resolvedAriaLabel"
    :class="cn('inline-flex animate-spin rounded-full', sizeClasses[size], props.class)"
    :style="spinnerStyle"
  />
</template>
