<script setup lang="ts">
import { provide, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Github, Moon, Sun } from 'lucide-vue-next'
import GlowDot from './components/GlowDot.vue'
import ComponentDrawer from './components/ComponentDrawer.vue'
import PlaygroundLocaleSelect from './components/PlaygroundLocaleSelect.vue'
import PlaygroundCategoryNav from './components/PlaygroundCategoryNav.vue'
import { usePlaygroundTheme } from './composables/usePlaygroundTheme'
import { providePlaygroundLocale } from './composables/usePlaygroundLocale'
import ToastHost from '@/components/feedback/ToastHost.vue'

const route = useRoute()
const router = useRouter()
const drawerName = ref<string | null>(null)
const drawerOpen = ref(false)
const { isDark, toggleTheme } = usePlaygroundTheme()
const { t } = providePlaygroundLocale()

function openDrawer(name: string): void {
  drawerName.value = name
  drawerOpen.value = true
}

provide('openDrawer', openDrawer)
</script>

<template>
  <div class="pg-shell min-h-screen overflow-x-clip">
    <div class="pg-grid-bg pointer-events-none fixed inset-0 z-0" />

    <header class="pg-header sticky top-0 z-40">
      <div class="pg-container pg-header-inner">
        <div class="pg-header-brand">
          
          <div class="min-w-0">
            <span class="block truncate text-sm font-semibold" style="color: var(--pg-text)">{{ t('app.title') }}</span>
          </div>
        </div>

        <nav class="pg-header-nav pg-nav">
          <router-link
            v-for="{ path, label } in [{ path: '/', label: 'categories.all' }, { path: '/foundations', label: 'categories.foundations' }, { path: '/catalog', label: 'categories.catalog' }, { path: '/docs', label: 'categories.docs' }]"
            :key="path"
            :to="path"
            class="pg-nav-btn shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium"
            :class="{ 'pg-nav-btn--active': route.path === path }"
          >
            {{ t(label) }}
          </router-link>
        </nav>

        <div class="pg-header-actions">
          <PlaygroundLocaleSelect />
          <button
            type="button"
            class="pg-theme-toggle shrink-0"
            :aria-label="isDark ? t('theme.switchToLight') : t('theme.switchToDark')"
            :title="isDark ? t('theme.lightMode') : t('theme.darkMode')"
            @click="toggleTheme"
          >
            <Sun v-if="isDark" :size="16" />
            <Moon v-else :size="16" />
          </button>
          <a
            href="https://github.com/thiagocarnaes/ds"
            target="_blank"
            rel="noopener noreferrer"
            class="pg-github-link pg-text-muted shrink-0 transition-colors"
          >
            <Github :size="16" />
          </a>
        </div>
      </div>
    </header>

    <main class="pg-container relative z-10 min-w-0 py-8 sm:py-12">
      <PlaygroundCategoryNav class="mb-6" />

      <router-view />

      <footer class="pg-border-top mt-12 flex items-center justify-between pt-8">
        <div class="flex items-center gap-2">
          <GlowDot color="#00E5B0" />
          <span class="pg-text-muted font-mono text-xs">{{ t('app.footer') }}</span>
        </div>
      </footer>
    </main>

    <ComponentDrawer v-model:open="drawerOpen" :name="drawerName" />
    <ToastHost />
  </div>
</template>
