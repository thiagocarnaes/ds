import { computed } from 'vue'
import { createUserTableColumns } from '../data/mockUsers'
import { usePlaygroundLocale } from './usePlaygroundLocale'

export function useUserTableColumns() {
  const { messages } = usePlaygroundLocale()
  return computed(() => createUserTableColumns(messages.value.dataTable.columns))
}

export function useDataTableLabels() {
  const { messages } = usePlaygroundLocale()
  return computed(() => messages.value.dataTable.labels)
}

export function useStatusLabel() {
  const { messages } = usePlaygroundLocale()
  const labels = computed(() => messages.value.dataTable.columns)

  function formatStatus(value: UserRowStatus): string {
    if (value === 'active') return labels.value.statusActive
    if (value === 'inactive') return labels.value.statusInactive
    return labels.value.statusPending
  }

  return { formatStatus }
}

type UserRowStatus = 'active' | 'inactive' | 'pending'
