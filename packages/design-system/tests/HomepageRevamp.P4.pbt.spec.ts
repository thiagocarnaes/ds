// Feature: design-system-homepage-revamp, Property 4: Benefícios Sempre Contêm Campos Obrigatórios

/**
 * Property-Based Tests — Benefícios Sempre Contêm Campos Obrigatórios (Property 4)
 *
 * **Validates: Requirements 3.2**
 * Property: ∀ locale ∈ { 'en', 'pt-BR' }, each of the 3 benefits in
 * HomePurposeSection MUST render:
 *   - an SVG icon element (aria-hidden Lucide icon)
 *   - a non-empty title string with length ≤ 40 characters
 *   - a non-empty description string with length ≤ 120 characters
 */

import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import * as fc from 'fast-check'
import HomePurposeSection from '../playground/components/HomePurposeSection.vue'
import {
  providePlaygroundLocale,
  type PlaygroundLocaleContext,
} from '../playground/composables/usePlaygroundLocale'
import type { PlaygroundLocale } from '../playground/i18n/types'

// ─── Mounting helpers ─────────────────────────────────────────────────────────

/**
 * A wrapper component that provides the locale context, sets the desired
 * locale synchronously, and renders HomePurposeSection as a default slot.
 */
function createLocaleWrapper(locale: PlaygroundLocale) {
  let ctx: PlaygroundLocaleContext | null = null

  const Wrapper = defineComponent({
    setup(_, { slots }) {
      ctx = providePlaygroundLocale()
      // Set the desired locale immediately so the child receives correct
      // translations during its own setup.
      ctx.setLocale(locale)
      return () => slots.default?.()
    },
  })

  return { Wrapper, getCtx: () => ctx }
}

/**
 * Mounts HomePurposeSection within a locale-providing shell and returns the
 * VTU wrapper.
 */
function mountPurposeSection(locale: PlaygroundLocale) {
  const { Wrapper } = createLocaleWrapper(locale)

  const wrapper = mount(Wrapper, {
    slots: {
      default: () => h(HomePurposeSection),
    },
    attachTo: document.body,
  })

  return wrapper
}

// ─── Cleanup ─────────────────────────────────────────────────────────────────

afterEach(() => {
  // Remove any DOM artifacts created by attachTo: document.body
  document.querySelectorAll('[data-v-app]').forEach((el) => el.remove())
})

// ─── Property 4: Benefícios Sempre Contêm Campos Obrigatórios ────────────────

describe('Property 4 — Benefícios Sempre Contêm Campos Obrigatórios (Requirement 3.2)', () => {
  /**
   * **Validates: Requirements 3.2**
   *
   * For any locale in { 'en', 'pt-BR' }, each of the 3 benefits rendered by
   * HomePurposeSection MUST contain:
   *   1. An SVG icon element (aria-hidden Lucide icon)
   *   2. A non-empty title string with length ≤ 40 characters
   *   3. A non-empty description string with length ≤ 120 characters
   */
  it('each benefit contains an SVG icon, non-empty title (≤40 chars), and non-empty description (≤120 chars) for any locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<PlaygroundLocale>('en', 'pt-BR'),
        async (locale) => {
          const wrapper = mountPurposeSection(locale)

          await nextTick()

          // HomePurposeSection renders exactly 3 benefit cards
          // Each benefit card contains an h3 and a p element
          const benefitCards = wrapper.findAll('.purpose-benefit-card')

          expect(
            benefitCards.length,
            `Expected 3 benefit cards for locale="${locale}", got ${benefitCards.length}`,
          ).toBe(3)

          for (let i = 0; i < benefitCards.length; i++) {
            const card = benefitCards[i]

            // 1. SVG icon must be present (Lucide icon)
            const svgEl = card.find('svg')
            expect(
              svgEl.exists(),
              `Benefit ${i} (locale="${locale}"): expected an SVG icon element`,
            ).toBe(true)

            // 2. Non-empty title (h3 inside the card) with length ≤ 40
            const titleEl = card.find('h3')
            expect(
              titleEl.exists(),
              `Benefit ${i} (locale="${locale}"): expected an h3 title element`,
            ).toBe(true)
            const titleText = titleEl.text().trim()
            expect(
              titleText.length,
              `Benefit ${i} (locale="${locale}"): title must be non-empty`,
            ).toBeGreaterThan(0)
            expect(
              titleText.length,
              `Benefit ${i} (locale="${locale}"): title length ${titleText.length} exceeds 40 chars: "${titleText}"`,
            ).toBeLessThanOrEqual(40)

            // 3. Non-empty description (p inside the card) with length ≤ 120
            const descEl = card.find('p')
            expect(
              descEl.exists(),
              `Benefit ${i} (locale="${locale}"): expected a <p> description element`,
            ).toBe(true)
            const descText = descEl.text().trim()
            expect(
              descText.length,
              `Benefit ${i} (locale="${locale}"): description must be non-empty`,
            ).toBeGreaterThan(0)
            expect(
              descText.length,
              `Benefit ${i} (locale="${locale}"): description length ${descText.length} exceeds 120 chars: "${descText}"`,
            ).toBeLessThanOrEqual(120)
          }

          wrapper.unmount()
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  // ─── Concrete example: 'en' locale ─────────────────────────────────────────

  /**
   * **Validates: Requirements 3.2**
   *
   * Concrete check for 'en' locale: verifies the expected number of benefits
   * and that each field satisfies the required constraints.
   */
  it('renders 3 benefits with all required fields in English', async () => {
    const wrapper = mountPurposeSection('en')
    await nextTick()

    const benefitCards = wrapper.findAll('.purpose-benefit-card')
    expect(benefitCards.length).toBe(3)

    for (const card of benefitCards) {
      expect(card.find('svg').exists()).toBe(true)

      const titleText = card.find('h3').text().trim()
      expect(titleText.length).toBeGreaterThan(0)
      expect(titleText.length).toBeLessThanOrEqual(40)

      const descText = card.find('p').text().trim()
      expect(descText.length).toBeGreaterThan(0)
      expect(descText.length).toBeLessThanOrEqual(120)
    }

    wrapper.unmount()
  })

  // ─── Concrete example: 'pt-BR' locale ──────────────────────────────────────

  /**
   * **Validates: Requirements 3.2**
   *
   * Concrete check for 'pt-BR' locale: verifies the expected number of benefits
   * and that each field satisfies the required constraints.
   */
  it('renders 3 benefits with all required fields in pt-BR', async () => {
    const wrapper = mountPurposeSection('pt-BR')
    await nextTick()

    const benefitCards = wrapper.findAll('.purpose-benefit-card')
    expect(benefitCards.length).toBe(3)

    for (const card of benefitCards) {
      expect(card.find('svg').exists()).toBe(true)

      const titleText = card.find('h3').text().trim()
      expect(titleText.length).toBeGreaterThan(0)
      expect(titleText.length).toBeLessThanOrEqual(40)

      const descText = card.find('p').text().trim()
      expect(descText.length).toBeGreaterThan(0)
      expect(descText.length).toBeLessThanOrEqual(120)
    }

    wrapper.unmount()
  })

  // ─── Property: no title or description equals a raw i18n key ───────────────

  /**
   * **Validates: Requirements 3.2**
   *
   * A raw i18n key looks like 'namespace.key'. If a title or description
   * matches this pattern, it means the translation was missing.
   */
  it('titles and descriptions are not raw i18n key strings for any locale', async () => {
    const rawKeyPattern = /^\w+\.\w+$/

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<PlaygroundLocale>('en', 'pt-BR'),
        async (locale) => {
          const wrapper = mountPurposeSection(locale)
          await nextTick()

          const benefitCards = wrapper.findAll('.purpose-benefit-card')

          for (let i = 0; i < benefitCards.length; i++) {
            const card = benefitCards[i]

            const titleText = card.find('h3').text().trim()
            expect(
              rawKeyPattern.test(titleText),
              `Benefit ${i} (locale="${locale}"): title looks like a raw i18n key: "${titleText}"`,
            ).toBe(false)

            const descText = card.find('p').text().trim()
            expect(
              rawKeyPattern.test(descText),
              `Benefit ${i} (locale="${locale}"): description looks like a raw i18n key: "${descText}"`,
            ).toBe(false)
          }

          wrapper.unmount()
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  // ─── Property: mission paragraph is present and non-empty ──────────────────

  /**
   * **Validates: Requirements 3.1**
   *
   * The mission paragraph above the benefits must be present and non-empty
   * for any locale.
   */
  it('mission paragraph is present and non-empty for any locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<PlaygroundLocale>('en', 'pt-BR'),
        async (locale) => {
          const wrapper = mountPurposeSection(locale)
          await nextTick()

          // The mission paragraph is the first <p> element at section level
          // (not inside a benefit card)
          const section = wrapper.find('section')
          expect(section.exists(), `section must exist for locale="${locale}"`).toBe(true)

          // Find <p> elements that are direct children of section (not inside cards)
          const allPs = section.findAll('p')
          // The first <p> should be the mission paragraph (before the grid)
          const missionP = allPs[0]
          expect(
            missionP?.exists(),
            `locale="${locale}": expected a mission <p> element`,
          ).toBe(true)
          const missionText = missionP.text().trim()
          expect(
            missionText.length,
            `locale="${locale}": mission paragraph must be non-empty`,
          ).toBeGreaterThan(0)
          expect(
            /^\w+\.\w+$/.test(missionText),
            `locale="${locale}": mission looks like a raw i18n key: "${missionText}"`,
          ).toBe(false)

          wrapper.unmount()
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })
})
