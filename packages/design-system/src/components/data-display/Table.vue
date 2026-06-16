<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

export interface TableProps {
  striped?: boolean
  class?: string
}

const props = withDefaults(defineProps<TableProps>(), {
  striped: false,
})

const classes = computed(() =>
  cn(
    'w-full caption-bottom text-sm',
    props.striped && '[&_tbody_tr:nth-child(even)]:bg-muted/50',
    '[&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-muted/50',
    props.class,
  ),
)
</script>

<template>
  <div class="relative w-full overflow-auto">
    <table :class="classes">
      <slot />
    </table>
  </div>
</template>
