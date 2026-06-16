import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import IconButton from '@/components/button/IconButton.vue'

describe('IconButton', () => {
  it('has accessible name', () => {
    const wrapper = mount(IconButton, {
      props: { ariaLabel: 'Close' },
      slots: { default: 'X' },
    })
    expect(wrapper.attributes('aria-label')).toBe('Close')
  })
})
