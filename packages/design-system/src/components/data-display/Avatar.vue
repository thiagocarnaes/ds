<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps {
  src?: string
  name?: string
  size?: AvatarSize
  class?: string
}

const props = withDefaults(defineProps<AvatarProps>(), {
  size: 'md',
})

const palette = ['#00D4FF', '#2979FF', '#00E5B0', '#FF8B00', '#A78BFA', '#FF3D57']

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-14 text-lg',
}

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

const classes = computed(() =>
  cn(
    'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white',
    sizeClasses[props.size],
    props.class,
  ),
)
</script>

<template>
  <span
    :class="classes"
    :style="src ? undefined : { backgroundColor }"
  >
    <img
      v-if="src"
      :src="src"
      :alt="name ?? ''"
      class="size-full object-cover"
    />
    <span v-else aria-hidden="true">{{ initials }}</span>
  </span>
</template>
