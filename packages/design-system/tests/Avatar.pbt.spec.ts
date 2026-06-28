/**
 * Property-Based Tests — Avatar fallback (Property 9)
 *
 * Validates: Requirement 3.6
 * Property: For any `src` value, when the image triggers an error event,
 *           the initials derived from `name` MUST be visible and the `<img>`
 *           element MUST be hidden.
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import * as fc from 'fast-check'
import Avatar from '@/components/data-display/Avatar.vue'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Compute expected initials the same way the component does. */
function expectedInitials(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return '?'
  return trimmed
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

// ─── Arbitraries ─────────────────────────────────────────────────────────────

/**
 * Generates a non-empty URL-like string for the `src` prop.
 * The image will never actually load in happy-dom, so any URL string is valid.
 */
const srcArbitrary = fc
  .string({ minLength: 1, maxLength: 120 })
  .filter((s) => s.trim().length > 0)

/**
 * Generates full names consisting of 1 or 2 words with at least one
 * alphabetic character each — mirrors realistic avatar `name` values.
 */
const nameArbitrary = fc
  .array(
    fc.stringMatching(/^[A-Za-z][A-Za-z'-]{0,19}$/),
    { minLength: 1, maxLength: 2 },
  )
  .map((parts) => parts.join(' '))

// ─── Property 9: Avatar fallback ─────────────────────────────────────────────

describe('Property 9 — Avatar fallback (Requirement 3.6)', () => {
  /**
   * **Validates: Requirements 3.6**
   *
   * For any (name, src) pair, after the <img> fires an error event:
   *   1. The <img> element MUST NOT exist in the DOM (hidden).
   *   2. The initials span MUST exist and MUST show the correct initials.
   */
  it('hides img and shows initials for any src after image error', async () => {
    await fc.assert(
      fc.asyncProperty(nameArbitrary, srcArbitrary, async (name, src) => {
        const wrapper = mount(Avatar, {
          props: { name, src },
        })

        // ── Pre-condition: img is rendered before any error ──────────────────
        expect(
          wrapper.find('img').exists(),
          `Expected <img> to exist before error for src="${src}"`,
        ).toBe(true)

        // ── Trigger the image error event ────────────────────────────────────
        await wrapper.find('img').trigger('error')

        // ── Post-condition 1: <img> MUST be removed ──────────────────────────
        expect(
          wrapper.find('img').exists(),
          `Expected <img> to be hidden after error for src="${src}", name="${name}"`,
        ).toBe(false)

        // ── Post-condition 2: initials MUST be correct ───────────────────────
        const initials = expectedInitials(name)
        expect(
          wrapper.text(),
          `Expected initials "${initials}" to be visible after error for name="${name}"`,
        ).toBe(initials)
      }),
      { numRuns: 100, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 3.6**
   *
   * Edge-case: a src value that is provided but an error fires immediately —
   * the component must remain stable and show initials regardless of the
   * src string content (empty-looking strings filtered out by the arbitrary).
   */
  it('shows correct initials derived from name after fallback', async () => {
    await fc.assert(
      fc.asyncProperty(nameArbitrary, srcArbitrary, async (name, src) => {
        const wrapper = mount(Avatar, { props: { name, src } })
        await wrapper.find('img').trigger('error')

        const initials = expectedInitials(name)
        // Initials are rendered inside a <span aria-hidden="true">
        const initialsSpan = wrapper.find('span[aria-hidden="true"]')
        expect(
          initialsSpan.exists(),
          `Expected initials span to exist for name="${name}"`,
        ).toBe(true)
        expect(
          initialsSpan.text(),
          `Expected initials span text to be "${initials}" for name="${name}"`,
        ).toBe(initials)
      }),
      { numRuns: 100, seed: 84 },
    )
  })
})
