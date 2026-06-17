import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from '@/components/feedback/Badge.vue'
import Lozenge from '@/components/data-display/Lozenge.vue'
import Popover from '@/components/overlay/Popover.vue'

describe('variant prop colors', () => {
  it('Badge variant changes glow color', async () => {
    const wrapper = mount(Badge, { props: { value: 1, variant: 'primary' } })
    expect(wrapper.attributes('style')).toContain('#00D4FF')
    await wrapper.setProps({ variant: 'important' })
    expect(wrapper.attributes('style')).toContain('#FF3D57')
  })

  it('Lozenge variant changes inline colors', () => {
    const success = mount(Lozenge, { props: { variant: 'success' }, slots: { default: 'OK' } })
    const danger = mount(Lozenge, { props: { variant: 'danger' }, slots: { default: 'OK' } })
    expect(success.attributes('style')).toContain('#00E5B0')
    expect(danger.attributes('style')).toContain('#FF3D57')
  })

  it('Popover variant changes panel classes', () => {
    const primary = mount(Popover, {
      props: { open: true, variant: 'primary' },
      slots: { trigger: '<button type="button">T</button>', content: '<p>C</p>' },
    })
    const danger = mount(Popover, {
      props: { open: true, variant: 'danger' },
      slots: { trigger: '<button type="button">T</button>', content: '<p>C</p>' },
    })
    const panel = primary.find('.border-transparent')
    expect(panel.exists()).toBe(true)
    expect(panel.classes().join(' ')).toContain('bg-popover')
    expect(danger.find('.border-destructive\\/40').exists()).toBe(true)
    expect(danger.find('.bg-destructive\\/45').exists()).toBe(true)
  })
})
