<script setup lang="ts">
import { computed } from 'vue'
import { Box, Maximize2 } from 'lucide-vue-next'
import UsageBlock from '../components/UsageBlock.vue'
import { catalogGroups, getComponentUsage, hasPlaygroundDemo, playgroundDemoName } from '../data/componentCatalog'
import { designSystemLibraryComponentCount } from '../designSystemMeta'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'

const emit = defineEmits<{
  openPlayground: [name: string]
}>()

const { messages, t } = usePlaygroundLocale()

const localizedGroups = computed(() =>
  catalogGroups.map((group) => ({
    ...group,
    label: messages.value.docs.groupCategories[group.category] ?? group.category,
  })),
)

function descriptionFor(name: string): string {
  return messages.value.componentCatalog.descriptions[name] ?? name
}
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

    <section
      v-for="group in localizedGroups"
      :key="group.category"
      class="pg-docs-section"
    >
      <h3 class="pg-docs-heading">{{ group.label }}</h3>
      <div class="space-y-4">
        <article
          v-for="name in group.items"
          :key="name"
          class="pg-playground-panel overflow-hidden rounded-xl"
        >
          <div
            class="flex flex-col gap-3 border-b px-4 py-4 sm:flex-row sm:items-start sm:justify-between"
            style="border-color: var(--pg-border)"
          >
            <div class="min-w-0">
              <h4 class="font-mono text-sm font-semibold" style="color: var(--pg-text)">{{ name }}</h4>
              <p class="pg-text-subtle mt-2 text-sm leading-relaxed">{{ descriptionFor(name) }}</p>
            </div>
            <button
              v-if="hasPlaygroundDemo(name)"
              type="button"
              class="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
              style="background: var(--pg-nav-active-bg); color: var(--pg-accent)"
              @click="emit('openPlayground', playgroundDemoName(name)!)"
            >
              <Maximize2 :size="12" />
              {{ t('componentCatalog.openPlayground') }}
            </button>
          </div>
          <div class="px-4 py-4">
            <p class="pg-text-muted mb-2 font-mono text-[10px] uppercase tracking-wider">
              {{ t('componentCatalog.usageHeading') }}
            </p>
            <UsageBlock :code="getComponentUsage(name)" />
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
