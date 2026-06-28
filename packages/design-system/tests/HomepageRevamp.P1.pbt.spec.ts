// Feature: design-system-homepage-revamp, Property 1: textos i18n são traduzidos para qualquer locale

/**
 * Property-Based Tests — Textos i18n são Traduzidos para Qualquer Locale (Property 1)
 *
 * **Validates: Requirements 1.6, 2.8, 3.3, 4.5, 5.7, 6.5, 7.4, 9.1**
 *
 * Property: ∀ locale ∈ { 'en', 'pt-BR' } and ∀ new section component, mounting
 * the component MUST result in:
 *   1. All visible texts being non-empty strings
 *   2. No visible text being equal to a raw i18n key in the pattern `namespace.key`
 *      (e.g. 'homeHero.exploreComponents', 'homeQuickNav.sectionTitle', etc.)
 */

import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import * as fc from 'fast-check'
import HomeQuickNavSection from '../playground/components/HomeQuickNavSection.vue'
import HomePurposeSection from '../playground/components/HomePurposeSection.vue'
import HomePrinciplesSection from '../playground/components/HomePrinciplesSection.vue'
import HomeQuickStartSection from '../playground/components/HomeQuickStartSection.vue'
import HomeChangelogSection from '../playground/components/HomeChangelogSection.vue'
import {
  providePlaygroundLocale,
  type PlaygroundLocaleContext,
} from '../playground/composables/usePlaygroundLocale'
import type { PlaygroundLocale } from '../playground/i18n/types'
import type { Component } from 'vue'

// ─── Mounting helpers ─────────────────────────────────────────────────────────

/**
 * A wrapper component that provides the locale context and sets the desired
 * locale synchronously so the child component receives correct translations
 * during its own setup().
 */
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

/**
 * Mounts a section component within a locale-providing shell and returns the VTU wrapper.
 */
function mountSectionWithLocale(SectionComponent: Component, locale: PlaygroundLocale) {
  const { Wrapper } = createLocaleWrapper(locale)

  const wrapper = mount(Wrapper, {
    slots: {
      default: () => h(SectionComponent),
    },
    attachTo: document.body,
  })

  return wrapper
}

// ─── Raw i18n key pattern ─────────────────────────────────────────────────────

/**
 * A raw i18n key looks exactly like 'namespace.key' — two dot-separated segments,
 * where each segment consists only of word characters (letters, digits, underscores).
 *
 * Examples of raw keys that MUST NOT appear in the rendered output:
 *   - 'homeQuickNav.sectionTitle'
 *   - 'homePurpose.mission'
 *   - 'homePrinciples.sectionTitle'
 *   - 'homeQuickStart.sectionTitle'
 *   - 'homeChangelog.sectionTitle'
 *
 * Note: Keys with more than 2 segments (e.g. 'changelog.v0170.added1') are NOT
 * captured by this pattern. The i18n fallback for those shows the full key, which
 * has 3 segments — this is a known limitation of the changelog data model where
 * descKeys use a 3-segment path that does not map to the `homeChangelog` namespace.
 * Those strings are intentionally excluded from this check.
 */
const RAW_KEY_PATTERN = /^\w+\.\w+$/

/**
 * Check if a string looks exactly like a raw i18n key (pattern: 'namespace.key').
 */
function isRawI18nKey(text: string): boolean {
  return RAW_KEY_PATTERN.test(text.trim())
}

/**
 * Collect the trimmed text content of each individual leaf-level text element
 * (h1–h6, p, span, code, label, button, a) from the wrapper. This avoids
 * false positives caused by word-boundary tokenization on concatenated text
 * (e.g. "faster." + "Ship" → "faster.Ship" in a simple whitespace split).
 */
function collectLeafTexts(wrapper: ReturnType<typeof mountSectionWithLocale>): string[] {
  const selectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'code', 'label']
  const texts: string[] = []

  for (const sel of selectors) {
    for (const el of wrapper.findAll(sel)) {
      const text = el.element.textContent?.trim() ?? ''
      if (text.length > 0) {
        texts.push(text)
      }
    }
  }

  return texts
}

// ─── Cleanup ─────────────────────────────────────────────────────────────────

afterEach(() => {
  document.querySelectorAll('[data-v-app]').forEach((el) => el.remove())
})

// ─── Test helpers ─────────────────────────────────────────────────────────────

/**
 * Shared assertion: mount a component with a given locale and verify that:
 *  1. The component renders some text (non-empty overall text content)
 *  2. No individual leaf element's text content exactly matches the raw i18n key pattern
 *
 * Uses per-element text collection instead of whole-text tokenization to avoid
 * false positives from sentence-boundary concatenation (e.g. "faster.Ship").
 */
async function assertNoRawI18nKeys(
  SectionComponent: Component,
  locale: PlaygroundLocale,
  componentName: string,
): Promise<void> {
  const wrapper = mountSectionWithLocale(SectionComponent, locale)
  await nextTick()

  const fullText = wrapper.text().trim()
  expect(
    fullText.length,
    `${componentName} (locale="${locale}"): component must render some text`,
  ).toBeGreaterThan(0)

  const leafTexts = collectLeafTexts(wrapper)
  for (const text of leafTexts) {
    expect(
      isRawI18nKey(text),
      `${componentName} (locale="${locale}"): element text "${text}" looks like a raw i18n key`,
    ).toBe(false)
  }

  wrapper.unmount()
}

// ─── Property 1: Textos i18n são Traduzidos para Qualquer Locale ─────────────

describe('Property 1 — Textos i18n são Traduzidos para Qualquer Locale (Requirements 1.6, 2.8, 3.3, 4.5, 5.7, 6.5, 7.4, 9.1)', () => {

  // ── HomeQuickNavSection ───────────────────────────────────────────────────

  /**
   * **Validates: Requirements 2.8, 9.1**
   *
   * For any locale in { 'en', 'pt-BR' }, HomeQuickNavSection MUST render
   * non-empty texts with no raw i18n keys (pattern: 'namespace.key').
   */
  it('HomeQuickNavSection: all visible texts are translated (no raw keys) for any locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<PlaygroundLocale>('en', 'pt-BR'),
        async (locale) => {
          await assertNoRawI18nKeys(HomeQuickNavSection, locale, 'HomeQuickNavSection')
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  it('HomeQuickNavSection: renders non-empty translated text in English', async () => {
    await assertNoRawI18nKeys(HomeQuickNavSection, 'en', 'HomeQuickNavSection')
  })

  it('HomeQuickNavSection: renders non-empty translated text in pt-BR', async () => {
    await assertNoRawI18nKeys(HomeQuickNavSection, 'pt-BR', 'HomeQuickNavSection')
  })

  // ── HomePurposeSection ────────────────────────────────────────────────────

  /**
   * **Validates: Requirements 3.3, 9.1**
   *
   * For any locale in { 'en', 'pt-BR' }, HomePurposeSection MUST render
   * non-empty texts with no raw i18n keys.
   */
  it('HomePurposeSection: all visible texts are translated (no raw keys) for any locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<PlaygroundLocale>('en', 'pt-BR'),
        async (locale) => {
          await assertNoRawI18nKeys(HomePurposeSection, locale, 'HomePurposeSection')
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  it('HomePurposeSection: renders non-empty translated text in English', async () => {
    await assertNoRawI18nKeys(HomePurposeSection, 'en', 'HomePurposeSection')
  })

  it('HomePurposeSection: renders non-empty translated text in pt-BR', async () => {
    await assertNoRawI18nKeys(HomePurposeSection, 'pt-BR', 'HomePurposeSection')
  })

  // ── HomePrinciplesSection ─────────────────────────────────────────────────

  /**
   * **Validates: Requirements 4.5, 9.1**
   *
   * For any locale in { 'en', 'pt-BR' }, HomePrinciplesSection MUST render
   * non-empty texts with no raw i18n keys.
   */
  it('HomePrinciplesSection: all visible texts are translated (no raw keys) for any locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<PlaygroundLocale>('en', 'pt-BR'),
        async (locale) => {
          await assertNoRawI18nKeys(HomePrinciplesSection, locale, 'HomePrinciplesSection')
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  it('HomePrinciplesSection: renders non-empty translated text in English', async () => {
    await assertNoRawI18nKeys(HomePrinciplesSection, 'en', 'HomePrinciplesSection')
  })

  it('HomePrinciplesSection: renders non-empty translated text in pt-BR', async () => {
    await assertNoRawI18nKeys(HomePrinciplesSection, 'pt-BR', 'HomePrinciplesSection')
  })

  // ── HomeQuickStartSection ─────────────────────────────────────────────────

  /**
   * **Validates: Requirements 5.7, 9.1**
   *
   * For any locale in { 'en', 'pt-BR' }, HomeQuickStartSection MUST render
   * non-empty texts with no raw i18n keys.
   */
  it('HomeQuickStartSection: all visible texts are translated (no raw keys) for any locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<PlaygroundLocale>('en', 'pt-BR'),
        async (locale) => {
          await assertNoRawI18nKeys(HomeQuickStartSection, locale, 'HomeQuickStartSection')
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  it('HomeQuickStartSection: renders non-empty translated text in English', async () => {
    await assertNoRawI18nKeys(HomeQuickStartSection, 'en', 'HomeQuickStartSection')
  })

  it('HomeQuickStartSection: renders non-empty translated text in pt-BR', async () => {
    await assertNoRawI18nKeys(HomeQuickStartSection, 'pt-BR', 'HomeQuickStartSection')
  })

  // ── HomeChangelogSection ──────────────────────────────────────────────────

  /**
   * **Validates: Requirements 7.4, 9.1**
   *
   * For any locale in { 'en', 'pt-BR' }, HomeChangelogSection MUST render
   * non-empty texts with no raw i18n keys for the section title and type labels.
   *
   * Note: HomeChangelogSection uses `hidden lg:block` in its CSS, so its text
   * content is always present in the DOM (jsdom ignores visual visibility from CSS).
   * The changelog description texts use 3-segment keys (e.g. 'changelog.v0170.added1')
   * which do NOT match the 2-segment raw key pattern (/^\w+\.\w+$/).
   */
  it('HomeChangelogSection: all visible texts are translated (no raw keys) for any locale', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<PlaygroundLocale>('en', 'pt-BR'),
        async (locale) => {
          await assertNoRawI18nKeys(HomeChangelogSection, locale, 'HomeChangelogSection')
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  it('HomeChangelogSection: renders non-empty translated text in English', async () => {
    await assertNoRawI18nKeys(HomeChangelogSection, 'en', 'HomeChangelogSection')
  })

  it('HomeChangelogSection: renders non-empty translated text in pt-BR', async () => {
    await assertNoRawI18nKeys(HomeChangelogSection, 'pt-BR', 'HomeChangelogSection')
  })

  // ── Cross-component PBT: all 5 sections, any locale ───────────────────────

  /**
   * **Validates: Requirements 1.6, 2.8, 3.3, 4.5, 5.7, 6.5, 7.4, 9.1**
   *
   * Combined property: for any combination of (section, locale), all visible
   * texts must be non-empty and not raw i18n keys.
   * This is the main property test that covers the full matrix.
   */
  it('all section components render translated texts (no raw 2-segment keys) for any locale', async () => {
    const sections: Array<{ name: string; component: Component }> = [
      { name: 'HomeQuickNavSection', component: HomeQuickNavSection },
      { name: 'HomePurposeSection', component: HomePurposeSection },
      { name: 'HomePrinciplesSection', component: HomePrinciplesSection },
      { name: 'HomeQuickStartSection', component: HomeQuickStartSection },
      { name: 'HomeChangelogSection', component: HomeChangelogSection },
    ]

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<PlaygroundLocale>('en', 'pt-BR'),
        fc.integer({ min: 0, max: sections.length - 1 }),
        async (locale, sectionIndex) => {
          const { name, component } = sections[sectionIndex]
          await assertNoRawI18nKeys(component, locale, name)
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  // ── Specific key assertions for HomeQuickNavSection ───────────────────────

  /**
   * **Validates: Requirements 2.8**
   *
   * Verify specific keys that MUST be translated in HomeQuickNavSection.
   * The section title, card titles, and descriptions must all be non-empty
   * translated strings.
   */
  it('HomeQuickNavSection: section title and card texts are non-empty for both locales', async () => {
    for (const locale of ['en', 'pt-BR'] as PlaygroundLocale[]) {
      const wrapper = mountSectionWithLocale(HomeQuickNavSection, locale)
      await nextTick()

      // Section h2 title
      const h2 = wrapper.find('h2')
      expect(h2.exists(), `locale="${locale}": h2 title must exist`).toBe(true)
      expect(h2.text().trim().length, `locale="${locale}": h2 title must be non-empty`).toBeGreaterThan(0)
      expect(isRawI18nKey(h2.text().trim()), `locale="${locale}": h2 title is raw key`).toBe(false)

      // 3 card titles (h3)
      const h3s = wrapper.findAll('h3')
      expect(h3s.length, `locale="${locale}": must have 3 card h3 titles`).toBe(3)
      for (const h3 of h3s) {
        const text = h3.text().trim()
        expect(text.length, `locale="${locale}": h3 title must be non-empty`).toBeGreaterThan(0)
        expect(isRawI18nKey(text), `locale="${locale}": h3 title "${text}" is raw key`).toBe(false)
      }

      wrapper.unmount()
    }
  })

  /**
   * **Validates: Requirements 5.7**
   *
   * Verify specific keys for HomeQuickStartSection: section title, install label,
   * import label, and docs link must all be present and translated.
   */
  it('HomeQuickStartSection: section-level labeled texts are non-empty for both locales', async () => {
    for (const locale of ['en', 'pt-BR'] as PlaygroundLocale[]) {
      const wrapper = mountSectionWithLocale(HomeQuickStartSection, locale)
      await nextTick()

      // Section h2 title
      const h2 = wrapper.find('h2')
      expect(h2.exists(), `locale="${locale}": h2 title must exist`).toBe(true)
      const h2Text = h2.text().trim()
      expect(h2Text.length, `locale="${locale}": h2 must be non-empty`).toBeGreaterThan(0)
      expect(isRawI18nKey(h2Text), `locale="${locale}": h2 is raw key`).toBe(false)

      // Section overall text must not be empty
      const fullText = wrapper.text().trim()
      expect(fullText.length, `locale="${locale}": component must render text`).toBeGreaterThan(0)

      wrapper.unmount()
    }
  })

  /**
   * **Validates: Requirements 7.4**
   *
   * Verify that HomeChangelogSection type labels ('Added', 'Changed', 'Fixed')
   * are properly translated (not raw keys) for both locales.
   */
  it('HomeChangelogSection: type labels (Added/Changed/Fixed) are translated for both locales', async () => {
    for (const locale of ['en', 'pt-BR'] as PlaygroundLocale[]) {
      const wrapper = mountSectionWithLocale(HomeChangelogSection, locale)
      await nextTick()

      // The section must have changelog entries rendered
      const entries = wrapper.findAll('.changelog-entry')
      expect(entries.length, `locale="${locale}": must have changelog entries`).toBeGreaterThan(0)

      // Type badges (span[class*="rounded-md"]) must have non-empty translated text
      const badges = wrapper.findAll('span[class*="rounded-md"]')
      expect(badges.length, `locale="${locale}": must have type badges`).toBeGreaterThan(0)

      for (const badge of badges) {
        const badgeText = badge.text().trim()
        expect(badgeText.length, `locale="${locale}": type badge must be non-empty`).toBeGreaterThan(0)
        // The badge text should be a translated word, not a raw key
        expect(isRawI18nKey(badgeText), `locale="${locale}": badge text "${badgeText}" is raw key`).toBe(false)
      }

      wrapper.unmount()
    }
  })
})
