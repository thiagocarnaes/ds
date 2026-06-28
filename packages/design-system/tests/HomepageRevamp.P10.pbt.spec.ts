// Feature: design-system-homepage-revamp, Property 10: Home com Categoria Específica Renderiza Bento Grid

/**
 * Property-Based Tests — Home com Categoria Específica Renderiza Bento Grid (Property 10)
 *
 * **Validates: Requirements 8.2**
 * Property: ∀ category ∈ { 'forms', 'labels', 'feedback', 'layout' }
 *   with activePage === 'home', the bento grid (.ds-bento-grid) MUST be present
 *   in the rendered DOM.
 *
 * When a specific category is selected (not 'all'), isFullLanding=false and
 * activePage remains 'home', so the bento grid must render.
 *
 * Note: 'forms', 'labels', 'feedback', 'layout' are intentionally commented out
 * of the UI navigation (CATEGORY_KEYS) since the revamped home uses editorial
 * sections instead. However, the bento grid code path still exists and must work
 * when setCategory() is called programmatically. We use App.vue's exposed
 * `setCategory` method to drive these states in tests.
 */

import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import * as fc from 'fast-check'
import App from '../playground/App.vue'

// ─── Category type (specific home categories that produce bento grid) ────────

type BentoCategory = 'forms' | 'labels' | 'feedback' | 'layout'

const BENTO_CATEGORIES: BentoCategory[] = ['forms', 'labels', 'feedback', 'layout']

// ─── Mounting helpers ─────────────────────────────────────────────────────────

function mountApp() {
  return mount(App, {
    attachTo: document.body,
  })
}

/**
 * Navigates the App to a specific category using the exposed setCategory method.
 * This bypasses UI nav buttons (which only expose all/foundations/catalog/docs)
 * and directly drives bento-grid categories (forms, labels, feedback, layout).
 */
async function navigateToCategory(
  wrapper: ReturnType<typeof mountApp>,
  category: BentoCategory,
): Promise<void> {
  await wrapper.vm.setCategory(category)
  await nextTick()
}

// ─── Cleanup ─────────────────────────────────────────────────────────────────

afterEach(() => {
  document.querySelectorAll('[data-v-app]').forEach((el) => el.remove())
})

// ─── Property 10: Home com Categoria Específica Renderiza Bento Grid ─────────

describe('Property 10 — Home com Categoria Específica Renderiza Bento Grid (Requirement 8.2)', () => {
  /**
   * **Validates: Requirements 8.2**
   *
   * PBT property: for any specific category in { forms, labels, feedback, layout },
   * navigating to that category from the home page must produce a bento grid
   * in the DOM.
   *
   * This verifies that isFullLanding=false (because activeCat !== 'all') combined
   * with activePage=home correctly falls through to the TransitionGroup bento grid.
   */
  it('bento grid is present in DOM for any specific home category (100 runs)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<BentoCategory>('forms', 'labels', 'feedback', 'layout'),
        async (category) => {
          const wrapper = mountApp()
          await nextTick()

          // Navigate to the specific category using exposed setCategory
          await navigateToCategory(wrapper, category)

          // The bento grid must be present when activePage='home' and activeCat=category
          const bentoGridExists = wrapper.find('.ds-bento-grid').exists()

          wrapper.unmount()
          return bentoGridExists
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  }, 30000)

  /**
   * **Validates: Requirements 8.2**
   *
   * Concrete check for each specific category: verifies the bento grid
   * is present and the editorial home sections are absent.
   */
  it.each(BENTO_CATEGORIES)(
    'bento grid is present when navigating to "%s" category',
    async (category) => {
      const wrapper = mountApp()
      await nextTick()

      // Initially (home+all): no bento grid
      expect(wrapper.find('.ds-bento-grid').exists()).toBe(false)

      // Navigate to specific category using exposed setCategory
      await navigateToCategory(wrapper, category)

      // After navigation: bento grid must exist
      expect(
        wrapper.find('.ds-bento-grid').exists(),
        `Expected .ds-bento-grid to exist for category="${category}"`,
      ).toBe(true)

      wrapper.unmount()
    },
  )

  /**
   * **Validates: Requirements 8.2**
   *
   * Transition test: navigate from home+all (no bento) to forms (bento present),
   * then back to all (no bento again). Verifies the transition is correct.
   */
  it('bento grid appears when category changes from all to forms, then disappears when returning to all', async () => {
    const wrapper = mountApp()
    await nextTick()

    // home+all → no bento grid
    expect(wrapper.find('.ds-bento-grid').exists()).toBe(false)

    // Navigate to 'forms' → bento grid should appear
    await navigateToCategory(wrapper, 'forms')
    expect(wrapper.find('.ds-bento-grid').exists()).toBe(true)

    // Navigate back to 'all' → bento grid disappears
    await wrapper.vm.setCategory('all')
    await nextTick()
    expect(wrapper.find('.ds-bento-grid').exists()).toBe(false)

    wrapper.unmount()
  })

  /**
   * **Validates: Requirements 8.2**
   *
   * Verify that the bento grid is absent when navigating to non-home pages
   * (catalog, docs) — only home+specific-category (forms/labels/feedback/layout)
   * shows it. The 'foundations' category navigates to FoundationsPage, also no bento.
   */
  it('bento grid is absent for catalog, docs, and foundations pages', async () => {
    const wrapper = mountApp()
    await nextTick()

    // catalog
    await wrapper.vm.setCategory('catalog')
    await nextTick()
    expect(wrapper.find('.ds-bento-grid').exists()).toBe(false)

    // docs
    await wrapper.vm.setCategory('docs')
    await nextTick()
    expect(wrapper.find('.ds-bento-grid').exists()).toBe(false)

    // foundations — navigates to FoundationsPage, not bento
    await wrapper.vm.setCategory('foundations')
    await nextTick()
    expect(wrapper.find('.ds-bento-grid').exists()).toBe(false)

    wrapper.unmount()
  })
})
