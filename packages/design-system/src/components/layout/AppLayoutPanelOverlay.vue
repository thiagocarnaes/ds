<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    open: boolean
    backdrop?: boolean
    initialWidth?: string
    minWidth?: string
    maxWidth?: string
    resizable?: boolean
  }>(),
  {
    backdrop: true,
    initialWidth: 'min(24rem, 50%)',
    minWidth: '12rem',
    maxWidth: '75%',
    resizable: true,
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const panelRef = ref<HTMLElement | null>(null)
const panelWidthPx = ref<number | null>(null)
const isResizing = ref(false)

let resizeContext: { startX: number; startWidth: number } | null = null

const panelStyle = computed(() => ({
  width: panelWidthPx.value ? `${panelWidthPx.value}px` : props.initialWidth,
}))

function parseLengthToPx(value: string, containerWidth: number): number {
  const trimmed = value.trim()

  if (trimmed.endsWith('px')) {
    return Number.parseFloat(trimmed)
  }

  if (trimmed.endsWith('rem')) {
    return Number.parseFloat(trimmed) * 16
  }

  if (trimmed.endsWith('%')) {
    return (Number.parseFloat(trimmed) / 100) * containerWidth
  }

  const minMatch = trimmed.match(/^min\((.+),\s*(.+)\)$/i)

  if (minMatch) {
    return Math.min(
      parseLengthToPx(minMatch[1], containerWidth),
      parseLengthToPx(minMatch[2], containerWidth),
    )
  }

  return Number.parseFloat(trimmed) || 0
}

function getContainerWidth(): number {
  return panelRef.value?.parentElement?.getBoundingClientRect().width ?? window.innerWidth
}

function clampWidth(width: number): number {
  const containerWidth = getContainerWidth()

  return Math.min(
    parseLengthToPx(props.maxWidth, containerWidth),
    Math.max(parseLengthToPx(props.minWidth, containerWidth), width),
  )
}

async function syncPanelWidth(): Promise<void> {
  await nextTick()
  panelWidthPx.value = panelRef.value?.getBoundingClientRect().width ?? null
}

function closePanel(): void {
  emit('update:open', false)
}

function onResizePointerDown(event: PointerEvent): void {
  if (!props.resizable || !panelRef.value) {
    return
  }

  event.preventDefault()
  resizeContext = {
    startX: event.clientX,
    startWidth: panelRef.value.getBoundingClientRect().width,
  }
  isResizing.value = true
  document.addEventListener('pointermove', onResizePointerMove)
  document.addEventListener('pointerup', onResizePointerUp)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

function onResizePointerMove(event: PointerEvent): void {
  if (!resizeContext) {
    return
  }

  const delta = resizeContext.startX - event.clientX
  panelWidthPx.value = clampWidth(resizeContext.startWidth + delta)
}

function onResizePointerUp(): void {
  resizeContext = null
  isResizing.value = false
  document.removeEventListener('pointermove', onResizePointerMove)
  document.removeEventListener('pointerup', onResizePointerUp)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      panelWidthPx.value = null
      syncPanelWidth()
      return
    }

    panelWidthPx.value = null
  },
)

onUnmounted(() => {
  onResizePointerUp()
})
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300 ease-in-out"
    leave-active-class="transition-opacity duration-300 ease-in-out"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <button
      v-if="open && backdrop"
      type="button"
      class="absolute inset-0 z-10 bg-background/50"
      aria-label="Close panel"
      @click="closePanel"
    />
  </Transition>

  <Transition
    enter-active-class="transition-transform duration-300 ease-in-out"
    leave-active-class="transition-transform duration-300 ease-in-out"
    enter-from-class="translate-x-full"
    leave-to-class="translate-x-full"
  >
    <aside
      v-if="open"
      ref="panelRef"
      data-app-layout-panel
      :class="
        cn(
          'absolute inset-y-0 right-0 z-20 flex min-h-0 flex-col overflow-y-auto border-l border-border bg-card shadow-xl',
          isResizing && 'transition-none',
        )
      "
      :style="panelStyle"
    >
      <div
        v-if="resizable"
        data-app-layout-panel-resize
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize panel"
        class="absolute inset-y-0 left-0 z-30 w-2 -translate-x-1/2 cursor-col-resize touch-none"
        @pointerdown="onResizePointerDown"
      >
        <span
          class="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border transition-colors group-hover:bg-primary/40"
          :class="isResizing ? 'bg-primary/60' : ''"
        />
      </div>

      <slot :close-panel="closePanel" />
    </aside>
  </Transition>
</template>
