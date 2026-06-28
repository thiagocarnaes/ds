<script setup lang="ts">
import { provide } from 'vue'
import Tag, { type TagColor } from './Tag.vue'
import { TAG_GROUP_KEY } from './TagGroup'

/**
 * TagGroup — container that renders a list of Tag components.
 *
 * Provides TAG_GROUP_KEY injection so child Tags can apply role="listitem".
 * Uses role="list" and gap of space.050 (4 px) between tags.
 *
 * Requirements: 12.6, 12.7
 */

export interface TagGroupItem {
  text: string
  color?: TagColor
  isRemovable?: boolean
  href?: string
  isLink?: boolean
}

export interface TagGroupProps {
  tags?: TagGroupItem[]
  label?: string
}

const props = withDefaults(defineProps<TagGroupProps>(), {
  tags: () => [],
})

const emit = defineEmits<{
  remove: [text: string]
}>()

// Provide the injection key so child Tags know they're inside a group
provide(TAG_GROUP_KEY, true)

function onTagRemove(text: string) {
  emit('remove', text)
}
</script>

<template>
  <div
    role="list"
    :aria-label="label"
    class="flex flex-wrap gap-[--ds-space-050]"
  >
    <Tag
      v-for="tag in tags"
      :key="tag.text"
      v-bind="tag"
      @remove="onTagRemove"
    />
    <slot />
  </div>
</template>
