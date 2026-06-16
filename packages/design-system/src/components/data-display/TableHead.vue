<script setup lang="ts">
import { cn } from '@/lib/utils'

export interface TableHeadProps {
  class?: string
}

const props = defineProps<TableHeadProps>()
</script>

<template>
  <thead :class="cn('[&_tr]:border-b', props.class)">
    <slot />
  </thead>
</template>
