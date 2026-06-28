<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { cn } from '@/lib/utils'

const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(
  defineProps<{
    closeOnOverlay?: boolean
    width?: 'small' | 'medium' | 'large' | 'xlarge'
    titleId?: string
    class?: string
  }>(),
  {
    closeOnOverlay: true,
  },
)

const widthMap: Record<NonNullable<typeof props.width>, string> = {
  small:  'max-w-[400px]',
  medium: 'max-w-[600px]',
  large:  'max-w-[800px]',
  xlarge: 'max-w-[968px]',
}

const panelRef = ref<HTMLElement | null>(null)

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
      document.body.style.overflow = 'hidden'
      await nextTick()
      panelRef.value?.focus()
    } else {
      document.body.style.overflow = ''
    }
  },
  { immediate: true },
)

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  // Restore scroll in case the component is destroyed while open
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[--ds-z-modal]">
      <div
        class="fixed inset-0 bg-black/60"
        aria-hidden="true"
        @click="onOverlayClick"
      />
      <div class="pointer-events-none fixed inset-0 flex items-center justify-center p-4">
        <div
          ref="panelRef"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          :aria-labelledby="props.titleId || undefined"
          :class="
            cn(
              'pointer-events-auto relative w-full rounded-lg border border-border bg-card p-6 text-card-foreground shadow-[var(--ds-shadow-modal)] outline-none',
              props.width ? widthMap[props.width] : 'max-w-lg',
              props.class,
            )
          "
        >
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
