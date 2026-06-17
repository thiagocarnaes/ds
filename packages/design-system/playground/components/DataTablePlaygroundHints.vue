<script setup lang="ts">
import { computed } from 'vue'
import type { DataTableColumnFilters, DataTableSortEntry } from '@/components/data-display/dataTableTypes'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { countActiveColumnFilters, formatSortStack } from '../utils/dataTablePlayground'

const props = defineProps<{
  sortStack: DataTableSortEntry[]
  columnFilters: DataTableColumnFilters
}>()

const { messages, t } = usePlaygroundLocale()

const hints = computed(() => messages.value.dataTable.hints)

const sortSummary = computed(() =>
  formatSortStack(props.sortStack, messages.value.dataTable.noSort),
)

const activeFiltersSummary = computed(() =>
  t('dataTable.activeFilters', { count: countActiveColumnFilters(props.columnFilters) }),
)
</script>

<template>
  <div class="space-y-3">
    <ul class="space-y-1.5 text-[11px] leading-relaxed text-[#7BA3C8]">
      <li v-for="hint in hints" :key="hint" class="flex gap-2">
        <span class="text-[#2979FF]">→</span>
        <span>{{ hint }}</span>
      </li>
    </ul>

    <div
      class="flex flex-wrap gap-2 rounded-lg px-3 py-2 font-mono text-[10px]"
      style="background: rgba(41,121,255,0.08); border: 1px solid rgba(41,121,255,0.2)"
    >
      <span class="text-[#7BA3C8]">{{ t('dataTable.sortLabel') }}</span>
      <span class="text-[#E8EDF5]">{{ sortSummary }}</span>
      <span class="text-[#4D6A87]">|</span>
      <span class="text-[#7BA3C8]">{{ t('dataTable.filtersLabel') }}</span>
      <span class="text-[#E8EDF5]">{{ activeFiltersSummary }}</span>
    </div>
  </div>
</template>
