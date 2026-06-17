<script setup lang="ts">
import { computed, ref, TransitionGroup } from 'vue'
import { ArrowUpRight, Moon, Sun, Zap } from 'lucide-vue-next'
import GlowDot from './components/GlowDot.vue'
import StatPill from './components/StatPill.vue'
import ComponentDrawer from './components/ComponentDrawer.vue'
import PlaygroundLocaleSelect from './components/PlaygroundLocaleSelect.vue'
import { usePlaygroundTheme } from './composables/usePlaygroundTheme'
import { providePlaygroundLocale } from './composables/usePlaygroundLocale'
import { usePlaygroundGrid } from './composables/usePlaygroundGrid'
import type { CategoryKey } from './i18n/types'
import ButtonCard from './cards/ButtonCard.vue'
import ColorCard from './cards/ColorCard.vue'
import TypographyCard from './cards/TypographyCard.vue'
import LabelsCard from './cards/LabelsCard.vue'
import AvatarCard from './cards/AvatarCard.vue'
import InputsCard from './cards/InputsCard.vue'
import ControlsCard from './cards/ControlsCard.vue'
import IconsCard from './cards/IconsCard.vue'
import LoadingCard from './cards/LoadingCard.vue'
import SpacingCard from './cards/SpacingCard.vue'
import MessagesCard from './cards/MessagesCard.vue'
import ChatPreviewCard from './cards/ChatPreviewCard.vue'
import ComponentIndexCard from './cards/ComponentIndexCard.vue'
import LayoutCard from './cards/LayoutCard.vue'
import DataTableCard from './cards/DataTableCard.vue'
import DocumentationPage from './views/DocumentationPage.vue'
import ComponentsCatalogPage from './views/ComponentsCatalogPage.vue'
import ToastHost from '@/components/feedback/ToastHost.vue'
import { Button } from '@/index'
import { designSystemLibraryComponentCount, designSystemVersionBadge } from './designSystemMeta'

type PlaygroundPage = 'home' | 'docs' | 'catalog'

const CATEGORY_KEYS: CategoryKey[] = [
  'all',
  'foundations',
  'forms',
  'labels',
  'feedback',
  'layout',
  'catalog',
  'docs',
]

const activeCat = ref<CategoryKey>('all')
const activePage = ref<PlaygroundPage>('home')
const drawerName = ref<string | null>(null)
const drawerOpen = ref(false)
const { isDark, toggleTheme } = usePlaygroundTheme()
const { t } = providePlaygroundLocale()
const { viewportCols } = usePlaygroundGrid(activeCat)

const cards = [
  { id: 'button', cats: ['forms'], span: 1, component: ButtonCard },
  { id: 'controls', cats: ['forms'], span: 1, component: ControlsCard },
  { id: 'inputs', cats: ['forms'], span: 3, component: InputsCard },
  { id: 'color', cats: ['foundations'], span: 4, component: ColorCard },
  { id: 'typography', cats: ['foundations'], span: 1, component: TypographyCard },
  { id: 'spacing', cats: ['foundations'], span: 1, component: SpacingCard },
  { id: 'icons', cats: ['foundations'], span: 4, component: IconsCard },
  { id: 'labels', cats: ['labels'], span: 1, component: LabelsCard },
  { id: 'avatar', cats: ['labels'], span: 1, component: AvatarCard },
  { id: 'loading', cats: ['feedback'], span: 1, component: LoadingCard },
  { id: 'messages', cats: ['feedback'], span: 1, component: MessagesCard },
  { id: 'chat', cats: ['feedback'], span: 4, component: ChatPreviewCard },
  { id: 'layout', cats: ['layout'], span: 3, component: LayoutCard, tall: true },
  { id: 'datatable', cats: ['layout'], span: 4, component: DataTableCard, tall: true },
  { id: 'index', cats: ['forms', 'labels', 'feedback', 'layout'], span: 3, component: ComponentIndexCard, tall: true },
] as const

type PlaygroundCard = (typeof cards)[number]

const visibleCards = computed(() =>
  activeCat.value === 'all'
    ? [...cards]
    : cards.filter((c) => c.cats.includes(activeCat.value)),
)

const hasPlaygroundSection = computed(
  () => activePage.value === 'home' && visibleCards.value.some((card) => card.id === 'index'),
)

const heroPillars = computed(() => [
  {
    id: 'components' as const,
    color: '#A78BFA',
    title: t('hero.pillarComponentsTitle', { count: designSystemLibraryComponentCount }),
    body: t('hero.pillarComponentsBody'),
  },
  {
    id: 'playgrounds' as const,
    color: '#00E5B0',
    title: t('hero.pillarPlaygroundsTitle'),
    body: t('hero.pillarPlaygroundsBody'),
  },
])

function cardGridSpan(card: PlaygroundCard): number {
  let span: number

  if (activeCat.value === 'all') {
    if (card.id === 'inputs' || card.id === 'icons' || card.id === 'color' || card.id === 'chat' || card.id === 'datatable') {
      span = 4
    } else if (card.id === 'button' || card.id === 'controls' || card.id === 'loading' || card.id === 'messages') {
      span = 2
    } else {
      span = Math.min(Math.ceil((card.span / 3) * 4), 4)
    }
  } else if (card.id === 'inputs' || card.id === 'icons' || card.id === 'color' || card.id === 'chat' || card.id === 'datatable') {
    span = 2
  } else {
    span = Math.min(card.span, 2)
  }

  return Math.min(span, viewportCols.value)
}

function openDrawer(name: string): void {
  drawerName.value = name
  drawerOpen.value = true
}

function openCatalog(): void {
  setCategory('catalog')
}

function openDocs(): void {
  setCategory('docs')
}

function setCategory(cat: CategoryKey): void {
  activeCat.value = cat
  if (cat === 'docs') activePage.value = 'docs'
  else if (cat === 'catalog') activePage.value = 'catalog'
  else activePage.value = 'home'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function isNavActive(cat: CategoryKey): boolean {
  if (cat === 'docs') return activePage.value === 'docs'
  if (cat === 'catalog') return activePage.value === 'catalog'
  return activePage.value === 'home' && activeCat.value === cat
}

function scrollToPlayground(): void {
  if (!hasPlaygroundSection.value) return
  requestAnimationFrame(() => {
    document.getElementById('card-index')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}
</script>

<template>
  <div class="pg-shell min-h-screen overflow-x-clip">
    <div class="pg-grid-bg pointer-events-none fixed inset-0 z-0" />

    <header class="pg-header sticky top-0 z-40">
      <div class="pg-container pg-header-inner">
        <div class="pg-header-brand">
          <div
            class="flex size-7 shrink-0 items-center justify-center rounded-lg"
            style="background: linear-gradient(135deg, #0052CC, #00D4FF); box-shadow: 0 0 14px var(--pg-accent-glow)"
          >
            <Zap :size="14" class="text-white" />
          </div>
          <div class="min-w-0">
            <span class="block truncate text-sm font-semibold" style="color: var(--pg-text)">{{ t('app.title') }}</span>
            <span class="pg-text-muted font-mono text-[10px]">{{ t('app.versionBadge', { version: designSystemVersionBadge }) }}</span>
          </div>
        </div>

        <nav class="pg-header-nav pg-nav">
          <button
            v-for="cat in CATEGORY_KEYS"
            :key="cat"
            type="button"
            class="pg-nav-btn shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium"
            :class="{ 'pg-nav-btn--active': isNavActive(cat) }"
            @click="setCategory(cat)"
          >
            {{ t(`categories.${cat}`) }}
          </button>
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
          <span
            class="hidden rounded-md px-2 py-1 font-mono text-[10px] xl:inline"
            :style="{ background: 'var(--pg-stable-bg)', color: 'var(--pg-stable-text)' }"
          >
            {{ t('app.stable') }}
          </span>
          <a
            href="https://github.com/thiagocarnaes/ds"
            target="_blank"
            rel="noopener noreferrer"
            class="pg-text-muted shrink-0 transition-colors hover:text-[var(--pg-accent)]"
          >
            <ArrowUpRight :size="14" />
          </a>
        </div>
      </div>
    </header>

    <main class="pg-container relative z-10 min-w-0 py-8 sm:py-12">
      <ComponentsCatalogPage
        v-if="activePage === 'catalog'"
        @open-playground="openDrawer"
      />

      <DocumentationPage v-else-if="activePage === 'docs'" />

      <template v-else>
        <div class="mb-12">
        <div class="mb-6 flex items-center gap-2">
          <GlowDot />
          <span class="pg-text-muted font-mono text-[10px] uppercase tracking-widest">{{ t('hero.versionLine', { version: designSystemVersionBadge }) }}</span>
        </div>

        <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h1 class="mb-5 text-3xl font-bold leading-[1.05] sm:text-4xl lg:text-5xl" style="letter-spacing: -0.02em">
              <span style="color: var(--pg-text)">{{ t('hero.titleLine1') }}</span><br />
              <span :style="{ color: 'var(--pg-hero-accent)', textShadow: `0 0 40px var(--pg-hero-glow)` }">
                {{ t('hero.titleLine2') }}
              </span>
            </h1>
            <p class="pg-text-subtle max-w-md text-sm leading-[1.8]">
              {{ t('hero.subtitle') }}
            </p>
            <div class="mt-6 flex flex-wrap items-center gap-3">
              <Button appearance="primary" @click="openCatalog">
                {{ t('hero.browseComponents') }}
              </Button>
              <Button appearance="outline" @click="openDocs">
                {{ t('hero.installDocs') }}
              </Button>
              <Button v-if="hasPlaygroundSection" appearance="outline" @click="scrollToPlayground">
                <GlowDot color="#00E5B0" />
                {{ t('hero.playground') }}
              </Button>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div
              v-for="pillar in heroPillars"
              :key="pillar.id"
              class="flex flex-col gap-2 rounded-xl p-4"
              :style="{ background: pillar.color + '08', border: `1px solid ${pillar.color}15` }"
            >
              <div class="flex items-center gap-2">
                <GlowDot v-if="pillar.id === 'playgrounds'" :color="pillar.color" />
                <p class="text-xs font-semibold" style="color: var(--pg-pillar-text)">{{ pillar.title }}</p>
              </div>
              <p class="pg-text-muted text-[11px] leading-relaxed">{{ pillar.body }}</p>
            </div>
          </div>
        </div>

        <div class="pg-border-top mt-8 flex flex-wrap gap-4 pt-8">
          <StatPill :label="t('hero.statComponents')" :target="designSystemLibraryComponentCount" color="#00D4FF" />
          <StatPill :label="t('hero.statCoverage')" :target="94" suffix="%" color="#00E5B0" />
        </div>
        </div>

      <div class="mb-6 flex flex-wrap gap-2 lg:hidden">
        <button
          v-for="cat in CATEGORY_KEYS"
          :key="cat"
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs"
          :class="isNavActive(cat) ? 'bg-primary/15 text-primary' : 'text-muted-foreground'"
          @click="setCategory(cat)"
        >
          {{ t(`categories.${cat}`) }}
        </button>
      </div>

      <TransitionGroup
        id="bento-grid"
        tag="div"
        name="ds-bento"
        class="ds-bento-grid"
        :class="{ 'ds-bento-grid--focus': activeCat !== 'all' }"
      >
        <div
          v-for="card in visibleCards"
          :id="`card-${card.id}`"
          :key="card.id"
          class="ds-bento-item min-h-0 min-w-0 max-w-full"
          :class="{ 'ds-bento-tall': card.tall }"
          :style="{ gridColumn: `span ${cardGridSpan(card)}` }"
        >
          <ComponentIndexCard
            v-if="card.id === 'index'"
            :active-cat="activeCat"
            :on-open="openDrawer"
          />
          <component :is="card.component" v-else />
        </div>
      </TransitionGroup>
      </template>

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
