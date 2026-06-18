<script setup lang="ts">
import { computed, inject, provide } from 'vue'
import {
  SIDEBAR_MENU_INJECTION_KEY,
  type SidebarMenuContext,
} from './sidebarMenuContext'

const props = defineProps<{
  parentGroupId: string
}>()

const parent = inject(SIDEBAR_MENU_INJECTION_KEY)

if (!parent) {
  throw new Error('SidebarMenuFlyout must be used inside SidebarMenu')
}

const flyoutContext: SidebarMenuContext = {
  collapsed: computed(() => false),
  inFlyout: computed(() => true),
  showLabels: computed(() => true),
  activeId: parent.activeId,
  openKeys: parent.openKeys,
  depth: parent.depth + 1,
  parentGroupId: props.parentGroupId,
  toggleOpen: parent.toggleOpen,
  isOpen: parent.isOpen,
  isActive: parent.isActive,
  isGroupActive: parent.isGroupActive,
  setActive: parent.setActive,
  registerMenuItem: parent.registerMenuItem,
  registerGroupItem: parent.registerGroupItem,
  registerFlyoutCloser: parent.registerFlyoutCloser,
  unregisterFlyoutCloser: parent.unregisterFlyoutCloser,
  closePeerFlyouts: parent.closePeerFlyouts,
  hasOpenDescendantFlyouts: parent.hasOpenDescendantFlyouts,
  closeAllFlyouts: parent.closeAllFlyouts,
}

provide(SIDEBAR_MENU_INJECTION_KEY, flyoutContext)
</script>

<template>
  <div class="flex flex-col gap-0.5">
    <slot />
  </div>
</template>
