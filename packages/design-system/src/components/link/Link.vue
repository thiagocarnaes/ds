<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

export interface LinkProps {
  href?: string
  /** When set, renders as anchor with router-friendly href (consumer may swap via slot). */
  to?: string
  external?: boolean
  class?: string
}

const props = withDefaults(defineProps<LinkProps>(), {
  external: false,
})

const tag = computed(() => (props.to || props.href ? 'a' : 'span'))
const linkHref = computed(() => props.to ?? props.href)
const rel = computed(() => (props.external ? 'noopener noreferrer' : undefined))
const target = computed(() => (props.external ? '_blank' : undefined))
</script>

<template>
  <component
    :is="tag"
    :href="linkHref"
    :target="target"
    :rel="rel"
    :class="cn('text-primary underline-offset-4 hover:underline', props.class)"
  >
    <slot />
  </component>
</template>
