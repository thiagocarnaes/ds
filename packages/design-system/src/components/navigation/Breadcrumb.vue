<script setup lang="ts">
import { cn } from '@/lib/utils'

export interface BreadcrumbProps {
  /** Separator character between items. */
  separator?: string
  class?: string
}

const props = withDefaults(defineProps<BreadcrumbProps>(), {
  separator: '/',
})
</script>

<template>
  <nav aria-label="breadcrumb" :class="cn(props.class)">
    <ol
      class="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground [&>li+li]:before:mx-1.5 [&>li+li]:before:text-muted-foreground [&>li+li]:before:content-[var(--ds-breadcrumb-separator)]"
      :style="{ '--ds-breadcrumb-separator': `'${props.separator}'` }"
    >
      <slot />
    </ol>
  </nav>
</template>
