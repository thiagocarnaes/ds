<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

export type StackDirection = 'vertical' | 'horizontal'
export type StackGap = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'

export interface StackProps {
  direction?: StackDirection
  gap?: StackGap
  align?: StackAlign
  justify?: StackJustify
  class?: string
}

const props = withDefaults(defineProps<StackProps>(), {
  direction: 'vertical',
  gap: 4,
  align: 'stretch',
  justify: 'start',
})

const gapClasses: Record<StackGap, string> = {
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  7: 'gap-7',
  8: 'gap-8',
}

const alignClasses: Record<StackAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
}

const justifyClasses: Record<StackJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

const classes = computed(() =>
  cn(
    'flex',
    props.direction === 'vertical' ? 'flex-col' : 'flex-row',
    gapClasses[props.gap],
    alignClasses[props.align],
    justifyClasses[props.justify],
    props.class,
  ),
)
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
