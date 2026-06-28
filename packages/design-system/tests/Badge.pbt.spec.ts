/**
 * Property-Based Tests — Badge value cap (Property 2)
 *
 * Validates: Requirement 4.6
 * Property: ∀ value ∈ ℤ, value > 99 → displayText === '99+'
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import * as fc from 'fast-check'
import Badge from '@/components/feedback/Badge.vue'

// ─── Arbitraries ─────────────────────────────────────────────────────────────

/**
 * Generates any integer strictly greater than 99.
 * Uses a wide range to stress-test the cap across many magnitudes.
 */
const valueAbove99 = fc.integer({ min: 100, max: Number.MAX_SAFE_INTEGER })

// ─── Property 2: Badge value cap ─────────────────────────────────────────────

describe('Property 2 — Badge value cap (Requirement 4.6)', () => {
  /**
   * **Validates: Requirements 4.6**
   *
   * For all integer values > 99, the Badge MUST display '99+' instead of
   * the actual number.
   */
  it('displays "99+" for any value > 99', () => {
    fc.assert(
      fc.property(valueAbove99, (value) => {
        const wrapper = mount(Badge, { props: { value } })
        expect(
          wrapper.text(),
          `Expected "99+" for value=${value}, got "${wrapper.text()}"`,
        ).toBe('99+')
      }),
      { numRuns: 200, seed: 42 },
    )
  })

  // ─── Boundary tests ────────────────────────────────────────────────────────

  /**
   * **Validates: Requirements 4.6**
   *
   * Boundary: value === 99 should display '99' (not capped).
   */
  it('displays "99" for value === 99 (boundary — not capped)', () => {
    const wrapper = mount(Badge, { props: { value: 99 } })
    expect(wrapper.text()).toBe('99')
  })

  /**
   * **Validates: Requirements 4.6**
   *
   * Boundary: value === 100 is the first value that triggers the cap and
   * must display '99+'.
   */
  it('displays "99+" for value === 100 (boundary — first capped value)', () => {
    const wrapper = mount(Badge, { props: { value: 100 } })
    expect(wrapper.text()).toBe('99+')
  })

  /**
   * **Validates: Requirements 4.6**
   *
   * Complement: values ≤ 99 must display their actual numeric string,
   * never the capped text.
   */
  it('displays the actual number for any value ≤ 99', () => {
    const valueAtMost99 = fc.integer({ min: 0, max: 99 })

    fc.assert(
      fc.property(valueAtMost99, (value) => {
        const wrapper = mount(Badge, { props: { value } })
        expect(
          wrapper.text(),
          `Expected "${value}" for value=${value}, got "${wrapper.text()}"`,
        ).toBe(String(value))
      }),
      { numRuns: 100, seed: 84 },
    )
  })
})
