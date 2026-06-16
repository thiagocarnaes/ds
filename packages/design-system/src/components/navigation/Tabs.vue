<script setup lang="ts">
import { provide, ref } from 'vue'
import { cn } from '@/lib/utils'
import { TABS_INJECTION_KEY } from './tabsContext'

export interface TabsProps {
  class?: string
}

const props = defineProps<TabsProps>()
const activeTab = defineModel<string>({ required: true })
const tabIds = ref<string[]>([])

function setActiveTab(value: string): void {
  activeTab.value = value
}

function registerTab(value: string): void {
  if (!tabIds.value.includes(value)) {
    tabIds.value = [...tabIds.value, value]
  }
}

function unregisterTab(value: string): void {
  tabIds.value = tabIds.value.filter((id) => id !== value)
}

provide(TABS_INJECTION_KEY, {
  activeTab,
  setActiveTab,
  registerTab,
  unregisterTab,
  tabIds,
})
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <slot />
  </div>
</template>
