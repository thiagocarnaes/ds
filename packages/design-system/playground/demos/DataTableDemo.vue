<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import DataTablePlaygroundHints from '../components/DataTablePlaygroundHints.vue'
import {
  fetchUsers,
  mockUsers,
  type UserRow,
} from '../data/mockUsers'
import { useDataTableLabels, useStatusLabel, useUserTableColumns } from '../composables/useUserTableColumns'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { DataTable, Lozenge, Switch } from '@/index'
import type { DataTableColumn, DataTableColumnFilters, DataTableSortEntry } from '@/components/data-display/dataTableTypes'

const { locale, t } = usePlaygroundLocale()
const userTableColumns = useUserTableColumns()
const dataTableLabels = useDataTableLabels()
const { formatStatus } = useStatusLabel()

const search = ref('')
const page = ref(1)
const pageSize = ref(5)
const mode = ref<'client' | 'api'>('client')
const sortStack = ref<DataTableSortEntry[]>([])
const columnFilters = ref<DataTableColumnFilters>({})
const loading = ref(false)
const rows = ref<UserRow[]>([])
const total = ref(0)

const showSearch = ref(true)
const showSort = ref(true)
const showColumnFilter = ref(true)
const showTotalRecords = ref(true)
const showPageSize = ref(true)

const tableColumns = computed<DataTableColumn[]>(() =>
  userTableColumns.value.map((column) => ({
    ...column,
    sortable: showSort.value ? column.sortable : false,
    filter: showColumnFilter.value ? column.filter : undefined,
    filterOptions: showColumnFilter.value ? column.filterOptions : undefined,
  })),
)

async function loadTable(): Promise<void> {
  loading.value = true
  try {
    const result = await fetchUsers({
      page: page.value,
      pageSize: pageSize.value,
      search: search.value,
      sortStack: sortStack.value,
      columnFilters: columnFilters.value,
      sortKey: sortStack.value[0]?.key ?? null,
      sortDirection: sortStack.value[0]?.direction ?? null,
    })
    rows.value = result.rows
    total.value = result.total
  } finally {
    loading.value = false
  }
}

watch([mode, page, pageSize, search, sortStack, columnFilters], () => {
  if (mode.value === 'api') void loadTable()
}, { immediate: true, deep: true })

watch(showSort, (enabled) => {
  if (!enabled) sortStack.value = []
})

watch(showColumnFilter, (enabled) => {
  if (!enabled) columnFilters.value = {}
})

watch(showSearch, (enabled) => {
  if (!enabled) search.value = ''
})

function setMode(next: 'client' | 'api'): void {
  if (mode.value === next) return
  mode.value = next
  search.value = ''
  page.value = 1
  sortStack.value = []
  columnFilters.value = {}
}

function columnSnippet(key: string, label: string, extras: string[]): string {
  const parts = [`key: '${key}'`, `label: '${label}'`, ...extras]
  return `  { ${parts.join(', ')} }`
}

const code = computed(() => {
  const columnLines = [
    columnSnippet('name', 'Name', [
      ...(showSort.value ? ['sortable: true'] : []),
      ...(showColumnFilter.value ? ["filter: 'text'"] : []),
    ]),
    columnSnippet('status', 'Status', [
      ...(showSort.value ? ['sortable: true'] : []),
      ...(showColumnFilter.value
        ? ["filter: 'enum'", 'filterOptions: [{ label: "Active", value: "active" }]']
        : []),
    ]),
  ]

  const props = [
    '  v-model:search="search"',
    '  v-model:current-page="page"',
    '  v-model:page-size="pageSize"',
    '  v-model:sort-stack="sortStack"',
    '  v-model:column-filters="columnFilters"',
    '  :columns="columns"',
    '  :rows="rows"',
    '  row-key="id"',
  ]

  if (!showSearch.value) props.push('  :searchable="false"')
  if (!showTotalRecords.value) props.push('  :show-total-records="false"')
  if (!showPageSize.value) props.push('  :show-page-size="false"')
  if (mode.value === 'api') {
    props.push('  server-side', '  :total="total"', '  :loading="loading"', '  @request="fetchRows"')
  }

  return [
    'const columns = [',
    ...columnLines,
    ']',
    '',
    '<DataTable',
    ...props,
    '/>',
  ].join('\n')
})
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
      <DataTablePlaygroundHints
        v-if="showSort || showColumnFilter"
        :sort-stack="sortStack"
        :column-filters="columnFilters"
      />

      <div
        class="inline-flex rounded-lg p-0.5"
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

      <DataTable
        v-model:search="search"
        v-model:current-page="page"
        v-model:page-size="pageSize"
        v-model:sort-stack="sortStack"
        v-model:column-filters="columnFilters"
        :columns="tableColumns"
        :rows="mode === 'client' ? mockUsers : rows"
        :server-side="mode === 'api'"
        :total="mode === 'api' ? total : undefined"
        :loading="mode === 'api' && loading"
        :searchable="showSearch"
        :show-total-records="showTotalRecords"
        :show-page-size="showPageSize"
        row-key="id"
        :search-placeholder="t('dataTable.searchPlaceholder')"
        :empty-title="dataTableLabels.emptyTitle"
        :empty-description="dataTableLabels.emptyDescription"
        :labels="dataTableLabels"
        :locale="locale"
        @request="loadTable"
      >
        <template #cell-status="{ value }">
          <Lozenge
            :appearance="
              value === 'active' ? 'success' : value === 'pending' ? 'warning' : 'default'
            "
          >
            {{ formatStatus(value as UserRow['status']) }}
          </Lozenge>
        </template>
      </DataTable>

      <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch v-model="showSearch" size="sm" />
          search filter
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch v-model="showSort" size="sm" />
          sort
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch v-model="showColumnFilter" size="sm" />
          column filter
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch v-model="showTotalRecords" size="sm" />
          total records
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch v-model="showPageSize" size="sm" />
          rows per page
        </label>
      </div>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
