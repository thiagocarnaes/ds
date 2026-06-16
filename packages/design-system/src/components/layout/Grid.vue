<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

export interface GridProps {
  cols?: number
  mdCols?: number
  lgCols?: number
  class?: string
}

const props = withDefaults(defineProps<GridProps>(), {
  cols: 1,
})

const colClassMap: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
  11: 'grid-cols-11',
  12: 'grid-cols-12',
}

const mdColClassMap: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
  7: 'md:grid-cols-7',
  8: 'md:grid-cols-8',
  9: 'md:grid-cols-9',
  10: 'md:grid-cols-10',
  11: 'md:grid-cols-11',
  12: 'md:grid-cols-12',
}

const lgColClassMap: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  7: 'lg:grid-cols-7',
  8: 'lg:grid-cols-8',
  9: 'lg:grid-cols-9',
  10: 'lg:grid-cols-10',
  11: 'lg:grid-cols-11',
  12: 'lg:grid-cols-12',
}

function resolveColClass(
  value: number | undefined,
  map: Record<number, string>,
  fallback: string,
): string {
  if (value === undefined) return fallback
  return map[value] ?? fallback
}

const classes = computed(() =>
  cn(
    'grid gap-4',
    resolveColClass(props.cols, colClassMap, 'grid-cols-1'),
    props.mdCols !== undefined
      ? resolveColClass(props.mdCols, mdColClassMap, '')
      : undefined,
    props.lgCols !== undefined
      ? resolveColClass(props.lgCols, lgColClassMap, '')
      : undefined,
    props.class,
  ),
)
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
