<script setup lang="ts">
import { computed, ref, TransitionGroup } from 'vue'
import { ArrowUpRight, Moon, Sun, Zap } from 'lucide-vue-next'
import GlowDot from './components/GlowDot.vue'
import StatPill from './components/StatPill.vue'
import ComponentDrawer from './components/ComponentDrawer.vue'
import { usePlaygroundTheme } from './composables/usePlaygroundTheme'
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
import DocumentationPage from './views/DocumentationPage.vue'
import ToastHost from '@/components/feedback/ToastHost.vue'

const categories = ['All', 'Docs', 'Foundations', 'Forms', 'Labels', 'Feedback', 'Layout'] as const
type Category = (typeof categories)[number]

const activeCat = ref<Category>('All')
const drawerName = ref<string | null>(null)
const drawerOpen = ref(false)
const { isDark, toggleTheme } = usePlaygroundTheme()

const cards = [
  { id: 'button', cats: ['Forms'], span: 1, component: ButtonCard },
  { id: 'controls', cats: ['Forms'], span: 1, component: ControlsCard },
  { id: 'inputs', cats: ['Forms'], span: 3, component: InputsCard },
  { id: 'color', cats: ['Foundations'], span: 4, component: ColorCard },
  { id: 'typography', cats: ['Foundations'], span: 1, component: TypographyCard },
  { id: 'spacing', cats: ['Foundations'], span: 1, component: SpacingCard },
  { id: 'icons', cats: ['Foundations'], span: 4, component: IconsCard },
  { id: 'labels', cats: ['Labels'], span: 1, component: LabelsCard },
  { id: 'avatar', cats: ['Labels'], span: 1, component: AvatarCard },
  { id: 'loading', cats: ['Feedback'], span: 1, component: LoadingCard },
  { id: 'messages', cats: ['Feedback'], span: 1, component: MessagesCard },
  { id: 'chat', cats: ['Feedback'], span: 4, component: ChatPreviewCard },
  { id: 'layout', cats: ['Layout'], span: 3, component: LayoutCard, tall: true },
  { id: 'index', cats: ['Layout'], span: 3, component: ComponentIndexCard, tall: true },
] as const

type PlaygroundCard = (typeof cards)[number]

const visibleCards = computed(() =>
  activeCat.value === 'All'
    ? [...cards]
    : cards.filter((c) => c.cats.includes(activeCat.value)),
)

function cardGridSpan(card: PlaygroundCard): number {
  if (activeCat.value === 'All') {
    if (card.id === 'inputs' || card.id === 'icons' || card.id === 'color' || card.id === 'chat') return 4
    if (card.id === 'button' || card.id === 'controls') return 2
    if (card.id === 'loading' || card.id === 'messages') return 2
    return Math.min(Math.ceil((card.span / 3) * 4), 4)
  }

  const maxCols = 2
  if (card.id === 'inputs' || card.id === 'icons' || card.id === 'color' || card.id === 'chat') {
    return maxCols
  }
  return Math.min(card.span, maxCols)
}

function openDrawer(name: string): void {
  drawerName.value = name
  drawerOpen.value = true
}

function scrollToIndex(): void {
  activeCat.value = 'All'
  requestAnimationFrame(() => {
    document.getElementById('card-index')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}

function openDocs(): void {
  activeCat.value = 'Docs'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="pg-shell min-h-screen">
    <div class="pg-grid-bg pointer-events-none fixed inset-0 z-0" />

    <header class="pg-header sticky top-0 z-40 flex h-14 items-center justify-between px-6">
      <div class="flex items-center gap-3">
        <div
          class="flex size-7 items-center justify-center rounded-lg"
          style="background: linear-gradient(135deg, #0052CC, #00D4FF); box-shadow: 0 0 14px var(--pg-accent-glow)"
        >
          <Zap :size="14" class="text-white" />
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-sm font-semibold" style="color: var(--pg-text)">Design System</span>
          <span class="pg-text-muted font-mono text-[10px]">v2.0.0</span>
        </div>
      </div>

      <nav class="pg-nav hidden items-center gap-1 rounded-xl p-1 md:flex">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-300 ease-out"
          :style="
            activeCat === cat
              ? {
                  background: 'var(--pg-nav-active-bg)',
                  color: 'var(--pg-accent)',
                  boxShadow: '0 0 12px var(--pg-nav-active-shadow)',
                }
              : { color: 'var(--pg-text-muted)' }
          "
          @click="activeCat = cat"
        >
          {{ cat }}
        </button>
      </nav>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="pg-theme-toggle"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          :title="isDark ? 'Light mode' : 'Dark mode'"
          @click="toggleTheme"
        >
          <Sun v-if="isDark" :size="16" />
          <Moon v-else :size="16" />
        </button>
        <span
          class="rounded-md px-2 py-1 font-mono text-[10px]"
          :style="{ background: 'var(--pg-stable-bg)', color: 'var(--pg-stable-text)' }"
        >
          stable
        </span>
        <a
          href="https://github.com/thiagocarnaes/ds"
          target="_blank"
          rel="noopener noreferrer"
          class="pg-text-muted transition-colors hover:text-[var(--pg-accent)]"
        >
          <ArrowUpRight :size="14" />
        </a>
      </div>
    </header>

    <main class="relative z-10 mx-auto max-w-6xl px-6 py-12">
      <!-- Hero + grid -->
      <template v-if="activeCat !== 'Docs'">
        <div class="mb-12">
        <div class="mb-6 flex items-center gap-2">
          <GlowDot />
          <span class="pg-text-muted font-mono text-[10px] uppercase tracking-widest">v2.0.0 · stable</span>
        </div>

        <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h1 class="mb-5 text-5xl font-bold leading-[1.05]" style="letter-spacing: -0.02em">
              <span style="color: var(--pg-text)">One system.</span><br />
              <span :style="{ color: 'var(--pg-hero-accent)', textShadow: `0 0 40px var(--pg-hero-glow)` }">
                Every team.
              </span>
            </h1>
            <p class="pg-text-subtle max-w-md text-sm leading-[1.8]">
              A shared foundation for designers and engineers — accessible Vue 3 components and live
              playgrounds for every team.
            </p>
            <div class="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                class="rounded-lg px-4 py-2 text-sm font-semibold transition-all"
                :style="{
                  background: 'var(--pg-cta-bg)',
                  color: 'var(--pg-cta-text)',
                  boxShadow: '0 0 20px var(--pg-cta-shadow)',
                }"
                @click="scrollToIndex"
              >
                Browse components
              </button>
              <button
                type="button"
                class="rounded-lg border px-4 py-2 text-sm font-semibold transition-colors"
                style="border-color: var(--pg-border); color: var(--pg-text)"
                @click="openDocs"
              >
                Install &amp; docs
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="pillar in [
                { color: '#A78BFA', title: '53 Components', body: 'Forms, labels, feedback, layout — interactive and accessible.' },
                { color: '#00E5B0', title: 'Live Playgrounds', body: 'Every card is a sandbox. Change props and see updates instantly.' },
              ]"
              :key="pillar.title"
              class="flex flex-col gap-2 rounded-xl p-4"
              :style="{ background: pillar.color + '08', border: `1px solid ${pillar.color}15` }"
            >
              <p class="text-xs font-semibold" style="color: var(--pg-pillar-text)">{{ pillar.title }}</p>
              <p class="pg-text-muted text-[11px] leading-relaxed">{{ pillar.body }}</p>
            </div>
          </div>
        </div>

        <div class="pg-border-top mt-8 flex flex-wrap gap-4 pt-8">
          <StatPill label="Components" :target="53" color="#00D4FF" />
          <StatPill label="Test coverage" :target="94" suffix="%" color="#00E5B0" />
        </div>
        </div>

      <!-- Mobile category nav -->
      <div class="mb-6 flex flex-wrap gap-2 md:hidden">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs"
          :class="activeCat === cat ? 'bg-primary/15 text-primary' : 'text-muted-foreground'"
          @click="activeCat = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Bento grid -->
      <TransitionGroup
        id="bento-grid"
        tag="div"
        name="ds-bento"
        class="ds-bento-grid"
        :class="{ 'ds-bento-grid--focus': activeCat !== 'All' }"
      >
        <div
          v-for="card in visibleCards"
          :id="`card-${card.id}`"
          :key="card.id"
          class="ds-bento-item min-h-0"
          :class="{ 'ds-bento-tall': card.tall }"
          :style="{ gridColumn: `span ${cardGridSpan(card)}` }"
        >
          <ComponentIndexCard
            v-if="card.id === 'index'"
            :on-open="openDrawer"
          />
          <ChatPreviewCard
            v-else-if="card.id === 'chat'"
            @open="openDrawer('AI Chat')"
          />
          <LayoutCard
            v-else-if="card.id === 'layout'"
            @open="openDrawer('Layout')"
          />
          <component :is="card.component" v-else />
        </div>
      </TransitionGroup>
      </template>

      <DocumentationPage v-else />

      <footer class="pg-border-top mt-12 flex items-center justify-between pt-8">
        <div class="flex items-center gap-2">
          <GlowDot color="#00E5B0" />
          <span class="pg-text-muted font-mono text-xs">All systems operational</span>
        </div>
      </footer>
    </main>

    <ComponentDrawer v-model:open="drawerOpen" :name="drawerName" />
    <ToastHost />
  </div>
</template>
