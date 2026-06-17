import type {
  DataTableColumn,
  DataTableColumnFilters,
  DataTableDateRangeFilter,
  DataTableSortEntry,
  SortDirection,
} from './dataTableTypes'

export function getCellValue(row: Record<string, unknown>, key: string): unknown {
  return key.split('.').reduce<unknown>((value, part) => {
    if (value == null || typeof value !== 'object') return undefined
    return (value as Record<string, unknown>)[part]
  }, row)
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export interface FormatCellValueOptions {
  locale?: string
  column?: Pick<DataTableColumn, 'filter'>
}

export function formatDataTableLabel(template: string, columnLabel: string): string {
  return template.replaceAll('{column}', columnLabel)
}

export function formatCellValue(value: unknown, options?: FormatCellValueOptions): string {
  if (value == null) return ''
  if (
    typeof value === 'string' &&
    options?.column?.filter === 'date' &&
    ISO_DATE.test(value)
  ) {
    const [year, month, day] = value.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    const intlLocale = options.locale === 'pt-BR' ? 'pt-BR' : 'en-US'
    return new Intl.DateTimeFormat(intlLocale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date)
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  return JSON.stringify(value)
}

function isDateRangeFilter(value: unknown): value is DataTableDateRangeFilter {
  return typeof value === 'object' && value != null && ('from' in value || 'to' in value)
}

export function isColumnFilterActive(
  column: DataTableColumn,
  filterValue: DataTableColumnFilters[string] | undefined,
): boolean {
  if (!column.filter || filterValue == null) return false

  if (column.filter === 'text') {
    return String(filterValue).trim().length > 0
  }

  if (column.filter === 'enum') {
    return Array.isArray(filterValue) && filterValue.length > 0
  }

  if (column.filter === 'date' && isDateRangeFilter(filterValue)) {
    return Boolean(filterValue.from || filterValue.to)
  }

  return false
}

function isActiveColumnFilter(
  column: DataTableColumn,
  filterValue: DataTableColumnFilters[string] | undefined,
): boolean {
  return isColumnFilterActive(column, filterValue)
}

export function applyColumnFilters<T extends Record<string, unknown>>(
  rows: T[],
  columns: DataTableColumn<T>[],
  filters: DataTableColumnFilters,
): T[] {
  const filterableColumns = columns.filter((column) =>
    isActiveColumnFilter(column, filters[column.key]),
  )

  if (filterableColumns.length === 0) return rows

  return rows.filter((row) =>
    filterableColumns.every((column) => {
      const filterValue = filters[column.key]
      if (filterValue == null) return true

      const cellValue = getCellValue(row, column.key)

      if (column.filter === 'text') {
        const term = String(filterValue).trim().toLowerCase()
        return formatCellValue(cellValue).toLowerCase().includes(term)
      }

      if (column.filter === 'enum') {
        const selected = filterValue as string[]
        return selected.includes(String(cellValue))
      }

      if (column.filter === 'date' && isDateRangeFilter(filterValue)) {
        const cellDate = String(cellValue)
        if (filterValue.from && cellDate < filterValue.from) return false
        if (filterValue.to && cellDate > filterValue.to) return false
        return true
      }

      return true
    }),
  )
}

export function filterDataTableRows<T extends Record<string, unknown>>(
  rows: T[],
  search: string,
  columns: DataTableColumn<T>[],
): T[] {
  const term = search.trim().toLowerCase()
  if (!term) return rows

  const searchableColumns = columns.filter((column) => column.searchable !== false)

  return rows.filter((row) =>
    searchableColumns.some((column) =>
      formatCellValue(getCellValue(row, column.key)).toLowerCase().includes(term),
    ),
  )
}

export function filterDataTableRowsPipeline<T extends Record<string, unknown>>(
  rows: T[],
  search: string,
  columns: DataTableColumn<T>[],
  columnFilters: DataTableColumnFilters,
): T[] {
  const withColumnFilters = applyColumnFilters(rows, columns, columnFilters)
  return filterDataTableRows(withColumnFilters, search, columns)
}

function compareValues(left: unknown, right: unknown): number {
  if (left == null && right == null) return 0
  if (left == null) return 1
  if (right == null) return -1

  if (typeof left === 'number' && typeof right === 'number') {
    return left - right
  }

  return formatCellValue(left).localeCompare(formatCellValue(right), undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

export function sortDataTableRowsMulti<T extends Record<string, unknown>>(
  rows: T[],
  sortStack: DataTableSortEntry[],
): T[] {
  if (sortStack.length === 0) return rows

  return [...rows].sort((left, right) => {
    for (const { key, direction } of sortStack) {
      const result = compareValues(getCellValue(left, key), getCellValue(right, key))
      if (result !== 0) return direction === 'asc' ? result : -result
    }
    return 0
  })
}

export function sortDataTableRows<T extends Record<string, unknown>>(
  rows: T[],
  sortKey: string | null,
  direction: SortDirection,
): T[] {
  if (!sortKey || !direction) return rows
  return sortDataTableRowsMulti(rows, [{ key: sortKey, direction }])
}

export function paginateDataTableRows<T>(
  rows: T[],
  page: number,
  currentPageSize: number,
): T[] {
  const start = (page - 1) * currentPageSize
  return rows.slice(start, start + currentPageSize)
}

export function resolveRowKey<T extends Record<string, unknown>>(
  row: T,
  index: number,
  rowKey?: keyof T & string | ((row: T, rowIndex: number) => string),
): string {
  if (typeof rowKey === 'function') return rowKey(row, index)
  if (typeof rowKey === 'string') return String(getCellValue(row, rowKey) ?? index)
  return String(index)
}
