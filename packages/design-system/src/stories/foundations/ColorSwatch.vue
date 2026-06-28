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
  <div class="flex w-full flex-col items-start gap-1.5">
    <!-- Colored swatch square -->
    <div
      class="h-12 w-12 rounded-md border border-border"
      :style="{ backgroundColor: `var(${token})` }"
      :aria-label="label ?? token"
    />

    <!-- Token name — full text, wraps if needed -->
    <span class="w-full break-all font-mono text-[10px] leading-snug text-muted-foreground">
      {{ label ?? token }}
    </span>

    <!-- Resolved value — full text, wraps if needed -->
    <span
      v-if="resolvedValue"
      class="w-full break-all font-mono text-[10px] leading-snug text-muted-foreground/70"
    >
      {{ resolvedValue }}
    </span>
  </div>
</template>
