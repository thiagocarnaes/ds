<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * RadiusPreview — displays a square with a border-radius token applied,
 * along with the token name and resolved value.
 *
 * Uses MutationObserver on <html> class changes to react to theme switches
 * in real-time (same pattern as ColorSwatch.vue).
 *
 * Requirements: 28.5
 */
export interface RadiusPreviewProps {
  /** CSS custom property name, e.g. `--ds-radius-md` */
  token: string
  label?: string
}

const props = withDefaults(defineProps<RadiusPreviewProps>(), {
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
    <!-- Shape preview with radius applied -->
    <div
      class="h-16 w-16 border-2 border-primary bg-primary/20"
      :style="{ borderRadius: `var(${token})` }"
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
