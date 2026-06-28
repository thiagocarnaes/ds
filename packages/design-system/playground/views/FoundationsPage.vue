<script setup lang="ts">
import { ref } from 'vue'
import ColorSwatch from '../../src/stories/foundations/ColorSwatch.vue'
import GradientSwatch from '../../src/stories/foundations/GradientSwatch.vue'
import ShadowCard from '../../src/stories/foundations/ShadowCard.vue'
import RadiusPreview from '../../src/stories/foundations/RadiusPreview.vue'
import MotionDemo from '../../src/stories/foundations/MotionDemo.vue'

// ── Tab navigation ──────────────────────────────────────────────────────────
type TabId =
  | 'colors'
  | 'gradients'
  | 'typography'
  | 'spacing'
  | 'radius'
  | 'shadows'
  | 'motion'
  | 'zindex'
  | 'borders'

const tabs: { id: TabId; label: string }[] = [
  { id: 'colors',     label: 'Colors' },
  { id: 'gradients',  label: 'Gradients' },
  { id: 'typography', label: 'Typography' },
  { id: 'spacing',    label: 'Spacing' },
  { id: 'radius',     label: 'Border Radius' },
  { id: 'shadows',    label: 'Shadows' },
  { id: 'motion',     label: 'Motion' },
  { id: 'zindex',     label: 'Z-Index' },
  { id: 'borders',    label: 'Border Widths' },
]

const activeTab = ref<TabId>('colors')

// ── Color token groups ───────────────────────────────────────────────────────
const colorGroups: { label: string; tokens: string[] }[] = [
  {
    label: 'Primitive — Navy',
    tokens: [
      '--ds-color-navy-900',
      '--ds-color-navy-800',
      '--ds-color-navy-700',
      '--ds-color-navy-600',
    ],
  },
  {
    label: 'Primitive — Cyan',
    tokens: [
      '--ds-color-cyan-600',
      '--ds-color-cyan-500',
      '--ds-color-cyan-400',
    ],
  },
  {
    label: 'Primitive — Accents',
    tokens: [
      '--ds-color-blue-600',
      '--ds-color-teal-400',
      '--ds-color-red-500',
      '--ds-color-amber-500',
      '--ds-color-purple-400',
      '--ds-color-slate-500',
      '--ds-color-slate-400',
      '--ds-color-white',
    ],
  },
  {
    label: 'Semantic — Text',
    tokens: [
      '--ds-color-text-default',
      '--ds-color-text-subtle',
      '--ds-color-text-disabled',
      '--ds-color-text-inverse',
      '--ds-color-text-brand',
      '--ds-color-text-danger',
      '--ds-color-text-warning',
      '--ds-color-text-success',
      '--ds-color-text-discovery',
    ],
  },
  {
    label: 'Semantic — Background',
    tokens: [
      '--ds-color-bg-default',
      '--ds-color-bg-subtle',
      '--ds-color-bg-brand',
      '--ds-color-bg-brand-bold',
      '--ds-color-bg-danger',
      '--ds-color-bg-warning',
      '--ds-color-bg-success',
      '--ds-color-bg-discovery',
    ],
  },
  {
    label: 'Semantic — Border',
    tokens: [
      '--ds-color-border-default',
      '--ds-color-border-brand',
      '--ds-color-border-focused',
      '--ds-color-border-danger',
      '--ds-color-border-success',
      '--ds-color-border-warning',
      '--ds-color-border-disabled',
    ],
  },
  {
    label: 'Icon Colors',
    tokens: [
      '--ds-color-icon-default',
      '--ds-color-icon-subtle',
      '--ds-color-icon-inverse',
      '--ds-color-icon-brand',
      '--ds-color-icon-disabled',
      '--ds-color-icon-danger',
      '--ds-color-icon-warning',
      '--ds-color-icon-success',
      '--ds-color-icon-discovery',
    ],
  },
  {
    label: 'Surface States',
    tokens: [
      '--ds-color-bg-hovered',
      '--ds-color-bg-pressed',
      '--ds-color-bg-selected',
      '--ds-color-bg-selected-hovered',
      '--ds-color-bg-brand-hovered',
      '--ds-color-bg-brand-pressed',
      '--ds-color-bg-danger-hovered',
      '--ds-color-bg-warning-hovered',
      '--ds-color-bg-success-hovered',
    ],
  },
]

// ── Gradient tokens ──────────────────────────────────────────────────────────
const gradientTokens: string[] = [
  '--ds-gradient-brand-horizontal',
  '--ds-gradient-brand-vertical',
  '--ds-gradient-brand-diagonal',
  '--ds-gradient-hero',
  '--ds-gradient-card',
  '--ds-gradient-overlay',
  '--ds-gradient-fade-end',
  '--ds-gradient-fade-bottom',
]

// ── Typography scale ─────────────────────────────────────────────────────────
const fontSizes: { name: string; token: string; px: string }[] = [
  { name: 'xsmall',  token: '--ds-font-size-xsmall',  px: '11px' },
  { name: 'small',   token: '--ds-font-size-small',   px: '12px' },
  { name: 'medium',  token: '--ds-font-size-medium',  px: '14px' },
  { name: 'base',    token: '--ds-font-size-base',    px: '16px' },
  { name: 'large',   token: '--ds-font-size-large',   px: '20px' },
  { name: 'xlarge',  token: '--ds-font-size-xlarge',  px: '24px' },
  { name: 'xxlarge', token: '--ds-font-size-xxlarge', px: '32px' },
]

const fontWeights: { name: string; token: string; value: number }[] = [
  { name: 'regular',  token: '--ds-font-weight-regular',  value: 400 },
  { name: 'medium',   token: '--ds-font-weight-medium',   value: 500 },
  { name: 'semibold', token: '--ds-font-weight-semibold', value: 600 },
  { name: 'bold',     token: '--ds-font-weight-bold',     value: 700 },
]

// ── Spacing tokens ───────────────────────────────────────────────────────────
const spacingTokens: { token: string; px: string }[] = [
  { token: '--ds-space-025',  px: '2px'  },
  { token: '--ds-space-050',  px: '4px'  },
  { token: '--ds-space-075',  px: '6px'  },
  { token: '--ds-space-100',  px: '8px'  },
  { token: '--ds-space-150',  px: '12px' },
  { token: '--ds-space-200',  px: '16px' },
  { token: '--ds-space-250',  px: '20px' },
  { token: '--ds-space-300',  px: '24px' },
  { token: '--ds-space-400',  px: '32px' },
  { token: '--ds-space-500',  px: '40px' },
  { token: '--ds-space-600',  px: '48px' },
  { token: '--ds-space-800',  px: '64px' },
  { token: '--ds-space-1000', px: '80px' },
]

// ── Border radius tokens ─────────────────────────────────────────────────────
const radiusTokens: string[] = [
  '--ds-radius-none',
  '--ds-radius-xs',
  '--ds-radius-sm',
  '--ds-radius-md',
  '--ds-radius-lg',
  '--ds-radius-xl',
  '--ds-radius-2xl',
  '--ds-radius-3xl',
  '--ds-radius-full',
]

// ── Shadow tokens ────────────────────────────────────────────────────────────
const shadowGroups: { label: string; tokens: string[] }[] = [
  {
    label: 'Primitive',
    tokens: [
      '--ds-shadow-none',
      '--ds-shadow-xs',
      '--ds-shadow-sm',
      '--ds-shadow-md',
      '--ds-shadow-lg',
      '--ds-shadow-xl',
      '--ds-shadow-2xl',
    ],
  },
  {
    label: 'Semantic',
    tokens: [
      '--ds-shadow-card',
      '--ds-shadow-dropdown',
      '--ds-shadow-modal',
      '--ds-shadow-tooltip',
    ],
  },
]

// ── Motion tokens ────────────────────────────────────────────────────────────
const durationTokens: { token: string; label: string }[] = [
  { token: '--ds-motion-duration-fast',   label: 'fast (100ms)'   },
  { token: '--ds-motion-duration-normal', label: 'normal (200ms)' },
  { token: '--ds-motion-duration-slow',   label: 'slow (350ms)'   },
  { token: '--ds-motion-duration-slower', label: 'slower (500ms)' },
]

const easingTokens: string[] = [
  '--ds-motion-easing-linear',
  '--ds-motion-easing-in',
  '--ds-motion-easing-out',
  '--ds-motion-easing-in-out',
  '--ds-motion-easing-spring',
]

// ── Z-index tokens ───────────────────────────────────────────────────────────
const zIndexLayers: { token: string; value: number; label: string }[] = [
  { token: '--ds-z-base',         value: 0,   label: 'base' },
  { token: '--ds-z-raised',       value: 100, label: 'raised' },
  { token: '--ds-z-dropdown',     value: 200, label: 'dropdown' },
  { token: '--ds-z-sticky',       value: 300, label: 'sticky' },
  { token: '--ds-z-overlay',      value: 400, label: 'overlay' },
  { token: '--ds-z-modal',        value: 500, label: 'modal' },
  { token: '--ds-z-notification', value: 600, label: 'notification' },
  { token: '--ds-z-tooltip',      value: 700, label: 'tooltip' },
]

// ── Border width tokens ──────────────────────────────────────────────────────
const borderWidthTokens: { token: string; px: string }[] = [
  { token: '--ds-border-width-none',   px: '0px' },
  { token: '--ds-border-width-thin',   px: '1px' },
  { token: '--ds-border-width-medium', px: '2px' },
  { token: '--ds-border-width-thick',  px: '3px' },
]
</script>

<template>
  <div class="pg-foundations">
    <!-- Page header -->
    <div class="pg-foundations-hero pg-playground-panel rounded-2xl p-4 sm:p-6 mb-6">
      <div class="mb-2 flex items-center gap-2">
        <span class="pg-text-muted font-mono text-[10px] uppercase tracking-wider">Design Tokens</span>
      </div>
      <h2 class="mb-1 text-xl font-bold sm:text-2xl" style="color: var(--pg-text)">Foundations</h2>
      <p class="pg-text-subtle text-sm leading-relaxed">
        Visual reference for all design tokens — colors, spacing, typography, motion, and more. Switch themes to see values update in real time.
      </p>
    </div>

    <!-- Tab navigation -->
    <div class="pg-foundations-tabs mb-6">
      <div
        class="flex gap-1 overflow-x-auto rounded-xl p-1 scrollbar-none"
        style="background: var(--pg-nav-bg)"
        role="tablist"
        aria-label="Foundations sections"
      >
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          :aria-selected="activeTab === tab.id"
          class="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
          :class="activeTab === tab.id ? 'pg-nav-btn--active' : 'pg-nav-btn'"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- ── COLORS ─────────────────────────────────────────────────────────── -->
    <section v-if="activeTab === 'colors'" aria-labelledby="section-colors">
      <h3 id="section-colors" class="pg-section-heading">Color Tokens</h3>
      <div
        v-for="group in colorGroups"
        :key="group.label"
        class="mb-8"
      >
        <p class="pg-group-label mb-3">{{ group.label }}</p>
        <div class="flex flex-wrap gap-6">
          <ColorSwatch
            v-for="token in group.tokens"
            :key="token"
            :token="token"
          />
        </div>
      </div>
    </section>

    <!-- ── GRADIENTS ──────────────────────────────────────────────────────── -->
    <section v-else-if="activeTab === 'gradients'" aria-labelledby="section-gradients">
      <h3 id="section-gradients" class="pg-section-heading">Gradient Tokens</h3>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <GradientSwatch
          v-for="token in gradientTokens"
          :key="token"
          :token="token"
        />
      </div>
    </section>

    <!-- ── TYPOGRAPHY ─────────────────────────────────────────────────────── -->
    <section v-else-if="activeTab === 'typography'" aria-labelledby="section-typography">
      <h3 id="section-typography" class="pg-section-heading">Typography Scale</h3>
      <div class="pg-playground-panel rounded-xl overflow-hidden">
        <div
          v-for="size in fontSizes"
          :key="size.token"
          class="border-b last:border-b-0"
          style="border-color: var(--pg-border)"
        >
          <p class="pg-group-label px-4 pt-3 pb-1">
            {{ size.name }} · {{ size.px }} · <code class="font-mono" style="color: var(--pg-accent)">{{ size.token }}</code>
          </p>
          <div class="flex flex-wrap gap-x-8 gap-y-2 px-4 pb-4">
            <div
              v-for="weight in fontWeights"
              :key="weight.token"
              class="min-w-0"
            >
              <p
                class="leading-tight"
                :style="{
                  fontSize: `var(${size.token})`,
                  fontWeight: `var(${weight.token})`,
                  color: 'var(--pg-text)',
                }"
              >
                The quick brown fox
              </p>
              <p class="font-mono mt-0.5" style="font-size: 10px; color: var(--pg-text-muted)">
                {{ weight.name }} ({{ weight.value }})
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── SPACING ────────────────────────────────────────────────────────── -->
    <section v-else-if="activeTab === 'spacing'" aria-labelledby="section-spacing">
      <h3 id="section-spacing" class="pg-section-heading">Spacing Scale</h3>
      <div class="pg-playground-panel rounded-xl overflow-hidden">
        <div
          v-for="item in spacingTokens"
          :key="item.token"
          class="flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
          style="border-color: var(--pg-border)"
        >
          <!-- Colored block sized to the token value -->
          <div
            class="shrink-0 rounded-sm"
            :style="{
              width: item.px,
              height: item.px,
              minWidth: item.px,
              background: 'var(--pg-accent)',
              opacity: '0.7',
            }"
          />
          <!-- Token name -->
          <code class="font-mono text-xs shrink-0" style="color: var(--pg-accent); min-width: 10rem">{{ item.token }}</code>
          <!-- Resolved value -->
          <span class="font-mono text-xs" style="color: var(--pg-text-muted)">{{ item.px }}</span>
        </div>
      </div>
    </section>

    <!-- ── BORDER RADIUS ──────────────────────────────────────────────────── -->
    <section v-else-if="activeTab === 'radius'" aria-labelledby="section-radius">
      <h3 id="section-radius" class="pg-section-heading">Border Radius</h3>
      <div class="flex flex-wrap gap-8">
        <RadiusPreview
          v-for="token in radiusTokens"
          :key="token"
          :token="token"
        />
      </div>
    </section>

    <!-- ── SHADOWS ────────────────────────────────────────────────────────── -->
    <section v-else-if="activeTab === 'shadows'" aria-labelledby="section-shadows">
      <h3 id="section-shadows" class="pg-section-heading">Shadows</h3>
      <div
        v-for="group in shadowGroups"
        :key="group.label"
        class="mb-8"
      >
        <p class="pg-group-label mb-3">{{ group.label }}</p>
        <div class="flex flex-wrap gap-6">
          <ShadowCard
            v-for="token in group.tokens"
            :key="token"
            :token="token"
          />
        </div>
      </div>
    </section>

    <!-- ── MOTION ─────────────────────────────────────────────────────────── -->
    <section v-else-if="activeTab === 'motion'" aria-labelledby="section-motion">
      <h3 id="section-motion" class="pg-section-heading">Motion</h3>
      <p class="pg-text-subtle text-sm mb-6">
        Click each button to preview the animation. Uses <code class="font-mono text-xs" style="color: var(--pg-accent)">prefers-reduced-motion</code> — durations resolve to <code class="font-mono text-xs" style="color: var(--pg-accent)">0ms</code> for users who prefer reduced motion.
      </p>
      <div
        v-for="dur in durationTokens"
        :key="dur.token"
        class="mb-8"
      >
        <p class="pg-group-label mb-3">{{ dur.label }} · <code class="font-mono" style="color: var(--pg-accent)">{{ dur.token }}</code></p>
        <div class="flex flex-wrap gap-8">
          <MotionDemo
            v-for="easing in easingTokens"
            :key="easing"
            :duration-token="dur.token"
            :easing-token="easing"
          />
        </div>
      </div>
    </section>

    <!-- ── Z-INDEX ────────────────────────────────────────────────────────── -->
    <section v-else-if="activeTab === 'zindex'" aria-labelledby="section-zindex">
      <h3 id="section-zindex" class="pg-section-heading">Z-Index Scale</h3>
      <p class="pg-text-subtle text-sm mb-6">
        Visual hierarchy of stacking layers from base (0) to tooltip (700).
      </p>
      <div class="pg-playground-panel rounded-xl overflow-hidden">
        <div
          v-for="(layer, index) in [...zIndexLayers].reverse()"
          :key="layer.token"
          class="flex items-center gap-4 border-b px-4 py-3 last:border-b-0"
          style="border-color: var(--pg-border)"
        >
          <!-- Layer bar (width proportional to z-index) -->
          <div
            class="h-6 rounded-sm shrink-0"
            :style="{
              width: `${Math.max(8, (layer.value / 700) * 280)}px`,
              background: `color-mix(in srgb, var(--pg-accent) ${30 + index * 10}%, transparent)`,
              border: '1px solid var(--pg-border-accent)',
            }"
          />
          <!-- Token + value -->
          <div class="flex items-center gap-3 min-w-0">
            <code class="font-mono text-xs shrink-0" style="color: var(--pg-accent)">{{ layer.token }}</code>
            <span class="font-mono text-xs" style="color: var(--pg-text-muted)">{{ layer.value }}</span>
            <span class="text-xs capitalize" style="color: var(--pg-text-subtle)">{{ layer.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ── BORDER WIDTHS ──────────────────────────────────────────────────── -->
    <section v-else-if="activeTab === 'borders'" aria-labelledby="section-borders">
      <h3 id="section-borders" class="pg-section-heading">Border Widths</h3>
      <div class="pg-playground-panel rounded-xl overflow-hidden">
        <div
          v-for="item in borderWidthTokens"
          :key="item.token"
          class="flex items-center gap-6 border-b px-4 py-4 last:border-b-0"
          style="border-color: var(--pg-border)"
        >
          <!-- Line preview -->
          <div
            class="w-32 shrink-0 rounded-sm"
            :style="{
              height: item.px === '0px' ? '1px' : item.px,
              background: item.px === '0px' ? 'transparent' : 'var(--pg-accent)',
              outline: item.px === '0px' ? '1px dashed var(--pg-border)' : 'none',
            }"
          />
          <!-- Token name + value -->
          <div class="flex items-center gap-4 min-w-0">
            <code class="font-mono text-xs" style="color: var(--pg-accent)">{{ item.token }}</code>
            <span class="font-mono text-xs" style="color: var(--pg-text-muted)">{{ item.px }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.pg-foundations {
  display: flex;
  flex-direction: column;
}

.pg-foundations-tabs {
  min-width: 0;
}

.pg-foundations-tabs button::-webkit-scrollbar {
  display: none;
}

.pg-section-heading {
  margin-bottom: 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--pg-text);
}

.pg-group-label {
  font-family: 'DM Mono', ui-monospace, monospace;
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--pg-text-muted);
}

.scrollbar-none {
  scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
</style>
