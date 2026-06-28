<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref } from 'vue'
import { cn } from '@/lib/utils'
import { FLAG_GROUP_KEY } from './FlagGroup'

export type FlagVariant = 'normal' | 'warning' | 'error' | 'success' | 'discovery'

export interface FlagAction {
  label: string
  onClick: () => void
}

export interface FlagProps {
  title: string
  description?: string
  variant?: FlagVariant
  actions?: FlagAction[]
  isDismissible?: boolean
  /** Unique id used by FlagGroup to manage the visible queue. Auto-generated if omitted. */
  flagId?: string
  class?: string
}

const props = withDefaults(defineProps<FlagProps>(), {
  variant: 'normal',
  isDismissible: false,
})

const emit = defineEmits<{
  dismiss: []
}>()

// ── FlagGroup integration ─────────────────────────────────────────────────────
// When Flag is used inside a FlagGroup the group provides register/unregister/isVisible.
// When used standalone these are undefined and the flag always renders.

const flagGroup = inject(FLAG_GROUP_KEY, null)

// Stable id for this flag instance (use prop or generate one)
const internalId = props.flagId ?? `flag-${Math.random().toString(36).slice(2, 9)}`

onMounted(() => {
  flagGroup?.register(internalId)
})

onUnmounted(() => {
  flagGroup?.unregister(internalId)
})

// Whether this specific flag should be shown according to the queue.
// Falls back to true when not inside a FlagGroup.
const queueVisible = computed(() =>
  flagGroup ? flagGroup.isVisible(internalId) : true,
)

const visible = ref(true)

/**
 * Left border + icon color per variant.
 * Variant color mapping:
 * - normal    → primary/cyan
 * - warning   → amber
 * - error     → red/destructive
 * - success   → teal
 * - discovery → purple
 */
const variantBorderColor = computed((): string => {
  const map: Record<FlagVariant, string> = {
    normal:    'var(--ds-color-cyan-500)',
    warning:   'var(--ds-color-amber-500)',
    error:     'var(--ds-color-red-500)',
    success:   'var(--ds-color-teal-400)',
    discovery: 'var(--ds-color-purple-400)',
  }
  return map[props.variant]
})

const containerStyle = computed(() => ({
  borderLeftColor: variantBorderColor.value,
}))

/**
 * ARIA live region: assertive for error, polite for all others (Req 11.7)
 */
const ariaLive = computed((): 'assertive' | 'polite' =>
  props.variant === 'error' ? 'assertive' : 'polite',
)

const containerClasses = computed(() =>
  cn(
    'relative flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-[var(--ds-shadow-card)]',
    'border-l-[4px]',
    props.class,
  ),
)

function dismiss(): void {
  visible.value = false
  flagGroup?.unregister(internalId)
  emit('dismiss')
}
</script>

<template>
  <div
    v-if="visible && queueVisible"
    role="alert"
    :aria-live="ariaLive"
    :class="containerClasses"
    :style="containerStyle"
  >
    <!-- Content area -->
    <div class="flex-1 space-y-1 min-w-0">
      <!-- Title (required) -->
      <p class="font-semibold text-sm text-foreground leading-snug">{{ title }}</p>

      <!-- Optional description -->
      <p v-if="description" class="text-sm text-muted-foreground">{{ description }}</p>

      <!-- Actions -->
      <div v-if="actions && actions.length > 0" class="mt-2 flex flex-wrap gap-2">
        <button
          v-for="action in actions"
          :key="action.label"
          type="button"
          class="text-xs font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 rounded-sm"
          :style="{ color: variantBorderColor }"
          @click="action.onClick"
        >
          {{ action.label }}
        </button>
      </div>
    </div>

    <!-- Dismiss button (Req 11.3) -->
    <button
      v-if="isDismissible"
      type="button"
      class="shrink-0 ml-1 rounded-sm text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      aria-label="Fechar notificação"
      @click="dismiss"
    >
      <!-- Close icon (×) -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M12.78 4.28a.75.75 0 0 0-1.06-1.06L8 6.94 4.28 3.22a.75.75 0 0 0-1.06 1.06L6.94 8l-3.72 3.72a.75.75 0 1 0 1.06 1.06L8 9.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L9.06 8l3.72-3.72Z"
        />
      </svg>
    </button>
  </div>
</template>
