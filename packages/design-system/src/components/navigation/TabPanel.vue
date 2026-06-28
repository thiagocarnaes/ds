<script setup lang="ts">
import { computed, inject } from 'vue'
import { cn } from '@/lib/utils'
import { TABS_INJECTION_KEY, TABS_UNMOUNT_KEY } from './tabsContext'

export interface TabPanelProps {
  value: string
  class?: string
}

const props = defineProps<TabPanelProps>()
const tabsContext = inject(TABS_INJECTION_KEY)
if (!tabsContext) {
  throw new Error('TabPanel must be used inside Tabs')
}
const ctx = tabsContext

const shouldUnmount = inject(TABS_UNMOUNT_KEY, false)

const isActive = computed(() => ctx.activeTab.value === props.value)
const tabId = computed(() => `ds-tab-${props.value}`)
const panelId = computed(() => `ds-tabpanel-${props.value}`)
</script>

<template>
  <div
    v-if="shouldUnmount ? isActive : true"
    v-show="!shouldUnmount || isActive"
    :id="panelId"
    role="tabpanel"
    :aria-labelledby="tabId"
    :hidden="!isActive"
    :class="
      cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
