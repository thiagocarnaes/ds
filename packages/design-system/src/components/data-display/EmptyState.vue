<script setup lang="ts">
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  title: string
  description?: string
  class?: string
}

const props = defineProps<EmptyStateProps>()
</script>

<template>
  <div
    :class="
      cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-border px-6 py-12 text-center',
        props.class,
      )
    "
  >
    <h3 class="text-lg font-semibold text-foreground">{{ title }}</h3>
    <p v-if="description" class="mt-2 max-w-sm text-sm text-muted-foreground">
      {{ description }}
    </p>
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </div>
</template>
