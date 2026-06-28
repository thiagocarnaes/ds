<script setup lang="ts">
import { provide, ref } from 'vue'
import { cn } from '@/lib/utils'
import { TABS_INJECTION_KEY, TABS_UNMOUNT_KEY } from './tabsContext'

export interface TabsProps {
  shouldUnmountTabPanelOnChange?: boolean
  class?: string
}

const props = defineProps<TabsProps>()
const emit = defineEmits<{ change: [value: string] }>()
const activeTab = defineModel<string>({ required: true })
const tabIds = ref<string[]>([])

function setActiveTab(value: string): void {
  activeTab.value = value
  emit('change', value)
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

provide(TABS_UNMOUNT_KEY, props.shouldUnmountTabPanelOnChange ?? false)
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <slot />
  </div>
</template>
