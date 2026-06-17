<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

export type LozengeAppearance =
  | 'default'
  | 'success'
  | 'danger'
  | 'progress'
  | 'warning'
  | 'new'

interface LozengeStyle {
  bg: string
  color: string
  border: string
  glow?: string
}

export interface LozengeProps {
  variant?: LozengeAppearance
  /** @deprecated Use `variant` instead. */
  appearance?: LozengeAppearance
  bold?: boolean
  /** Alias for `bold`. */
  isBold?: boolean
  class?: string
}

const props = withDefaults(defineProps<LozengeProps>(), {
  variant: undefined,
  appearance: undefined,
  bold: false,
  isBold: false,
})

const resolvedVariant = computed(
  (): LozengeAppearance => props.variant ?? props.appearance ?? 'default',
)

const normalStyles: Record<LozengeAppearance, LozengeStyle> = {
  default: { bg: 'rgba(77,106,135,0.15)', color: '#7BA3C8', border: 'rgba(77,106,135,0.25)' },
  success: { bg: 'rgba(0,229,176,0.08)', color: '#00E5B0', border: 'rgba(0,229,176,0.25)' },
  danger: { bg: 'rgba(255,61,87,0.08)', color: '#FF3D57', border: 'rgba(255,61,87,0.25)' },
  progress: { bg: 'rgba(0,212,255,0.08)', color: '#00D4FF', border: 'rgba(0,212,255,0.25)' },
  warning: { bg: 'rgba(255,139,0,0.08)', color: '#FF8B00', border: 'rgba(255,139,0,0.25)' },
  new: { bg: 'rgba(167,139,250,0.08)', color: '#A78BFA', border: 'rgba(167,139,250,0.25)' },
}

const boldStyles: Record<LozengeAppearance, LozengeStyle> = {
  default: { bg: 'rgba(77,106,135,0.35)', color: '#A8C4DC', border: 'rgba(77,106,135,0.5)', glow: 'rgba(77,106,135,0.35)' },
  success: { bg: 'rgba(0,229,176,0.2)', color: '#00E5B0', border: 'rgba(0,229,176,0.5)', glow: 'rgba(0,229,176,0.45)' },
  danger: { bg: 'rgba(255,61,87,0.2)', color: '#FF3D57', border: 'rgba(255,61,87,0.5)', glow: 'rgba(255,61,87,0.45)' },
  progress: { bg: 'rgba(0,212,255,0.16)', color: '#00D4FF', border: 'rgba(0,212,255,0.5)', glow: 'rgba(0,212,255,0.5)' },
  warning: { bg: 'rgba(255,139,0,0.18)', color: '#FF8B00', border: 'rgba(255,139,0,0.5)', glow: 'rgba(255,139,0,0.4)' },
  new: { bg: 'rgba(167,139,250,0.2)', color: '#A78BFA', border: 'rgba(167,139,250,0.5)', glow: 'rgba(167,139,250,0.45)' },
}

const isBold = computed(() => props.bold || props.isBold)

const palette = computed(() => (isBold.value ? boldStyles : normalStyles)[resolvedVariant.value])

const lozengeStyle = computed(() => ({
  backgroundColor: palette.value.bg,
  color: palette.value.color,
  border: `1px solid ${palette.value.border}`,
  boxShadow: palette.value.glow ? `0 0 14px ${palette.value.glow}` : undefined,
}))
</script>

<template>
  <span
    :class="
      cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wide',
        isBold ? 'font-bold' : 'font-semibold',
        props.class,
      )
    "
    :style="lozengeStyle"
  >
    <slot />
  </span>
</template>
