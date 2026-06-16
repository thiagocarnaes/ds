<script setup lang="ts">
import { cn } from '@/lib/utils'

export interface BreadcrumbItemProps {
  href?: string
  current?: boolean
  class?: string
}

const props = withDefaults(defineProps<BreadcrumbItemProps>(), {
  current: false,
})
</script>

<template>
  <li :class="cn('inline-flex items-center gap-1.5', props.class)">
    <a
      v-if="href && !current"
      :href="href"
      :class="cn('text-primary transition-colors hover:text-primary/80')"
    >
      <slot />
    </a>
    <span
      v-else
      :aria-current="current ? 'page' : undefined"
      :class="cn(current ? 'font-medium text-[#E8EDF5]' : 'text-primary')"
    >
      <slot />
    </span>
  </li>
</template>
