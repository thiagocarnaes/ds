<script setup lang="ts">
import Tooltip from '../overlay/Tooltip.vue'

defineProps<{
  collapsed: boolean
  toggleMenu: () => void
}>()
</script>

<template>
  <Tooltip
    :content="collapsed ? 'Expand menu' : 'Collapse menu'"
    placement="right"
  >
    <button
      type="button"
      class="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      :aria-label="collapsed ? 'Expand menu' : 'Collapse menu'"
      :aria-expanded="!collapsed"
      @click="toggleMenu()"
    >
      <svg
        viewBox="0 0 16 16"
        class="size-3.5 shrink-0 transition-transform duration-300 ease-in-out"
        :class="{ 'rotate-180': collapsed }"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        aria-hidden="true"
      >
        <path
          d="M10 3 5 8l5 5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </Tooltip>
</template>
