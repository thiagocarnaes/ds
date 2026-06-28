<script setup lang="ts">
import type { Component } from 'vue'
import { Zap, Layers, TrendingUp } from 'lucide-vue-next'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'

const { t } = usePlaygroundLocale()

interface PurposeBenefit {
  icon: Component
  titleKey: string
  descKey: string
}

const benefits: PurposeBenefit[] = [
  {
    icon: Zap,
    titleKey: 'homePurpose.benefit1Title',
    descKey: 'homePurpose.benefit1Desc',
  },
  {
    icon: Layers,
    titleKey: 'homePurpose.benefit2Title',
    descKey: 'homePurpose.benefit2Desc',
  },
  {
    icon: TrendingUp,
    titleKey: 'homePurpose.benefit3Title',
    descKey: 'homePurpose.benefit3Desc',
  },
]
</script>

<template>
  <section class="mb-10 lg:mb-14" :aria-label="t('homePurpose.sectionTitle')">
    <h2 class="mb-4 text-xs font-semibold uppercase tracking-widest" style="color: var(--pg-text-muted)">
      {{ t('homePurpose.sectionTitle') }}
    </h2>

    <!-- Mission paragraph -->
    <p class="mb-8 max-w-2xl text-sm leading-relaxed" style="color: var(--pg-text-subtle)">
      {{ t('homePurpose.mission') }}
    </p>

    <!-- Benefits grid -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div
        v-for="(benefit, index) in benefits"
        :key="index"
        class="purpose-benefit-card flex flex-col gap-4 rounded-xl p-5"
      >
        <!-- Icon -->
        <div
          class="flex size-10 items-center justify-center rounded-lg"
          style="background: var(--pg-nav-active-bg)"
        >
          <component
            :is="benefit.icon"
            :size="20"
            aria-hidden="true"
            style="color: var(--pg-accent)"
          />
        </div>

        <!-- Content -->
        <div class="flex flex-col gap-1.5">
          <h3 class="text-sm font-semibold" style="color: var(--pg-text)">
            {{ t(benefit.titleKey) }}
          </h3>
          <p class="text-xs leading-relaxed" style="color: var(--pg-text-subtle)">
            {{ t(benefit.descKey) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.purpose-benefit-card {
  background: linear-gradient(135deg, var(--pg-card-from), var(--pg-card-to));
  border: 1px solid var(--pg-card-border);
}
</style>
