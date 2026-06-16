<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { cn } from '@/lib/utils'

const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(
  defineProps<{
    closeOnOverlay?: boolean
    class?: string
  }>(),
  {
    closeOnOverlay: true,
  },
)

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
      await nextTick()
      panelRef.value?.focus()
    }
  },
)

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[60]">
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
          :class="
            cn(
              'pointer-events-auto relative z-50 w-full max-w-lg rounded-lg border border-border bg-card p-6 text-card-foreground shadow-lg outline-none',
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
