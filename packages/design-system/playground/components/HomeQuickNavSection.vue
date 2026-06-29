<script setup lang="ts">
import type { Component } from 'vue'
import { useRouter } from 'vue-router'
import { Layers, LayoutGrid, BookOpen, ArrowRight } from 'lucide-vue-next'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { designSystemLibraryComponentCount } from '../designSystemMeta'

const router = useRouter()
const { t } = usePlaygroundLocale()

interface QuickNavCard {
  id: 'foundations' | 'catalog' | 'docs'
  icon: Component
  titleKey: string
  descKey: string
  stat: string | number
  path: string
}

const cards: QuickNavCard[] = [
  {
    id: 'foundations',
    icon: Layers,
    titleKey: 'homeQuickNav.foundationsTitle',
    descKey: 'homeQuickNav.foundationsDesc',
    stat: t('homeQuickNav.foundationsStat'),
    path: '/foundations',
  },
  {
    id: 'catalog',
    icon: LayoutGrid,
    titleKey: 'homeQuickNav.componentsTitle',
    descKey: 'homeQuickNav.componentsDesc',
    stat: designSystemLibraryComponentCount,
    path: '/catalog',
  },
  {
    id: 'docs',
    icon: BookOpen,
    titleKey: 'homeQuickNav.docsTitle',
    descKey: 'homeQuickNav.docsDesc',
    stat: t('homeQuickNav.docsStat'),
    path: '/docs',
  },
]

function handleCardClick(path: string): void {
  router.push(path)
}

function handleCardKeydown(event: KeyboardEvent, path: string): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    router.push(path)
  }
}
</script>

<template>
  <section class="mb-10 lg:mb-14" :aria-label="t('homeQuickNav.sectionTitle')">
    <h2 class="mb-6 text-xs font-semibold uppercase tracking-widest" style="color: var(--pg-text-muted)">
      {{ t('homeQuickNav.sectionTitle') }}
    </h2>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div
        v-for="card in cards"
        :key="card.id"
        role="button"
        :tabindex="0"
        class="quick-nav-card group relative flex cursor-pointer flex-col gap-4 rounded-xl p-5 outline-none transition-all duration-200"
        :aria-label="`${t(card.titleKey)} — ${t('homeQuickNav.arrowLabel')}`"
        @click="handleCardClick(card.path)"
        @keydown="handleCardKeydown($event, card.path)"
      >
        <!-- Icon -->
        <div
          class="flex size-10 items-center justify-center rounded-lg transition-colors duration-200"
          style="background: var(--pg-nav-active-bg)"
        >
          <component
            :is="card.icon"
            :size="20"
            aria-hidden="true"
            style="color: var(--pg-accent)"
          />
        </div>

        <!-- Content -->
        <div class="flex flex-1 flex-col gap-1.5">
          <h3 class="text-sm font-semibold" style="color: var(--pg-text)">
            {{ t(card.titleKey) }}
          </h3>
          <p class="text-xs leading-relaxed" style="color: var(--pg-text-subtle)">
            {{ t(card.descKey) }}
          </p>
        </div>

        <!-- Footer row: stat + arrow -->
        <div class="flex items-center justify-between">
          <span
            class="rounded-md px-2 py-0.5 font-mono text-[11px] font-medium"
            style="background: var(--pg-nav-active-bg); color: var(--pg-accent)"
          >
            {{ card.stat }}
          </span>
          <ArrowRight
            :size="14"
            aria-hidden="true"
            class="transition-transform duration-200 group-hover:translate-x-0.5"
            style="color: var(--pg-text-muted)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.quick-nav-card {
  background: linear-gradient(135deg, var(--pg-card-from), var(--pg-card-to));
  border: 1px solid var(--pg-card-border);
}

.quick-nav-card:hover {
  background: var(--pg-nav-active-bg);
  border-color: var(--pg-card-border-hover);
}

.quick-nav-card:focus-visible {
  outline: 2px solid var(--pg-accent);
  outline-offset: 2px;
}
</style>
