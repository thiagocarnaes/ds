<script setup lang="ts">
import { computed } from 'vue'
import { Maximize2, Box } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import type { CategoryKey } from '../i18n/types'

const props = defineProps<{
  activeCat: CategoryKey
  onOpen: (name: string) => void
}>()

const { messages, t } = usePlaygroundLocale()

const componentNames = [
  'Button',
  'Toggle',
  'Checkbox',
  'Select',
  'Badge',
  'Lozenge',
  'Avatar',
  'Tabs',
  'Breadcrumbs',
  'Pagination',
  'DataTable',
  'Layout',
  'Modal',
  'Spinner',
  'Alert',
  'Toast',
  'AI Chat',
] as const

const catColors: Record<CategoryKey, string> = {
  all: '#A78BFA',
  docs: '#A78BFA',
  foundations: '#00D4FF',
  forms: '#00D4FF',
  labels: '#A78BFA',
  feedback: '#FF8B00',
  layout: '#00E5B0',
}

const visibleComponents = computed(() =>
  componentNames.filter((name) => {
    const category = messages.value.componentIndex.items[name].category
    return props.activeCat === 'all' || category === props.activeCat
  }),
)

const cardLabel = computed(() => {
  const titles = messages.value.cards.index.titleByCategory
  if (props.activeCat === 'all') return titles.all
  if (props.activeCat in titles) {
    return titles[props.activeCat as keyof typeof titles]
  }
  return titles.all
})
</script>

<template>
  <PlayCard :label="cardLabel" accent-color="#A78BFA">
    <template #icon><Box :size="14" /></template>
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      <button
        v-for="name in visibleComponents"
        :key="name"
        type="button"
        class="group flex min-h-[72px] flex-col rounded-lg px-3 py-2.5 text-left transition-all hover:scale-[1.02]"
        :style="{
          background: `${catColors[messages.componentIndex.items[name].category]}08`,
          border: `1px solid ${catColors[messages.componentIndex.items[name].category]}18`,
        }"
        @click="onOpen(name)"
      >
        <span class="flex w-full items-center justify-between text-xs font-medium text-[#E8EDF5]">
          {{ name }}
          <Maximize2
            :size="9"
            class="opacity-0 transition-opacity group-hover:opacity-100"
            :style="{ color: catColors[messages.componentIndex.items[name].category] }"
          />
        </span>
        <span
          class="mt-1 font-mono text-[10px]"
          :style="{ color: catColors[messages.componentIndex.items[name].category] + 'AA' }"
        >
          {{ t(`categories.${messages.componentIndex.items[name].category}`) }}
        </span>
        <span class="text-[10px] text-[#4D6A87]">{{ messages.componentIndex.items[name].count }}</span>
      </button>
    </div>
  </PlayCard>
</template>
