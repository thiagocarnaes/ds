<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

export type SectionMessageVariant =
  | 'information'
  | 'warning'
  | 'error'
  | 'success'
  | 'discovery'
  | 'change'

export interface SectionMessageProps {
  variant?: SectionMessageVariant
  title?: string
  class?: string
}

const props = withDefaults(defineProps<SectionMessageProps>(), {
  variant: 'information',
})

/**
 * Color palette per variant.
 * Using inline styles with CSS custom property references to stay aligned with
 * the existing token system (tokens.css).
 */
const variantConfig = computed(() => {
  const map: Record<
    SectionMessageVariant,
    { bg: string; border: string; icon: string }
  > = {
    information: {
      bg: 'color-mix(in srgb, var(--ds-color-cyan-500) 10%, transparent)',
      border: 'color-mix(in srgb, var(--ds-color-cyan-500) 30%, transparent)',
      icon: 'var(--ds-color-cyan-500)',
    },
    warning: {
      bg: 'color-mix(in srgb, var(--ds-color-amber-500) 10%, transparent)',
      border: 'color-mix(in srgb, var(--ds-color-amber-500) 30%, transparent)',
      icon: 'var(--ds-color-amber-500)',
    },
    error: {
      bg: 'color-mix(in srgb, var(--ds-color-red-500) 10%, transparent)',
      border: 'color-mix(in srgb, var(--ds-color-red-500) 30%, transparent)',
      icon: 'var(--ds-color-red-500)',
    },
    success: {
      bg: 'color-mix(in srgb, var(--ds-color-teal-400) 10%, transparent)',
      border: 'color-mix(in srgb, var(--ds-color-teal-400) 30%, transparent)',
      icon: 'var(--ds-color-teal-400)',
    },
    discovery: {
      bg: 'color-mix(in srgb, var(--ds-color-purple-400) 10%, transparent)',
      border: 'color-mix(in srgb, var(--ds-color-purple-400) 30%, transparent)',
      icon: 'var(--ds-color-purple-400)',
    },
    change: {
      bg: 'color-mix(in srgb, var(--ds-color-blue-600) 10%, transparent)',
      border: 'color-mix(in srgb, var(--ds-color-blue-600) 30%, transparent)',
      icon: 'var(--ds-color-blue-600)',
    },
  }
  return map[props.variant]
})

const containerStyle = computed(() => ({
  backgroundColor: variantConfig.value.bg,
  borderColor: variantConfig.value.border,
}))

const iconColor = computed(() => variantConfig.value.icon)

const containerClasses = computed(() =>
  cn(
    'flex items-start gap-3 rounded-lg border p-4 text-sm',
    props.class,
  ),
)

/**
 * aria-live value based on variant urgency (Req 16.8).
 * 'error' is urgent → assertive.
 * All other variants → polite.
 */
const ariaLive = computed(() =>
  props.variant === 'error' ? 'assertive' : 'polite',
)
</script>

<template>
  <div
    role="region"
    :aria-label="title || undefined"
    :aria-live="ariaLive"
    :class="containerClasses"
    :style="containerStyle"
  >
    <!-- Icon based on variant (Req 10.5) -->
    <span class="mt-0.5 shrink-0" :style="{ color: iconColor }" aria-hidden="true">
      <!-- information: info circle -->
      <svg
        v-if="variant === 'information'"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path
          d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 3a.875.875 0 1 1 0 1.75A.875.875 0 0 1 8 4Zm1.25 7.25h-2.5v-.5h.75v-3H6.75V7.25h2v3.5h.75v-.5Z"
        />
      </svg>

      <!-- warning: warning triangle -->
      <svg
        v-else-if="variant === 'warning'"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path
          d="M8.865 1.52c-.18-.31-.51-.5-.87-.5s-.69.19-.87.5L.275 13.5c-.18.31-.18.69 0 1 .18.31.51.5.87.5h13.76c.36 0 .69-.19.87-.5.18-.31.18-.69 0-1L8.865 1.52ZM8.005 5.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75Zm0 6.5a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75Z"
        />
      </svg>

      <!-- error: circle with X -->
      <svg
        v-else-if="variant === 'error'"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path
          d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm2.78 4.22a.75.75 0 0 1 0 1.06L9.06 8l1.72 1.72a.75.75 0 1 1-1.06 1.06L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 0 1 1.06 0Z"
        />
      </svg>

      <!-- success: checkmark circle -->
      <svg
        v-else-if="variant === 'success'"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path
          d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm3.28 5.28-3.75 3.75a.75.75 0 0 1-1.06 0l-1.75-1.75a.75.75 0 0 1 1.06-1.06L7 8.44l3.22-3.22a.75.75 0 0 1 1.06 1.06Z"
        />
      </svg>

      <!-- discovery: sparkle / star -->
      <svg
        v-else-if="variant === 'discovery'"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path
          d="M8 1c.28 0 .5.22.5.5 0 1.8.7 3.13 1.76 3.97C11.32 6.31 12.7 6.5 14 6.5c.28 0 .5.22.5.5s-.22.5-.5.5c-1.3 0-2.68.19-3.74 1.03C9.2 9.37 8.5 10.7 8.5 12.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-1.8-.7-3.13-1.76-3.97C4.68 7.69 3.3 7.5 2 7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5c1.3 0 2.68-.19 3.74-1.03C6.8 4.63 7.5 3.3 7.5 1.5c0-.28.22-.5.5-.5Z"
        />
      </svg>

      <!-- change: refresh / arrow cycle -->
      <svg
        v-else-if="variant === 'change'"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path
          d="M13.5 2.5a.5.5 0 0 0-1 0v1.836A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-1.598-3.847L10.5 5.5h3a.5.5 0 0 0 .5-.5V2.5Z"
        />
      </svg>
    </span>

    <!-- Content area -->
    <div class="flex-1 space-y-1">
      <!-- Title (Req 10.3) -->
      <p v-if="title" class="font-semibold text-foreground">{{ title }}</p>

      <!-- Body slot (Req 10.4) -->
      <div class="text-sm text-muted-foreground">
        <slot />
      </div>

      <!-- Actions slot (Req 10.4) -->
      <div v-if="$slots.actions" class="mt-3 flex gap-2">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
