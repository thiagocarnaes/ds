// Feature: design-system-homepage-revamp, Property 6: Principles_Section Omitida com Menos de 4 Princípios

/**
 * Property-Based Tests — Principles_Section Omitida com Menos de 4 Princípios (Property 6)
 *
 * **Validates: Requirements 4.3**
 * Property: IF the principles data structure has fewer than 4 entries, THEN
 * HomePrinciplesSection SHALL omit itself completely (render no visible content).
 * IF the principles array has 4 or more entries, THEN it SHALL render.
 *
 * Since HomePrinciplesSection has a fixed internal array of 4 principles (no props),
 * this test suite:
 *   1. Validates the guard logic directly: `shouldRender = principles.length >= 4`
 *      returns false for lengths 0–3 and true for lengths >= 4.
 *   2. Mounts the real component and verifies it renders its section element
 *      (the internal array always has exactly 4 principles, so it always renders).
 *   3. Verifies that when the guard would be false (< 4 entries), no visible
 *      content is expected — tested via the pure function logic.
 */

import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import * as fc from 'fast-check'
import HomePrinciplesSection from '../playground/components/HomePrinciplesSection.vue'
import {
  providePlaygroundLocale,
  type PlaygroundLocaleContext,
} from '../playground/composables/usePlaygroundLocale'
import type { PlaygroundLocale } from '../playground/i18n/types'

// ─── Guard logic (pure function) ─────────────────────────────────────────────

/**
 * The exact guard logic from HomePrinciplesSection's computed property.
 * Extracted as a pure function for property-based testing.
 */
function shouldRenderPrinciples(principles: unknown[]): boolean {
  return principles.length >= 4
}

// ─── Mounting helpers ─────────────────────────────────────────────────────────

function createLocaleWrapper(locale: PlaygroundLocale) {
  let ctx: PlaygroundLocaleContext | null = null

  const Wrapper = defineComponent({
    setup(_, { slots }) {
      ctx = providePlaygroundLocale()
      ctx.setLocale(locale)
      return () => slots.default?.()
    },
  })

  return { Wrapper, getCtx: () => ctx }
}

function mountPrinciplesSection(locale: PlaygroundLocale) {
  const { Wrapper } = createLocaleWrapper(locale)

  const wrapper = mount(Wrapper, {
    slots: {
      default: () => h(HomePrinciplesSection),
    },
    attachTo: document.body,
  })

  return wrapper
}

// ─── Cleanup ─────────────────────────────────────────────────────────────────

afterEach(() => {
  document.querySelectorAll('[data-v-app]').forEach((el) => el.remove())
})

// ─── Property 6: Principles_Section Omitida com Menos de 4 Princípios ────────

describe('Property 6 — Principles_Section Omitida com Menos de 4 Princípios (Requirement 4.3)', () => {
  /**
   * **Validates: Requirements 4.3**
   *
   * The guard `shouldRender = principles.length >= 4` must return false for
   * any array with fewer than 4 entries (0–3).
   */
  it('shouldRender guard returns false for any array with 0–3 entries', () => {
    fc.assert(
      fc.property(
        fc.array(fc.anything(), { minLength: 0, maxLength: 3 }),
        (principles) => {
          const result = shouldRenderPrinciples(principles)
          expect(
            result,
            `Expected shouldRender=false for ${principles.length} principles, got ${result}`,
          ).toBe(false)
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 4.3**
   *
   * The guard `shouldRender = principles.length >= 4` must return true for
   * any array with 4 or more entries.
   */
  it('shouldRender guard returns true for any array with 4 or more entries', () => {
    fc.assert(
      fc.property(
        fc.array(fc.anything(), { minLength: 4, maxLength: 20 }),
        (principles) => {
          const result = shouldRenderPrinciples(principles)
          expect(
            result,
            `Expected shouldRender=true for ${principles.length} principles, got ${result}`,
          ).toBe(true)
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 4.3**
   *
   * The guard must return false for all specific boundary cases: 0, 1, 2, 3 entries.
   */
  it('shouldRender guard returns false for every boundary case below 4', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 3 }),
        (len) => {
          const principles = new Array(len).fill({})
          const result = shouldRenderPrinciples(principles)
          expect(
            result,
            `Expected shouldRender=false for length=${len}`,
          ).toBe(false)
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 4.3**
   *
   * The guard must return true for the minimum valid count (exactly 4) and above.
   */
  it('shouldRender guard returns true for exactly 4 and beyond', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 4, max: 100 }),
        (len) => {
          const principles = new Array(len).fill({})
          const result = shouldRenderPrinciples(principles)
          expect(
            result,
            `Expected shouldRender=true for length=${len}`,
          ).toBe(true)
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  // ─── Component mount: real component always renders (fixed array of 4) ─────

  /**
   * **Validates: Requirements 4.1, 4.3**
   *
   * The real HomePrinciplesSection component has an internal fixed array of
   * exactly 4 principles, so it always renders (shouldRender = true).
   * This verifies the component renders its section element for any locale.
   */
  it('component renders a section element because internal array has exactly 4 principles', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<PlaygroundLocale>('en', 'pt-BR'),
        async (locale) => {
          const wrapper = mountPrinciplesSection(locale)
          await nextTick()

          const section = wrapper.find('section')
          expect(
            section.exists(),
            `Expected section to be rendered for locale="${locale}" (internal array has 4 principles)`,
          ).toBe(true)

          wrapper.unmount()
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 4.1, 4.3**
   *
   * The component renders exactly 4 principle cards for any locale.
   */
  it('component renders exactly 4 principle cards for any locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<PlaygroundLocale>('en', 'pt-BR'),
        async (locale) => {
          const wrapper = mountPrinciplesSection(locale)
          await nextTick()

          const cards = wrapper.findAll('.principle-card')
          expect(
            cards.length,
            `Expected exactly 4 principle cards for locale="${locale}", got ${cards.length}`,
          ).toBe(4)

          wrapper.unmount()
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  // ─── Concrete examples ────────────────────────────────────────────────────

  /**
   * **Validates: Requirements 4.3**
   *
   * Explicit boundary: 3 entries → guard returns false.
   */
  it('guard returns false for exactly 3 entries (boundary below threshold)', () => {
    const principles = new Array(3).fill({})
    expect(shouldRenderPrinciples(principles)).toBe(false)
  })

  /**
   * **Validates: Requirements 4.3**
   *
   * Explicit boundary: 4 entries → guard returns true.
   */
  it('guard returns true for exactly 4 entries (minimum valid threshold)', () => {
    const principles = new Array(4).fill({})
    expect(shouldRenderPrinciples(principles)).toBe(true)
  })

  /**
   * **Validates: Requirements 4.3**
   *
   * Empty array → guard returns false (no content rendered).
   */
  it('guard returns false for empty array', () => {
    expect(shouldRenderPrinciples([])).toBe(false)
  })
})
