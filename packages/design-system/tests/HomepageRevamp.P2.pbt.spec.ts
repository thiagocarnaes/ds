// Feature: design-system-homepage-revamp, Property 2: reatividade de locale

/**
 * Property-Based Tests — Reatividade de Locale (Property 2)
 *
 * **Validates: Requirements 9.2**
 *
 * Property: ∀ pair of locales ('en', 'pt-BR'), mounting each section component
 * with locale 'en' versus locale 'pt-BR' MUST produce at least one visible text
 * that differs between the two locales.
 *
 * This verifies that locale switching causes genuine reactivity — the Portuguese
 * translation is not just a copy of the English one for any section.
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
 * Mounts a section component within a locale-providing shell and returns the
 * full rendered text content.
 */
async function getRenderedText(SectionComponent: Component, locale: PlaygroundLocale): Promise<string> {
  const { Wrapper } = createLocaleWrapper(locale)

  const wrapper = mount(Wrapper, {
    slots: {
      default: () => h(SectionComponent),
    },
    attachTo: document.body,
  })

  await nextTick()
  const text = wrapper.text().trim()
  wrapper.unmount()
  return text
}

/**
 * Collects all individual text tokens rendered by a component for a given locale.
 * Splits on whitespace to get discrete text units for fine-grained comparison.
 */
async function getRenderedTokens(
  SectionComponent: Component,
  locale: PlaygroundLocale,
): Promise<Set<string>> {
  const fullText = await getRenderedText(SectionComponent, locale)
  const tokens = fullText
    .split(/\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
  return new Set(tokens)
}

// ─── Cleanup ─────────────────────────────────────────────────────────────────

afterEach(() => {
  document.querySelectorAll('[data-v-app]').forEach((el) => el.remove())
})

// ─── Core assertion ───────────────────────────────────────────────────────────

/**
 * Asserts that at least one text differs between 'en' and 'pt-BR' for a given
 * section component. This is the core locale reactivity check.
 *
 * Strategy: compare the full text content. If the two locales produce different
 * text (at least one character differs), the property holds.
 */
async function assertLocaleReactivity(
  SectionComponent: Component,
  componentName: string,
): Promise<void> {
  const enText = await getRenderedText(SectionComponent, 'en')
  const ptBrText = await getRenderedText(SectionComponent, 'pt-BR')

  expect(
    enText.length,
    `${componentName}: 'en' locale must render some text`,
  ).toBeGreaterThan(0)

  expect(
    ptBrText.length,
    `${componentName}: 'pt-BR' locale must render some text`,
  ).toBeGreaterThan(0)

  expect(
    enText,
    `${componentName}: text in 'en' and 'pt-BR' must differ — at least one text must change with locale`,
  ).not.toBe(ptBrText)
}

// ─── Property 2: Reatividade de Locale ───────────────────────────────────────

describe('Property 2 — Reatividade de Locale (Requirement 9.2)', () => {

  // ── HomeQuickNavSection ───────────────────────────────────────────────────

  /**
   * **Validates: Requirements 9.2**
   *
   * HomeQuickNavSection must produce at least one different text when locale
   * switches from 'en' to 'pt-BR'.
   */
  it('HomeQuickNavSection: locale change produces distinct text between en and pt-BR', async () => {
    await assertLocaleReactivity(HomeQuickNavSection, 'HomeQuickNavSection')
  })

  it('HomeQuickNavSection: renders different content for en vs pt-BR across 100 independent mounts', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Dummy arbitrary to drive 100 runs; the two locales are always compared
        fc.constant(null),
        async (_) => {
          const enText = await getRenderedText(HomeQuickNavSection, 'en')
          const ptBrText = await getRenderedText(HomeQuickNavSection, 'pt-BR')
          // At least one text must differ
          return enText !== ptBrText
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 9.2**
   *
   * Specifically verify that the section title text differs between locales
   * (a heading-level change confirms top-level reactivity).
   */
  it('HomeQuickNavSection: section title (h2) differs between en and pt-BR', async () => {
    const wrapperEn = (await (async () => {
      const { Wrapper } = createLocaleWrapper('en')
      const w = mount(Wrapper, { slots: { default: () => h(HomeQuickNavSection) }, attachTo: document.body })
      await nextTick()
      return w
    })())

    const wrapperPtBr = (await (async () => {
      const { Wrapper } = createLocaleWrapper('pt-BR')
      const w = mount(Wrapper, { slots: { default: () => h(HomeQuickNavSection) }, attachTo: document.body })
      await nextTick()
      return w
    })())

    const h2En = wrapperEn.find('h2').text().trim()
    const h2PtBr = wrapperPtBr.find('h2').text().trim()

    expect(h2En.length).toBeGreaterThan(0)
    expect(h2PtBr.length).toBeGreaterThan(0)
    expect(h2En).not.toBe(h2PtBr)

    wrapperEn.unmount()
    wrapperPtBr.unmount()
  })

  // ── HomePurposeSection ────────────────────────────────────────────────────

  /**
   * **Validates: Requirements 9.2**
   *
   * HomePurposeSection must produce at least one different text when locale
   * switches from 'en' to 'pt-BR'.
   */
  it('HomePurposeSection: locale change produces distinct text between en and pt-BR', async () => {
    await assertLocaleReactivity(HomePurposeSection, 'HomePurposeSection')
  })

  it('HomePurposeSection: renders different content for en vs pt-BR across 100 independent mounts', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(null),
        async (_) => {
          const enText = await getRenderedText(HomePurposeSection, 'en')
          const ptBrText = await getRenderedText(HomePurposeSection, 'pt-BR')
          return enText !== ptBrText
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 9.2**
   *
   * Mission paragraph must differ between locales.
   */
  it('HomePurposeSection: mission paragraph text differs between en and pt-BR', async () => {
    const { Wrapper: WrapperEn } = createLocaleWrapper('en')
    const { Wrapper: WrapperPtBr } = createLocaleWrapper('pt-BR')

    const wrapperEn = mount(WrapperEn, {
      slots: { default: () => h(HomePurposeSection) },
      attachTo: document.body,
    })
    const wrapperPtBr = mount(WrapperPtBr, {
      slots: { default: () => h(HomePurposeSection) },
      attachTo: document.body,
    })

    await nextTick()

    // The first <p> in the section is the mission paragraph
    const allPsEn = wrapperEn.findAll('p')
    const allPsPtBr = wrapperPtBr.findAll('p')

    expect(allPsEn.length).toBeGreaterThan(0)
    expect(allPsPtBr.length).toBeGreaterThan(0)

    const missionEn = allPsEn[0].text().trim()
    const missionPtBr = allPsPtBr[0].text().trim()

    expect(missionEn.length).toBeGreaterThan(0)
    expect(missionPtBr.length).toBeGreaterThan(0)
    expect(missionEn).not.toBe(missionPtBr)

    wrapperEn.unmount()
    wrapperPtBr.unmount()
  })

  // ── HomePrinciplesSection ─────────────────────────────────────────────────

  /**
   * **Validates: Requirements 9.2**
   *
   * HomePrinciplesSection must produce at least one different text when locale
   * switches from 'en' to 'pt-BR'.
   */
  it('HomePrinciplesSection: locale change produces distinct text between en and pt-BR', async () => {
    await assertLocaleReactivity(HomePrinciplesSection, 'HomePrinciplesSection')
  })

  it('HomePrinciplesSection: renders different content for en vs pt-BR across 100 independent mounts', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(null),
        async (_) => {
          const enText = await getRenderedText(HomePrinciplesSection, 'en')
          const ptBrText = await getRenderedText(HomePrinciplesSection, 'pt-BR')
          return enText !== ptBrText
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  // ── HomeQuickStartSection ─────────────────────────────────────────────────

  /**
   * **Validates: Requirements 9.2**
   *
   * HomeQuickStartSection must produce at least one different text when locale
   * switches from 'en' to 'pt-BR'.
   */
  it('HomeQuickStartSection: locale change produces distinct text between en and pt-BR', async () => {
    await assertLocaleReactivity(HomeQuickStartSection, 'HomeQuickStartSection')
  })

  it('HomeQuickStartSection: renders different content for en vs pt-BR across 100 independent mounts', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(null),
        async (_) => {
          const enText = await getRenderedText(HomeQuickStartSection, 'en')
          const ptBrText = await getRenderedText(HomeQuickStartSection, 'pt-BR')
          return enText !== ptBrText
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  // ── HomeChangelogSection ──────────────────────────────────────────────────

  /**
   * **Validates: Requirements 9.2**
   *
   * HomeChangelogSection must produce at least one different text when locale
   * switches from 'en' to 'pt-BR'.
   *
   * Note: HomeChangelogSection has `hidden lg:block` CSS. In jsdom, this does not
   * affect text content availability — the text() method returns all DOM text
   * regardless of CSS visibility. The type labels (typeAdded, typeChanged, typeFixed)
   * and sectionTitle are translated and will differ between locales.
   */
  it('HomeChangelogSection: locale change produces distinct text between en and pt-BR', async () => {
    await assertLocaleReactivity(HomeChangelogSection, 'HomeChangelogSection')
  })

  it('HomeChangelogSection: renders different content for en vs pt-BR across 100 independent mounts', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(null),
        async (_) => {
          const enText = await getRenderedText(HomeChangelogSection, 'en')
          const ptBrText = await getRenderedText(HomeChangelogSection, 'pt-BR')
          return enText !== ptBrText
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 9.2**
   *
   * Verify that the type labels themselves differ between locales
   * (e.g. "Added" in en vs "Adicionado" in pt-BR).
   */
  it('HomeChangelogSection: type labels (Added/Changed/Fixed) differ between en and pt-BR', async () => {
    const { Wrapper: WrapperEn } = createLocaleWrapper('en')
    const { Wrapper: WrapperPtBr } = createLocaleWrapper('pt-BR')

    const wrapperEn = mount(WrapperEn, {
      slots: { default: () => h(HomeChangelogSection) },
      attachTo: document.body,
    })
    const wrapperPtBr = mount(WrapperPtBr, {
      slots: { default: () => h(HomeChangelogSection) },
      attachTo: document.body,
    })

    await nextTick()

    const badgesEn = wrapperEn.findAll('span[class*="rounded-md"]')
    const badgesPtBr = wrapperPtBr.findAll('span[class*="rounded-md"]')

    // Both locales must have badges
    expect(badgesEn.length, 'en: must have type badges').toBeGreaterThan(0)
    expect(badgesPtBr.length, 'pt-BR: must have type badges').toBeGreaterThan(0)

    // Collect badge texts for each locale
    const badgeTextsEn = new Set(badgesEn.map(b => b.text().trim()))
    const badgeTextsPtBr = new Set(badgesPtBr.map(b => b.text().trim()))

    // At least one badge text must differ between locales
    const intersection = [...badgeTextsEn].filter(t => badgeTextsPtBr.has(t))
    const totalEn = badgeTextsEn.size
    const totalPtBr = badgeTextsPtBr.size

    // Not all badges should be the same across both locales
    // (en has "Added", "Changed", "Fixed"; pt-BR has "Adicionado", "Alterado", "Corrigido")
    expect(
      intersection.length < Math.max(totalEn, totalPtBr),
      `At least one badge text should differ between en and pt-BR. en: [${[...badgeTextsEn].join(', ')}], pt-BR: [${[...badgeTextsPtBr].join(', ')}]`,
    ).toBe(true)

    wrapperEn.unmount()
    wrapperPtBr.unmount()
  })

  // ── Combined PBT: all sections must show locale difference ────────────────

  /**
   * **Validates: Requirements 9.2**
   *
   * Combined property: for any section component, the text rendered in 'en'
   * MUST differ from the text rendered in 'pt-BR'.
   *
   * This is the primary PBT for locale reactivity — it randomly picks a section
   * component and verifies that switching locale produces different output.
   */
  it('all section components produce distinct text between en and pt-BR (100 runs)', async () => {
    const sections: Array<{ name: string; component: Component }> = [
      { name: 'HomeQuickNavSection', component: HomeQuickNavSection },
      { name: 'HomePurposeSection', component: HomePurposeSection },
      { name: 'HomePrinciplesSection', component: HomePrinciplesSection },
      { name: 'HomeQuickStartSection', component: HomeQuickStartSection },
      { name: 'HomeChangelogSection', component: HomeChangelogSection },
    ]

    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: sections.length - 1 }),
        async (sectionIndex) => {
          const { name, component } = sections[sectionIndex]

          const enText = await getRenderedText(component, 'en')
          const ptBrText = await getRenderedText(component, 'pt-BR')

          expect(
            enText.length,
            `${name}: 'en' must render some text`,
          ).toBeGreaterThan(0)

          expect(
            ptBrText.length,
            `${name}: 'pt-BR' must render some text`,
          ).toBeGreaterThan(0)

          expect(
            enText,
            `${name}: text must differ between 'en' and 'pt-BR'`,
          ).not.toBe(ptBrText)
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })
})
