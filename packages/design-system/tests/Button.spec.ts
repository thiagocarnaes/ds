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

  // Requirement 2.4 — shouldFitContainer adds w-full class
  it('applies w-full class when shouldFitContainer is true', () => {
    const wrapper = mount(Button, {
      props: { shouldFitContainer: true },
      slots: { default: 'Submit' },
    })
    expect(wrapper.classes()).toContain('w-full')
  })

  it('does not apply w-full class when shouldFitContainer is false', () => {
    const wrapper = mount(Button, {
      props: { shouldFitContainer: false },
      slots: { default: 'Submit' },
    })
    expect(wrapper.classes()).not.toContain('w-full')
  })

  // Requirement 2.3 — isSelected adds ring classes
  it('applies ring-2 and ring-ring classes when isSelected is true', () => {
    const wrapper = mount(Button, {
      props: { isSelected: true },
      slots: { default: 'Option' },
    })
    const classes = wrapper.classes()
    expect(classes).toContain('ring-2')
    expect(classes).toContain('ring-ring')
  })

  it('does not apply ring classes when isSelected is false', () => {
    const wrapper = mount(Button, {
      props: { isSelected: false },
      slots: { default: 'Option' },
    })
    const classes = wrapper.classes()
    expect(classes).not.toContain('ring-2')
    expect(classes).not.toContain('ring-ring')
  })

  // Requirement 2.1 — variant='warning' applies bg-warning class
  it('applies bg-warning class when variant is warning', () => {
    const wrapper = mount(Button, {
      props: { variant: 'warning' },
      slots: { default: 'Warning' },
    })
    expect(wrapper.classes().join(' ')).toContain('bg-warning')
  })

  // Requirement 2.2 — variant='discovery' applies bg-[--ds-color-purple-400] class
  it('applies bg-[--ds-color-purple-400] class when variant is discovery', () => {
    const wrapper = mount(Button, {
      props: { variant: 'discovery' },
      slots: { default: 'Discovery' },
    })
    expect(wrapper.classes().join(' ')).toContain('bg-[--ds-color-purple-400]')
  })
})
