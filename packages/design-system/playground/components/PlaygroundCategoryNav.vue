<script setup lang="ts">
import type { CategoryKey } from '../i18n/types'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'

defineProps<{
  categories: CategoryKey[]
  isActive: (cat: CategoryKey) => boolean
}>()

const emit = defineEmits<{
  select: [cat: CategoryKey]
}>()

const { t } = usePlaygroundLocale()
</script>

<template>
  <nav
    class="pg-mobile-category-nav pg-nav"
    aria-label="Playground categories"
  >
    <button
      v-for="cat in categories"
      :key="cat"
      type="button"
      class="pg-nav-btn shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium"
      :class="{ 'pg-nav-btn--active': isActive(cat) }"
      @click="emit('select', cat)"
    >
      {{ t(`categories.${cat}`) }}
    </button>
  </nav>
</template>
