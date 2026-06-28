<script setup lang="ts">
import { computed } from 'vue'

export type TextSize = 'large' | 'medium' | 'small' | 'xsmall'
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold'
export type TextColor = 'default' | 'subtle' | 'disabled' | 'inverse' | 'success' | 'warning' | 'danger'

export interface TextProps {
  size?: TextSize
  weight?: TextWeight
  color?: TextColor
  as?: string
  class?: string
}

const props = withDefaults(defineProps<TextProps>(), {
  size: 'medium',
  weight: 'regular',
  color: 'default',
  as: 'span',
})

const sizeMap: Record<TextSize, string> = {
  large: 'var(--ds-font-size-base)',
  medium: 'var(--ds-font-size-medium)',
  small: 'var(--ds-font-size-small)',
  xsmall: 'var(--ds-font-size-xsmall)',
}

const colorMap: Record<TextColor, string> = {
  default: 'var(--ds-color-text-default)',
  subtle: 'var(--ds-color-text-subtle)',
  disabled: 'var(--ds-color-text-disabled)',
  inverse: 'var(--ds-color-text-inverse)',
  success: 'var(--ds-color-text-success)',
  warning: 'var(--ds-color-text-warning)',
  danger: 'var(--ds-color-text-danger)',
}

const weightMap: Record<TextWeight, string> = {
  regular: 'var(--ds-font-weight-regular)',
  medium: 'var(--ds-font-weight-medium)',
  semibold: 'var(--ds-font-weight-semibold)',
  bold: 'var(--ds-font-weight-bold)',
}

const textStyle = computed(() => ({
  fontSize: sizeMap[props.size],
  color: colorMap[props.color],
  fontWeight: weightMap[props.weight],
  display: props.as === 'p' ? 'block' : undefined,
}))
</script>

<template>
  <component :is="as" :style="textStyle" :class="props.class">
    <slot />
  </component>
</template>
