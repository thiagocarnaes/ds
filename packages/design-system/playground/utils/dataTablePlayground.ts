import type { DataTableColumnFilters, DataTableSortEntry } from '@/components/data-display/dataTableTypes'

export function formatSortStack(stack: DataTableSortEntry[]): string {
  if (stack.length === 0) return 'No sort'
  return stack.map((entry, index) => `${index + 1}. ${entry.key} (${entry.direction})`).join(' · ')
}

export function countActiveColumnFilters(filters: DataTableColumnFilters): number {
  return Object.keys(filters).length
}
