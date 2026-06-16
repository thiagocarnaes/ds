import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Alert from '@/components/feedback/Alert.vue'
import Badge from '@/components/feedback/Badge.vue'
import Spinner from '@/components/feedback/Spinner.vue'
import Progress from '@/components/feedback/Progress.vue'
import Skeleton from '@/components/feedback/Skeleton.vue'
import { useToast } from '@/composables/useToast'

describe('Alert', () => {
  it('renders with alert role', () => {
    const wrapper = mount(Alert, {
      props: { variant: 'success', title: 'Done' },
      slots: { default: 'Saved' },
    })
    expect(wrapper.attributes('role')).toBe('alert')
    expect(wrapper.text()).toContain('Done')
  })

  it('applies variant styles', () => {
    const success = mount(Alert, { props: { variant: 'success' }, slots: { default: 'OK' } })
    const error = mount(Alert, { props: { variant: 'error' }, slots: { default: 'Fail' } })
    expect(success.classes().join(' ')).toContain('border-success/30')
    expect(error.classes().join(' ')).toContain('border-destructive/30')
  })
})

describe('Badge', () => {
  it('renders numeric value with appearance glow', () => {
    const wrapper = mount(Badge, {
      props: { value: 21, appearance: 'primary' },
    })
    expect(wrapper.text()).toBe('21')
    expect(wrapper.attributes('style')).toContain('#00D4FF')
  })

  it('formats values above 99', () => {
    const wrapper = mount(Badge, {
      props: { value: 100, appearance: 'important' },
    })
    expect(wrapper.text()).toBe('99+')
  })
})

describe('Spinner', () => {
  it('has status role', () => {
    const wrapper = mount(Spinner, { props: { ariaLabel: 'Loading' } })
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-label')).toBe('Loading')
  })
})

describe('Progress', () => {
  it('reflects value', () => {
    const wrapper = mount(Progress, { props: { value: 60 } })
    expect(wrapper.attributes('aria-valuenow')).toBe('60')
  })
})

describe('Skeleton', () => {
  it('renders pulse element', () => {
    const wrapper = mount(Skeleton)
    expect(wrapper.classes().some((c) => c.includes('animate-pulse'))).toBe(true)
  })
})

describe('useToast', () => {
  it('adds toast', () => {
    const toast = useToast()
    const initial = toast.toasts.length
    toast.success('Saved')
    expect(toast.toasts.length).toBe(initial + 1)
  })

  it('stores position on toast item', () => {
    const toast = useToast()
    toast.info('Bottom center', 'bottom-center')
    const latest = toast.toasts[toast.toasts.length - 1]
    expect(latest?.position).toBe('bottom-center')
  })

  it('stores dismissible on toast item', () => {
    const toast = useToast()
    toast.warning('Dismiss me', { dismissible: true })
    const latest = toast.toasts[toast.toasts.length - 1]
    expect(latest?.dismissible).toBe(true)
  })
})

describe('Toast', () => {
  it('renders dismiss button when dismissible', async () => {
    const Toast = (await import('@/components/feedback/Toast.vue')).default
    const wrapper = mount(Toast, {
      props: { dismissible: true },
      slots: { default: 'Saved' },
    })
    expect(wrapper.find('button[aria-label="Dismiss"]').exists()).toBe(true)
  })
})
