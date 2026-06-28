// Feature: design-system-homepage-revamp, Property 9: Home All Não Renderiza Bento Grid

/**
 * Property-Based Tests — Home All Não Renderiza Bento Grid (Property 9)
 *
 * **Validates: Requirements 8.1, 8.3**
 * Property: ∀ state where activePage === 'home' AND activeCat === 'all',
 *   the bento grid (.ds-bento-grid) MUST NOT be present in the rendered DOM.
 *
 * When isFullLanding is true (activePage=home + activeCat=all), the Editorial
 * Home renders instead of the bento grid. This test verifies that separation.
 */

import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import * as fc from 'fast-check'
import App from '../playground/App.vue'
import { providePlaygroundLocale } from '../playground/composables/usePlaygroundLocale'

// ─── Mounting helpers ─────────────────────────────────────────────────────────

/**
 * Mounts App.vue within a locale-providing shell and returns the VTU wrapper.
 * App.vue itself calls providePlaygroundLocale() internally, so no wrapping needed,
 * but we mount it directly since it is a standalone root component.
 */
function mountApp() {
  return mount(App, {
    attachTo: document.body,
  })
}

// ─── Cleanup ─────────────────────────────────────────────────────────────────

afterEach(() => {
  document.querySelectorAll('[data-v-app]').forEach((el) => el.remove())
})

// ─── Property 9: Home All Não Renderiza Bento Grid ───────────────────────────

describe('Property 9 — Home All Não Renderiza Bento Grid (Requirements 8.1, 8.3)', () => {
  /**
   * **Validates: Requirements 8.1, 8.3**
   *
   * The initial state of App.vue is activePage='home' and activeCat='all',
   * which sets isFullLanding=true. In this state, the bento grid
   * (.ds-bento-grid) must be absent from the DOM — the Editorial Home renders
   * instead.
   */
  it('bento grid is absent from DOM when App mounts with default home/all state', async () => {
    const wrapper = mountApp()
    await nextTick()

    // Default state: activePage='home', activeCat='all' → isFullLanding=true
    // The bento grid must NOT be rendered
    expect(wrapper.find('.ds-bento-grid').exists()).toBe(false)

    wrapper.unmount()
  })

  /**
   * **Validates: Requirements 8.1, 8.3**
   *
   * PBT property: across 100 runs, mounting the App in its default state
   * (home + all) consistently produces no bento grid in the DOM.
   *
   * Uses fc.constant(null) as a dummy arbitrary since the state is fixed —
   * we are verifying the deterministic behavior of isFullLanding=true.
   */
  it('bento grid is never present when home+all state is active (100 runs)', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Dummy arbitrary: the "input" is always the same default state
        fc.constant(null),
        async (_) => {
          const wrapper = mountApp()
          await nextTick()

          // activePage='home', activeCat='all' → isFullLanding=true → no bento grid
          const bentoGridExists = wrapper.find('.ds-bento-grid').exists()

          wrapper.unmount()
          return !bentoGridExists
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 8.1, 8.3**
   *
   * Explicit concrete check: mount App, confirm the Editorial Home sections
   * render (HomeQuickNavSection area visible) while bento grid is absent.
   *
   * The Quick Nav section has role="button" elements for the 3 nav cards.
   */
  it('editorial home sections render (nav cards present) when home+all state is active', async () => {
    const wrapper = mountApp()
    await nextTick()

    // Bento grid absent
    expect(wrapper.find('.ds-bento-grid').exists()).toBe(false)

    // Editorial home renders the quick nav cards (role=button from HomeQuickNavSection)
    const navCards = wrapper.findAll('[role="button"]')
    expect(navCards.length).toBeGreaterThanOrEqual(3)

    wrapper.unmount()
  })

  /**
   * **Validates: Requirements 8.3**
   *
   * After navigating away from home+all (e.g. clicking docs) and back to all,
   * the bento grid must still be absent — isFullLanding is restored.
   *
   * This verifies the reactivity of the Editorial Home condition.
   */
  it('bento grid remains absent after navigating away and returning to home+all', async () => {
    const wrapper = mountApp()
    await nextTick()

    // Initially no bento grid
    expect(wrapper.find('.ds-bento-grid').exists()).toBe(false)

    // Navigate to docs by clicking the docs nav button
    const navButtons = wrapper.findAll('.pg-nav-btn')
    const docsButton = navButtons.find((btn) => btn.text().toLowerCase().includes('docs'))
    if (docsButton) {
      await docsButton.trigger('click')
      await nextTick()
    }

    // Navigate back to 'all' by clicking the 'all' nav button
    const allButton = navButtons.find((btn) => btn.text().toLowerCase().includes('all'))
    if (allButton) {
      await allButton.trigger('click')
      await nextTick()
    }

    // Bento grid must still be absent (Editorial Home should be visible again)
    expect(wrapper.find('.ds-bento-grid').exists()).toBe(false)

    wrapper.unmount()
  })
})
