<script setup lang="ts">
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import { alertVariants, type AlertVariants } from './alertVariants'

export interface AlertProps extends /* @vue-ignore */ AlertVariants {
  variant?: AlertVariants['variant']
  title?: string
  dismissible?: boolean
  class?: string
}

const props = withDefaults(defineProps<AlertProps>(), {
  variant: 'info',
  dismissible: false,
})

const emit = defineEmits<{
  dismiss: []
}>()

const visible = ref(true)

const classes = computed(() => cn(alertVariants({ variant: props.variant }), props.class))

function dismiss(): void {
  visible.value = false
  emit('dismiss')
}
</script>

<template>
  <div
    v-if="visible"
    role="alert"
    :class="classes"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 space-y-1">
        <p v-if="title" class="font-medium leading-none tracking-tight">
          {{ title }}
        </p>
        <div :class="title ? 'text-muted-foreground' : undefined">
          <slot />
        </div>
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
