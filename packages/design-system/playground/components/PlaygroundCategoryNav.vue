<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'

const route = useRoute()
const router = useRouter()
const { t } = usePlaygroundLocale()

interface NavItem {
  path: string
  labelKey: string
}

const items: NavItem[] = [
  { path: '/', labelKey: 'categories.all' },
  { path: '/foundations', labelKey: 'categories.foundations' },
  { path: '/catalog', labelKey: 'categories.catalog' },
  { path: '/docs', labelKey: 'categories.docs' },
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function navigate(path: string): void {
  router.push(path)
}
</script>

<template>
  <nav
    class="pg-mobile-category-nav pg-nav"
    aria-label="Playground categories"
  >
    <button
      v-for="item in items"
      :key="item.path"
      type="button"
      class="pg-nav-btn shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium"
      :class="{ 'pg-nav-btn--active': isActive(item.path) }"
      @click="navigate(item.path)"
    >
      {{ t(item.labelKey) }}
    </button>
  </nav>
</template>
