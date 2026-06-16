<script setup lang="ts">
import { cn } from '@/lib/utils'

export interface ListItemProps {
  class?: string
}

const props = defineProps<ListItemProps>()
</script>

<template>
  <li :class="cn('px-4 py-3 text-sm text-foreground', props.class)">
    <slot />
  </li>
</template>
