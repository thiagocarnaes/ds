<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * ColorSwatch — displays a colored square + resolved hex value + token name.
 *
 * Uses getComputedStyle to read the resolved CSS variable value at runtime.
 * An observer watches for class changes on <html> to react to theme switches.
 *
 * Requirements: 28.1, 28.2
 */
export interface ColorSwatchProps {
  /** CSS custom property name, e.g. `--ds-color-cyan-500` */
  token: string
  label?: string
}

const props = withDefaults(defineProps<ColorSwatchProps>(), {
  label: undefined,
})

const resolvedValue = ref('')

function readValue() {
  resolvedValue.value = getComputedStyle(document.documentElement)
    .getPropertyValue(props.token)
    .trim()
}

// Watch for class changes on <html> (e.g. dark-mode toggle)
let observer: MutationObserver | null = null

onMounted(() => {
  readValue()
  observer = new MutationObserver(readValue)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="inline-flex flex-col items-center gap-1.5">
    <!-- Colored swatch square -->
    <div
      class="h-12 w-12 rounded-md border border-border"
      :style="{ backgroundColor: `var(${token})` }"
      :aria-label="label ?? token"
    />

    <!-- Token name -->
    <span class="max-w-[120px] break-all text-center font-mono text-[10px] leading-tight text-muted-foreground">
      {{ label ?? token }}
    </span>

    <!-- Resolved value -->
    <span
      v-if="resolvedValue"
      class="font-mono text-[10px] text-muted-foreground/70"
    >
      {{ resolvedValue }}
    </span>
  </div>
</template>
