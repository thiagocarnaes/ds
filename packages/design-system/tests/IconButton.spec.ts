import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import IconButton from '@/components/button/IconButton.vue'

describe('IconButton', () => {
  it('has accessible name via aria-label prop', () => {
    const wrapper = mount(IconButton, {
      props: { 'aria-label': 'Close' },
      slots: { default: 'X' },
    })
    // aria-label passes through attrs chain down to the native <button>
    expect(wrapper.find('button').attributes('aria-label')).toBe('Close')
  })
})
