<script setup lang="ts">
import { ref } from 'vue'
import { cn } from '@/lib/utils'
import type { ToastVariant } from '@/composables/useToast'

export interface ToastProps {
  variant?: ToastVariant
  dismissible?: boolean
  class?: string
}

const props = withDefaults(defineProps<ToastProps>(), {
  variant: 'info',
  dismissible: false,
})

const emit = defineEmits<{
  dismiss: []
}>()

const visible = ref(true)

const variantClasses: Record<ToastVariant, string> = {
  success: 'border-success/40 bg-success/10 text-foreground',
  error: 'border-destructive/40 bg-destructive/10 text-foreground',
  info: 'border-primary/40 bg-primary/10 text-foreground',
  warning: 'border-warning/40 bg-warning/10 text-foreground',
}

function dismiss(): void {
  visible.value = false
  emit('dismiss')
}
</script>

<template>
  <div
    v-if="visible"
    role="status"
    :class="
      cn(
        'rounded-md border px-4 py-3 text-sm shadow-md',
        variantClasses[props.variant],
        props.class,
      )
    "
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1">
        <slot />
      </div>
      <button
        v-if="dismissible"
        type="button"
        class="shrink-0 rounded-sm text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        aria-label="Dismiss"
        @click="dismiss"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>
