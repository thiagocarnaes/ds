<script setup lang="ts">
import { ref, watch } from 'vue'
import { Table2 } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'
import DataTablePlaygroundHints from '../components/DataTablePlaygroundHints.vue'
import { useDataTableLabels, useStatusLabel, useUserTableColumns } from '../composables/useUserTableColumns'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { DataTable, Lozenge } from '@/index'
import type { LozengeAppearance } from '@/components/data-display/Lozenge.vue'
import type { DataTableColumnFilters, DataTableSortEntry } from '@/components/data-display/dataTableTypes'
import { fetchUsers, mockUsers, type UserRow } from '../data/mockUsers'

type DataMode = 'client' | 'api'

const { t, locale } = usePlaygroundLocale()
const userTableColumns = useUserTableColumns()
const dataTableLabels = useDataTableLabels()
const { formatStatus } = useStatusLabel()

const mode = ref<DataMode>('api')
const search = ref('')
const currentPage = ref(1)
const pageSize = ref(5)
const sortStack = ref<DataTableSortEntry[]>([])
const columnFilters = ref<DataTableColumnFilters>({})
const loading = ref(false)
const apiRows = ref<UserRow[]>([])
const total = ref(0)

const statusAppearance: Record<UserRow['status'], LozengeAppearance> = {
  active: 'success',
  inactive: 'default',
  pending: 'warning',
}

async function loadFromApi(): Promise<void> {
  loading.value = true
  try {
    const result = await fetchUsers({
      page: currentPage.value,
      pageSize: pageSize.value,
      search: search.value,
      sortStack: sortStack.value,
      columnFilters: columnFilters.value,
      sortKey: sortStack.value[0]?.key ?? null,
      sortDirection: sortStack.value[0]?.direction ?? null,
    })
    apiRows.value = result.rows
    total.value = result.total
  } finally {
    loading.value = false
  }
}

watch(
  [mode, currentPage, pageSize, search, sortStack, columnFilters],
  () => {
    if (mode.value === 'api') void loadFromApi()
  },
  { immediate: true, deep: true },
)

function setMode(next: DataMode): void {
  if (mode.value === next) return
  mode.value = next
  search.value = ''
  currentPage.value = 1
  sortStack.value = []
  columnFilters.value = {}
}
</script>

<template>
  <PlayCard
    :label="t('cards.datatable.label')"
    accent-color="#2979FF"
    :tag="t('cards.datatable.tag')"
    fill-height
  >
    <template #icon><Table2 :size="14" /></template>

    <div class="flex min-h-0 flex-1 flex-col gap-4">
      <div class="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <DataTablePlaygroundHints
          class="min-w-0 w-full flex-1"
          :sort-stack="sortStack"
          :column-filters="columnFilters"
        />
        <div
          class="inline-flex shrink-0 rounded-lg p-0.5"
          style="background: var(--pg-nav-active-bg); border: 1px solid var(--pg-card-border)"
        >
          <button
            type="button"
            class="rounded-md px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors"
            :style="
              mode === 'client'
                ? { background: '#2979FF22', color: '#2979FF' }
                : { color: 'var(--pg-text-muted)' }
            "
            @click="setMode('client')"
          >
            {{ t('dataTable.modeClient') }}
          </button>
          <button
            type="button"
            class="rounded-md px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors"
            :style="
              mode === 'api'
                ? { background: '#2979FF22', color: '#2979FF' }
                : { color: 'var(--pg-text-muted)' }
            "
            @click="setMode('api')"
          >
            {{ t('dataTable.modeApi') }}
          </button>
        </div>
      </div>

      <DataTable
        v-model:search="search"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        v-model:sort-stack="sortStack"
        v-model:column-filters="columnFilters"
        :columns="userTableColumns"
        :rows="mode === 'client' ? mockUsers : apiRows"
        :server-side="mode === 'api'"
        :total="mode === 'api' ? total : undefined"
        :loading="mode === 'api' && loading"
        row-key="id"
        :search-placeholder="t('dataTable.searchPlaceholder')"
        :empty-title="dataTableLabels.emptyTitle"
        :empty-description="dataTableLabels.emptyDescription"
        :labels="dataTableLabels"
        :locale="locale"
        class="min-h-0 flex-1"
        @request="loadFromApi"
      >
        <template #cell-status="{ value }">
          <Lozenge :variant="statusAppearance[value as UserRow['status']]">
            {{ formatStatus(value as UserRow['status']) }}
          </Lozenge>
        </template>
      </DataTable>
    </div>
  </PlayCard>
</template>
