export type SortDirection = 'asc' | 'desc' | null

export type DataTableFilterType = 'text' | 'date' | 'enum'

export interface DataTableFilterOption {
  label: string
  value: string
}

export interface DataTableDateRangeFilter {
  from: string
  to: string
}

export type DataTableColumnFilterValue =
  | string
  | string[]
  | DataTableDateRangeFilter

export type DataTableColumnFilters = Record<string, DataTableColumnFilterValue | undefined>

export interface DataTableColumn<T = Record<string, unknown>> {
  key: string
  label: string
  sortable?: boolean
  searchable?: boolean
  filter?: DataTableFilterType
  filterOptions?: DataTableFilterOption[]
  align?: 'left' | 'center' | 'right'
  width?: string
}

export interface DataTableSortEntry {
  key: string
  direction: Exclude<SortDirection, null>
}

export interface DataTableSortState {
  key: string | null
  direction: SortDirection
}

export interface DataTableRequestParams {
  page: number
  pageSize: number
  search: string
  sortStack: DataTableSortEntry[]
  columnFilters: DataTableColumnFilters
  sortKey: string | null
  sortDirection: SortDirection
}

export type DataTableRowKey<T> = keyof T & string | ((row: T, index: number) => string)

export interface DataTableLabels {
  record?: string
  records?: string
  page?: string
  pages?: string
  pageSize?: string
  searchAriaLabel?: string
  loadingAriaLabel?: string
  loadingText?: string
  filterTitle?: string
  filterPlaceholder?: string
  filterAriaLabel?: string
  filterClear?: string
  filterDateFrom?: string
  filterDateTo?: string
  filterDateFromAriaLabel?: string
  filterDateToAriaLabel?: string
  filterEnumAll?: string
}
