<script setup lang="ts">
/**
 * ShadowCard — displays a white card with the given shadow token applied,
 * on a muted background so the shadow is visible.
 *
 * Requirements: 28.4
 */
export interface ShadowCardProps {
  /** CSS custom property name, e.g. `--ds-shadow-card` */
  token: string
  label?: string
}

withDefaults(defineProps<ShadowCardProps>(), {
  label: undefined,
})
</script>

<template>
  <div class="inline-flex flex-col items-center gap-2">
    <!-- Muted background container -->
    <div class="flex items-center justify-center rounded-lg bg-muted p-6">
      <!-- Card with shadow applied via token -->
      <div
        class="h-20 w-[200px] rounded-md bg-card"
        :style="{ boxShadow: `var(${token})` }"
        :aria-label="label ?? token"
      />
    </div>

    <!-- Token name -->
    <span class="font-mono text-[10px] leading-tight text-muted-foreground">
      {{ label ?? token }}
    </span>
  </div>
</template>
