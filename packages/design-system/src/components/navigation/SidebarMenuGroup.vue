<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import { computed, inject, nextTick, onBeforeMount, onMounted, onUnmounted, ref, toValue, watch } from 'vue'
import type { Component } from 'vue'
import { cn } from '@/lib/utils'
import {
  APP_LAYOUT_MENU_INJECTION_KEY,
  isPinnedSettingsGroupId,
} from '../layout/appLayoutMenuContext'
import {
  sidebarMenuChevronClass,
  sidebarMenuIconClass,
  sidebarMenuIconStateClass,
  sidebarMenuLabelClass,
  sidebarMenuStateClass,
  sidebarMenuTriggerClass,
} from './sidebarMenuStyles'
import SidebarMenuFlyout from './SidebarMenuFlyout.vue'
import {
  SIDEBAR_MENU_INJECTION_KEY,
  type SidebarMenuContext,
} from './sidebarMenuContext'

const props = withDefaults(
  defineProps<{
    id: string
    label: string
    icon?: Component
    defaultOpen?: boolean
    /** Flyout vertical alignment relative to the group trigger. `auto` opens upward when near the viewport bottom. */
    flyoutPlacement?: 'auto' | 'down' | 'up'
  }>(),
  {
    defaultOpen: false,
    flyoutPlacement: 'auto',
  },
)

const injectedMenu = inject(SIDEBAR_MENU_INJECTION_KEY)

if (!injectedMenu) {
  throw new Error('SidebarMenuGroup must be used inside SidebarMenu')
}

const sidebarMenu: SidebarMenuContext = injectedMenu
const layoutMenu = inject(APP_LAYOUT_MENU_INJECTION_KEY, null)

const isPinnedSettingsGroup = computed(
  () =>
    Boolean(
      layoutMenu?.settingsMenu.value
        && isPinnedSettingsGroupId(props.id, layoutMenu.settingsMenuId),
    ),
)

const renderInSettingsFooter = computed(() => {
  if (!isPinnedSettingsGroup.value || !layoutMenu) {
    return false
  }

  return layoutMenu.settingsGroupTarget.value instanceof HTMLElement
})

const renderInMain = computed(() => !isPinnedSettingsGroup.value)

const settingsTeleportTarget = computed(
  () => layoutMenu?.settingsGroupTarget.value ?? document.body,
)

const rootRef = ref<HTMLElement | null>(null)
const buttonRef = ref<HTMLButtonElement | null>(null)
const iconRef = ref<HTMLElement | null>(null)
const flyoutRef = ref<HTMLElement | null>(null)
const flyoutOpen = ref(false)
const flyoutCoords = ref({ top: 0, left: 0 })
const flyoutAlign = ref<'down' | 'up'>('down')
let hideTimer: ReturnType<typeof setTimeout> | undefined
let scrollTarget: HTMLElement | Window | null = null

const FLYOUT_MARGIN = 8

onBeforeMount(() => {
  if (isPinnedSettingsGroup.value && layoutMenu) {
    layoutMenu.registerSettingsGroup()
  }
})

onMounted(() => {
  sidebarMenu.registerFlyoutCloser(
    props.id,
    sidebarMenu.depth,
    hideFlyout,
    () => flyoutOpen.value,
  )

  if (props.defaultOpen && !sidebarMenu.isOpen(props.id)) {
    sidebarMenu.toggleOpen(props.id)
  }
})

onUnmounted(() => {
  clearTimeout(hideTimer)
  sidebarMenu.unregisterFlyoutCloser(props.id)
  removePositionListeners()
})

const showFlyoutHeader = computed(
  () => sidebarMenu.collapsed.value && !sidebarMenu.inFlyout.value,
)

const groupActive = computed(() => sidebarMenu.isGroupActive(props.id))

const triggerClasses = computed(() =>
  cn(sidebarMenuTriggerClass(), sidebarMenuStateClass(groupActive.value)),
)

const iconClasses = computed(() =>
  cn(
    sidebarMenuIconClass(),
    sidebarMenuIconStateClass(groupActive.value, toValue(sidebarMenu.collapsed)),
  ),
)

const chevronClasses = computed(() =>
  cn(sidebarMenuChevronClass(), groupActive.value && '!text-primary'),
)

function findScrollParent(element: HTMLElement | null): HTMLElement | Window {
  let node = element?.parentElement ?? null

  while (node) {
    const style = getComputedStyle(node)

    if (/(auto|scroll)/.test(style.overflowY)) {
      return node
    }

    node = node.parentElement
  }

  return window
}

function removePositionListeners(): void {
  if (scrollTarget) {
    scrollTarget.removeEventListener('scroll', updateFlyoutPosition)
    scrollTarget = null
  }

  window.removeEventListener('resize', updateFlyoutPosition)
}

function addPositionListeners(): void {
  removePositionListeners()
  scrollTarget = findScrollParent(rootRef.value)
  scrollTarget.addEventListener('scroll', updateFlyoutPosition, { passive: true })
  window.addEventListener('resize', updateFlyoutPosition, { passive: true })
}

function getViewportBounds(): { top: number; bottom: number } {
  if (scrollTarget instanceof HTMLElement) {
    const rect = scrollTarget.getBoundingClientRect()
    return { top: rect.top, bottom: rect.bottom }
  }

  return { top: 0, bottom: window.innerHeight }
}

function shouldOpenFlyoutUpward(rect: DOMRect, flyoutHeight: number): boolean {
  if (props.flyoutPlacement === 'up') {
    return true
  }

  if (props.flyoutPlacement === 'down') {
    return false
  }

  if (flyoutHeight <= 0) {
    return false
  }

  const bounds = getViewportBounds()
  const spaceBelow = bounds.bottom - rect.bottom - FLYOUT_MARGIN
  const spaceAbove = rect.top - bounds.top - FLYOUT_MARGIN

  if (spaceBelow >= flyoutHeight) {
    return false
  }

  if (spaceAbove >= flyoutHeight) {
    return true
  }

  return spaceAbove > spaceBelow
}

function applyFlyoutPosition(rect: DOMRect, flyoutHeight: number): void {
  const bounds = getViewportBounds()
  const openUpward = shouldOpenFlyoutUpward(rect, flyoutHeight)
  flyoutAlign.value = openUpward ? 'up' : 'down'

  let top = openUpward ? rect.bottom - flyoutHeight : rect.top
  const maxTop = bounds.bottom - flyoutHeight - FLYOUT_MARGIN
  top = Math.max(bounds.top + FLYOUT_MARGIN, Math.min(top, maxTop))

  flyoutCoords.value = {
    top,
    left: rect.right - 6,
  }
}

async function updateFlyoutPosition(): Promise<void> {
  await nextTick()

  const button = buttonRef.value
  const icon = iconRef.value

  if (!button) {
    return
  }

  const anchor =
    sidebarMenu.collapsed.value && !sidebarMenu.inFlyout.value && icon
      ? icon
      : button
  const rect = anchor.getBoundingClientRect()

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const flyoutHeight = flyoutRef.value?.offsetHeight ?? 0
    applyFlyoutPosition(rect, flyoutHeight)

    if (flyoutHeight > 0 || props.flyoutPlacement !== 'auto') {
      break
    }

    await nextTick()
  }
}

function showFlyout(): void {
  clearTimeout(hideTimer)
  sidebarMenu.closePeerFlyouts(sidebarMenu.depth, props.id)
  flyoutOpen.value = true
}

function hideFlyout(): void {
  flyoutOpen.value = false
}

function isMovingToDeeperFlyout(related: Node | null): boolean {
  if (!(related instanceof Element)) {
    return false
  }

  const targetFlyout = related.closest('[data-sidebar-flyout]')

  if (!(targetFlyout instanceof HTMLElement)) {
    return false
  }

  const targetDepth = Number(targetFlyout.dataset.sidebarDepth ?? -1)

  return targetDepth > sidebarMenu.depth
}

function scheduleHideFlyout(event?: MouseEvent): void {
  const related = event?.relatedTarget ?? null

  if (related instanceof Node) {
    if (rootRef.value?.contains(related)) {
      return
    }

    if (flyoutRef.value?.contains(related)) {
      return
    }

    if (isMovingToDeeperFlyout(related)) {
      return
    }
  }

  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    if (sidebarMenu.hasOpenDescendantFlyouts(sidebarMenu.depth)) {
      return
    }

    hideFlyout()
  }, 200)
}

watch(flyoutOpen, (visible) => {
  if (visible) {
    updateFlyoutPosition()
    addPositionListeners()
    return
  }

  removePositionListeners()
})

watch(
  () => sidebarMenu.collapsed.value,
  () => {
    if (flyoutOpen.value) {
      updateFlyoutPosition()
    }
  },
)
</script>

<template>
  <Teleport
    :disabled="!renderInSettingsFooter"
    :to="settingsTeleportTarget"
  >
    <div
      v-show="renderInMain || renderInSettingsFooter"
      ref="rootRef"
      class="flex w-full flex-col"
      @mouseenter="showFlyout"
      @mouseleave="scheduleHideFlyout($event)"
    >
    <button
      ref="buttonRef"
      type="button"
      :class="triggerClasses"
      :title="sidebarMenu.collapsed.value ? label : undefined"
      :aria-expanded="flyoutOpen"
      @mouseenter="showFlyout"
      @mouseleave="scheduleHideFlyout($event)"
    >
      <span ref="iconRef" :class="iconClasses">
        <component :is="icon" v-if="icon" :size="16" class="shrink-0" />
      </span>
      <span :class="sidebarMenuLabelClass()">{{ label }}</span>
      <ChevronRight :class="chevronClasses" />
    </button>

    <Teleport to="body">
      <div
        v-if="flyoutOpen"
        ref="flyoutRef"
        data-sidebar-flyout
        :data-sidebar-depth="sidebarMenu.depth"
        :data-flyout-placement="flyoutAlign"
        class="fixed min-w-[11rem] rounded-lg border border-border bg-popover py-1.5 pl-2.5 pr-1.5 shadow-[var(--ds-shadow-dropdown)]"
        :style="{
          top: `${flyoutCoords.top}px`,
          left: `${flyoutCoords.left}px`,
          zIndex: 200 + sidebarMenu.depth * 10,
        }"
        @mouseenter="showFlyout"
        @mouseleave="scheduleHideFlyout($event)"
      >
        <p
          v-if="showFlyoutHeader"
          class="mb-1 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
        >
          {{ label }}
        </p>
        <SidebarMenuFlyout :parent-group-id="id">
          <slot />
        </SidebarMenuFlyout>
      </div>
    </Teleport>
    </div>
  </Teleport>
</template>
