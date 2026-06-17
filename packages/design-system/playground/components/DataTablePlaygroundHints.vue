<script setup lang="ts">
import type { DataTableColumnFilters, DataTableSortEntry } from '@/components/data-display/dataTableTypes'
import { countActiveColumnFilters, formatSortStack } from '../utils/dataTablePlayground'

defineProps<{
  sortStack: DataTableSortEntry[]
  columnFilters: DataTableColumnFilters
}>()

const hints = [
  'Click a header to sort one column (asc → desc → clear).',
  'Ctrl+click (⌘+click on Mac) to add more sort columns.',
  'Use the filter icon beside each header for text, date range, or enum filters.',
]
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
      <span class="text-[#7BA3C8]">Sort:</span>
      <span class="text-[#E8EDF5]">{{ formatSortStack(sortStack) }}</span>
      <span class="text-[#4D6A87]">|</span>
      <span class="text-[#7BA3C8]">Filters:</span>
      <span class="text-[#E8EDF5]">{{ countActiveColumnFilters(columnFilters) }} active</span>
    </div>
  </div>
</template>
