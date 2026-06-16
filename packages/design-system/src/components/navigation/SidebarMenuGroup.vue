<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'
import { computed, inject, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import type { Component } from 'vue'
import { cn } from '@/lib/utils'
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
  }>(),
  {
    defaultOpen: false,
  },
)

const injectedMenu = inject(SIDEBAR_MENU_INJECTION_KEY)

if (!injectedMenu) {
  throw new Error('SidebarMenuGroup must be used inside SidebarMenu')
}

const sidebarMenu: SidebarMenuContext = injectedMenu

const rootRef = ref<HTMLElement | null>(null)
const buttonRef = ref<HTMLButtonElement | null>(null)
const iconRef = ref<HTMLElement | null>(null)
const flyoutRef = ref<HTMLElement | null>(null)
const flyoutOpen = ref(false)
const flyoutCoords = ref({ top: 0, left: 0 })
let hideTimer: ReturnType<typeof setTimeout> | undefined
let scrollTarget: HTMLElement | Window | null = null

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

  flyoutCoords.value = {
    top: rect.top,
    left: rect.right - 6,
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
  <div
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
      <span
        ref="iconRef"
        :class="
          cn(
            sidebarMenuIconClass(),
            sidebarMenuIconStateClass(groupActive, sidebarMenu.collapsed.value),
          )
        "
      >
        <component :is="icon" v-if="icon" :size="16" class="shrink-0" />
      </span>
      <span :class="sidebarMenuLabelClass()">{{ label }}</span>
      <ChevronRight
        :class="cn(sidebarMenuChevronClass(), groupActive && '!text-primary')"
      />
    </button>

    <Teleport to="body">
      <div
        v-if="flyoutOpen"
        ref="flyoutRef"
        data-sidebar-flyout
        :data-sidebar-depth="sidebarMenu.depth"
        class="fixed min-w-[11rem] rounded-lg border border-border bg-popover py-1.5 pl-2.5 pr-1.5 shadow-lg"
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
        <SidebarMenuFlyout>
          <slot />
        </SidebarMenuFlyout>
      </div>
    </Teleport>
  </div>
</template>
