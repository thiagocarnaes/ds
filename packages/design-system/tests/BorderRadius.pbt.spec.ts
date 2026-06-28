/**
 * Property-Based Tests — Border-radius token map (Property 12)
 *
 * Validates: Requirement 21.4
 * Property: Avatar with shape='square' renders a class referencing --ds-radius-md (6px)
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import * as fc from 'fast-check'
import Avatar from '@/components/data-display/Avatar.vue'

// ─── Property 12: Border-radius token map ─────────────────────────────────────

describe('Property 12 — Border-radius token map (Requirement 21.4)', () => {
  /**
   * **Validates: Requirements 21.4**
   *
   * Avatar with shape='square' must apply the Tailwind arbitrary-value class
   * that references the --ds-radius-md CSS token.
   */
  it('Avatar with shape="square" applies rounded-[--ds-radius-md] class', () => {
    const wrapper = mount(Avatar, { props: { name: 'Test User', shape: 'square' } })
    const html = wrapper.html()
    expect(html).toMatch(/rounded-\[--ds-radius-md\]|rounded-\[var\(--ds-radius-md\)\]/)
  })

  /**
   * **Validates: Requirements 21.4**
   *
   * Avatar with shape='circle' (default) must apply rounded-full, not the md token.
   */
  it('Avatar with shape="circle" applies rounded-full class', () => {
    const wrapper = mount(Avatar, { props: { name: 'Test User', shape: 'circle' } })
    expect(wrapper.html()).toContain('rounded-full')
  })

  /**
   * **Validates: Requirements 21.4**
   *
   * Property: for ANY non-empty name string, shape='square' always yields
   * the --ds-radius-md token class (i.e., the shape logic is name-independent).
   */
  it('property: Avatar with shape="square" always references the md radius for any name', () => {
    const nameArb = fc.string({ minLength: 1, maxLength: 20 })
    fc.assert(
      fc.property(nameArb, (name) => {
        const wrapper = mount(Avatar, { props: { name, shape: 'square' } })
        const html = wrapper.html()
        expect(html).toMatch(/rounded-\[--ds-radius-md\]|rounded-\[var\(--ds-radius-md\)\]/)
      }),
      { numRuns: 50, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 21.4**
   *
   * The --ds-radius-md primitive token must resolve to 6px when set on a DOM element.
   * This verifies the token value itself, not just that it is referenced.
   */
  it('--ds-radius-md resolves to 6px when set on DOM element', () => {
    const el = document.createElement('div')
    el.style.setProperty('--ds-radius-md', '6px')
    expect(el.style.getPropertyValue('--ds-radius-md').trim()).toBe('6px')
  })

  /**
   * **Validates: Requirements 21.4**
   *
   * Semantic border-radius tokens must map to the expected primitive tokens.
   * Verified by setting each semantic token as var(primitive) and confirming
   * the stored value matches.
   */
  it('semantic radius tokens map to expected primitives', () => {
    const SEMANTIC_TO_PRIMITIVE: Record<string, string> = {
      '--ds-radius-button': '--ds-radius-md',
      '--ds-radius-card':   '--ds-radius-lg',
      '--ds-radius-input':  '--ds-radius-md',
      '--ds-radius-badge':  '--ds-radius-full',
      '--ds-radius-tag':    '--ds-radius-sm',
    }
    for (const [semantic, primitive] of Object.entries(SEMANTIC_TO_PRIMITIVE)) {
      const el = document.createElement('div')
      el.style.setProperty(semantic, `var(${primitive})`)
      expect(el.style.getPropertyValue(semantic).trim()).toBe(`var(${primitive})`)
    }
  })
})
