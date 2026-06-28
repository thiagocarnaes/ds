/**
 * Unit Tests — PlaygroundHero (post-editorial-revamp)
 *
 * Requirements 1.4, 6.1, 6.2
 *
 * 1.4 — Hero SHALL display the version badge using designSystemVersionBadge.
 * 6.1 — Stats_Bar SHALL display exactly 4 metrics (3 StatPills + 1 version div).
 * 6.2 — Stats_Bar SHALL use StatPill component for numeric metrics.
 *
 * NOTE: CTA buttons (browseComponents, installDocs, playground) were removed in
 * task 4 of the UI improvements spec. Tests for CTA events have been replaced
 * with tests verifying CTA absence.
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

// ─── Tests: CTA buttons are absent (task 4 removed them) ─────────────────────

describe('PlaygroundHero — no CTA buttons (task 4 removed CTAs)', () => {
  /**
   * After the editorial revamp in task 4, the CTA buttons (Browse, Docs, Playground)
   * were removed from the hero. Verify no CTA-style buttons are present.
   */
  it('does not render a "Browse components" button', async () => {
    const wrapper = mountHero({ fullLanding: true })
    await nextTick()

    const buttons = wrapper.findAll('button')
    const browseBtn = buttons.find((b) =>
      b.text().toLowerCase().includes('browse'),
    )
    expect(browseBtn).toBeUndefined()
    wrapper.unmount()
  })

  it('does not render an "Install & docs" button', async () => {
    const wrapper = mountHero({ fullLanding: true })
    await nextTick()

    const buttons = wrapper.findAll('button')
    const docsBtn = buttons.find((b) =>
      b.text().toLowerCase().includes('install') || b.text().toLowerCase().includes('docs'),
    )
    expect(docsBtn).toBeUndefined()
    wrapper.unmount()
  })

  it('does not render a "Playground" CTA button', async () => {
    const wrapper = mountHero({ fullLanding: true })
    await nextTick()

    const buttons = wrapper.findAll('button')
    const playgroundBtn = buttons.find((b) =>
      b.text().toLowerCase() === 'playground',
    )
    expect(playgroundBtn).toBeUndefined()
    wrapper.unmount()
  })

  it('does not emit "browse" when no CTA exists', async () => {
    const wrapper = mountHero({ fullLanding: true })
    await nextTick()

    const hero = wrapper.findComponent(PlaygroundHero)
    // No CTA exists, so no 'browse' event should ever be emitted
    expect(hero.emitted('browse')).toBeFalsy()
    wrapper.unmount()
  })

  it('does not emit "docs" when no CTA exists', async () => {
    const wrapper = mountHero({ fullLanding: true })
    await nextTick()

    const hero = wrapper.findComponent(PlaygroundHero)
    expect(hero.emitted('docs')).toBeFalsy()
    wrapper.unmount()
  })
})

// ─── Tests: No pillar cards ────────────────────────────────────────────────────

describe('PlaygroundHero — no pillar cards (Requirement 1.8, 8.4)', () => {
  /**
   * After the editorial revamp, the pillar cards grid has been removed.
   * Verify none are present.
   */
  it('does not render pillar cards in the DOM', async () => {
    const wrapper = mountHero({ fullLanding: true })
    await nextTick()

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
   * The Stats_Bar div (4th metric — version) must also be present,
   * making a total of 4 stat items in the stats bar.
   */
  it('renders 4 total stat items in the stats bar when fullLanding=true', async () => {
    const wrapper = mountHero({ fullLanding: true })
    await nextTick()

    const hero = wrapper.findComponent(PlaygroundHero)

    // 3 StatPill components
    const statPills = hero.findAllComponents(StatPill)
    expect(statPills).toHaveLength(3)

    // Plus 1 version div with font-mono and the version badge string
    const statsBar = hero.find('.pg-border-top')
    expect(statsBar.exists()).toBe(true)

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
   * The version badge is present even when fullLanding=false (stats bar is still rendered,
   * just hidden via CSS — but the DOM is still present).
   */
  it('version div exists in DOM even when fullLanding=false', async () => {
    const wrapper = mountHero({ fullLanding: false })
    await nextTick()

    const hero = wrapper.findComponent(PlaygroundHero)
    const statsBar = hero.find('.pg-border-top')
    expect(statsBar.exists()).toBe(true)

    wrapper.unmount()
  })
})

// ─── Tests: Heading and subtitle ─────────────────────────────────────────────

describe('PlaygroundHero — heading and subtitle content', () => {
  it('renders the h1 title from t("hero.titleLine1") and t("hero.titleLine2")', async () => {
    const wrapper = mountHero({ fullLanding: true })
    await nextTick()

    const h1 = wrapper.find('h1')
    expect(h1.exists()).toBe(true)
    // en locale: "One system." and "Every team."
    expect(h1.text()).toContain('One system.')
    expect(h1.text()).toContain('Every team.')

    wrapper.unmount()
  })

  it('renders the subtitle paragraph', async () => {
    const wrapper = mountHero({ fullLanding: true })
    await nextTick()

    const subtitle = wrapper.find('p.pg-text-subtle')
    expect(subtitle.exists()).toBe(true)
    expect(subtitle.text().length).toBeGreaterThan(10)

    wrapper.unmount()
  })
})
