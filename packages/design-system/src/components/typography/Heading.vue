<script setup lang="ts">
import { computed } from 'vue'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
export type HeadingSize = 'xxlarge' | 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall'
export type HeadingColor = 'default' | 'subtle' | 'disabled' | 'inverse'

export interface HeadingProps {
  level?: HeadingLevel
  size?: HeadingSize
  color?: HeadingColor
  id?: string
  class?: string
}

const props = withDefaults(defineProps<HeadingProps>(), {
  level: 2,
  color: 'default',
})

const levelToSize: Record<HeadingLevel, HeadingSize> = {
  1: 'xxlarge',
  2: 'xlarge',
  3: 'large',
  4: 'medium',
  5: 'small',
  6: 'xsmall',
}

const sizeMap: Record<HeadingSize, string> = {
  xxlarge: 'var(--ds-font-size-xxlarge)',
  xlarge: 'var(--ds-font-size-xlarge)',
  large: 'var(--ds-font-size-large)',
  medium: 'var(--ds-font-size-base)',
  small: 'var(--ds-font-size-medium)',
  xsmall: 'var(--ds-font-size-small)',
}

const colorMap: Record<HeadingColor, string> = {
  default: 'var(--ds-color-text-default)',
  subtle: 'var(--ds-color-text-subtle)',
  disabled: 'var(--ds-color-text-disabled)',
  inverse: 'var(--ds-color-text-inverse)',
}

const resolvedSize = computed<HeadingSize>(() => props.size ?? levelToSize[props.level])

const headingStyle = computed(() => ({
  fontSize: sizeMap[resolvedSize.value],
  color: colorMap[props.color],
  fontWeight: 'var(--ds-font-weight-bold)',
  lineHeight: 'var(--ds-line-height-base)',
}))
</script>

<template>
  <component :is="`h${level}`" :id="id" :style="headingStyle" :class="props.class">
    <slot />
  </component>
</template>
