<script setup lang="ts">
import { computed, provide } from 'vue'
import { cn } from '@/lib/utils'
import {
  SIDEBAR_MENU_INJECTION_KEY,
  type SidebarMenuContext,
} from './sidebarMenuContext'

const props = withDefaults(
  defineProps<{
    collapsed?: boolean
    class?: string
  }>(),
  {
    collapsed: false,
  },
)

const activeId = defineModel<string>('activeId', { default: '' })
const openKeys = defineModel<string[]>('openKeys', { default: () => [] })

interface FlyoutRegistration {
  depth: number
  close: () => void
  isOpen: () => boolean
}

const flyoutRegistry = new Map<string, FlyoutRegistration>()
const groupItemIds = new Map<string, Set<string>>()
const topLevelItemIds = new Set<string>()
let firstRegisteredItemId: string | null = null

function toggleOpen(key: string): void {
  if (openKeys.value.includes(key)) {
    openKeys.value = openKeys.value.filter((item) => item !== key)
    return
  }

  openKeys.value = [...openKeys.value, key]
}

function isOpen(key: string): boolean {
  return openKeys.value.includes(key)
}

function isActive(id: string): boolean {
  if (!activeId.value) {
    return false
  }

  return activeId.value === id
}

function isGroupActive(id: string): boolean {
  if (!activeId.value) {
    return false
  }

  if (activeId.value === id) {
    return true
  }

  const directMembers = groupItemIds.get(id)
  if (directMembers?.has(activeId.value)) {
    return true
  }

  for (const [groupId, members] of groupItemIds) {
    if (groupId === id || !groupId.startsWith(`${id}.`)) {
      continue
    }

    if (members.has(activeId.value)) {
      return true
    }
  }

  const prefix = `${id}.`
  if (activeId.value.startsWith(prefix) && !topLevelItemIds.has(activeId.value)) {
    return true
  }

  return false
}

function registerMenuItem(id: string, isTopLevel = true): void {
  if (isTopLevel) {
    topLevelItemIds.add(id)
  }

  if (firstRegisteredItemId === null) {
    firstRegisteredItemId = id
  }

  if (!activeId.value && firstRegisteredItemId === id) {
    activeId.value = id
  }
}

function registerGroupItem(groupId: string, itemId: string): void {
  const members = groupItemIds.get(groupId) ?? new Set<string>()
  members.add(itemId)
  groupItemIds.set(groupId, members)
}

function registerFlyoutCloser(
  id: string,
  depth: number,
  close: () => void,
  isOpen: () => boolean,
): void {
  flyoutRegistry.set(id, { depth, close, isOpen })
}

function unregisterFlyoutCloser(id: string): void {
  flyoutRegistry.delete(id)
}

function closePeerFlyouts(depth: number, exceptId: string): void {
  flyoutRegistry.forEach(({ close, depth: entryDepth }, id) => {
    if (entryDepth === depth && id !== exceptId) {
      close()
    }
  })
}

function closeAllFlyouts(): void {
  flyoutRegistry.forEach(({ close }) => close())
}

function hasOpenDescendantFlyouts(depth: number): boolean {
  for (const { depth: entryDepth, isOpen } of flyoutRegistry.values()) {
    if (entryDepth > depth && isOpen()) {
      return true
    }
  }

  return false
}

function setActive(id: string): void {
  activeId.value = id
  closeAllFlyouts()
}

const context: SidebarMenuContext = {
  collapsed: computed(() => props.collapsed),
  inFlyout: computed(() => false),
  showLabels: computed(() => !props.collapsed),
  activeId,
  openKeys,
  depth: 0,
  toggleOpen,
  isOpen,
  isActive,
  isGroupActive,
  setActive,
  registerMenuItem,
  registerGroupItem,
  registerFlyoutCloser,
  unregisterFlyoutCloser,
  closePeerFlyouts,
  hasOpenDescendantFlyouts,
  closeAllFlyouts,
}

provide(SIDEBAR_MENU_INJECTION_KEY, context)
</script>

<template>
  <nav :class="cn('flex w-full min-w-0 flex-col gap-0.5', props.class)">
    <slot />
  </nav>
</template>
