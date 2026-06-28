<script setup lang="ts">
import { ref } from 'vue'

/**
 * MotionDemo — an interactive button that animates on click using the provided
 * duration and easing tokens.
 *
 * Requirements: 28.6
 */
export interface MotionDemoProps {
  /** CSS custom property for duration, e.g. `--ds-motion-duration-normal` */
  durationToken: string
  /** CSS custom property for easing, e.g. `--ds-motion-easing-in-out` */
  easingToken: string
  label?: string
}

const props = withDefaults(defineProps<MotionDemoProps>(), {
  label: undefined,
})

const scale = ref(1)

function animate() {
  scale.value = 1.12
  setTimeout(() => {
    scale.value = 1
  }, 400)
}
</script>

<template>
  <div class="inline-flex flex-col items-center gap-2">
    <!-- Animated button -->
    <button
      type="button"
      class="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
      :style="{
        transform: `scale(${scale})`,
        transition: `transform var(${durationToken}) var(${easingToken})`,
      }"
      @click="animate"
    >
      Click me
    </button>

    <!-- Token labels -->
    <div class="text-center">
      <p class="font-mono text-[10px] leading-tight text-muted-foreground">
        {{ label ?? durationToken }}
      </p>
      <p class="font-mono text-[10px] text-muted-foreground/70">
        {{ easingToken }}
      </p>
    </div>
  </div>
</template>
