<script setup lang="ts">
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarShape = 'circle' | 'square'
export type AvatarPresence = 'online' | 'busy' | 'offline' | 'focus'
export type AvatarStatus = 'approved' | 'declined' | 'locked'

export interface AvatarProps {
  src?: string
  name?: string
  size?: AvatarSize
  shape?: AvatarShape
  presence?: AvatarPresence
  status?: AvatarStatus
  class?: string
}

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'md',
  shape: 'circle',
})

const imgError = ref(false)

const palette = ['#00D4FF', '#2979FF', '#00E5B0', '#FF8B00', '#A78BFA', '#FF3D57']

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-14 text-lg',
}

const shapeClass = computed(() =>
  props.shape === 'square' ? 'rounded-[--ds-radius-md]' : 'rounded-full',
)

const initials = computed(() => {
  if (!props.name) return '?'
  return props.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
})

const backgroundColor = computed(() => {
  if (!props.name) return palette[0]
  let hash = 0
  for (const char of props.name) hash = char.charCodeAt(0) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
})

const showInitials = computed(() => !props.src || imgError.value)

const classes = computed(() =>
  cn(
    'relative inline-flex shrink-0 items-center justify-center overflow-hidden font-semibold text-white',
    sizeClasses[props.size],
    shapeClass.value,
    props.class,
  ),
)

// Presence indicator color map
const presenceColorMap: Record<AvatarPresence, string> = {
  online: '#00E5B0',
  busy: '#FF3D57',
  offline: '#4D6A87',
  focus: '#FF8B00',
}

function onImgError() {
  imgError.value = true
}
</script>

<template>
  <span
    :class="classes"
    :style="showInitials ? { backgroundColor } : undefined"
    :aria-label="name"
  >
    <img
      v-if="src && !imgError"
      :src="src"
      :alt="name ?? ''"
      class="size-full object-cover"
      @error="onImgError"
    />
    <span v-if="showInitials" aria-hidden="true">{{ initials }}</span>

    <!-- Presence indicator -->
    <span
      v-if="presence"
      class="absolute bottom-0 right-0 size-[10px] rounded-full border-2 border-card"
      :style="{ backgroundColor: presenceColorMap[presence] }"
      :aria-label="`${presence} presence`"
    />

    <!-- Status icon -->
    <span
      v-if="status"
      class="absolute bottom-0 right-0 size-[14px] flex items-center justify-center"
      :aria-label="`${status} status`"
    >
      <!-- approved: checkmark green -->
      <svg
        v-if="status === 'approved'"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="size-[14px]"
        aria-hidden="true"
      >
        <circle cx="7" cy="7" r="7" fill="#00E5B0" />
        <path d="M3.5 7L5.5 9L10.5 5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <!-- declined: X red -->
      <svg
        v-else-if="status === 'declined'"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="size-[14px]"
        aria-hidden="true"
      >
        <circle cx="7" cy="7" r="7" fill="#FF3D57" />
        <path d="M4.5 4.5L9.5 9.5M9.5 4.5L4.5 9.5" stroke="white" stroke-width="1.5" stroke-linecap="round" />
      </svg>

      <!-- locked: lock gray -->
      <svg
        v-else-if="status === 'locked'"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="size-[14px]"
        aria-hidden="true"
      >
        <circle cx="7" cy="7" r="7" fill="#4D6A87" />
        <rect x="4.5" y="6.5" width="5" height="3.5" rx="0.75" fill="white" />
        <path d="M5.5 6.5V5a1.5 1.5 0 0 1 3 0v1.5" stroke="white" stroke-width="1.2" stroke-linecap="round" />
      </svg>
    </span>
  </span>
</template>
