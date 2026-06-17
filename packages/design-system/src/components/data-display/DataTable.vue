<script setup lang="ts">
import { computed, watch } from 'vue'
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import Input from '@/components/form/Input.vue'
import Pagination from '@/components/navigation/Pagination.vue'
import PageSizeSelect from './PageSizeSelect.vue'
import Spinner from '@/components/feedback/Spinner.vue'
import EmptyState from './EmptyState.vue'
import Table from './Table.vue'
import TableHead from './TableHead.vue'
import TableBody from './TableBody.vue'
import TableRow from './TableRow.vue'
import TableCell from './TableCell.vue'
import DataTableColumnFilterMenu from './DataTableColumnFilterMenu.vue'
import type {
  DataTableColumn,
  DataTableColumnFilters,
  DataTableRequestParams,
  DataTableSortEntry,
  SortDirection,
} from './dataTableTypes'
import {
  filterDataTableRowsPipeline,
  formatCellValue,
  getCellValue,
  paginateDataTableRows,
  resolveRowKey,
  sortDataTableRowsMulti,
} from './dataTableUtils'

export interface DataTableProps {
  columns: DataTableColumn[]
  rows: Record<string, unknown>[]
  rowKey?: string | ((row: Record<string, unknown>, index: number) => string)
  pageSizeOptions?: number[]
  searchable?: boolean
  searchPlaceholder?: string
  loading?: boolean
  total?: number
  serverSide?: boolean
  striped?: boolean
  emptyTitle?: string
  emptyDescription?: string
  class?: string
}

const props = withDefaults(defineProps<DataTableProps>(), {
  pageSizeOptions: () => [5, 10, 25, 50],
  searchable: true,
  searchPlaceholder: 'Search…',
  loading: false,
  serverSide: false,
  striped: true,
  emptyTitle: 'No results',
  emptyDescription: 'Try adjusting your search or filters.',
})

const search = defineModel<string>('search', { default: '' })
const currentPage = defineModel<number>('currentPage', { default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 10 })
const sortStack = defineModel<DataTableSortEntry[]>('sortStack', { default: () => [] })
const columnFilters = defineModel<DataTableColumnFilters>('columnFilters', { default: () => ({}) })
const sortKey = defineModel<string | null>('sortKey', { default: null })
const sortDirection = defineModel<SortDirection>('sortDirection', { default: null })

const emit = defineEmits<{
  request: [params: DataTableRequestParams]
}>()

const clientFilteredRows = computed(() => {
  if (props.serverSide) return props.rows
  return filterDataTableRowsPipeline(
    props.rows,
    search.value,
    props.columns,
    columnFilters.value,
  )
})

const processedRows = computed(() => {
  if (props.serverSide) return props.rows
  const sorted = sortDataTableRowsMulti(clientFilteredRows.value, sortStack.value)
  return paginateDataTableRows(sorted, currentPage.value, pageSize.value)
})

const filteredTotal = computed(() => {
  if (props.serverSide) return props.total ?? props.rows.length
  return clientFilteredRows.value.length
})

const totalPages = computed(() => {
  if (filteredTotal.value === 0) return 0
  return Math.ceil(filteredTotal.value / pageSize.value)
})

const showEmpty = computed(() => !props.loading && processedRows.value.length === 0)

const alignClasses: Record<'left' | 'center' | 'right', string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

function requestParams(): DataTableRequestParams {
  return {
    page: currentPage.value,
    pageSize: pageSize.value,
    search: search.value,
    sortStack: sortStack.value,
    columnFilters: columnFilters.value,
    sortKey: sortStack.value[0]?.key ?? null,
    sortDirection: sortStack.value[0]?.direction ?? null,
  }
}

function emitRequest(): void {
  if (props.serverSide) emit('request', requestParams())
}

function syncLegacySortModels(): void {
  sortKey.value = sortStack.value[0]?.key ?? null
  sortDirection.value = sortStack.value[0]?.direction ?? null
}

function sortEntry(column: DataTableColumn): DataTableSortEntry | undefined {
  return sortStack.value.find((entry) => entry.key === column.key)
}

function sortPriority(column: DataTableColumn): number | null {
  const index = sortStack.value.findIndex((entry) => entry.key === column.key)
  return index >= 0 ? index + 1 : null
}

function toggleSort(column: DataTableColumn, event: MouseEvent): void {
  if (!column.sortable) return

  const multi = event.ctrlKey || event.metaKey
  let stack = [...sortStack.value]
  const index = stack.findIndex((entry) => entry.key === column.key)

  if (multi) {
    if (index >= 0) {
      const entry = stack[index]!
      if (entry.direction === 'asc') {
        stack[index] = { key: column.key, direction: 'desc' }
      } else {
        stack = stack.filter((_, entryIndex) => entryIndex !== index)
      }
    } else {
      stack.push({ key: column.key, direction: 'asc' })
    }
  } else if (index >= 0 && stack.length === 1) {
    const entry = stack[index]!
    if (entry.direction === 'asc') {
      stack = [{ key: column.key, direction: 'desc' }]
    } else {
      stack = []
    }
  } else {
    stack = [{ key: column.key, direction: 'asc' }]
  }

  sortStack.value = stack
  syncLegacySortModels()
  currentPage.value = 1
}

function sortIcon(column: DataTableColumn) {
  const entry = sortEntry(column)
  if (!entry) return ArrowUpDown
  return entry.direction === 'asc' ? ArrowUp : ArrowDown
}

function headerAriaSort(column: DataTableColumn): 'none' | 'ascending' | 'descending' | undefined {
  const entry = sortEntry(column)
  if (!entry) return column.sortable ? 'none' : undefined
  return entry.direction === 'asc' ? 'ascending' : 'descending'
}

watch(search, () => {
  currentPage.value = 1
  if (props.serverSide) emitRequest()
})

watch(columnFilters, () => {
  currentPage.value = 1
  if (props.serverSide) emitRequest()
}, { deep: true })

watch(sortStack, () => {
  syncLegacySortModels()
  if (props.serverSide) emitRequest()
}, { deep: true })

watch([currentPage], () => {
  if (props.serverSide) emitRequest()
})

watch(filteredTotal, (total) => {
  const maxPage = Math.max(1, Math.ceil(total / pageSize.value))
  if (currentPage.value > maxPage) currentPage.value = maxPage
})

watch(pageSize, () => {
  currentPage.value = 1
  if (props.serverSide) emitRequest()
})

watch(
  () => [sortKey.value, sortDirection.value] as const,
  ([key, direction]) => {
    if (sortStack.value.length === 0 && key && direction) {
      sortStack.value = [{ key, direction }]
    }
  },
  { immediate: true },
)

watch(
  () => props.serverSide,
  (serverSide) => {
    if (serverSide) emitRequest()
  },
  { immediate: true },
)
</script>

<template>
  <div :class="cn('flex w-full flex-col gap-4', props.class)">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div v-if="searchable" class="relative w-full sm:max-w-xs">
        <Search
          :size="16"
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          v-model="search"
          :placeholder="searchPlaceholder"
          class="pl-9"
          aria-label="Search table"
        />
      </div>

      <div class="flex items-center gap-3 sm:ml-auto">
        <slot name="toolbar" />
      </div>
    </div>

    <div
      :class="
        cn(
          'relative overflow-hidden rounded-xl border border-border',
          loading && processedRows.length > 0 && 'pointer-events-none',
        )
      "
    >
      <Table :striped="striped" class="rounded-xl">
        <TableHead>
          <TableRow class="hover:bg-transparent">
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              :aria-sort="headerAriaSort(column)"
              :class="
                cn(
                  'h-12 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wide text-muted-foreground',
                  alignClasses[column.align ?? 'left'],
                )
              "
              :style="column.width ? { width: column.width } : undefined"
            >
              <div class="inline-flex items-center gap-1">
                <button
                  v-if="column.sortable"
                  type="button"
                  class="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                  @click="toggleSort(column, $event)"
                >
                  <span>{{ column.label }}</span>
                  <span
                    v-if="sortPriority(column)"
                    class="inline-flex size-4 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary"
                  >
                    {{ sortPriority(column) }}
                  </span>
                  <component
                    :is="sortIcon(column)"
                    :size="14"
                    :class="sortEntry(column) ? 'text-primary' : 'text-muted-foreground/70'"
                    aria-hidden="true"
                  />
                </button>
                <span v-else>{{ column.label }}</span>

                <DataTableColumnFilterMenu
                  v-if="column.filter"
                  v-model="columnFilters"
                  :column="column"
                  :disabled="loading"
                />
              </div>
            </th>
          </TableRow>
        </TableHead>

        <TableBody>
          <TableRow v-if="loading">
            <TableCell :colspan="columns.length" class="py-16 text-center">
              <div class="flex flex-col items-center gap-3">
                <Spinner size="md" :glow="false" aria-label="Loading table data" />
                <span class="text-sm text-muted-foreground">Loading data…</span>
              </div>
            </TableCell>
          </TableRow>

          <TableRow v-else-if="showEmpty">
            <TableCell :colspan="columns.length" class="p-0">
              <EmptyState
                :title="emptyTitle"
                :description="emptyDescription"
                class="border-0 bg-transparent"
              />
            </TableCell>
          </TableRow>

          <TableRow
            v-for="(row, rowIndex) in processedRows"
            v-else
            :key="resolveRowKey(row, rowIndex, rowKey)"
          >
            <TableCell
              v-for="column in columns"
              :key="column.key"
              :class="alignClasses[column.align ?? 'left']"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :value="getCellValue(row, column.key)"
                :index="rowIndex"
              >
                {{ formatCellValue(getCellValue(row, column.key)) }}
              </slot>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-between gap-4 overflow-x-auto border-t border-border pt-4">
      <div class="flex shrink-0 items-center gap-4 whitespace-nowrap">
        <p class="text-sm text-muted-foreground">
          <span class="font-medium text-foreground">{{ filteredTotal }}</span>
          {{ filteredTotal === 1 ? 'record' : 'records' }}
          ·
          <span class="font-medium text-foreground">{{ totalPages }}</span>
          {{ totalPages === 1 ? 'page' : 'pages' }}
        </p>
        <PageSizeSelect
          v-model="pageSize"
          :options="pageSizeOptions"
          :disabled="loading"
          class="shrink-0"
        />
      </div>

      <div class="flex shrink-0 items-center gap-3">
        <Spinner
          v-if="loading"
          size="sm"
          :glow="false"
          class="shrink-0"
          aria-label="Loading table data"
        />
        <Pagination
          v-model:current-page="currentPage"
          :total="filteredTotal"
          :page-size="pageSize"
          class="shrink-0"
        />
      </div>
    </div>
  </div>
</template>
