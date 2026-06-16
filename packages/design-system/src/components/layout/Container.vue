<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

export type ContainerMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export interface ContainerProps {
  maxWidth?: ContainerMaxWidth
  class?: string
}

const props = withDefaults(defineProps<ContainerProps>(), {
  maxWidth: 'lg',
})

const maxWidthClasses: Record<ContainerMaxWidth, string> = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'max-w-full',
}

const classes = computed(() =>
  cn('mx-auto w-full px-4 sm:px-6 lg:px-8', maxWidthClasses[props.maxWidth], props.class),
)
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
