<script setup lang="ts">
import { cn } from '@/lib/utils'

export interface ListProps {
  class?: string
}

const props = defineProps<ListProps>()
</script>

<template>
  <ul :class="cn('divide-y divide-border rounded-md border border-border', props.class)">
    <slot />
  </ul>
</template>
