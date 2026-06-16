<script setup lang="ts">
import { cn } from '@/lib/utils'

export interface SkeletonProps {
  class?: string
}

const props = defineProps<SkeletonProps>()
</script>

<template>
  <div
    :class="cn('block animate-pulse rounded-md bg-muted', props.class)"
    aria-hidden="true"
  />
</template>
