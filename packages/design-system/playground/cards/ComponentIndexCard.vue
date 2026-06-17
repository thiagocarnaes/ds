<script setup lang="ts">
import { computed } from 'vue'
import { Maximize2, Box, Sparkles } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundDemoComponents, showcaseDemoComponents } from '../designSystemMeta'
import type { CategoryKey } from '../i18n/types'

const props = defineProps<{
  activeCat: CategoryKey
  onOpen: (name: string) => void
}>()

const { messages, t } = usePlaygroundLocale()

const libraryDemoNames = playgroundDemoComponents

const catColors: Record<CategoryKey, string> = {
  all: '#A78BFA',
  catalog: '#A78BFA',
  docs: '#A78BFA',
  foundations: '#00D4FF',
  forms: '#00D4FF',
  labels: '#A78BFA',
  feedback: '#FF8B00',
  layout: '#00E5B0',
}

const visibleComponents = computed(() =>
  libraryDemoNames.filter((name) => {
    const category = messages.value.componentIndex.items[name]?.category
    if (!category) return false
    return props.activeCat === 'all' || category === props.activeCat
  }),
)

const visibleShowcase = computed(() =>
  props.activeCat === 'all' ? [...showcaseDemoComponents] : [],
)

const cardLabel = computed(() => {
  const titles = messages.value.cards.index.titleByCategory
  if (props.activeCat === 'all') {
    return t('cards.index.titleByCategory.all', { count: libraryDemoNames.length })
  }
  if (props.activeCat in titles) {
    return titles[props.activeCat as keyof typeof titles]
  }
  return t('cards.index.titleByCategory.all', { count: libraryDemoNames.length })
})

function itemMeta(name: string) {
  return messages.value.componentIndex.items[name]
}
</script>

<template>
  <PlayCard :label="cardLabel" accent-color="#A78BFA">
    <template #icon><Box :size="14" /></template>
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      <button
        v-for="name in visibleComponents"
        :key="name"
        type="button"
        class="group flex min-h-[72px] min-w-0 flex-col rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/[0.02]"
        :style="{
          background: `${catColors[itemMeta(name).category]}08`,
          border: `1px solid ${catColors[itemMeta(name).category]}18`,
        }"
        @click="onOpen(name)"
      >
        <span class="flex w-full items-center justify-between text-xs font-medium text-[#E8EDF5]">
          {{ name }}
          <Maximize2
            :size="9"
            class="opacity-0 transition-opacity group-hover:opacity-100"
            :style="{ color: catColors[itemMeta(name).category] }"
          />
        </span>
        <span
          class="mt-1 font-mono text-[10px]"
          :style="{ color: catColors[itemMeta(name).category] + 'AA' }"
        >
          {{ t(`categories.${itemMeta(name).category}`) }}
        </span>
        <span class="text-[10px] text-[#4D6A87]">{{ itemMeta(name).count }}</span>
      </button>
    </div>

    <div v-if="visibleShowcase.length" class="mt-6 border-t pt-5" style="border-color: var(--pg-card-divider)">
      <div class="mb-3 flex items-center gap-2">
        <Sparkles :size="12" class="text-[#A78BFA]" />
        <span class="font-mono text-[9px] uppercase tracking-wider text-[#A78BFA]">
          {{ t('componentIndex.showcaseTitle') }}
        </span>
      </div>
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <button
          v-for="name in visibleShowcase"
          :key="name"
          type="button"
          class="group flex min-h-[72px] min-w-0 flex-col rounded-lg border border-[#A78BFA]/20 bg-[#A78BFA]/5 px-3 py-2.5 text-left transition-colors hover:bg-[#A78BFA]/10"
          @click="onOpen(name)"
        >
          <span class="flex w-full items-center justify-between text-xs font-medium text-[#E8EDF5]">
            {{ name }}
            <Maximize2 :size="9" class="opacity-0 transition-opacity group-hover:opacity-100 text-[#A78BFA]" />
          </span>
          <span class="mt-1 font-mono text-[10px] text-[#A78BFA]/80">
            {{ t('componentIndex.showcaseTitle') }}
          </span>
          <span class="text-[10px] text-[#4D6A87]">{{ itemMeta(name).count }}</span>
        </button>
      </div>
    </div>
  </PlayCard>
</template>
