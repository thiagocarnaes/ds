import {
  filterDataTableRowsPipeline,
  paginateDataTableRows,
  sortDataTableRowsMulti,
} from '@/components/data-display/dataTableUtils'
import type {
  DataTableColumnFilters,
  DataTableSortEntry,
  SortDirection,
} from '@/components/data-display/dataTableTypes'
import type { UserTableColumnMessages } from '../i18n/types'

export interface UserRow {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive' | 'pending'
  lastLogin: string
}

export const mockUsers: UserRow[] = [
  { id: '1', name: 'Ana Martins', email: 'ana@acme.io', role: 'Designer', status: 'active', lastLogin: '2026-06-15' },
  { id: '2', name: 'Bruno Costa', email: 'bruno@acme.io', role: 'Engineer', status: 'active', lastLogin: '2026-06-14' },
  { id: '3', name: 'Carla Dias', email: 'carla@acme.io', role: 'Product', status: 'pending', lastLogin: '2026-06-10' },
  { id: '4', name: 'Diego Lima', email: 'diego@acme.io', role: 'Engineer', status: 'inactive', lastLogin: '2026-05-28' },
  { id: '5', name: 'Elena Souza', email: 'elena@acme.io', role: 'Design Lead', status: 'active', lastLogin: '2026-06-16' },
  { id: '6', name: 'Felipe Rocha', email: 'felipe@acme.io', role: 'QA', status: 'active', lastLogin: '2026-06-13' },
  { id: '7', name: 'Gabriela Nunes', email: 'gabi@acme.io', role: 'Engineer', status: 'pending', lastLogin: '2026-06-12' },
  { id: '8', name: 'Henrique Alves', email: 'henrique@acme.io', role: 'DevOps', status: 'active', lastLogin: '2026-06-16' },
  { id: '9', name: 'Isabela Ferreira', email: 'isa@acme.io', role: 'Designer', status: 'inactive', lastLogin: '2026-04-20' },
  { id: '10', name: 'João Pereira', email: 'joao@acme.io', role: 'Engineer', status: 'active', lastLogin: '2026-06-15' },
  { id: '11', name: 'Karina Lopes', email: 'karina@acme.io', role: 'Product', status: 'active', lastLogin: '2026-06-11' },
  { id: '12', name: 'Leo Martins', email: 'leo@acme.io', role: 'Engineer', status: 'active', lastLogin: '2026-06-16' },
  { id: '13', name: 'Marina Teixeira', email: 'marina@acme.io', role: 'Support', status: 'pending', lastLogin: '2026-06-09' },
  { id: '14', name: 'Nicolas Barros', email: 'nicolas@acme.io', role: 'Engineer', status: 'inactive', lastLogin: '2026-05-01' },
  { id: '15', name: 'Olivia Campos', email: 'olivia@acme.io', role: 'Designer', status: 'active', lastLogin: '2026-06-14' },
  { id: '16', name: 'Paulo Mendes', email: 'paulo@acme.io', role: 'Engineer', status: 'active', lastLogin: '2026-06-12' },
  { id: '17', name: 'Quintino Silva', email: 'quintino@acme.io', role: 'Security', status: 'active', lastLogin: '2026-06-16' },
  { id: '18', name: 'Rita Oliveira', email: 'rita@acme.io', role: 'Product', status: 'inactive', lastLogin: '2026-03-18' },
  { id: '19', name: 'Samuel Araujo', email: 'samuel@acme.io', role: 'Engineer', status: 'pending', lastLogin: '2026-06-08' },
  { id: '20', name: 'Tatiana Ribeiro', email: 'tati@acme.io', role: 'Design Lead', status: 'active', lastLogin: '2026-06-15' },
  { id: '21', name: 'Ulisses Pinto', email: 'ulisses@acme.io', role: 'Engineer', status: 'active', lastLogin: '2026-06-13' },
  { id: '22', name: 'Valentina Cruz', email: 'valentina@acme.io', role: 'QA', status: 'active', lastLogin: '2026-06-16' },
  { id: '23', name: 'William Santos', email: 'will@acme.io', role: 'Engineer', status: 'inactive', lastLogin: '2026-02-10' },
  { id: '24', name: 'Xavier Monteiro', email: 'xavier@acme.io', role: 'DevOps', status: 'active', lastLogin: '2026-06-14' },
  { id: '25', name: 'Yasmin Freitas', email: 'yasmin@acme.io', role: 'Designer', status: 'pending', lastLogin: '2026-06-07' },
]

const userColumns = [
  { key: 'name', label: 'Name', sortable: true, filter: 'text' as const },
  { key: 'email', label: 'Email', sortable: true, filter: 'text' as const },
  { key: 'role', label: 'Role', sortable: true, filter: 'text' as const },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    filter: 'enum' as const,
    filterOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Pending', value: 'pending' },
    ],
  },
  { key: 'lastLogin', label: 'Last login', sortable: true, filter: 'date' as const },
]

export function createUserTableColumns(columns: UserTableColumnMessages) {
  return [
    { key: 'name', label: columns.name, sortable: true, filter: 'text' as const },
    { key: 'email', label: columns.email, sortable: true, filter: 'text' as const },
    { key: 'role', label: columns.role, sortable: true, filter: 'text' as const },
    {
      key: 'status',
      label: columns.status,
      sortable: true,
      filter: 'enum' as const,
      filterOptions: [
        { label: columns.statusActive, value: 'active' },
        { label: columns.statusInactive, value: 'inactive' },
        { label: columns.statusPending, value: 'pending' },
      ],
    },
    { key: 'lastLogin', label: columns.lastLogin, sortable: true, filter: 'date' as const },
  ]
}

export const userTableColumns = userColumns

export interface FetchUsersParams {
  page: number
  pageSize: number
  search: string
  sortStack: DataTableSortEntry[]
  columnFilters: DataTableColumnFilters
  sortKey: string | null
  sortDirection: SortDirection
}

export interface FetchUsersResult {
  rows: UserRow[]
  total: number
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Simulates a paginated API with search, column filters, and multi-sort. */
export async function fetchUsers(params: FetchUsersParams): Promise<FetchUsersResult> {
  await delay(450)

  const filtered = filterDataTableRowsPipeline(
    mockUsers,
    params.search,
    userColumns,
    params.columnFilters,
  )
  const sorted = sortDataTableRowsMulti(filtered, params.sortStack)
  const rows = paginateDataTableRows(sorted, params.page, params.pageSize)

  return {
    rows,
    total: filtered.length,
  }
}
