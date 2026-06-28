/**
 * Property-Based Tests — Lozenge alias (Property 3)
 *
 * Validates: Requirement 5.2
 * Property: render(appearance='progress') ≡ render(appearance='inprogress')
 *           — both must produce identical classes and inline styles.
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import * as fc from 'fast-check'
import Lozenge from '@/components/data-display/Lozenge.vue'

// ─── Arbitraries ─────────────────────────────────────────────────────────────

/**
 * Boolean arbitrary for the `bold` / `isBold` prop.
 * Including both bold states ensures the alias mapping is consistent
 * regardless of whether the bold visual style is active.
 */
const boldArbitrary = fc.boolean()

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Mount a Lozenge and return the root span's class string and style object.
 * Using `attachTo: document.body` is not required here — happy-dom's
 * computed style is not needed because Lozenge applies inline styles directly.
 */
function renderLozenge(appearance: string, bold: boolean) {
  const wrapper = mount(Lozenge, {
    props: { appearance, bold },
    slots: { default: 'Label' },
  })
  const span = wrapper.find('span')
  return {
    class: span.attributes('class') ?? '',
    style: span.attributes('style') ?? '',
  }
}

// ─── Property 3: Lozenge alias ────────────────────────────────────────────────

describe('Property 3 — Lozenge alias (Requirement 5.2)', () => {
  /**
   * **Validates: Requirements 5.2**
   *
   * For all boolean values of `bold`, the deprecated alias `progress` MUST
   * produce the exact same classes and inline styles as the canonical
   * appearance `inprogress`.
   */
  it('progress alias produces identical classes and styles as inprogress', () => {
    fc.assert(
      fc.property(boldArbitrary, (bold) => {
        const aliased = renderLozenge('progress', bold)
        const canonical = renderLozenge('inprogress', bold)

        expect(
          aliased.class,
          `Expected class to match for bold=${bold}: alias="${aliased.class}" canonical="${canonical.class}"`,
        ).toBe(canonical.class)

        expect(
          aliased.style,
          `Expected style to match for bold=${bold}: alias="${aliased.style}" canonical="${canonical.style}"`,
        ).toBe(canonical.style)
      }),
      { numRuns: 50, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 5.2**
   *
   * Complement: the `danger` alias MUST produce identical output as `removed`,
   * verifying the full alias map behaves consistently.
   */
  it('danger alias produces identical classes and styles as removed', () => {
    fc.assert(
      fc.property(boldArbitrary, (bold) => {
        const aliased = renderLozenge('danger', bold)
        const canonical = renderLozenge('removed', bold)

        expect(
          aliased.class,
          `Expected class to match for bold=${bold}: alias="${aliased.class}" canonical="${canonical.class}"`,
        ).toBe(canonical.class)

        expect(
          aliased.style,
          `Expected style to match for bold=${bold}: alias="${aliased.style}" canonical="${canonical.style}"`,
        ).toBe(canonical.style)
      }),
      { numRuns: 50, seed: 84 },
    )
  })

  // ─── Boundary / example tests ──────────────────────────────────────────────

  /**
   * **Validates: Requirements 5.2**
   *
   * Concrete example: non-bold `progress` matches non-bold `inprogress`.
   */
  it('progress (non-bold) matches inprogress (non-bold) — concrete example', () => {
    const aliased = renderLozenge('progress', false)
    const canonical = renderLozenge('inprogress', false)
    expect(aliased.class).toBe(canonical.class)
    expect(aliased.style).toBe(canonical.style)
  })

  /**
   * **Validates: Requirements 5.2**
   *
   * Concrete example: bold `progress` matches bold `inprogress`.
   */
  it('progress (bold) matches inprogress (bold) — concrete example', () => {
    const aliased = renderLozenge('progress', true)
    const canonical = renderLozenge('inprogress', true)
    expect(aliased.class).toBe(canonical.class)
    expect(aliased.style).toBe(canonical.style)
  })
})
