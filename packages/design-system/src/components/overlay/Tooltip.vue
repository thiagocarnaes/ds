<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { cn } from '@/lib/utils'
import {
  overlayAppearanceClasses,
  type OverlayAppearance,
  type TooltipAppearance,
} from './overlayAppearance'

export type { TooltipAppearance }

const props = withDefaults(
  defineProps<{
    content: string
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end'
    variant?: OverlayAppearance
    /** @deprecated Use `variant` instead. */
    appearance?: OverlayAppearance
    class?: string
    /** Delay in milliseconds before showing the tooltip. Default: 300ms */
    delay?: number
    /** Keyboard shortcut to display alongside the tooltip content */
    shortcut?: string
  }>(),
  {
    placement: 'top',
    variant: undefined,
    appearance: undefined,
    delay: 300,
    shortcut: undefined,
  },
)

const resolvedVariant = computed(
  (): OverlayAppearance => props.variant ?? props.appearance ?? 'outline',
)

const variantClasses = computed(() => overlayAppearanceClasses[resolvedVariant.value])

const triggerRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)
const visible = ref(false)
const coords = ref({ top: 0, left: 0 })
let showTimer: ReturnType<typeof setTimeout> | null = null

function computePosition(
  trigger: DOMRect,
  tooltip: DOMRect,
): { top: number; left: number } {
  const gap = 8

  switch (props.placement) {
    case 'right':
      return {
        top: trigger.top + trigger.height / 2 - tooltip.height / 2,
        left: trigger.right + gap,
      }
    case 'left':
      return {
        top: trigger.top + trigger.height / 2 - tooltip.height / 2,
        left: trigger.left - tooltip.width - gap,
      }
    case 'bottom':
      return {
        top: trigger.bottom + gap,
        left: trigger.left + trigger.width / 2 - tooltip.width / 2,
      }
    case 'top-start':
      return {
        top: trigger.top - tooltip.height - gap,
        left: trigger.left,
      }
    case 'top-end':
      return {
        top: trigger.top - tooltip.height - gap,
        left: trigger.right - tooltip.width,
      }
    default:
      return {
        top: trigger.top - tooltip.height - gap,
        left: trigger.left + trigger.width / 2 - tooltip.width / 2,
      }
  }
}

async function updatePosition(): Promise<void> {
  await nextTick()

  const trigger = triggerRef.value
  const tooltip = tooltipRef.value

  if (!trigger || !tooltip) {
    return
  }

  coords.value = computePosition(
    trigger.getBoundingClientRect(),
    tooltip.getBoundingClientRect(),
  )
}

function show(): void {
  if (showTimer !== null) {
    clearTimeout(showTimer)
  }
  showTimer = setTimeout(() => {
    visible.value = true
    showTimer = null
  }, props.delay)
}

function hide(): void {
  if (showTimer !== null) {
    clearTimeout(showTimer)
    showTimer = null
  }
  visible.value = false
}

watch(visible, (isVisible) => {
  if (isVisible) {
    updatePosition()
  }
})

watch(
  () => props.placement,
  () => {
    if (visible.value) {
      updatePosition()
    }
  },
)

function onViewportChange(): void {
  if (visible.value) {
    updatePosition()
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', onViewportChange, true)
  window.addEventListener('resize', onViewportChange)
}

onUnmounted(() => {
  if (showTimer !== null) {
    clearTimeout(showTimer)
    showTimer = null
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onViewportChange, true)
    window.removeEventListener('resize', onViewportChange)
  }
})

const tooltipStyle = computed(() => ({
  top: `${coords.value.top}px`,
  left: `${coords.value.left}px`,
}))
</script>

<template>
  <span
    ref="triggerRef"
    class="inline-flex"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />
  </span>

  <Teleport to="body">
    <span
      v-if="visible"
      ref="tooltipRef"
      role="tooltip"
      :class="
        cn(
          'pointer-events-none fixed z-[--ds-z-tooltip] whitespace-nowrap rounded-md border px-2 py-1 text-xs shadow-[var(--ds-shadow-tooltip)]',
          variantClasses,
          props.class,
        )
      "
      :style="tooltipStyle"
    >
      {{ content }}
      <kbd v-if="shortcut" class="ml-2 rounded border px-1 text-[10px]">{{ shortcut }}</kbd>
    </span>
  </Teleport>
</template>
