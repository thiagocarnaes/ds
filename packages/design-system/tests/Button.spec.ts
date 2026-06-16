import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '@/components/button/Button.vue'

describe('Button', () => {
  it('renders label', () => {
    const wrapper = mount(Button, { slots: { default: 'Save' } })
    expect(wrapper.text()).toBe('Save')
  })

  it('emits click when enabled', async () => {
    const wrapper = mount(Button, { slots: { default: 'Save' } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(Button, {
      props: { disabled: true },
      slots: { default: 'Save' },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('shows loading state', () => {
    const wrapper = mount(Button, {
      props: { loading: true },
      slots: { default: 'Save' },
    })
    expect(wrapper.attributes('aria-busy')).toBe('true')
    expect(wrapper.find('[aria-hidden="true"]').exists()).toBe(true)
  })

  it('applies size variant classes', () => {
    const sm = mount(Button, { props: { size: 'sm' }, slots: { default: 'Save' } })
    const lg = mount(Button, { props: { size: 'lg' }, slots: { default: 'Save' } })
    expect(sm.classes().join(' ')).toMatch(/h-8/)
    expect(lg.classes().join(' ')).toMatch(/h-10/)
  })

  it('renders icon from icon prop', () => {
    const wrapper = mount(Button, {
      props: { icon: 'zap' },
      slots: { default: 'Action' },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.text()).toBe('Action')
  })
})
