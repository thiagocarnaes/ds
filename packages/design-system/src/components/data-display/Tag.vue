<script setup lang="ts">
import { computed, inject } from 'vue'
import { cn } from '@/lib/utils'
import { TAG_GROUP_KEY } from './TagGroup'

/**
 * Tag — classification/categorization element with optional remove action.
 *
 * Renders as <a> when isLink && href, otherwise as <span>.
 * Adds role="listitem" automatically when inside a TagGroup.
 *
 * Requirements: 12.2, 12.3, 12.4, 12.5, 12.7
 */

export type TagColor = 'default' | 'blue' | 'teal' | 'red' | 'orange' | 'purple'

export interface TagProps {
  text: string
  isRemovable?: boolean
  color?: TagColor
  href?: string
  isLink?: boolean
  class?: string
}

const props = withDefaults(defineProps<TagProps>(), {
  isRemovable: false,
  color: 'default',
  isLink: false,
})

const emit = defineEmits<{
  remove: [text: string]
}>()

// Check if we're inside a TagGroup via injection
const tagGroup = inject(TAG_GROUP_KEY, null)
const isInGroup = computed(() => tagGroup !== null)

// Determine root element: <a> when isLink && href, else <span>
const rootTag = computed(() => {
  if (props.isLink && props.href) return 'a'
  return 'span'
})

interface TagColorStyle {
  bg: string
  color: string
  border: string
}

const colorMap: Record<TagColor, TagColorStyle> = {
  default: {
    bg: 'rgba(77,106,135,0.12)',
    color: '#7BA3C8',
    border: 'rgba(77,106,135,0.25)',
  },
  blue: {
    bg: 'rgba(41,121,255,0.10)',
    color: '#2979FF',
    border: 'rgba(41,121,255,0.30)',
  },
  teal: {
    bg: 'rgba(0,229,176,0.08)',
    color: '#00E5B0',
    border: 'rgba(0,229,176,0.25)',
  },
  red: {
    bg: 'rgba(255,61,87,0.08)',
    color: '#FF3D57',
    border: 'rgba(255,61,87,0.25)',
  },
  orange: {
    bg: 'rgba(255,139,0,0.08)',
    color: '#FF8B00',
    border: 'rgba(255,139,0,0.25)',
  },
  purple: {
    bg: 'rgba(167,139,250,0.08)',
    color: '#A78BFA',
    border: 'rgba(167,139,250,0.25)',
  },
}

const tagStyle = computed(() => {
  const palette = colorMap[props.color ?? 'default']
  return {
    backgroundColor: palette.bg,
    color: palette.color,
    border: `1px solid ${palette.border}`,
  }
})

const tagClasses = computed(() =>
  cn(
    'inline-flex items-center gap-1 rounded-[var(--ds-radius-badge)] px-2.5 py-0.5 text-xs font-medium leading-none',
    props.isLink && props.href ? 'cursor-pointer hover:opacity-80 transition-opacity' : '',
    props.class,
  ),
)

function onRemove(event: MouseEvent) {
  event.stopPropagation()
  emit('remove', props.text)
}
</script>

<template>
  <component
    :is="rootTag"
    :class="tagClasses"
    :style="tagStyle"
    :href="isLink && href ? href : undefined"
    :role="isInGroup ? 'listitem' : undefined"
  >
    {{ text }}
    <button
      v-if="isRemovable"
      type="button"
      :aria-label="`Remover ${text}`"
      class="ml-0.5 inline-flex size-3.5 shrink-0 items-center justify-center rounded-full opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current"
      @click="onRemove"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 14 14"
        fill="none"
        class="size-2.5"
        aria-hidden="true"
      >
        <path
          d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </component>
</template>
