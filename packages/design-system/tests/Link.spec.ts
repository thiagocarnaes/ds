import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Link from '@/components/link/Link.vue'

describe('Link', () => {
  it('renders external link with target blank', () => {
    const wrapper = mount(Link, {
      props: { href: 'https://example.com', external: true },
      slots: { default: 'Docs' },
    })
    expect(wrapper.attributes('target')).toBe('_blank')
    expect(wrapper.attributes('rel')).toBe('noopener noreferrer')
  })
})
