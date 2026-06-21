<script setup lang="ts">
import { computed } from 'vue'

const SHELL_INSET = '0.5rem'

const props = withDefaults(
  defineProps<{
    collapsed: boolean
    menuLabel?: string
    menuWidth: string
    collapsedWidth?: string
    showToggle?: boolean
  }>(),
  {
    showToggle: true,
  },
)

const contentWidth = computed(() => `calc(${props.menuWidth} - 2 * ${SHELL_INSET})`)

const collapsedInnerWidth = computed(() =>
  props.collapsedWidth
    ? `calc(${props.collapsedWidth} - 2 * ${SHELL_INSET})`
    : contentWidth.value,
)

const collapsedOffset = computed(() => {
  if (!props.collapsed || !props.collapsedWidth) {
    return '0px'
  }

  return `max(0px, calc((${collapsedInnerWidth.value} - 2rem) / 2))`
})

const toggleLeft = computed(() => {
  if (props.collapsed) {
    return collapsedOffset.value
  }

  return `calc(${contentWidth.value} - 2rem)`
})
</script>

<template>
  <div class="flex h-full min-h-0 w-full flex-col px-2 py-2">
    <div
      v-if="showToggle || menuLabel"
      class="relative mb-2 w-full shrink-0"
      :class="showToggle ? 'h-8' : 'min-h-0'"
    >
      <span
        v-if="menuLabel"
        class="pointer-events-none truncate font-mono text-[10px] uppercase tracking-wider text-[#A78BFA] transition-opacity duration-300 ease-in-out"
        :class="[
          showToggle
            ? 'absolute left-0 top-1/2 max-w-[calc(100%-2.5rem)] -translate-y-1/2'
            : 'block py-1',
          collapsed && showToggle ? 'opacity-0' : 'opacity-100',
        ]"
      >
        {{ menuLabel }}
      </span>

      <div
        v-if="showToggle"
        class="absolute top-0 flex size-8 items-center justify-center transition-[left] duration-300 ease-in-out"
        :style="{ left: toggleLeft }"
      >
        <slot name="toggle" />
      </div>
    </div>

    <div
      class="flex min-h-0 flex-1 flex-col transition-transform duration-300 ease-in-out"
      :style="{
        width: contentWidth,
        minWidth: contentWidth,
        transform: collapsed ? `translateX(${collapsedOffset})` : 'translateX(0)',
      }"
    >
      <slot />
    </div>
  </div>
</template>
