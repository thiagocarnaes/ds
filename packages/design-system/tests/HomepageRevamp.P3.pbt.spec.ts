// Feature: design-system-homepage-revamp, Property 3: Cards de Navegação Sempre Contêm Campos Obrigatórios

/**
 * Property-Based Tests — Cards de Navegação Sempre Contêm Campos Obrigatórios (Property 3)
 *
 * **Validates: Requirements 2.2**
 * Property: ∀ locale ∈ { 'en', 'pt-BR' }, each of the 3 navigation cards in
 * HomeQuickNavSection MUST render:
 *   - an SVG icon element
 *   - a non-empty title
 *   - a non-empty description
 *   - a non-empty quantitative stat
 */

import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import * as fc from 'fast-check'
import HomeQuickNavSection from '../playground/components/HomeQuickNavSection.vue'
import {
  providePlaygroundLocale,
  type PlaygroundLocaleContext,
} from '../playground/composables/usePlaygroundLocale'
import type { PlaygroundLocale } from '../playground/i18n/types'

// ─── Mounting helpers ─────────────────────────────────────────────────────────

/**
 * A wrapper component that provides the locale context and exposes it so
 * tests can call setLocale() before making assertions.
 */
function createLocaleWrapper(locale: PlaygroundLocale) {
  let ctx: PlaygroundLocaleContext | null = null

  const Wrapper = defineComponent({
    setup(_, { slots }) {
      ctx = providePlaygroundLocale()
      // Set the desired locale immediately (synchronously) so the child
      // component receives the correct translations during its own setup.
      ctx.setLocale(locale)
      return () => slots.default?.()
    },
  })

  return { Wrapper, getCtx: () => ctx }
}

/**
 * Mounts HomeQuickNavSection within a locale-providing shell and returns the
 * VTU wrapper plus a cleanup function.
 */
function mountQuickNav(locale: PlaygroundLocale) {
  const { Wrapper } = createLocaleWrapper(locale)

  const wrapper = mount(Wrapper, {
    slots: {
      default: () => h(HomeQuickNavSection),
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

// ─── Property 3: Cards de Navegação Sempre Contêm Campos Obrigatórios ────────

describe('Property 3 — Cards de Navegação Sempre Contêm Campos Obrigatórios (Requirement 2.2)', () => {
  /**
   * **Validates: Requirements 2.2**
   *
   * For any locale in { 'en', 'pt-BR' }, each of the 3 navigation cards
   * rendered by HomeQuickNavSection MUST contain:
   *   1. An SVG icon element (aria-hidden Lucide icon)
   *   2. A non-empty title string
   *   3. A non-empty description string
   *   4. A non-empty quantitative stat string
   */
  it('each card contains an SVG icon, non-empty title, non-empty description, and non-empty stat for any locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<PlaygroundLocale>('en', 'pt-BR'),
        async (locale) => {
          const wrapper = mountQuickNav(locale)

          await nextTick()

          // HomeQuickNavSection renders exactly 3 cards (.quick-nav-card role="button" elements)
          const cards = wrapper.findAll('[role="button"]')

          expect(
            cards.length,
            `Expected 3 nav cards for locale="${locale}", got ${cards.length}`,
          ).toBe(3)

          for (let i = 0; i < cards.length; i++) {
            const card = cards[i]

            // 1. SVG icon must be present
            const svgEl = card.find('svg')
            expect(
              svgEl.exists(),
              `Card ${i} (locale="${locale}"): expected an SVG icon element`,
            ).toBe(true)

            // 2. Non-empty title (h3 inside the card)
            const titleEl = card.find('h3')
            expect(
              titleEl.exists(),
              `Card ${i} (locale="${locale}"): expected an h3 title element`,
            ).toBe(true)
            const titleText = titleEl.text().trim()
            expect(
              titleText.length,
              `Card ${i} (locale="${locale}"): title must be non-empty`,
            ).toBeGreaterThan(0)

            // 3. Non-empty description (p inside the card)
            const descEl = card.find('p')
            expect(
              descEl.exists(),
              `Card ${i} (locale="${locale}"): expected a <p> description element`,
            ).toBe(true)
            const descText = descEl.text().trim()
            expect(
              descText.length,
              `Card ${i} (locale="${locale}"): description must be non-empty`,
            ).toBeGreaterThan(0)

            // 4. Non-empty quantitative stat (span with font-mono class)
            const statEl = card.find('span')
            expect(
              statEl.exists(),
              `Card ${i} (locale="${locale}"): expected a stat <span> element`,
            ).toBe(true)
            const statText = statEl.text().trim()
            expect(
              statText.length,
              `Card ${i} (locale="${locale}"): stat must be non-empty`,
            ).toBeGreaterThan(0)
          }

          wrapper.unmount()
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  // ─── Concrete example: 'en' locale ─────────────────────────────────────────

  /**
   * **Validates: Requirements 2.2**
   *
   * Concrete check for 'en' locale: verifies the expected number of cards
   * and that each field is non-empty.
   */
  it('renders 3 cards with all required fields in English', async () => {
    const wrapper = mountQuickNav('en')
    await nextTick()

    const cards = wrapper.findAll('[role="button"]')
    expect(cards.length).toBe(3)

    for (const card of cards) {
      expect(card.find('svg').exists()).toBe(true)
      expect(card.find('h3').text().trim().length).toBeGreaterThan(0)
      expect(card.find('p').text().trim().length).toBeGreaterThan(0)
      expect(card.find('span').text().trim().length).toBeGreaterThan(0)
    }

    wrapper.unmount()
  })

  // ─── Concrete example: 'pt-BR' locale ──────────────────────────────────────

  /**
   * **Validates: Requirements 2.2**
   *
   * Concrete check for 'pt-BR' locale: verifies the expected number of cards
   * and that each field is non-empty.
   */
  it('renders 3 cards with all required fields in pt-BR', async () => {
    const wrapper = mountQuickNav('pt-BR')
    await nextTick()

    const cards = wrapper.findAll('[role="button"]')
    expect(cards.length).toBe(3)

    for (const card of cards) {
      expect(card.find('svg').exists()).toBe(true)
      expect(card.find('h3').text().trim().length).toBeGreaterThan(0)
      expect(card.find('p').text().trim().length).toBeGreaterThan(0)
      expect(card.find('span').text().trim().length).toBeGreaterThan(0)
    }

    wrapper.unmount()
  })

  // ─── Property: no title or description equals a raw i18n key ───────────────

  /**
   * **Validates: Requirements 2.2**
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
          const wrapper = mountQuickNav(locale)
          await nextTick()

          const cards = wrapper.findAll('[role="button"]')

          for (let i = 0; i < cards.length; i++) {
            const card = cards[i]

            const titleText = card.find('h3').text().trim()
            expect(
              rawKeyPattern.test(titleText),
              `Card ${i} (locale="${locale}"): title looks like a raw i18n key: "${titleText}"`,
            ).toBe(false)

            const descText = card.find('p').text().trim()
            expect(
              rawKeyPattern.test(descText),
              `Card ${i} (locale="${locale}"): description looks like a raw i18n key: "${descText}"`,
            ).toBe(false)
          }

          wrapper.unmount()
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })
})
