<script setup lang="ts">
import { ref } from 'vue'
import GlowDot from './GlowDot.vue'

const props = withDefaults(
  defineProps<{
    label: string
    accentColor?: string
    tag?: string
    icon?: object
    fillHeight?: boolean
  }>(),
  { accentColor: '#00D4FF', fillHeight: false },
)

const hovered = ref(false)
</script>

<template>
  <div
    class="pg-play-card flex h-full min-h-0 min-w-0 max-w-full flex-col overflow-hidden rounded-2xl transition-all duration-300"
    :style="{
      background: 'linear-gradient(145deg, var(--pg-card-from) 0%, var(--pg-card-to) 100%)',
      border: hovered
        ? `1px solid ${accentColor}40`
        : '1px solid var(--pg-card-border)',
      boxShadow: hovered
        ? `0 0 32px ${accentColor}18, inset 0 1px 0 var(--pg-card-inset)`
        : 'inset 0 1px 0 var(--pg-card-inset)',
    }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <div
      class="flex shrink-0 items-center justify-between px-4 pb-3 pt-4 sm:px-5 sm:pb-4 sm:pt-5"
      style="border-bottom: 1px solid var(--pg-card-divider)"
    >
      <div class="flex min-w-0 items-center gap-2.5">
        <span class="shrink-0" :style="{ color: accentColor }">
          <slot name="icon" />
        </span>
        <span class="pg-text-subtle truncate text-xs font-semibold uppercase tracking-wide">{{ label }}</span>
      </div>
      <div class="flex items-center gap-2">
        <span
          v-if="tag"
          class="rounded px-1.5 py-0.5 font-mono text-[9px]"
          :style="{ background: accentColor + '18', color: accentColor }"
        >
          {{ tag }}
        </span>
        <GlowDot :color="accentColor" />
      </div>
    </div>
    <div
      class="playground-scroll min-h-0 flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-5"
      :class="fillHeight ? 'flex flex-col' : undefined"
    >
      <slot />
    </div>
  </div>
</template>
