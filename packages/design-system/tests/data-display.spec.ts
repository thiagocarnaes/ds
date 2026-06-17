import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Card from '@/components/data-display/Card.vue'
import Divider from '@/components/data-display/Divider.vue'
import Avatar from '@/components/data-display/Avatar.vue'
import Table from '@/components/data-display/Table.vue'
import TableHead from '@/components/data-display/TableHead.vue'
import TableBody from '@/components/data-display/TableBody.vue'
import TableRow from '@/components/data-display/TableRow.vue'
import TableCell from '@/components/data-display/TableCell.vue'
import EmptyState from '@/components/data-display/EmptyState.vue'
import DataTable from '@/components/data-display/DataTable.vue'
import type { DataTableColumn } from '@/components/data-display/dataTableTypes'
import {
  applyColumnFilters,
  filterDataTableRows,
  formatCellValue,
  paginateDataTableRows,
  sortDataTableRows,
  sortDataTableRowsMulti,
} from '@/components/data-display/dataTableUtils'

describe('Card', () => {
  it('renders header slot', () => {
    const wrapper = mount(Card, {
      slots: {
        header: 'Title',
        default: 'Body',
      },
    })
    expect(wrapper.text()).toContain('Title')
    expect(wrapper.text()).toContain('Body')
  })
})

describe('Divider', () => {
  it('renders horizontal rule', () => {
    const wrapper = mount(Divider, { props: { orientation: 'horizontal' } })
    expect(wrapper.find('hr').exists()).toBe(true)
  })
})

describe('Avatar', () => {
  it('shows initials fallback', () => {
    const wrapper = mount(Avatar, { props: { name: 'Jane Doe' } })
    expect(wrapper.text()).toBe('JD')
  })
})

describe('Table', () => {
  it('renders table rows', () => {
    const wrapper = mount(Table, {
      slots: {
        default: `
          <TableHead><TableRow><TableCell>H</TableCell></TableRow></TableHead>
          <TableBody><TableRow><TableCell>C</TableCell></TableRow></TableBody>
        `,
      },
      global: {
        components: { TableHead, TableBody, TableRow, TableCell },
      },
    })
    expect(wrapper.findAll('tr')).toHaveLength(2)
  })
})

describe('EmptyState', () => {
  it('renders title and description', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'No tasks', description: 'Create one' },
    })
    expect(wrapper.text()).toContain('No tasks')
    expect(wrapper.text()).toContain('Create one')
  })
})

type SampleRow = {
  id: string
  name: string
  role: string
  status: string
  joined: string
}

const sampleRows: SampleRow[] = [
  { id: '1', name: 'Zara', role: 'Designer', status: 'active', joined: '2026-01-10' },
  { id: '2', name: 'Ana', role: 'Engineer', status: 'active', joined: '2026-02-15' },
  { id: '3', name: 'Bruno', role: 'Product', status: 'pending', joined: '2026-03-01' },
  { id: '4', name: 'Carla', role: 'QA', status: 'inactive', joined: '2026-04-20' },
  { id: '5', name: 'Diego', role: 'DevOps', status: 'active', joined: '2026-05-05' },
  { id: '6', name: 'Elena', role: 'Support', status: 'pending', joined: '2026-06-01' },
]

const sampleColumns: DataTableColumn<SampleRow>[] = [
  { key: 'name', label: 'Name', sortable: true, filter: 'text' },
  { key: 'role', label: 'Role', sortable: true },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    filter: 'enum',
    filterOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Pending', value: 'pending' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
  { key: 'joined', label: 'Joined', sortable: true, filter: 'date' },
]

describe('dataTableUtils', () => {
  it('filters rows by search term', () => {
    const filtered = filterDataTableRows(sampleRows, 'ana', sampleColumns)
    expect(filtered).toHaveLength(1)
    expect(filtered[0]?.name).toBe('Ana')
  })

  it('sorts rows ascending and descending', () => {
    const asc = sortDataTableRows(sampleRows, 'name', 'asc').map((row) => row.name)
    expect(asc[0]).toBe('Ana')
    expect(asc.at(-1)).toBe('Zara')

    const desc = sortDataTableRows(sampleRows, 'name', 'desc').map((row) => row.name)
    expect(desc[0]).toBe('Zara')
  })

  it('paginates rows', () => {
    const page = paginateDataTableRows(sampleRows, 2, 2)
    expect(page).toHaveLength(2)
    expect(page[0]?.name).toBe('Bruno')
    expect(page[1]?.name).toBe('Carla')
  })

  it('sorts by multiple columns', () => {
    const sorted = sortDataTableRowsMulti(sampleRows, [
      { key: 'status', direction: 'asc' },
      { key: 'name', direction: 'asc' },
    ])

    expect(sorted[0]?.status).toBe('active')
    expect(sorted[0]?.name).toBe('Ana')
    expect(sorted.at(-1)?.status).toBe('pending')
  })

  it('filters enum and date ranges', () => {
    const enumFiltered = applyColumnFilters(sampleRows, sampleColumns, {
      status: ['active'],
    })
    expect(enumFiltered).toHaveLength(3)

    const dateFiltered = applyColumnFilters(sampleRows, sampleColumns, {
      joined: { from: '2026-03-01', to: '2026-05-31' },
    })
    expect(dateFiltered.map((row) => row.name)).toEqual(['Bruno', 'Carla', 'Diego'])
  })

  it('formats date column values by locale', () => {
    const column = sampleColumns.find((item) => item.key === 'joined')!
    expect(formatCellValue('2026-06-15', { locale: 'en', column })).toBe('06/15/2026')
    expect(formatCellValue('2026-06-15', { locale: 'pt-BR', column })).toBe('15/06/2026')
  })
})

describe('DataTable', () => {
  it('renders rows with client-side pagination', () => {
    const wrapper = mount(DataTable, {
      props: {
        columns: sampleColumns,
        rows: sampleRows,
        pageSize: 2,
        currentPage: 1,
        searchable: false,
      },
    })

    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.text()).toContain('Ana')
  })

  it('filters rows client-side', async () => {
    const wrapper = mount(DataTable, {
      props: {
        columns: sampleColumns,
        rows: sampleRows,
        search: 'qa',
        pageSize: 10,
      },
    })

    expect(wrapper.text()).toContain('Carla')
    expect(wrapper.text()).not.toContain('Ana')
  })

  it('shows empty state when no rows match', () => {
    const wrapper = mount(DataTable, {
      props: {
        columns: sampleColumns,
        rows: sampleRows,
        search: 'missing-user',
        pageSize: 10,
        emptyTitle: 'Nothing here',
      },
    })

    expect(wrapper.text()).toContain('Nothing here')
  })

  it('emits request in server-side mode', async () => {
    const wrapper = mount(DataTable, {
      props: {
        columns: sampleColumns,
        rows: sampleRows.slice(0, 2),
        serverSide: true,
        total: 6,
        pageSize: 2,
        currentPage: 1,
      },
    })

    expect(wrapper.emitted('request')).toBeTruthy()
    await wrapper.setProps({ currentPage: 2 })
    expect(wrapper.emitted('request')?.length).toBeGreaterThan(1)
  })

  it('shows record and page totals with page size selector', () => {
    const wrapper = mount(DataTable, {
      props: {
        columns: sampleColumns,
        rows: sampleRows,
        pageSize: 2,
        searchable: false,
      },
    })

    expect(wrapper.text()).toContain('6 records')
    expect(wrapper.text()).toContain('3 pages')
    expect(wrapper.text()).toContain('Rows per page')
  })

  it('supports ctrl+click multi-sort', async () => {
    const wrapper = mount(DataTable, {
      props: {
        columns: sampleColumns,
        rows: sampleRows,
        searchable: false,
        sortStack: [],
      },
    })

    const nameHeader = wrapper.findAll('button').find((button) => button.text().includes('Name'))
    const statusHeader = wrapper.findAll('button').find((button) => button.text().includes('Status'))
    expect(nameHeader).toBeTruthy()
    expect(statusHeader).toBeTruthy()

    await nameHeader!.trigger('click')
    await statusHeader!.trigger('click', { ctrlKey: true })

    expect(wrapper.emitted('update:sortStack')?.at(-1)?.[0]).toEqual([
      { key: 'name', direction: 'asc' },
      { key: 'status', direction: 'asc' },
    ])
  })

  it('renders column filter menu triggers', async () => {
    const wrapper = mount(DataTable, {
      props: {
        columns: sampleColumns,
        rows: sampleRows,
        searchable: false,
      },
    })

    const filterButtons = wrapper.findAll('button[aria-label^="Filter "]')
    expect(filterButtons.length).toBeGreaterThanOrEqual(3)

    await filterButtons[0]!.trigger('click')
    expect(document.body.textContent).toContain('Filter Name')
  })
})
