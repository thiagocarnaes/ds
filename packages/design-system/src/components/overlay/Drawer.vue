<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { cn } from '@/lib/utils'

const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(
  defineProps<{
    placement?: 'left' | 'right' | 'top' | 'bottom'
    closeOnOverlay?: boolean
    backdrop?: boolean
    resizable?: boolean
    class?: string
  }>(),
  {
    placement: 'right',
    closeOnOverlay: true,
    backdrop: true,
    resizable: false,
  },
)

const panelRef = ref<HTMLElement | null>(null)
const visible = ref(false)
const animated = ref(false)

const drawerWidth = ref<number | undefined>(undefined)

const panelClasses = computed(() => {
  const base =
    'fixed z-[var(--ds-z-overlay)] border-border bg-card text-card-foreground shadow-[var(--ds-shadow-modal)] outline-none transition-transform duration-300 ease-in-out'

  switch (props.placement) {
    case 'left':
      return cn(base, 'top-0 left-0 h-full w-80 max-w-[85vw] border-r', {
        'translate-x-0': animated.value,
        '-translate-x-full': !animated.value,
      })
    case 'top':
      return cn(base, 'top-0 left-0 h-80 max-h-[85vh] w-full border-b', {
        'translate-y-0': animated.value,
        '-translate-y-full': !animated.value,
      })
    case 'bottom':
      return cn(base, 'bottom-0 left-0 h-80 max-h-[85vh] w-full border-t', {
        'translate-y-0': animated.value,
        'translate-y-full': !animated.value,
      })
    default:
      return cn(base, 'top-0 right-0 h-full w-80 max-w-[85vw] border-l', {
        'translate-x-0': animated.value,
        'translate-x-full': !animated.value,
      })
  }
})

const panelStyle = computed(() => {
  if (drawerWidth.value && (props.placement === 'left' || props.placement === 'right')) {
    return { width: `${drawerWidth.value}px` }
  }
  return undefined
})

const showResizeHandle = computed(() =>
  props.resizable && (props.placement === 'left' || props.placement === 'right'),
)

const resizeHandleClasses = computed(() =>
  props.placement === 'left' ? '-right-1' : '-left-1',
)

function onResizePointerDown(event: PointerEvent): void {
  if (!(props.placement === 'left' || props.placement === 'right')) return
  event.preventDefault()
  const handle = event.currentTarget as HTMLElement
  handle.setPointerCapture(event.pointerId)

  function onPointerMove(e: PointerEvent): void {
    const maxWidth = window.innerWidth * 0.9
    if (props.placement === 'left') {
      drawerWidth.value = Math.max(280, Math.min(e.clientX, maxWidth))
    } else {
      drawerWidth.value = Math.max(280, Math.min(window.innerWidth - e.clientX, maxWidth))
    }
  }

  function onPointerUp(): void {
    handle.removeEventListener('pointermove', onPointerMove)
    handle.removeEventListener('pointerup', onPointerUp)
    handle.releasePointerCapture(event.pointerId)
  }

  handle.addEventListener('pointermove', onPointerMove)
  handle.addEventListener('pointerup', onPointerUp)
}

function close(): void {
  open.value = false
}

function onOverlayClick(): void {
  if (props.closeOnOverlay) {
    close()
  }
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    close()
  }
}

watch(
  () => open.value,
  async (isOpen) => {
    if (isOpen) {
      visible.value = true
      animated.value = false
      await nextTick()
      requestAnimationFrame(() => {
        animated.value = true
      })
      await nextTick()
      panelRef.value?.focus()
      return
    }

    animated.value = false
    window.setTimeout(() => {
      if (!open.value) {
        visible.value = false
      }
    }, 300)
  },
)

watch(
  () => props.placement,
  async () => {
    if (!open.value || !visible.value) {
      return
    }

    animated.value = false
    await nextTick()
    requestAnimationFrame(() => {
      animated.value = true
    })
  },
)

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  if (open.value) {
    visible.value = true
    animated.value = true
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="relative z-[var(--ds-z-overlay)]">
      <div
        v-if="backdrop"
        class="fixed inset-0 bg-black/60"
        aria-hidden="true"
        @click="onOverlayClick"
      />

      <div
        ref="panelRef"
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        :class="cn(panelClasses, props.class)"
        :style="panelStyle"
      >
        <div
          v-if="showResizeHandle"
          role="separator"
          aria-orientation="vertical"
          :aria-valuenow="drawerWidth"
          class="absolute inset-y-0 w-1.5 cursor-ew-resize bg-transparent hover:bg-border/50 active:bg-border transition-colors z-10"
          :class="resizeHandleClasses"
          @pointerdown="onResizePointerDown"
        />
        <slot />
      </div>
    </div>
  </Teleport>
</template>
