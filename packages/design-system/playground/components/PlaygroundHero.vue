<script setup lang="ts">
import GlowDot from './GlowDot.vue'
import StatPill from './StatPill.vue'
import logoUrl from '../assets/logo.png?url'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { Button } from '@/index'
import {
  designSystemLibraryComponentCount,
  designSystemVersionBadge,
  playgroundDemoComponentCount,
} from '../designSystemMeta'

const props = defineProps<{
  /** Home → All: show stats on mobile/tablet too. */
  fullLanding?: boolean
}>()

const emit = defineEmits<{
  browse: []
  docs: []
  playground: []
}>()

const { t } = usePlaygroundLocale()
</script>

<template>
  <section class="mb-8 lg:mb-12">
    <div class="mb-6 flex items-center gap-2">
      <GlowDot />
      <span class="pg-text-muted font-mono text-[10px] uppercase tracking-widest">
        {{ t('hero.versionLine', { version: designSystemVersionBadge }) }}
      </span>
    </div>

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

    <!-- Stats_Bar: 4 StatPills — visible on all viewports when fullLanding=true, hidden on <lg when false -->
    <div
      class="pg-border-top mt-8 flex flex-wrap gap-4 pt-8"
      :class="props.fullLanding ? '' : 'hidden lg:flex'"
    >
      <StatPill
        :label="t('homeStats.components')"
        :target="designSystemLibraryComponentCount"
        color="#00D4FF"
      />
      <StatPill
        :label="t('homeStats.coverage')"
        :target="94"
        suffix="%"
        color="#00E5B0"
      />
      <StatPill
        :label="t('homeStats.demos')"
        :target="playgroundDemoComponentCount"
        color="#A78BFA"
      />
      <!-- Version: static string, no numeric animation -->
      <div
        class="flex min-w-[120px] flex-col gap-1 rounded-xl px-4 py-3"
        style="background: color-mix(in srgb, var(--pg-accent) 10%, transparent); border: 1px solid color-mix(in srgb, var(--pg-accent) 20%, transparent)"
      >
        <span class="font-mono text-2xl font-bold" style="color: var(--pg-accent)">
          {{ designSystemVersionBadge }}
        </span>
        <span class="text-[10px] uppercase tracking-wider text-[#4D6A87]">{{ t('homeStats.version') }}</span>
      </div>
    </div>
  </section>
</template>
