/**
 * Tests — Design System UI Improvements (Task 11)
 *
 * Properties 1, 2, 3, 7, 8 and unit tests for template smoke checks.
 *
 * Property 1 — FlagGroupDemo snippet reflects isDismissible (Req 2.x)
 * Property 2 — All icons rendered in Iconography tab (Req 3.x)
 * Property 3 — Clicking icon copies correct snippet (Req 3.x)
 * Property 7 — Button/Flag/SectionMessage descriptions don't contain "appearance" as prop (Req 5.x)
 * Property 8 — Showcase selection renders correct preview (Req 7.x)
 *
 * Note: Properties 4, 5, 6 are implemented in PlaygroundLocaleSelect.spec.ts
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import * as fc from 'fast-check'

import { providePlaygroundLocale } from '../playground/composables/usePlaygroundLocale'
import FlagGroupDemo from '../playground/demos/FlagGroupDemo.vue'
import FoundationsPage from '../playground/views/FoundationsPage.vue'
import ComponentsCatalogPage from '../playground/views/ComponentsCatalogPage.vue'
import ChatPreviewCard from '../playground/cards/ChatPreviewCard.vue'
import ComponentApiReference from '../playground/components/ComponentApiReference.vue'
import { iconography } from '../src/icons/iconography'
import { showcaseDemoComponents } from '../playground/designSystemMeta'
import { en, ptBR } from '../playground/i18n'
import {
  componentCatalogDescriptionsEn,
  componentCatalogDescriptionsPtBR,
} from '../playground/i18n/componentCatalogDescriptions'

// ─── Mounting helpers ──────────────────────────────────────────────────────────

const LocaleShell = defineComponent({
  setup(_, { slots }) {
    providePlaygroundLocale()
    return () => slots.default?.()
  },
})

function mountWithLocale(component: Parameters<typeof mount>[0], props?: Record<string, unknown>) {
  return mount(LocaleShell, {
    slots: { default: () => h(component as Parameters<typeof h>[0], props ?? {}) },
    attachTo: document.body,
  })
}

// ─── Cleanup ──────────────────────────────────────────────────────────────────

afterEach(() => {
  vi.restoreAllMocks()
  document.querySelectorAll('[data-v-app]').forEach((el) => el.remove())
})

// ─── Property 1: FlagGroupDemo snippet reflects isDismissible ─────────────────

describe('Property 1 — FlagGroupDemo snippet reflects isDismissible', () => {
  /**
   * **Validates: Requirements 2.x**
   *
   * For any boolean value of isDismissible, the computed `code` string
   * must include ':is-dismissible="true"' if and only if isDismissible is true.
   */
  it('code snippet includes :is-dismissible="true" iff isDismissible is toggled on', async () => {
    await fc.assert(
      fc.asyncProperty(fc.boolean(), async (isDismissible) => {
        const wrapper = mountWithLocale(FlagGroupDemo)
        await nextTick()

        if (isDismissible) {
          // Click the switch to toggle isDismissible to true
          const switchBtn = wrapper.find('button[role="switch"]')
          if (switchBtn.exists()) {
            await switchBtn.trigger('click')
            await nextTick()
          }
        }

        // Use <pre> textContent — UsageBlock renders via v-html with HTML entities;
        // textContent gives the unescaped actual code text.
        const pre = wrapper.find('pre')
        const codeText = pre.exists() ? (pre.element.textContent ?? '') : ''

        if (isDismissible) {
          expect(
            codeText.includes(':is-dismissible="true"'),
            `isDismissible=${isDismissible}: snippet should contain :is-dismissible="true"`,
          ).toBe(true)
        } else {
          expect(
            codeText.includes(':is-dismissible="true"'),
            `isDismissible=${isDismissible}: snippet must NOT contain :is-dismissible="true"`,
          ).toBe(false)
        }

        wrapper.unmount()
      }),
      { numRuns: 4, seed: 42 },
    )
  })

  it('code snippet does not include :is-dismissible when isDismissible defaults to false', async () => {
    const wrapper = mountWithLocale(FlagGroupDemo)
    await nextTick()

    const pre = wrapper.find('pre')
    const codeText = pre.exists() ? (pre.element.textContent ?? '') : ''
    expect(codeText).not.toContain(':is-dismissible="true"')
    wrapper.unmount()
  })

  it('code snippet includes :is-dismissible="true" after toggling the switch', async () => {
    const wrapper = mountWithLocale(FlagGroupDemo)
    await nextTick()

    const switchBtn = wrapper.find('button[role="switch"]')
    expect(switchBtn.exists()).toBe(true)
    await switchBtn.trigger('click')
    await nextTick()

    // UsageBlock renders code via v-html with HTML entities; use textContent on the <pre>
    // element to get the unescaped code text.
    const pre = wrapper.find('pre')
    expect(pre.exists(), '<pre> element should exist in UsageBlock').toBe(true)
    const codeText = pre.element.textContent ?? ''
    expect(codeText).toContain(':is-dismissible="true"')
    wrapper.unmount()
  })
})

// ─── Property 2: All icons rendered in Iconography tab ───────────────────────

describe('Property 2 — All icons rendered in Iconography tab', () => {
  /**
   * **Validates: Requirements 3.x**
   *
   * After navigating to the Iconography tab, every icon item from the
   * iconography catalog must have a corresponding button in the DOM.
   */
  it('renders a button for every icon item in the iconography list', async () => {
    const wrapper = mountWithLocale(FoundationsPage)
    await nextTick()

    // Navigate to the Iconography tab
    const tabButtons = wrapper.findAll('button[role="tab"]')
    const iconographyTab = tabButtons.find((btn) =>
      btn.text().toLowerCase().includes('iconography'),
    )
    expect(iconographyTab, 'Iconography tab button should exist').toBeDefined()
    await iconographyTab!.trigger('click')
    await nextTick()

    // Find all icon buttons in the grid
    const allButtons = wrapper.findAll('button[type="button"]')
    // Filter to icon grid buttons (they have a span child with truncate text-[7px])
    const iconButtons = allButtons.filter((btn) => btn.find('span.truncate').exists())

    // Every icon in the full iconography list must have a button
    // (the search filter is empty so all icons should show)
    for (const iconItem of iconography) {
      const found = iconButtons.some((btn) => {
        const span = btn.find('span.truncate')
        return span.exists() && span.text() === iconItem.label
      })
      expect(found, `Button for icon "${iconItem.label}" should be in the DOM`).toBe(true)
    }

    wrapper.unmount()
  })

  it('fc.constantFrom(iconography) — each icon item has a button in iconography tab', async () => {
    const wrapper = mountWithLocale(FoundationsPage)
    await nextTick()

    // Navigate to Iconography tab
    const tabButtons = wrapper.findAll('button[role="tab"]')
    const iconographyTab = tabButtons.find((btn) =>
      btn.text().toLowerCase().includes('iconography'),
    )
    await iconographyTab!.trigger('click')
    await nextTick()

    const iconButtons = wrapper.findAll('button[type="button"]').filter((btn) =>
      btn.find('span.truncate').exists(),
    )

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...iconography),
        async (iconItem) => {
          const found = iconButtons.some((btn) => {
            const span = btn.find('span.truncate')
            return span.exists() && span.text() === iconItem.label
          })
          expect(found, `Icon "${iconItem.label}" should have a button`).toBe(true)
        },
      ),
      { numRuns: 50, seed: 42 },
    )

    wrapper.unmount()
  })
})

// ─── Property 3: Clicking icon copies correct snippet ────────────────────────

describe('Property 3 — Clicking icon copies correct snippet', () => {
  /**
   * **Validates: Requirements 3.x**
   *
   * For any icon in the iconography list, clicking its button calls
   * navigator.clipboard.writeText with '<LabelWithoutSpaces />'
   */
  beforeEach(() => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    })
  })

  it('clicking any icon button copies the correct JSX snippet to clipboard', async () => {
    const wrapper = mountWithLocale(FoundationsPage)
    await nextTick()

    // Navigate to Iconography tab
    const tabButtons = wrapper.findAll('button[role="tab"]')
    const iconographyTab = tabButtons.find((btn) =>
      btn.text().toLowerCase().includes('iconography'),
    )
    await iconographyTab!.trigger('click')
    await nextTick()

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...iconography.slice(0, 20)), // sample first 20 for perf
        async (iconItem) => {
          const writeText = vi.fn().mockResolvedValue(undefined)
          Object.defineProperty(navigator, 'clipboard', {
            value: { writeText },
            writable: true,
            configurable: true,
          })

          const iconButtons = wrapper.findAll('button[type="button"]').filter((btn) =>
            btn.find('span.truncate').exists(),
          )

          const btn = iconButtons.find((b) => {
            const span = b.find('span.truncate')
            return span.exists() && span.text() === iconItem.label
          })

          if (btn) {
            await btn.trigger('click')
            await nextTick()

            const expected = `<${iconItem.label.replace(/\s+/g, '')} />`
            expect(writeText).toHaveBeenCalledWith(expected)
          }
        },
      ),
      { numRuns: 10, seed: 42 },
    )

    wrapper.unmount()
  })

  it('copies <Accessibility /> when Accessibility icon is clicked', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    })

    const wrapper = mountWithLocale(FoundationsPage)
    await nextTick()

    // Navigate to Iconography tab
    const tabButtons = wrapper.findAll('button[role="tab"]')
    const iconographyTab = tabButtons.find((btn) =>
      btn.text().toLowerCase().includes('iconography'),
    )
    await iconographyTab!.trigger('click')
    await nextTick()

    const iconButtons = wrapper.findAll('button[type="button"]').filter((btn) =>
      btn.find('span.truncate').exists(),
    )
    const accessibilityBtn = iconButtons.find((btn) => {
      const span = btn.find('span.truncate')
      return span.exists() && span.text() === 'Accessibility'
    })
    expect(accessibilityBtn, 'Accessibility icon button must exist').toBeDefined()

    await accessibilityBtn!.trigger('click')
    await nextTick()

    expect(writeText).toHaveBeenCalledWith('<Accessibility />')
    wrapper.unmount()
  })

  it('copies multi-word label without spaces (e.g. <AirVent />) for "Air Vent"', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    })

    const wrapper = mountWithLocale(FoundationsPage)
    await nextTick()

    const tabButtons = wrapper.findAll('button[role="tab"]')
    const iconographyTab = tabButtons.find((btn) =>
      btn.text().toLowerCase().includes('iconography'),
    )
    await iconographyTab!.trigger('click')
    await nextTick()

    const iconButtons = wrapper.findAll('button[type="button"]').filter((btn) =>
      btn.find('span.truncate').exists(),
    )
    const airVentBtn = iconButtons.find((btn) => {
      const span = btn.find('span.truncate')
      return span.exists() && span.text() === 'Air Vent'
    })
    expect(airVentBtn, 'Air Vent icon button must exist').toBeDefined()

    await airVentBtn!.trigger('click')
    await nextTick()

    expect(writeText).toHaveBeenCalledWith('<AirVent />')
    wrapper.unmount()
  })
})

// ─── Property 7: Button/Flag/SectionMessage descriptions don't use "appearance" as prop ──

describe('Property 7 — Button/Flag/SectionMessage descriptions do not use "appearance" as a prop name', () => {
  /**
   * **Validates: Requirements 5.x**
   *
   * For each of Button, Flag, SectionMessage, none of the following
   * description sources should contain the forbidden appearance-as-prop patterns:
   *   - ":appearance"
   *   - "appearance prop"
   *   - "use appearance"
   */

  const FORBIDDEN_PATTERNS = [
    /:appearance/i,
    /appearance\s+prop/i,
    /use\s+appearance/i,
  ]

  function checkNoAppearanceAsProp(description: string, context: string): void {
    for (const pattern of FORBIDDEN_PATTERNS) {
      expect(
        pattern.test(description),
        `${context} — description must not match "${pattern}" (found in: "${description}")`,
      ).toBe(false)
    }
  }

  it('fc.constantFrom — no appearance-as-prop in en/ptBR descriptions for Button, Flag, SectionMessage', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('Button' as const, 'Flag' as const, 'SectionMessage' as const),
        (name) => {
          // Check all four description sources
          const enDrawer = (en.drawer.descriptions as Record<string, string>)[name] ?? ''
          const ptBRDrawer = (ptBR.drawer.descriptions as Record<string, string>)[name] ?? ''
          const enCatalog = componentCatalogDescriptionsEn[name] ?? ''
          const ptBRCatalog = componentCatalogDescriptionsPtBR[name] ?? ''

          checkNoAppearanceAsProp(enDrawer, `en.drawer.descriptions.${name}`)
          checkNoAppearanceAsProp(ptBRDrawer, `ptBR.drawer.descriptions.${name}`)
          checkNoAppearanceAsProp(enCatalog, `componentCatalogDescriptionsEn.${name}`)
          checkNoAppearanceAsProp(ptBRCatalog, `componentCatalogDescriptionsPtBR.${name}`)
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  it('Button en.drawer.descriptions does not contain appearance as prop', () => {
    const desc = (en.drawer.descriptions as Record<string, string>)['Button'] ?? ''
    checkNoAppearanceAsProp(desc, 'en.drawer.descriptions.Button')
  })

  it('Flag en.drawer.descriptions does not contain appearance as prop', () => {
    const desc = (en.drawer.descriptions as Record<string, string>)['Flag'] ?? ''
    checkNoAppearanceAsProp(desc, 'en.drawer.descriptions.Flag')
  })

  it('SectionMessage en.drawer.descriptions exists (not in drawer.descriptions — only in componentCatalog)', () => {
    // SectionMessage may not be in drawer.descriptions — verify componentCatalog descriptions
    const desc = componentCatalogDescriptionsEn['SectionMessage'] ?? ''
    checkNoAppearanceAsProp(desc, 'componentCatalogDescriptionsEn.SectionMessage')
  })

  it('componentCatalogDescriptionsEn.Button does not contain appearance as prop', () => {
    const desc = componentCatalogDescriptionsEn['Button'] ?? ''
    checkNoAppearanceAsProp(desc, 'componentCatalogDescriptionsEn.Button')
  })

  it('componentCatalogDescriptionsPtBR.Button does not contain appearance as prop', () => {
    const desc = componentCatalogDescriptionsPtBR['Button'] ?? ''
    checkNoAppearanceAsProp(desc, 'componentCatalogDescriptionsPtBR.Button')
  })
})

// ─── Property 8: Showcase selection renders correct preview ──────────────────

describe('Property 8 — Showcase selection renders correct preview', () => {
  /**
   * **Validates: Requirements 7.x**
   *
   * For each showcase component name (currently ['AI Chat']),
   * clicking its nav button should:
   *   - Render ChatPreviewCard (or showcase content)
   *   - NOT render ComponentApiReference
   */
  it('fc.constantFrom(showcaseDemoComponents) — clicking showcase nav renders preview, not API reference', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...showcaseDemoComponents),
        async (showcaseName) => {
          const wrapper = mountWithLocale(ComponentsCatalogPage)
          await nextTick()

          // Find and click the showcase nav button
          const navButtons = wrapper.findAll('button[type="button"]')
          const showcaseBtn = navButtons.find((btn) => btn.text().trim() === showcaseName)
          expect(showcaseBtn, `Nav button for "${showcaseName}" must exist`).toBeDefined()

          await showcaseBtn!.trigger('click')
          await nextTick()

          // ChatPreviewCard should be rendered
          const chatPreview = wrapper.findComponent(ChatPreviewCard)
          expect(chatPreview.exists(), `ChatPreviewCard should be rendered for "${showcaseName}"`).toBe(true)

          // ComponentApiReference should NOT be rendered
          const apiRef = wrapper.findComponent(ComponentApiReference)
          expect(apiRef.exists(), `ComponentApiReference should NOT be rendered for showcase "${showcaseName}"`).toBe(false)

          wrapper.unmount()
        },
      ),
      { numRuns: 10, seed: 42 },
    )
  })

  it('selecting AI Chat renders ChatPreviewCard and hides ComponentApiReference', async () => {
    const wrapper = mountWithLocale(ComponentsCatalogPage)
    await nextTick()

    const navButtons = wrapper.findAll('button[type="button"]')
    const aiChatBtn = navButtons.find((btn) => btn.text().trim() === 'AI Chat')
    expect(aiChatBtn, 'AI Chat button should be in the nav').toBeDefined()

    await aiChatBtn!.trigger('click')
    await nextTick()

    expect(wrapper.findComponent(ChatPreviewCard).exists()).toBe(true)
    expect(wrapper.findComponent(ComponentApiReference).exists()).toBe(false)

    wrapper.unmount()
  })

  it('selecting a regular component (Button) renders ComponentApiReference and not ChatPreviewCard', async () => {
    const wrapper = mountWithLocale(ComponentsCatalogPage)
    await nextTick()

    // Click Button in the nav
    const navButtons = wrapper.findAll('button[type="button"]')
    const buttonBtn = navButtons.find((btn) => btn.text().trim() === 'Button')
    expect(buttonBtn, 'Button nav item should exist').toBeDefined()

    await buttonBtn!.trigger('click')
    await nextTick()

    expect(wrapper.findComponent(ComponentApiReference).exists()).toBe(true)
    expect(wrapper.findComponent(ChatPreviewCard).exists()).toBe(false)

    wrapper.unmount()
  })
})
