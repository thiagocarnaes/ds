<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import { Eye, AlignCenter, Zap, Layers } from 'lucide-vue-next'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'

const { t } = usePlaygroundLocale()

interface Principle {
  icon: Component
  titleKey: string
  descKey: string
}

const principles: Principle[] = [
  {
    icon: Eye,
    titleKey: 'homePrinciples.p1Title',
    descKey: 'homePrinciples.p1Desc',
  },
  {
    icon: AlignCenter,
    titleKey: 'homePrinciples.p2Title',
    descKey: 'homePrinciples.p2Desc',
  },
  {
    icon: Zap,
    titleKey: 'homePrinciples.p3Title',
    descKey: 'homePrinciples.p3Desc',
  },
  {
    icon: Layers,
    titleKey: 'homePrinciples.p4Title',
    descKey: 'homePrinciples.p4Desc',
  },
]

const shouldRender = computed(() => principles.length >= 4)
</script>

<template>
  <section
    v-if="shouldRender"
    class="mb-10 lg:mb-14"
    :aria-label="t('homePrinciples.sectionTitle')"
  >
    <h2
      class="mb-6 text-xs font-semibold uppercase tracking-widest"
      style="color: var(--pg-text-muted)"
    >
      {{ t('homePrinciples.sectionTitle') }}
    </h2>

    <!-- Principles grid: 1 col < 768px, 2 cols < 1024px, 4 cols >= 1024px -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="(principle, index) in principles"
        :key="index"
        class="principle-card flex flex-col gap-4 rounded-xl p-5"
      >
        <!-- Decorative icon -->
        <div
          class="flex size-10 items-center justify-center rounded-lg"
          style="background: var(--pg-nav-active-bg)"
        >
          <component
            :is="principle.icon"
            :size="20"
            aria-hidden="true"
            style="color: var(--pg-accent)"
          />
        </div>

        <!-- Content -->
        <div class="flex flex-col gap-1.5">
          <h3 class="text-sm font-semibold" style="color: var(--pg-text)">
            {{ t(principle.titleKey) }}
          </h3>
          <p class="text-xs leading-relaxed" style="color: var(--pg-text-subtle)">
            {{ t(principle.descKey) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.principle-card {
  background: linear-gradient(135deg, var(--pg-card-from), var(--pg-card-to));
  border: 1px solid var(--pg-card-border);
}
</style>
