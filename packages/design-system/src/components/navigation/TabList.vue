<script setup lang="ts">
import { inject, onMounted } from 'vue'
import { cn } from '@/lib/utils'
import { TABS_INJECTION_KEY } from './tabsContext'

export interface TabListProps {
  class?: string
}

const props = defineProps<TabListProps>()
const tabsContext = inject(TABS_INJECTION_KEY)
if (!tabsContext) {
  throw new Error('TabList must be used inside Tabs')
}
const ctx = tabsContext

function focusTab(index: number): void {
  const tabId = ctx.tabIds.value[index]
  if (tabId) {
    ctx.setActiveTab(tabId)
    const tabElement = document.getElementById(`ds-tab-${tabId}`)
    tabElement?.focus()
  }
}

function onKeydown(event: KeyboardEvent): void {
  const { tabIds, activeTab } = ctx
  const count = tabIds.value.length
  if (count === 0) return

  const currentIndex = tabIds.value.indexOf(activeTab.value)
  let nextIndex = currentIndex

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      nextIndex = currentIndex < count - 1 ? currentIndex + 1 : 0
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      nextIndex = currentIndex > 0 ? currentIndex - 1 : count - 1
      break
    case 'Home':
      nextIndex = 0
      break
    case 'End':
      nextIndex = count - 1
      break
    default:
      return
  }

  event.preventDefault()
  focusTab(nextIndex)
}

onMounted(() => {
  if (ctx.tabIds.value.length > 0 && !ctx.activeTab.value) {
    ctx.setActiveTab(ctx.tabIds.value[0]!)
  }
})
</script>

<template>
  <div
    role="tablist"
    :class="
      cn(
        'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
        props.class,
      )
    "
    @keydown="onKeydown"
  >
    <slot />
  </div>
</template>
