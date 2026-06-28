import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Card from '@/components/data-display/Card.vue'
import ProgressTracker from '@/components/data-display/ProgressTracker.vue'
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

  // Requirement 3.1 — shape='circle' uses rounded-full
  it('applies rounded-full for shape circle (default)', () => {
    const wrapper = mount(Avatar, { props: { name: 'Alice' } })
    expect(wrapper.classes().join(' ')).toContain('rounded-full')
  })

  it('applies rounded-full when shape is explicitly circle', () => {
    const wrapper = mount(Avatar, { props: { name: 'Alice', shape: 'circle' } })
    expect(wrapper.classes().join(' ')).toContain('rounded-full')
  })

  // Requirement 3.2 — shape='square' uses rounded-[--ds-radius-md]
  it('applies rounded-[--ds-radius-md] when shape is square', () => {
    const wrapper = mount(Avatar, { props: { name: 'Alice', shape: 'square' } })
    expect(wrapper.classes().join(' ')).toContain('rounded-[--ds-radius-md]')
    expect(wrapper.classes().join(' ')).not.toContain('rounded-full')
  })

  // Requirement 3.3 — presence indicator is rendered
  it('renders presence indicator when presence prop is set', () => {
    const wrapper = mount(Avatar, { props: { name: 'Bob', presence: 'online' } })
    const indicator = wrapper.find('[aria-label="online presence"]')
    expect(indicator.exists()).toBe(true)
  })

  it('renders presence indicator with correct color for online', () => {
    const wrapper = mount(Avatar, { props: { name: 'Bob', presence: 'online' } })
    const indicator = wrapper.find('[aria-label="online presence"]')
    expect(indicator.attributes('style')).toContain('#00E5B0')
  })

  it('renders presence indicator with correct color for busy', () => {
    const wrapper = mount(Avatar, { props: { name: 'Bob', presence: 'busy' } })
    const indicator = wrapper.find('[aria-label="busy presence"]')
    expect(indicator.attributes('style')).toContain('#FF3D57')
  })

  it('renders presence indicator with correct color for offline', () => {
    const wrapper = mount(Avatar, { props: { name: 'Bob', presence: 'offline' } })
    const indicator = wrapper.find('[aria-label="offline presence"]')
    expect(indicator.attributes('style')).toContain('#4D6A87')
  })

  it('renders presence indicator with correct color for focus', () => {
    const wrapper = mount(Avatar, { props: { name: 'Bob', presence: 'focus' } })
    const indicator = wrapper.find('[aria-label="focus presence"]')
    expect(indicator.attributes('style')).toContain('#FF8B00')
  })

  it('does not render presence indicator when presence prop is not set', () => {
    const wrapper = mount(Avatar, { props: { name: 'Bob' } })
    const indicator = wrapper.find('[aria-label$="presence"]')
    expect(indicator.exists()).toBe(false)
  })

  // Requirement 3.4 — status icon is rendered
  it('renders status icon when status is approved', () => {
    const wrapper = mount(Avatar, { props: { name: 'Carol', status: 'approved' } })
    const statusEl = wrapper.find('[aria-label="approved status"]')
    expect(statusEl.exists()).toBe(true)
    expect(statusEl.find('svg').exists()).toBe(true)
  })

  it('renders status icon when status is declined', () => {
    const wrapper = mount(Avatar, { props: { name: 'Carol', status: 'declined' } })
    const statusEl = wrapper.find('[aria-label="declined status"]')
    expect(statusEl.exists()).toBe(true)
    expect(statusEl.find('svg').exists()).toBe(true)
  })

  it('renders status icon when status is locked', () => {
    const wrapper = mount(Avatar, { props: { name: 'Carol', status: 'locked' } })
    const statusEl = wrapper.find('[aria-label="locked status"]')
    expect(statusEl.exists()).toBe(true)
    expect(statusEl.find('svg').exists()).toBe(true)
  })

  it('does not render status icon when status prop is not set', () => {
    const wrapper = mount(Avatar, { props: { name: 'Carol' } })
    const statusEl = wrapper.find('[aria-label$="status"]')
    expect(statusEl.exists()).toBe(false)
  })

  // Requirement 3.5 — AvatarGroup compatibility with shape and size
  it('renders src image when provided', () => {
    const wrapper = mount(Avatar, { props: { name: 'Dave', src: 'https://example.com/photo.jpg' } })
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/photo.jpg')
  })

  // Requirement 3.6 — image error fallback shows initials
  it('hides image and shows initials on image load error', async () => {
    const wrapper = mount(Avatar, { props: { name: 'Jane Doe', src: 'https://broken.example.com/img.jpg' } })
    // Initially the image should be rendered
    expect(wrapper.find('img').exists()).toBe(true)
    // Trigger the error event on the img element
    await wrapper.find('img').trigger('error')
    // After error the img should be gone and initials should appear
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toBe('JD')
  })

  it('shows initials immediately when no src is provided', () => {
    const wrapper = mount(Avatar, { props: { name: 'John Smith' } })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toBe('JS')
  })

  // Requirement 3.7 — aria-label calculated from name
  it('exposes aria-label derived from name', () => {
    const wrapper = mount(Avatar, { props: { name: 'Alice Wonderland' } })
    expect(wrapper.attributes('aria-label')).toBe('Alice Wonderland')
  })

  it('exposes aria-label when src is also provided', () => {
    const wrapper = mount(Avatar, { props: { name: 'Bob Builder', src: 'https://example.com/bob.jpg' } })
    expect(wrapper.attributes('aria-label')).toBe('Bob Builder')
  })

  it('handles single word name for aria-label', () => {
    const wrapper = mount(Avatar, { props: { name: 'Madonna' } })
    expect(wrapper.attributes('aria-label')).toBe('Madonna')
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

// ──────────────────────────────────────────────────────────────────────────────
// ProgressTracker
// ──────────────────────────────────────────────────────────────────────────────

const sampleSteps = [
  { label: 'Step 1', percentageComplete: 100 },
  { label: 'Step 2', percentageComplete: 50 },
  { label: 'Step 3', percentageComplete: 0 },
]

describe('ProgressTracker', () => {
  // REQ 15.1 — component mounts
  it('renders an ordered list with role="list"', () => {
    const wrapper = mount(ProgressTracker, {
      props: { steps: sampleSteps, currentIndex: 1 },
    })
    const ol = wrapper.find('ol')
    expect(ol.exists()).toBe(true)
    expect(ol.attributes('role')).toBe('list')
  })

  // REQ 15.2 — step labels are rendered
  it('renders each step label', () => {
    const wrapper = mount(ProgressTracker, {
      props: { steps: sampleSteps, currentIndex: 1 },
    })
    expect(wrapper.text()).toContain('Step 1')
    expect(wrapper.text()).toContain('Step 2')
    expect(wrapper.text()).toContain('Step 3')
  })

  // REQ 15.6 — aria-label on container
  it('sets aria-label on the list when label prop is provided', () => {
    const wrapper = mount(ProgressTracker, {
      props: { steps: sampleSteps, currentIndex: 0, label: 'Checkout progress' },
    })
    expect(wrapper.find('ol').attributes('aria-label')).toBe('Checkout progress')
  })

  // REQ 15.6 — aria-current="step" on active step only
  it('sets aria-current="step" on the active step', () => {
    const wrapper = mount(ProgressTracker, {
      props: { steps: sampleSteps, currentIndex: 1 },
    })
    const items = wrapper.findAll('li')
    expect(items[0]?.attributes('aria-current')).toBeUndefined()
    expect(items[1]?.attributes('aria-current')).toBe('step')
    expect(items[2]?.attributes('aria-current')).toBeUndefined()
  })

  // REQ 15.3 — currentIndex prop changes active step
  it('moves aria-current when currentIndex changes', async () => {
    const wrapper = mount(ProgressTracker, {
      props: { steps: sampleSteps, currentIndex: 0 },
    })
    expect(wrapper.findAll('li')[0]?.attributes('aria-current')).toBe('step')

    await wrapper.setProps({ currentIndex: 2 })
    expect(wrapper.findAll('li')[0]?.attributes('aria-current')).toBeUndefined()
    expect(wrapper.findAll('li')[2]?.attributes('aria-current')).toBe('step')
  })

  // REQ 15.4 — completed step shows checkmark SVG
  it('renders a checkmark for completed steps (percentageComplete === 100)', () => {
    const wrapper = mount(ProgressTracker, {
      props: { steps: sampleSteps, currentIndex: 1 },
    })
    const items = wrapper.findAll('li')
    // Step 0 is completed → should have an SVG checkmark
    expect(items[0]?.find('svg').exists()).toBe(true)
    // Step 1 is current → should NOT have the checkmark SVG (has step number span)
    expect(items[1]?.find('svg').exists()).toBe(false)
  })

  // REQ 15.5 — current step has ring visual (checked via style)
  it('applies primary ring style to the current step indicator', () => {
    const wrapper = mount(ProgressTracker, {
      props: { steps: sampleSteps, currentIndex: 1 },
    })
    const items = wrapper.findAll('li')
    const currentIndicator = items[1]?.find('span.rounded-full')
    expect(currentIndicator?.attributes('style')).toContain('var(--primary)')
  })

  // REQ 15.7 — stepClick emitted when completed step is clicked
  it('emits stepClick with index when a completed step is clicked', async () => {
    const wrapper = mount(ProgressTracker, {
      props: { steps: sampleSteps, currentIndex: 1 },
    })
    await wrapper.findAll('li')[0]?.trigger('click')
    expect(wrapper.emitted('stepClick')).toBeTruthy()
    expect(wrapper.emitted('stepClick')![0]).toEqual([0])
  })

  // REQ 15.7 — stepClick is NOT emitted for non-completed steps
  it('does not emit stepClick when a non-completed step is clicked', async () => {
    const wrapper = mount(ProgressTracker, {
      props: { steps: sampleSteps, currentIndex: 1 },
    })
    // Step 1 is current (not completed), step 2 is future
    await wrapper.findAll('li')[1]?.trigger('click')
    await wrapper.findAll('li')[2]?.trigger('click')
    expect(wrapper.emitted('stepClick')).toBeFalsy()
  })

  // REQ 15.6 — each li has role="listitem"
  it('applies role="listitem" to each step', () => {
    const wrapper = mount(ProgressTracker, {
      props: { steps: sampleSteps, currentIndex: 0 },
    })
    wrapper.findAll('li').forEach((li) => {
      expect(li.attributes('role')).toBe('listitem')
    })
  })

  // Connector line count
  it('renders N-1 connector lines for N steps', () => {
    const wrapper = mount(ProgressTracker, {
      props: { steps: sampleSteps, currentIndex: 0 },
    })
    // Connectors are <span class="h-0.5 flex-1 ..."> inside each li except last
    const connectors = wrapper.findAll('li').map(li => li.findAll('span').filter(s => s.attributes('aria-hidden') === 'true' && s.classes().includes('h-0.5')))
    const connectorCount = connectors.flat().length
    expect(connectorCount).toBe(sampleSteps.length - 1)
  })
})
