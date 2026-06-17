import type { DataTableColumnFilters, DataTableSortEntry } from '@/components/data-display/dataTableTypes'

export function formatSortStack(stack: DataTableSortEntry[], emptyLabel = 'No sort'): string {
  if (stack.length === 0) return emptyLabel
  return stack.map((entry, index) => `${index + 1}. ${entry.key} (${entry.direction})`).join(' · ')
}

export function countActiveColumnFilters(filters: DataTableColumnFilters): number {
  return Object.keys(filters).length
}
