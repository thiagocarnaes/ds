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
