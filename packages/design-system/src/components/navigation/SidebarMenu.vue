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
  return activeId.value === id
}

function isGroupActive(id: string): boolean {
  if (activeId.value === id) {
    return true
  }

  return activeId.value.startsWith(`${id}.`)
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
