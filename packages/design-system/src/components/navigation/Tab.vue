<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted } from 'vue'
import { cn } from '@/lib/utils'
import { TABS_INJECTION_KEY } from './tabsContext'

export interface TabProps {
  value: string
  /** Alias for `value`. */
  id?: string
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<TabProps>(), {
  disabled: false,
})

const tabsContext = inject(TABS_INJECTION_KEY)
if (!tabsContext) {
  throw new Error('Tab must be used inside Tabs')
}
const ctx = tabsContext

const tabValue = computed(() => props.id ?? props.value)
const isSelected = computed(() => ctx.activeTab.value === tabValue.value)
const tabId = computed(() => `ds-tab-${tabValue.value}`)
const panelId = computed(() => `ds-tabpanel-${tabValue.value}`)

function onClick(): void {
  if (!props.disabled) {
    ctx.setActiveTab(tabValue.value)
  }
}

onMounted(() => {
  ctx.registerTab(tabValue.value)
})

onUnmounted(() => {
  ctx.unregisterTab(tabValue.value)
})
</script>

<template>
  <button
    :id="tabId"
    type="button"
    role="tab"
    :aria-selected="isSelected"
    :aria-controls="panelId"
    :tabindex="isSelected ? 0 : -1"
    :disabled="disabled"
    :class="
      cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isSelected
          ? 'bg-background text-foreground shadow-sm'
          : 'hover:bg-background/50 hover:text-foreground',
        props.class,
      )
    "
    @click="onClick"
  >
    <slot />
  </button>
</template>
