<script setup lang="ts">
/**
 * GradientSwatch — displays a gradient preview rectangle + token name.
 *
 * Requirements: 28.3
 */
export interface GradientSwatchProps {
  /** CSS custom property name, e.g. `--ds-gradient-brand-horizontal` */
  token: string
  label?: string
}

withDefaults(defineProps<GradientSwatchProps>(), {
  label: undefined,
})
</script>

<template>
  <div class="inline-flex w-full flex-col gap-1.5">
    <!-- Gradient preview strip -->
    <div
      class="h-16 w-full rounded-md border border-border"
      :style="{ backgroundImage: `var(${token})` }"
      :aria-label="label ?? token"
    />

    <!-- Token name -->
    <span class="font-mono text-[10px] leading-tight text-muted-foreground">
      {{ label ?? token }}
    </span>
  </div>
</template>
