<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { Box, Maximize2 } from 'lucide-vue-next'
import UsageBlock from '../components/UsageBlock.vue'
import ComponentApiReference from '../components/ComponentApiReference.vue'
import {
  catalogGroups,
  getComponentCatalogEntry,
  getComponentUsage,
  hasPlaygroundDemo,
  playgroundDemoName,
} from '../data/componentCatalog'
import { designSystemLibraryComponentCount } from '../designSystemMeta'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'

const emit = defineEmits<{
  openPlayground: [name: string]
}>()

const { messages, t } = usePlaygroundLocale()

const selectedName = ref(catalogGroups[0]?.items[0] ?? 'Button')
const navScrollEl = ref<HTMLElement | null>(null)
const navEl = ref<HTMLElement | null>(null)
const detailEl = ref<HTMLElement | null>(null)

let detailResizeObserver: ResizeObserver | null = null

const localizedGroups = computed(() =>
  catalogGroups.map((group) => ({
    ...group,
    label: messages.value.docs.groupCategories[group.category] ?? group.category,
  })),
)

const allComponentNames = computed(() => localizedGroups.value.flatMap((group) => group.items))

const selectedEntry = computed(() => getComponentCatalogEntry(selectedName.value))

function descriptionFor(name: string): string {
  return messages.value.componentCatalog.descriptions[name] ?? name
}

function selectComponent(name: string): void {
  selectedName.value = name
  if (typeof window !== 'undefined') {
    window.history.replaceState(null, '', `#catalog-${name}`)
  }
}

function scrollActiveNavItemIntoView(): void {
  requestAnimationFrame(() => {
    const container = navScrollEl.value
    if (!container) return
    const activeItem = container.querySelector<HTMLElement>(
      `[data-nav-item="${CSS.escape(selectedName.value)}"]`,
    )
    activeItem?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  })
}

function syncNavHeight(): void {
  if (!navEl.value || !detailEl.value) return
  const isDesktop = window.matchMedia('(min-width: 1024px)').matches
  if (!isDesktop) {
    navEl.value.style.height = ''
    return
  }
  navEl.value.style.height = `${detailEl.value.offsetHeight}px`
}

function syncFromHash(): void {
  if (typeof window === 'undefined') return
  const match = window.location.hash.match(/^#catalog-(.+)$/)
  if (!match) return
  const name = decodeURIComponent(match[1])
  if (allComponentNames.value.includes(name)) {
    selectedName.value = name
  }
}

watch(selectedName, (name) => {
  if (typeof window === 'undefined') return
  const nextHash = `#catalog-${name}`
  if (window.location.hash !== nextHash) {
    window.history.replaceState(null, '', nextHash)
  }
  nextTick(() => {
    syncNavHeight()
    scrollActiveNavItemIntoView()
  })
})

function onWindowResize(): void {
  syncNavHeight()
}

onMounted(() => {
  syncFromHash()
  window.addEventListener('hashchange', syncFromHash)
  window.addEventListener('resize', onWindowResize)

  detailResizeObserver = new ResizeObserver(() => {
    syncNavHeight()
    scrollActiveNavItemIntoView()
  })
  if (detailEl.value) {
    detailResizeObserver.observe(detailEl.value)
  }

  nextTick(() => {
    syncNavHeight()
    scrollActiveNavItemIntoView()
  })
})

onUnmounted(() => {
  window.removeEventListener('hashchange', syncFromHash)
  window.removeEventListener('resize', onWindowResize)
  detailResizeObserver?.disconnect()
})
</script>

<template>
  <div class="pg-docs">
    <div class="pg-docs-hero pg-playground-panel rounded-2xl p-4 sm:p-6 md:p-8">
      <div class="mb-4 flex items-center gap-2">
        <Box :size="16" class="text-primary" />
        <span class="pg-text-muted font-mono text-[10px] uppercase tracking-wider">
          {{ t('componentCatalog.badge') }}
        </span>
      </div>
      <h2 class="mb-2 text-xl font-bold sm:text-2xl" style="color: var(--pg-text)">
        {{ t('componentCatalog.title', { count: designSystemLibraryComponentCount }) }}
      </h2>
      <p class="pg-text-subtle max-w-2xl text-sm leading-relaxed">
        {{ t('componentCatalog.subtitle', { count: designSystemLibraryComponentCount }) }}
      </p>
    </div>

    <div class="pg-catalog-layout">
      <aside ref="navEl" class="pg-catalog-nav pg-playground-panel rounded-xl p-3">
        <p class="pg-catalog-nav-title">
          {{ t('componentCatalog.navHeading') }}
        </p>

        <nav
          ref="navScrollEl"
          class="pg-catalog-nav-list"
          aria-label="Component catalog"
        >
          <section
            v-for="group in localizedGroups"
            :key="group.category"
            class="pg-catalog-nav-group"
          >
            <h4 class="pg-catalog-nav-group-label">
              {{ group.label }}
            </h4>
            <ul class="pg-catalog-nav-group-items">
              <li v-for="name in group.items" :key="name">
                <button
                  type="button"
                  class="pg-catalog-nav-item"
                  :class="{ 'pg-catalog-nav-item--active': selectedName === name }"
                  :data-nav-item="name"
                  :aria-current="selectedName === name ? 'page' : undefined"
                  @click="selectComponent(name)"
                >
                  {{ name }}
                </button>
              </li>
            </ul>
          </section>
        </nav>
      </aside>

      <article
        ref="detailEl"
        class="pg-catalog-detail pg-playground-panel min-w-0 overflow-hidden rounded-xl"
      >
        <div
          class="flex flex-col gap-3 border-b px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
          style="border-color: var(--pg-border)"
        >
          <div class="min-w-0">
            <label class="pg-catalog-mobile-select">
              <span class="pg-text-muted mb-1.5 block font-mono text-[10px] uppercase tracking-wider">
                {{ t('componentCatalog.selectLabel') }}
              </span>
              <select
                :value="selectedName"
                class="pg-catalog-select w-full rounded-lg px-3 py-2 font-mono text-sm"
                @change="selectComponent(($event.target as HTMLSelectElement).value)"
              >
                <optgroup v-for="group in localizedGroups" :key="group.category" :label="group.label">
                  <option v-for="name in group.items" :key="name" :value="name">
                    {{ name }}
                  </option>
                </optgroup>
              </select>
            </label>
            <h3 class="pg-catalog-detail-title">
              {{ selectedName }}
            </h3>
            <p class="pg-text-subtle mt-2 text-sm leading-relaxed">
              {{ descriptionFor(selectedName) }}
            </p>
          </div>
          <button
            v-if="hasPlaygroundDemo(selectedName)"
            type="button"
            class="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
            style="background: var(--pg-nav-active-bg); color: var(--pg-accent)"
            @click="emit('openPlayground', playgroundDemoName(selectedName)!)"
          >
            <Maximize2 :size="12" />
            {{ t('componentCatalog.openPlayground') }}
          </button>
        </div>

        <div class="space-y-5 px-4 py-4">
          <div>
            <p class="pg-text-muted mb-2 font-mono text-[10px] uppercase tracking-wider">
              {{ t('componentCatalog.apiHeading') }}
            </p>
            <ComponentApiReference v-if="selectedEntry" :entry="selectedEntry" />
          </div>

          <div>
            <p class="pg-text-muted mb-2 font-mono text-[10px] uppercase tracking-wider">
              {{ t('componentCatalog.usageHeading') }}
            </p>
            <p
              v-if="hasPlaygroundDemo(selectedName)"
              class="pg-text-subtle mb-3 text-xs leading-relaxed"
            >
              {{ t('componentCatalog.playgroundHint') }}
            </p>
            <UsageBlock :code="getComponentUsage(selectedName)" />
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
