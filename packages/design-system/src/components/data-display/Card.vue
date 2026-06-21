<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { semanticSurfaceClasses } from '@/lib/semanticSurfaceClasses'

export type CardVariant = 'elevated' | 'outlined' | 'flat' | 'ghost'

export interface CardProps {
  variant?: CardVariant
}

const props = withDefaults(defineProps<CardProps>(), {
  variant: 'outlined',
})

const variantClasses: Record<CardVariant, string> = {
  elevated: 'bg-card text-card-foreground shadow-lg',
  outlined: 'border border-border bg-card text-card-foreground shadow-sm',
  flat: 'bg-card text-card-foreground',
  ghost: semanticSurfaceClasses.ghost,
}

const classes = computed(() =>
  cn('rounded-lg', variantClasses[props.variant]),
)
</script>

<template>
  <div :class="[classes, $attrs.class]">
    <div
      v-if="$slots.header"
      class="flex flex-col space-y-1.5 border-b border-border px-6 py-4"
    >
      <slot name="header" />
    </div>
    <div :class="cn('px-6 py-4', !$slots.header && 'pt-6', !$slots.footer && 'pb-6')">
      <slot />
    </div>
    <div
      v-if="$slots.footer"
      class="flex items-center border-t border-border px-6 py-4"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
