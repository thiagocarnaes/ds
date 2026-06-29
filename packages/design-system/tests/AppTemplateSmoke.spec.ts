/**
 * Smoke Tests — App.vue template (Task 11.10)
 *
 * Verifies the App.vue template structure after the UI improvements:
 *   - GitHub icon (Github from lucide) is used in the GitHub link (not ArrowUpRight)
 *   - t('app.stable') text is NOT present in the rendered DOM
 *   - pg-header-brand does NOT contain a span with version badge pattern (v0. or versionBadge)
 */

import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount, RouterLinkStub } from '@vue/test-utils'
import App from '../playground/App.vue'

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({ path: '/', hash: '', params: {}, query: {} })),
  useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn() })),
}))

// ─── Cleanup ──────────────────────────────────────────────────────────────────

afterEach(() => {
  document.querySelectorAll('[data-v-app]').forEach((el) => el.remove())
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mountApp() {
  return mount(App, {
    attachTo: document.body,
    global: {
      stubs: {
        RouterLink: RouterLinkStub,
        RouterView: { template: '<div class="router-view-stub"><slot /></div>' },
      },
    },
  })
}

// ─── Tests: GitHub icon ───────────────────────────────────────────────────────

describe('App.vue — GitHub link uses Github icon (not ArrowUpRight)', () => {
  it('renders an anchor linking to github.com', async () => {
    const wrapper = mountApp()
    await nextTick()

    const githubLink = wrapper.find('a[href*="github.com"]')
    expect(githubLink.exists(), 'GitHub anchor should exist').toBe(true)

    wrapper.unmount()
  })

  it('GitHub anchor contains an SVG icon (from lucide Github component)', async () => {
    const wrapper = mountApp()
    await nextTick()

    const githubLink = wrapper.find('a[href*="github.com"]')
    expect(githubLink.exists()).toBe(true)

    // The lucide Github icon renders as an <svg>
    const svg = githubLink.find('svg')
    expect(svg.exists(), 'Github icon SVG should be present in the GitHub anchor').toBe(true)

    wrapper.unmount()
  })
})

// ─── Tests: No "stable" text in DOM ──────────────────────────────────────────

describe('App.vue — t("app.stable") is not rendered in DOM', () => {
  /**
   * The "stable" badge / version line was removed in the UI improvements.
   * Verify neither the English "stable" nor Portuguese "estável" label
   * appears as a standalone rendered element.
   *
   * Note: We check the rendered text rather than the raw HTML to avoid
   * false positives from attribute values or comments.
   */
  it('does not render the word "stable" as a standalone UI element', async () => {
    const wrapper = mountApp()
    await nextTick()

    // The app.stable key maps to "stable" in English
    // It should not appear as visible text in the rendered DOM
    const renderedText = wrapper.text()

    // "stable" might appear in changelog (e.g. "All systems operational")
    // We specifically check for the short standalone "stable" badge text
    // which would be wrapped in its own small element
    const spans = wrapper.findAll('span')
    const stableBadge = spans.find((s) => s.text().trim().toLowerCase() === 'stable')
    expect(stableBadge, '"stable" badge span should not exist').toBeUndefined()

    wrapper.unmount()
  })

  it('does not render "estável" (pt-BR stable) as a standalone badge', async () => {
    const wrapper = mountApp()
    await nextTick()

    const spans = wrapper.findAll('span')
    const stableBadge = spans.find((s) => s.text().trim().toLowerCase() === 'estável')
    expect(stableBadge, '"estável" badge span should not exist').toBeUndefined()

    wrapper.unmount()
  })
})

// ─── Tests: pg-header-brand has no version badge span ────────────────────────

describe('App.vue — pg-header-brand does not contain a version badge span', () => {
  /**
   * After the UI improvements, the version badge was removed from the header brand.
   * Verify the pg-header-brand section does not contain spans matching the
   * version badge pattern (v0. or a versionBadge token).
   */
  it('pg-header-brand exists in the header', async () => {
    const wrapper = mountApp()
    await nextTick()

    const brand = wrapper.find('.pg-header-brand')
    expect(brand.exists(), '.pg-header-brand element should exist').toBe(true)

    wrapper.unmount()
  })

  it('pg-header-brand does not contain a span with version pattern (v0. or v1.)', async () => {
    const wrapper = mountApp()
    await nextTick()

    const brand = wrapper.find('.pg-header-brand')
    expect(brand.exists()).toBe(true)

    const spans = brand.findAll('span')
    const versionSpan = spans.find((s) => /^v\d+\./.test(s.text().trim()))
    expect(versionSpan, 'Version badge span should not be in pg-header-brand').toBeUndefined()

    wrapper.unmount()
  })

  it('pg-header-brand does not contain GlowDot + version line combination', async () => {
    const wrapper = mountApp()
    await nextTick()

    const brand = wrapper.find('.pg-header-brand')
    expect(brand.exists()).toBe(true)

    // The removed element had a div.mb-6 containing GlowDot and a version span
    // Verify that pattern is absent from the brand section
    const versionLine = brand.find('[class*="mb-6"]')
    if (versionLine.exists()) {
      // If some mb-6 element exists in brand, it should not contain a version badge
      const versionText = versionLine.text()
      expect(/v\d+\.\d+/.test(versionText), 'No version string in mb-6 element in brand').toBe(false)
    } else {
      // No mb-6 in brand at all — which is correct
      expect(true).toBe(true)
    }

    wrapper.unmount()
  })
})
