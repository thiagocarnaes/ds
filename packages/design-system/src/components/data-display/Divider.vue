<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

export type DividerOrientation = 'horizontal' | 'vertical'

export interface DividerProps {
  orientation?: DividerOrientation
  class?: string
}

const props = withDefaults(defineProps<DividerProps>(), {
  orientation: 'horizontal',
})

const isHorizontal = computed(() => props.orientation === 'horizontal')
</script>

<template>
  <hr
    v-if="isHorizontal"
    role="separator"
    :class="cn('shrink-0 border-0 border-t border-border', props.class)"
  />
  <div
    v-else
    role="separator"
    aria-orientation="vertical"
    :class="cn('shrink-0 self-stretch border-l border-border', props.class)"
  />
</template>
