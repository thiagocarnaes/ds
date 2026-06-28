<script setup lang="ts">
import { computed } from 'vue'
import {
  TOAST_POSITIONS,
  useToast,
  type ToastPosition,
} from '@/composables/useToast'
import Toast from './Toast.vue'

const { toasts, dismiss } = useToast()

const positionClasses: Record<ToastPosition, string> = {
  'top-left': 'top-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'top-right': 'top-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start flex-col-reverse',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center flex-col-reverse',
  'bottom-right': 'bottom-4 right-4 items-end flex-col-reverse',
}

const activePositions = computed(() =>
  TOAST_POSITIONS.filter((position) =>
    toasts.some((toast) => toast.position === position),
  ),
)

function toastsAt(position: ToastPosition) {
  return toasts.filter((toast) => toast.position === position)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-for="position in activePositions"
      :key="position"
      class="pointer-events-none fixed z-[var(--ds-z-raised)] flex w-full max-w-sm flex-col gap-2"
      :class="positionClasses[position]"
      aria-live="polite"
    >
      <Toast
        v-for="toast in toastsAt(position)"
        :key="toast.id"
        :variant="toast.variant"
        :dismissible="toast.dismissible"
        class="pointer-events-auto"
        @dismiss="dismiss(toast.id)"
      >
        {{ toast.message }}
      </Toast>
    </div>
  </Teleport>
</template>
