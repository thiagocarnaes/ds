<script setup lang="ts">
import { Maximize2, Box } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'

defineProps<{
  onOpen: (name: string) => void
}>()

const components = [
  { name: 'Button', count: '6 variants', category: 'Forms' },
  { name: 'Toggle', count: 'binary', category: 'Forms' },
  { name: 'Checkbox', count: '3 states', category: 'Forms' },
  { name: 'Select', count: 'filterable', category: 'Forms' },
  { name: 'Badge', count: '5 types', category: 'Labels' },
  { name: 'Lozenge', count: '6 states', category: 'Labels' },
  { name: 'Avatar', count: '5 sizes', category: 'Labels' },
  { name: 'Tabs', count: 'horizontal', category: 'Layout' },
  { name: 'Breadcrumbs', count: 'nestable', category: 'Layout' },
  { name: 'Pagination', count: 'numbered', category: 'Layout' },
  { name: 'DataTable', count: 'multi-sort · filters', category: 'Layout' },
  { name: 'Layout', count: 'collapsible', category: 'Layout' },
  { name: 'Modal', count: 'overlay', category: 'Feedback' },
  { name: 'Spinner', count: '3 sizes', category: 'Feedback' },
  { name: 'Alert', count: '4 variants', category: 'Feedback' },
  { name: 'Toast', count: 'auto-dismiss', category: 'Feedback' },
  { name: 'AI Chat', count: 'conversational', category: 'Feedback' },
]

const catColors: Record<string, string> = {
  Forms: '#00D4FF',
  Labels: '#A78BFA',
  Layout: '#00E5B0',
  Feedback: '#FF8B00',
}
</script>

<template>
  <PlayCard label="All Components" accent-color="#A78BFA">
    <template #icon><Box :size="14" /></template>
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      <button
        v-for="item in components"
        :key="item.name"
        type="button"
        class="group flex min-h-[72px] flex-col rounded-lg px-3 py-2.5 text-left transition-all hover:scale-[1.02]"
        :style="{
          background: `${catColors[item.category]}08`,
          border: `1px solid ${catColors[item.category]}18`,
        }"
        @click="onOpen(item.name)"
      >
        <span class="flex w-full items-center justify-between text-xs font-medium text-[#E8EDF5]">
          {{ item.name }}
          <Maximize2
            :size="9"
            class="opacity-0 transition-opacity group-hover:opacity-100"
            :style="{ color: catColors[item.category] }"
          />
        </span>
        <span class="mt-1 font-mono text-[10px]" :style="{ color: catColors[item.category] + 'AA' }">
          {{ item.category }}
        </span>
        <span class="text-[10px] text-[#4D6A87]">{{ item.count }}</span>
      </button>
    </div>
  </PlayCard>
</template>
