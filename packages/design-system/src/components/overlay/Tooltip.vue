<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    content: string
    placement?: 'top' | 'bottom' | 'left' | 'right'
    class?: string
  }>(),
  {
    placement: 'top',
  },
)

const triggerRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)
const visible = ref(false)
const coords = ref({ top: 0, left: 0 })

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
  visible.value = true
}

function hide(): void {
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
          'pointer-events-none fixed z-[200] whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md',
          props.class,
        )
      "
      :style="tooltipStyle"
    >
      {{ content }}
    </span>
  </Teleport>
</template>
