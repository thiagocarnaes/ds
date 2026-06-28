/**
 * Unit Tests — HomeQuickNavSection navigation events
 *
 * Verifies that clicking each card emits the `navigate` event with the
 * correct category payload (Requirements 2.3, 2.4, 2.5).
 */

import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import HomeQuickNavSection from '../playground/components/HomeQuickNavSection.vue'
import {
  providePlaygroundLocale,
  type PlaygroundLocaleContext,
} from '../playground/composables/usePlaygroundLocale'

// ─── Mounting helpers ──────────────────────────────────────────────────────────

function createLocaleWrapper() {
  let ctx: PlaygroundLocaleContext | null = null

  const Wrapper = defineComponent({
    setup(_, { slots }) {
      ctx = providePlaygroundLocale()
      ctx.setLocale('en')
      return () => slots.default?.()
    },
  })

  return { Wrapper, getCtx: () => ctx }
}

function mountQuickNav() {
  const { Wrapper } = createLocaleWrapper()

  const wrapper = mount(Wrapper, {
    slots: {
      default: () => h(HomeQuickNavSection),
    },
    attachTo: document.body,
  })

  return wrapper
}

// ─── Cleanup ──────────────────────────────────────────────────────────────────

afterEach(() => {
  document.querySelectorAll('[data-v-app]').forEach((el) => el.remove())
})

// ─── Unit Tests: Navigation Events ────────────────────────────────────────────

describe('HomeQuickNavSection — navigation events', () => {
  /**
   * Requirement 2.3
   * Clicking the "Foundations" card (index 0) must emit `navigate` with `'foundations'`.
   */
  it('emits navigate with "foundations" when Foundations card is clicked', async () => {
    const wrapper = mountQuickNav()
    await nextTick()

    const cards = wrapper.findAll('[role="button"]')
    expect(cards.length).toBe(3)

    // The Foundations card is the first card (id="foundations")
    const foundationsCard = cards[0]
    await foundationsCard.trigger('click')

    const quickNav = wrapper.findComponent(HomeQuickNavSection)
    const emitted = quickNav.emitted('navigate')
    expect(emitted).toBeTruthy()
    expect(emitted![emitted!.length - 1]).toEqual(['foundations'])

    wrapper.unmount()
  })

  /**
   * Requirement 2.4
   * Clicking the "Components" card (index 1) must emit `navigate` with `'catalog'`.
   */
  it('emits navigate with "catalog" when Components card is clicked', async () => {
    const wrapper = mountQuickNav()
    await nextTick()

    const cards = wrapper.findAll('[role="button"]')
    expect(cards.length).toBe(3)

    // The Components card is the second card (id="catalog")
    const componentsCard = cards[1]
    await componentsCard.trigger('click')

    const quickNav = wrapper.findComponent(HomeQuickNavSection)
    const emitted = quickNav.emitted('navigate')
    expect(emitted).toBeTruthy()
    expect(emitted![emitted!.length - 1]).toEqual(['catalog'])

    wrapper.unmount()
  })

  /**
   * Requirement 2.5
   * Clicking the "Docs" card (index 2) must emit `navigate` with `'docs'`.
   */
  it('emits navigate with "docs" when Docs card is clicked', async () => {
    const wrapper = mountQuickNav()
    await nextTick()

    const cards = wrapper.findAll('[role="button"]')
    expect(cards.length).toBe(3)

    // The Docs card is the third card (id="docs")
    const docsCard = cards[2]
    await docsCard.trigger('click')

    const quickNav = wrapper.findComponent(HomeQuickNavSection)
    const emitted = quickNav.emitted('navigate')
    expect(emitted).toBeTruthy()
    expect(emitted![emitted!.length - 1]).toEqual(['docs'])

    wrapper.unmount()
  })

  /**
   * Requirements 2.3, 2.4, 2.5
   * Clicking all 3 cards in sequence emits the correct payload for each.
   */
  it('emits the correct navigate payload for each card in sequence', async () => {
    const wrapper = mountQuickNav()
    await nextTick()

    const cards = wrapper.findAll('[role="button"]')
    expect(cards.length).toBe(3)

    await cards[0].trigger('click')
    await cards[1].trigger('click')
    await cards[2].trigger('click')

    const quickNav = wrapper.findComponent(HomeQuickNavSection)
    const emitted = quickNav.emitted('navigate')

    expect(emitted).toHaveLength(3)
    expect(emitted![0]).toEqual(['foundations'])
    expect(emitted![1]).toEqual(['catalog'])
    expect(emitted![2]).toEqual(['docs'])

    wrapper.unmount()
  })

  /**
   * Requirements 2.3, 2.4, 2.5
   * Keyboard navigation: pressing Enter on each card triggers the same navigate emit.
   */
  it('emits navigate with correct payload when Enter is pressed on each card', async () => {
    const wrapper = mountQuickNav()
    await nextTick()

    const cards = wrapper.findAll('[role="button"]')
    expect(cards.length).toBe(3)

    const expectedPayloads = ['foundations', 'catalog', 'docs'] as const

    for (let i = 0; i < cards.length; i++) {
      await cards[i].trigger('keydown', { key: 'Enter' })
    }

    const quickNav = wrapper.findComponent(HomeQuickNavSection)
    const emitted = quickNav.emitted('navigate')

    expect(emitted).toHaveLength(3)
    for (let i = 0; i < 3; i++) {
      expect(emitted![i]).toEqual([expectedPayloads[i]])
    }

    wrapper.unmount()
  })
})
