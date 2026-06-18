import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from '@/components/form/Input.vue'
import Switch from '@/components/form/Switch.vue'
import Badge from '@/components/feedback/Badge.vue'
import Spinner from '@/components/feedback/Spinner.vue'
import Avatar from '@/components/data-display/Avatar.vue'
import Button from '@/components/button/Button.vue'
import IconButton from '@/components/button/IconButton.vue'

describe('size props', () => {
  it('Input applies different height classes', () => {
    const sm = mount(Input, { props: { size: 'sm', modelValue: 'x' } })
    const lg = mount(Input, { props: { size: 'lg', modelValue: 'x' } })
    expect(sm.find('input').classes().join(' ')).toMatch(/h-8/)
    expect(lg.find('input').classes().join(' ')).toMatch(/h-10/)
  })

  it('Switch applies different track classes', () => {
    const sm = mount(Switch, { props: { size: 'sm' } })
    const md = mount(Switch, { props: { size: 'md' } })
    expect(sm.find('button').classes().join(' ')).toMatch(/h-4/)
    expect(md.find('button').classes().join(' ')).toMatch(/h-5/)
  })

  it('Badge applies different size classes', () => {
    const sm = mount(Badge, { props: { size: 'sm', value: 1 } })
    const md = mount(Badge, { props: { size: 'md', value: 1 } })
    expect(sm.classes().join(' ')).toMatch(/min-h-7/)
    expect(md.classes().join(' ')).toMatch(/min-h-8/)
  })

  it('Spinner applies different size classes', () => {
    const xs = mount(Spinner, { props: { size: 'xs' } })
    const lg = mount(Spinner, { props: { size: 'lg' } })
    expect(xs.classes().join(' ')).toMatch(/size-3/)
    expect(lg.classes().join(' ')).toMatch(/size-8/)
  })

  it('Avatar applies different size classes', () => {
    const xs = mount(Avatar, { props: { size: 'xs', name: 'Ana' } })
    const xl = mount(Avatar, { props: { size: 'xl', name: 'Ana' } })
    expect(xs.classes().join(' ')).toMatch(/size-6/)
    expect(xl.classes().join(' ')).toMatch(/size-14/)
  })

  it('Button md and sm differ', () => {
    const sm = mount(Button, { props: { size: 'sm' }, slots: { default: 'Save' } })
    const lg = mount(Button, { props: { size: 'lg' }, slots: { default: 'Save' } })
    expect(sm.classes().join(' ')).toMatch(/h-8/)
    expect(lg.classes().join(' ')).toMatch(/h-10/)
  })

  it('IconButton applies size classes from size prop', () => {
    const sm = mount(IconButton, {
      props: { ariaLabel: 'Settings', size: 'sm' },
      slots: { default: '•' },
    })
    const icon = mount(IconButton, {
      props: { ariaLabel: 'Settings', size: 'icon' },
      slots: { default: '•' },
    })
    expect(sm.classes().join(' ')).toMatch(/h-8/)
    expect(icon.classes().join(' ')).toMatch(/size-9/)
  })
})
