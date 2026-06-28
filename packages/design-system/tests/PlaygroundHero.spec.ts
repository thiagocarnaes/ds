/**
 * Unit Tests — PlaygroundHero (modified for editorial layout)
 *
 * Requirements 1.2, 1.3, 1.4, 6.1, 6.2
 *
 * 1.2 — Hero SHALL include CTA "browseComponents" that navigates to Library/Components.
 * 1.3 — Hero SHALL include CTA "installDocs" that navigates to Docs.
 * 1.4 — Hero SHALL display the version badge using designSystemVersionBadge.
 * 6.1 — Stats_Bar SHALL display exactly 4 metrics (3 StatPills + 1 version div).
 * 6.2 — Stats_Bar SHALL use StatPill component for numeric metrics.
 */

import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import PlaygroundHero from '../playground/components/PlaygroundHero.vue'
import StatPill from '../playground/components/StatPill.vue'
import {
  providePlaygroundLocale,
} from '../playground/composables/usePlaygroundLocale'
import { designSystemVersionBadge } from '../playground/designSystemMeta'

// ─── Mounting helpers ──────────────────────────────────────────────────────────

function createLocaleWrapper() {
  const Wrapper = defineComponent({
    setup(_, { slots }) {
      const ctx = providePlaygroundLocale()
      ctx.setLocale('en')
      return () => slots.default?.()
    },
  })
  return Wrapper
}

function mountHero(props: { fullLanding?: boolean } = {}) {
  const Wrapper = createLocaleWrapper()
  const wrapper = mount(Wrapper, {
    slots: {
      default: () => h(PlaygroundHero, props),
    },
    attachTo: document.body,
  })
  return wrapper
}

// ─── Cleanup ──────────────────────────────────────────────────────────────────

afterEach(() => {
  document.querySelectorAll('[data-v-app]').forEach((el) => el.remove())
})

// ─── Tests: No pillar cards ────────────────────────────────────────────────────

describe('PlaygroundHero — no pillar cards (Requirement 1.8, 8.4)', () => {
  /**
   * After the editorial revamp, the pillar cards grid has been removed.
   * Common class names for pillars: .pillar-card, .pillar, ds-pillar, hero-pillar.
   * Verify none are present.
   */
  it('does not render pillar cards in the DOM', async () => {
    const wrapper = mountHero({ fullLanding: true })
    await nextTick()

    // Pillar cards were rendered as divs with class matching 'pillar'
    expect(wrapper.find('.pillar-card').exists()).toBe(false)
    expect(wrapper.find('.pillar').exists()).toBe(false)
    expect(wrapper.find('[class*="pillar"]').exists()).toBe(false)

    wrapper.unmount()
  })
})

// ─── Tests: 4 StatPills when fullLanding=true ──────────────────────────────────

describe('PlaygroundHero — Stats_Bar with 4 stat elements (Requirement 6.1, 6.2)', () => {
  /**
   * Requirement 6.1
   * When fullLanding=true, the Stats_Bar must contain exactly 4 metrics:
   *   - 3 StatPill components (components, coverage, demos)
   *   - 1 version div (static string, no animation)
   */
  it('renders 3 StatPill components when fullLanding=true', async () => {
    const wrapper = mountHero({ fullLanding: true })
    await nextTick()

    const hero = wrapper.findComponent(PlaygroundHero)
    const statPills = hero.findAllComponents(StatPill)
    expect(statPills).toHaveLength(3)

    wrapper.unmount()
  })

  /**
   * Requirement 6.1
   * The Stats_Bar div itself (4th metric — version) must also be present,
   * making a total of 4 stat items in the stats bar.
   * 3 StatPill components + 1 version div = 4 total.
   */
  it('renders 4 total stat items in the stats bar when fullLanding=true', async () => {
    const wrapper = mountHero({ fullLanding: true })
    await nextTick()

    const hero = wrapper.findComponent(PlaygroundHero)

    // 3 StatPill components confirmed in previous test
    const statPills = hero.findAllComponents(StatPill)
    expect(statPills).toHaveLength(3)

    // Plus 1 version div (not a StatPill — it uses a static string without animation)
    // The version div is inside .pg-border-top but is not a StatPill component
    const statsBar = hero.find('.pg-border-top')
    expect(statsBar.exists()).toBe(true)

    // The version div has font-mono class and contains the version badge (static string, not animated)
    // StatPills animate from 0, so the version span is the only one containing 'v' prefix
    const allMonoSpans = statsBar.findAll('.font-mono.text-2xl.font-bold')
    const versionSpan = allMonoSpans.find((s) => s.text().startsWith('v'))
    expect(versionSpan).toBeDefined()
    expect(versionSpan!.text()).toContain(designSystemVersionBadge)

    wrapper.unmount()
  })

  /**
   * Requirement 6.2
   * StatPill is used for numeric metrics (not for the version).
   */
  it('uses StatPill components for the numeric metrics', async () => {
    const wrapper = mountHero({ fullLanding: true })
    await nextTick()

    const hero = wrapper.findComponent(PlaygroundHero)
    const statPills = hero.findAllComponents(StatPill)

    // Each StatPill must exist and have a target prop (numeric)
    for (const pill of statPills) {
      expect(typeof pill.props('target')).toBe('number')
    }

    wrapper.unmount()
  })
})

// ─── Tests: Version badge ──────────────────────────────────────────────────────

describe('PlaygroundHero — version badge (Requirement 1.4)', () => {
  /**
   * Requirement 1.4
   * The hero must display the current version badge string from designSystemVersionBadge.
   */
  it('displays the version badge string in the rendered DOM', async () => {
    const wrapper = mountHero({ fullLanding: true })
    await nextTick()

    expect(wrapper.text()).toContain(designSystemVersionBadge)

    wrapper.unmount()
  })

  /**
   * Requirement 1.4
   * The version badge is present even when fullLanding=false.
   */
  it('displays the version badge when fullLanding is false', async () => {
    const wrapper = mountHero({ fullLanding: false })
    await nextTick()

    expect(wrapper.text()).toContain(designSystemVersionBadge)

    wrapper.unmount()
  })
})

// ─── Tests: CTA events ────────────────────────────────────────────────────────

describe('PlaygroundHero — CTA events (Requirements 1.2, 1.3)', () => {
  /**
   * Requirement 1.2
   * Clicking the primary "browseComponents" CTA emits the `browse` event.
   */
  it('emits "browse" when the browseComponents CTA is clicked', async () => {
    const wrapper = mountHero({ fullLanding: true })
    await nextTick()

    const hero = wrapper.findComponent(PlaygroundHero)

    // The primary button is variant="primary" and is the first button
    const buttons = hero.findAll('button')
    const primaryBtn = buttons[0]
    expect(primaryBtn.exists()).toBe(true)

    await primaryBtn.trigger('click')

    const emitted = hero.emitted('browse')
    expect(emitted).toBeTruthy()
    expect(emitted).toHaveLength(1)

    wrapper.unmount()
  })

  /**
   * Requirement 1.3
   * Clicking the "installDocs" outline CTA emits the `docs` event.
   */
  it('emits "docs" when the installDocs CTA is clicked', async () => {
    const wrapper = mountHero({ fullLanding: true })
    await nextTick()

    const hero = wrapper.findComponent(PlaygroundHero)

    // The docs button is the second button (variant="outline", emits 'docs')
    const buttons = hero.findAll('button')
    const docsBtn = buttons[1]
    expect(docsBtn.exists()).toBe(true)

    await docsBtn.trigger('click')

    const emitted = hero.emitted('docs')
    expect(emitted).toBeTruthy()
    expect(emitted).toHaveLength(1)

    wrapper.unmount()
  })

  /**
   * Requirements 1.2, 1.3
   * Clicking browse and docs in sequence emits both events independently.
   */
  it('emits "browse" and "docs" independently when each CTA is clicked', async () => {
    const wrapper = mountHero({ fullLanding: true })
    await nextTick()

    const hero = wrapper.findComponent(PlaygroundHero)
    const buttons = hero.findAll('button')

    await buttons[0].trigger('click') // browse
    await buttons[1].trigger('click') // docs

    expect(hero.emitted('browse')).toHaveLength(1)
    expect(hero.emitted('docs')).toHaveLength(1)

    wrapper.unmount()
  })
})
