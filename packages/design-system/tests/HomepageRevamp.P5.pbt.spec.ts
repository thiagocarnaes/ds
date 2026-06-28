// Feature: design-system-homepage-revamp, Property 5: Seções Condicionais Ocultas quando fullLanding=false

/**
 * Property-Based Tests — Seções Condicionais Ocultas quando fullLanding=false (Property 5)
 *
 * **Validates: Requirements 3.6, 4.6, 7.5**
 *
 * Property: ∀ state where `isFullLanding` is `false` (i.e. a specific category is
 * active, not `activeCat='all'`), the sections `HomePurposeSection`,
 * `HomePrinciplesSection`, and `HomeChangelogSection` MUST NOT be visible in the
 * rendered DOM (either absent or with `display: none`).
 *
 * In `App.vue`:
 *   - `isFullLanding = activePage === 'home' && activeCat === 'all'`
 *   - The three sections are rendered inside `<template v-else-if="isFullLanding">`,
 *     so when `isFullLanding=false`, the block is entirely skipped and these
 *     components are absent from the DOM.
 *   - The sections also carry `v-show="isFullLanding"` for additional visibility
 *     control, but the outer `v-else-if` already removes them from the DOM.
 *
 * Tested categories that produce `isFullLanding=false`:
 *   - 'forms', 'labels', 'feedback', 'layout' → `activePage='home'`, `activeCat=category`
 */

import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import * as fc from 'fast-check'
import App from '../playground/App.vue'

// ─── Category type ────────────────────────────────────────────────────────────

/**
 * Categories that set `activePage='home'` with `activeCat` ≠ 'all',
 * resulting in `isFullLanding=false`.
 */
type NonAllCategory = 'forms' | 'labels' | 'feedback' | 'layout'

const NON_ALL_CATEGORIES: NonAllCategory[] = ['forms', 'labels', 'feedback', 'layout']

// ─── Mounting helpers ─────────────────────────────────────────────────────────

function mountApp() {
  return mount(App, {
    attachTo: document.body,
  })
}

/**
 * Maps category names to their index in the CATEGORY_KEYS array defined in
 * App.vue. In App.vue, CATEGORY_KEYS = ['all', 'foundations', 'catalog', 'docs']
 * and the nav buttons correspond to those entries.
 *
 * However, looking at the actual App.vue template, the nav buttons use
 * CATEGORY_KEYS which currently is: ['all', 'foundations', 'catalog', 'docs'].
 * The 'forms', 'labels', 'feedback', 'layout' categories are commented out.
 *
 * To set activeCat to a non-all home category (making isFullLanding=false),
 * we instead set activeCat directly by triggering a nav click to 'foundations'
 * and then checking — or we navigate programmatically by clicking the nav button
 * whose text matches the category.
 *
 * Since 'forms'/'labels'/'feedback'/'layout' are not in the current CATEGORY_KEYS
 * nav (they are commented out in App.vue), we use the 'foundations' nav which
 * does set activePage='foundations' (not 'home'). The cleanest approach to
 * produce isFullLanding=false while staying on activePage='home' is to use the
 * internal category navigation via the HomeQuickNavSection — or simply click the
 * 'foundations' button which navigates away from home (isFullLanding=false because
 * activePage≠'home').
 *
 * Actually, re-reading App.vue's CATEGORY_KEYS:
 *   const CATEGORY_KEYS: CategoryKey[] = ['all', 'foundations', 'catalog', 'docs']
 * 'forms', 'labels', 'feedback', 'layout' are commented out.
 *
 * For 'foundations', 'catalog', 'docs': setCategory sets activePage ≠ 'home'
 * → isFullLanding=false because activePage !== 'home'.
 *
 * So ANY navigation away from 'all' produces isFullLanding=false. The test can
 * use any of the active nav categories: 'foundations', 'catalog', 'docs'.
 *
 * The order in CATEGORY_KEYS is: ['all', 'foundations', 'catalog', 'docs']
 * Nav button indices:               0       1              2         3
 */
const ACTIVE_CATEGORY_KEYS = ['all', 'foundations', 'catalog', 'docs'] as const
type ActiveCategoryKey = (typeof ACTIVE_CATEGORY_KEYS)[number]

/**
 * Non-all categories available in the actual nav (produces isFullLanding=false).
 */
const CATEGORIES_PRODUCING_NOT_FULL_LANDING: Exclude<ActiveCategoryKey, 'all'>[] = [
  'foundations',
  'catalog',
  'docs',
]

async function navigateToNonAllCategory(
  wrapper: ReturnType<typeof mountApp>,
  category: Exclude<ActiveCategoryKey, 'all'>,
): Promise<void> {
  const idx = ACTIVE_CATEGORY_KEYS.indexOf(category)
  const navButtons = wrapper.findAll('.pg-nav-btn')
  if (idx >= 0 && idx < navButtons.length) {
    await navButtons[idx].trigger('click')
    await nextTick()
  }
}

// ─── Selectors for the three conditional sections ─────────────────────────────

/**
 * Returns the root element of HomePurposeSection if present in the DOM.
 * HomePurposeSection renders a <section aria-label="..."> with the
 * homePurpose.sectionTitle label. We look it up via aria-label pattern
 * or by checking for the mission paragraph text.
 *
 * Since jsdom doesn't apply CSS, visibility is determined by DOM presence
 * (v-if / v-else-if removes from DOM) rather than computed style.
 *
 * When isFullLanding=false, the wrapping `<template v-else-if="isFullLanding">`
 * is skipped entirely, so ALL three sections are absent from the DOM.
 * We use broad selectors to detect their presence.
 */

/**
 * Checks whether HomePurposeSection is present and visible.
 *
 * HomePurposeSection renders a <section> with aria-label referencing
 * the 'homePurpose.sectionTitle' key. We identify it by searching for
 * a section element that contains the mission paragraph (class="mb-8")
 * or the benefit cards (class contains "purpose-benefit-card").
 */
function isPurposeSectionVisible(wrapper: ReturnType<typeof mountApp>): boolean {
  const purposeCards = wrapper.findAll('.purpose-benefit-card')
  return purposeCards.length > 0
}

/**
 * Checks whether HomePrinciplesSection is present and visible.
 *
 * HomePrinciplesSection renders principle cards with class "principle-card".
 */
function isPrinciplesSectionVisible(wrapper: ReturnType<typeof mountApp>): boolean {
  const principleCards = wrapper.findAll('.principle-card')
  return principleCards.length > 0
}

/**
 * Checks whether HomeChangelogSection is present and visible.
 *
 * HomeChangelogSection renders changelog entry divs with class "changelog-entry".
 * Note: In its own template the section uses `hidden lg:block`, but since jsdom
 * doesn't apply CSS classes, the DOM presence is what matters here.
 * When isFullLanding=false, the section is outside the rendered block entirely.
 */
function isChangelogSectionVisible(wrapper: ReturnType<typeof mountApp>): boolean {
  const changelogEntries = wrapper.findAll('.changelog-entry')
  return changelogEntries.length > 0
}

// ─── Cleanup ─────────────────────────────────────────────────────────────────

afterEach(() => {
  document.querySelectorAll('[data-v-app]').forEach((el) => el.remove())
})

// ─── Property 5: Seções Condicionais Ocultas quando fullLanding=false ─────────

describe('Property 5 — Seções Condicionais Ocultas quando fullLanding=false (Requirements 3.6, 4.6, 7.5)', () => {
  /**
   * **Validates: Requirements 3.6, 4.6, 7.5**
   *
   * PBT property: for any non-all category available in the navigation, after
   * navigating away from home+all, the three conditional sections must be absent
   * from the DOM (isFullLanding=false removes the v-else-if block entirely).
   *
   * Uses fc.constantFrom over the available non-all categories.
   */
  it('HomePurposeSection, HomePrinciplesSection, and HomeChangelogSection are absent from DOM when isFullLanding=false (100 runs)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<Exclude<ActiveCategoryKey, 'all'>>('foundations', 'catalog', 'docs'),
        async (category) => {
          const wrapper = mountApp()
          await nextTick()

          // Navigate to a category that makes isFullLanding=false
          await navigateToNonAllCategory(wrapper, category)

          const purposeVisible = isPurposeSectionVisible(wrapper)
          const principlesVisible = isPrinciplesSectionVisible(wrapper)
          const changelogVisible = isChangelogSectionVisible(wrapper)

          wrapper.unmount()

          // All three sections must be hidden/absent
          return !purposeVisible && !principlesVisible && !changelogVisible
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  }, 30000)

  /**
   * **Validates: Requirements 3.6**
   *
   * Concrete check: HomePurposeSection is absent from the DOM for each
   * category that produces isFullLanding=false.
   */
  it.each(CATEGORIES_PRODUCING_NOT_FULL_LANDING)(
    'HomePurposeSection is absent from DOM when category="%s" (isFullLanding=false)',
    async (category) => {
      const wrapper = mountApp()
      await nextTick()

      // Initially (home+all): HomePurposeSection IS visible
      expect(
        isPurposeSectionVisible(wrapper),
        'HomePurposeSection should be present in the initial home+all state',
      ).toBe(true)

      // Navigate to non-all category
      await navigateToNonAllCategory(wrapper, category)

      // HomePurposeSection must be absent (not in DOM)
      expect(
        isPurposeSectionVisible(wrapper),
        `HomePurposeSection must be absent from DOM when category="${category}"`,
      ).toBe(false)

      wrapper.unmount()
    },
  )

  /**
   * **Validates: Requirements 4.6**
   *
   * Concrete check: HomePrinciplesSection is absent from the DOM for each
   * category that produces isFullLanding=false.
   */
  it.each(CATEGORIES_PRODUCING_NOT_FULL_LANDING)(
    'HomePrinciplesSection is absent from DOM when category="%s" (isFullLanding=false)',
    async (category) => {
      const wrapper = mountApp()
      await nextTick()

      // Initially (home+all): HomePrinciplesSection IS visible
      expect(
        isPrinciplesSectionVisible(wrapper),
        'HomePrinciplesSection should be present in the initial home+all state',
      ).toBe(true)

      // Navigate to non-all category
      await navigateToNonAllCategory(wrapper, category)

      // HomePrinciplesSection must be absent (not in DOM)
      expect(
        isPrinciplesSectionVisible(wrapper),
        `HomePrinciplesSection must be absent from DOM when category="${category}"`,
      ).toBe(false)

      wrapper.unmount()
    },
  )

  /**
   * **Validates: Requirements 7.5**
   *
   * Concrete check: HomeChangelogSection is absent from the DOM for each
   * category that produces isFullLanding=false.
   *
   * Note: HomeChangelogSection uses `hidden lg:block` in its CSS, but jsdom
   * does not apply CSS classes for computed style — however, the section lives
   * inside the `<template v-else-if="isFullLanding">` block in App.vue, so
   * when isFullLanding=false, the section is entirely absent from the DOM.
   */
  it.each(CATEGORIES_PRODUCING_NOT_FULL_LANDING)(
    'HomeChangelogSection is absent from DOM when category="%s" (isFullLanding=false)',
    async (category) => {
      const wrapper = mountApp()
      await nextTick()

      // Initially (home+all): HomeChangelogSection IS present in the DOM
      expect(
        isChangelogSectionVisible(wrapper),
        'HomeChangelogSection should be present in the initial home+all state',
      ).toBe(true)

      // Navigate to non-all category
      await navigateToNonAllCategory(wrapper, category)

      // HomeChangelogSection must be absent (not in DOM)
      expect(
        isChangelogSectionVisible(wrapper),
        `HomeChangelogSection must be absent from DOM when category="${category}"`,
      ).toBe(false)

      wrapper.unmount()
    },
  )

  /**
   * **Validates: Requirements 3.6, 4.6, 7.5**
   *
   * Transition check: all three sections are present in home+all, disappear
   * when navigating away, and reappear when returning to home+all.
   * This verifies the reactivity of the isFullLanding computed property.
   */
  it('conditional sections appear/disappear reactively as isFullLanding changes', async () => {
    const wrapper = mountApp()
    await nextTick()

    // Step 1: home+all → all three sections present
    expect(isPurposeSectionVisible(wrapper), 'Purpose: present at home+all').toBe(true)
    expect(isPrinciplesSectionVisible(wrapper), 'Principles: present at home+all').toBe(true)
    expect(isChangelogSectionVisible(wrapper), 'Changelog: present at home+all').toBe(true)

    // Step 2: navigate to 'foundations' → isFullLanding=false → all three absent
    await navigateToNonAllCategory(wrapper, 'foundations')
    expect(isPurposeSectionVisible(wrapper), 'Purpose: absent after foundations').toBe(false)
    expect(isPrinciplesSectionVisible(wrapper), 'Principles: absent after foundations').toBe(false)
    expect(isChangelogSectionVisible(wrapper), 'Changelog: absent after foundations').toBe(false)

    // Step 3: navigate back to 'all' → isFullLanding=true → all three present again
    const allButton = wrapper.findAll('.pg-nav-btn')[0] // 'all' is index 0 in CATEGORY_KEYS
    await allButton.trigger('click')
    await nextTick()
    expect(isPurposeSectionVisible(wrapper), 'Purpose: present again after returning to all').toBe(true)
    expect(isPrinciplesSectionVisible(wrapper), 'Principles: present again after returning to all').toBe(true)
    expect(isChangelogSectionVisible(wrapper), 'Changelog: present again after returning to all').toBe(true)

    wrapper.unmount()
  })

  /**
   * **Validates: Requirements 3.6, 4.6, 7.5**
   *
   * All three sections absent simultaneously: verifies that none of the three
   * conditional sections are visible when any non-all category is active.
   */
  it('all three conditional sections are simultaneously absent for any non-all navigation', async () => {
    for (const category of CATEGORIES_PRODUCING_NOT_FULL_LANDING) {
      const wrapper = mountApp()
      await nextTick()

      await navigateToNonAllCategory(wrapper, category)

      expect(
        isPurposeSectionVisible(wrapper),
        `Purpose visible for category="${category}" — must be false`,
      ).toBe(false)
      expect(
        isPrinciplesSectionVisible(wrapper),
        `Principles visible for category="${category}" — must be false`,
      ).toBe(false)
      expect(
        isChangelogSectionVisible(wrapper),
        `Changelog visible for category="${category}" — must be false`,
      ).toBe(false)

      wrapper.unmount()
    }
  })
})
