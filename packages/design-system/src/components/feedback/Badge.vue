<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import {
  badgeAppearanceStyles,
  badgeVariantToAppearance,
  badgeVariants,
  type BadgeAppearance,
  type BadgeVariants,
} from './badgeVariants'

export interface BadgeProps extends /* @vue-ignore */ BadgeVariants {
  size?: BadgeVariants['size']
  /** Numeric value — renders as text (99+ when above 99). */
  value?: number
  /** Badge color variant. */
  variant?: keyof typeof badgeVariantToAppearance | BadgeAppearance
  /** @deprecated Use `variant` instead. */
  appearance?: BadgeAppearance
  class?: string
}

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: 'default',
  appearance: undefined,
  size: 'md',
})

const resolvedAppearance = computed((): BadgeAppearance => {
  if (props.appearance) return props.appearance
  return badgeVariantToAppearance[props.variant ?? 'default'] ?? 'default'
})

const palette = computed(() => badgeAppearanceStyles[resolvedAppearance.value])

const displayText = computed(() => {
  if (props.value === undefined) return undefined
  if (props.value > 99) return '99+'
  return String(props.value)
})

const classes = computed(() => cn(badgeVariants({ size: props.size }), props.class))

const glowStyle = computed(() => ({
  color: palette.value.color,
  backgroundColor: palette.value.bg,
  boxShadow: `0 0 18px ${palette.value.glow}, inset 0 0 10px ${palette.value.glow}`,
}))
</script>

<template>
  <span :class="classes" :style="glowStyle">
    <slot>{{ displayText }}</slot>
  </span>
</template>
