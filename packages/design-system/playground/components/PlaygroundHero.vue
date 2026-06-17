<script setup lang="ts">
import GlowDot from './GlowDot.vue'
import StatPill from './StatPill.vue'
import logoUrl from '../assets/logo.png?url'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { Button } from '@/index'
import { designSystemLibraryComponentCount, designSystemVersionBadge } from '../designSystemMeta'

const props = defineProps<{
  /** Home → All: show pillars, stats and playground on mobile/tablet too. */
  fullLanding?: boolean
}>()

const emit = defineEmits<{
  browse: []
  docs: []
  playground: []
}>()

const { t } = usePlaygroundLocale()

const pillars = [
  {
    id: 'components' as const,
    color: '#A78BFA',
    titleKey: 'hero.pillarComponentsTitle' as const,
    bodyKey: 'hero.pillarComponentsBody' as const,
    count: designSystemLibraryComponentCount,
    showDot: false,
  },
  {
    id: 'playgrounds' as const,
    color: '#00E5B0',
    titleKey: 'hero.pillarPlaygroundsTitle' as const,
    bodyKey: 'hero.pillarPlaygroundsBody' as const,
    showDot: true,
  },
]
</script>

<template>
  <section class="mb-8 lg:mb-12">
    <div class="mb-6 flex items-center gap-2">
      <GlowDot />
      <span class="pg-text-muted font-mono text-[10px] uppercase tracking-widest">
        {{ t('hero.versionLine', { version: designSystemVersionBadge }) }}
      </span>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div>
        <div class="pg-hero-headline mb-5">
          <img :src="logoUrl" alt="" class="pg-hero-logo" />
          <h1 class="text-3xl font-bold leading-[1.05] sm:text-4xl lg:text-5xl" style="letter-spacing: -0.02em">
            <span style="color: var(--pg-text)">{{ t('hero.titleLine1') }}</span><br />
            <span :style="{ color: 'var(--pg-hero-accent)', textShadow: `0 0 40px var(--pg-hero-glow)` }">
              {{ t('hero.titleLine2') }}
            </span>
          </h1>
        </div>
        <p class="pg-text-subtle max-w-md text-sm leading-[1.8]">
          {{ t('hero.subtitle') }}
        </p>
        <div class="mt-6 flex flex-wrap items-center gap-3">
          <Button variant="primary" @click="emit('browse')">
            {{ t('hero.browseComponents') }}
          </Button>
          <Button variant="outline" @click="emit('docs')">
            {{ t('hero.installDocs') }}
          </Button>
          <Button variant="outline" @click="emit('playground')">
            <GlowDot color="#00E5B0" />
            {{ t('hero.playground') }}
          </Button>
        </div>
      </div>

      <div
        class="grid grid-cols-1 gap-3 sm:grid-cols-2"
        :class="props.fullLanding ? 'grid' : 'hidden lg:grid'"
      >
        <div
          v-for="pillar in pillars"
          :key="pillar.id"
          class="flex flex-col gap-2 rounded-xl p-4"
          :style="{ background: pillar.color + '08', border: `1px solid ${pillar.color}15` }"
        >
          <div class="flex items-center gap-2">
            <GlowDot v-if="pillar.showDot" :color="pillar.color" />
            <p class="text-xs font-semibold" style="color: var(--pg-pillar-text)">
              {{
                pillar.count
                  ? t(pillar.titleKey, { count: pillar.count })
                  : t(pillar.titleKey)
              }}
            </p>
          </div>
          <p class="pg-text-muted text-[11px] leading-relaxed">{{ t(pillar.bodyKey) }}</p>
        </div>
      </div>
    </div>

    <div
      class="pg-border-top mt-8 flex flex-wrap gap-4 pt-8"
      :class="props.fullLanding ? 'flex' : 'hidden lg:flex'"
    >
      <StatPill :label="t('hero.statComponents')" :target="designSystemLibraryComponentCount" color="#00D4FF" />
      <StatPill :label="t('hero.statCoverage')" :target="94" suffix="%" color="#00E5B0" />
    </div>
  </section>
</template>
