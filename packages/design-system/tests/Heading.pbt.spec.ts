/**
 * Property-Based Tests — Heading level (Property 10)
 *
 * Validates: Requirement 13.2
 * Property: ∀ level ∈ {1..6} → elemento HTML renderizado é h{level}
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import * as fc from 'fast-check'
import Heading from '@/components/typography/Heading.vue'
import type { HeadingLevel } from '@/components/typography/Heading.vue'

// ─── Arbitraries ─────────────────────────────────────────────────────────────

/**
 * Generates any valid HeadingLevel (1–6).
 * This covers the full domain of the `level` prop as specified in Req 13.2.
 */
const levelArbitrary = fc.integer({ min: 1, max: 6 }) as fc.Arbitrary<HeadingLevel>

// ─── Property 10: Heading level ──────────────────────────────────────────────

describe('Property 10 — Heading level (Requirement 13.2)', () => {
  /**
   * **Validates: Requirements 13.2**
   *
   * For every level ∈ {1, 2, 3, 4, 5, 6}, mounting the Heading component MUST
   * render the corresponding HTML element h{level} — i.e., h1 for level=1,
   * h2 for level=2, …, h6 for level=6. The tag name must match exactly.
   */
  it('renders h{level} element for every level in {1..6}', () => {
    fc.assert(
      fc.property(levelArbitrary, (level) => {
        const wrapper = mount(Heading, {
          props: { level },
          slots: { default: 'Heading text' },
        })

        const expectedTag = `h${level}`
        expect(
          wrapper.element.tagName.toLowerCase(),
          `Expected root element to be <${expectedTag}> for level=${level}, got <${wrapper.element.tagName.toLowerCase()}>`,
        ).toBe(expectedTag)
      }),
      { numRuns: 100, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 13.2**
   *
   * Complement: the rendered element tag MUST be one of the six heading tags
   * (h1–h6) and nothing else. This ensures no unexpected fallback tags appear.
   */
  it('rendered element is always one of h1–h6', () => {
    fc.assert(
      fc.property(levelArbitrary, (level) => {
        const wrapper = mount(Heading, {
          props: { level },
          slots: { default: 'Heading text' },
        })

        const tag = wrapper.element.tagName.toLowerCase()
        const validTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
        expect(
          validTags.includes(tag),
          `Expected tag to be one of ${validTags.join(', ')}, got "${tag}" for level=${level}`,
        ).toBe(true)
      }),
      { numRuns: 100, seed: 84 },
    )
  })

  // ─── Boundary / concrete examples ─────────────────────────────────────────

  /**
   * **Validates: Requirements 13.2**
   *
   * Concrete: level=1 renders <h1>.
   */
  it('renders <h1> for level=1', () => {
    const wrapper = mount(Heading, { props: { level: 1 }, slots: { default: 'Title' } })
    expect(wrapper.element.tagName.toLowerCase()).toBe('h1')
  })

  /**
   * **Validates: Requirements 13.2**
   *
   * Concrete: level=2 (default) renders <h2>.
   */
  it('renders <h2> for level=2 (explicit)', () => {
    const wrapper = mount(Heading, { props: { level: 2 }, slots: { default: 'Title' } })
    expect(wrapper.element.tagName.toLowerCase()).toBe('h2')
  })

  /**
   * **Validates: Requirements 13.2**
   *
   * Concrete: level=3 renders <h3>.
   */
  it('renders <h3> for level=3', () => {
    const wrapper = mount(Heading, { props: { level: 3 }, slots: { default: 'Title' } })
    expect(wrapper.element.tagName.toLowerCase()).toBe('h3')
  })

  /**
   * **Validates: Requirements 13.2**
   *
   * Concrete: level=4 renders <h4>.
   */
  it('renders <h4> for level=4', () => {
    const wrapper = mount(Heading, { props: { level: 4 }, slots: { default: 'Title' } })
    expect(wrapper.element.tagName.toLowerCase()).toBe('h4')
  })

  /**
   * **Validates: Requirements 13.2**
   *
   * Concrete: level=5 renders <h5>.
   */
  it('renders <h5> for level=5', () => {
    const wrapper = mount(Heading, { props: { level: 5 }, slots: { default: 'Title' } })
    expect(wrapper.element.tagName.toLowerCase()).toBe('h5')
  })

  /**
   * **Validates: Requirements 13.2**
   *
   * Concrete: level=6 renders <h6>.
   */
  it('renders <h6> for level=6', () => {
    const wrapper = mount(Heading, { props: { level: 6 }, slots: { default: 'Title' } })
    expect(wrapper.element.tagName.toLowerCase()).toBe('h6')
  })

  /**
   * **Validates: Requirements 13.5**
   *
   * Default: omitting the `level` prop should render <h2> (default level=2).
   */
  it('renders <h2> when level prop is omitted (default)', () => {
    const wrapper = mount(Heading, { slots: { default: 'Default heading' } })
    expect(wrapper.element.tagName.toLowerCase()).toBe('h2')
  })

  /**
   * **Validates: Requirements 13.2**
   *
   * Content is preserved: the slot content MUST be rendered inside the
   * heading element regardless of the level value.
   */
  it('preserves slot content inside the heading element for all levels', () => {
    fc.assert(
      fc.property(levelArbitrary, (level) => {
        const text = `Heading at level ${level}`
        const wrapper = mount(Heading, {
          props: { level },
          slots: { default: text },
        })
        expect(
          wrapper.text(),
          `Expected slot content "${text}" to be visible for level=${level}`,
        ).toBe(text)
      }),
      { numRuns: 50, seed: 126 },
    )
  })
})
