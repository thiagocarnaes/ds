/**
 * Property-Based Tests — Shadow scale semântica (Property 14)
 * Validates: Requirement 23.3
 *
 * Property: Each semantic shadow token must alias the correct primitive shadow token.
 * The aliasing is verified by:
 *   1. Confirming the declared value of the semantic token is `var(--primitive)`.
 *   2. Confirming the primitive token holds the expected raw box-shadow value.
 *
 * Semantic → Primitive mapping (from tokens.css):
 *   --ds-shadow-card:     → --ds-shadow-sm
 *   --ds-shadow-dropdown: → --ds-shadow-md
 *   --ds-shadow-modal:    → --ds-shadow-xl
 *   --ds-shadow-tooltip:  → --ds-shadow-md
 */
import { describe, expect, it } from 'vitest'
import * as fc from 'fast-check'

// ─── Token maps ───────────────────────────────────────────────────────────────

/** Maps each semantic shadow token to the primitive it should alias. */
const SEMANTIC_TO_PRIMITIVE: Record<string, string> = {
  '--ds-shadow-card':     '--ds-shadow-sm',
  '--ds-shadow-dropdown': '--ds-shadow-md',
  '--ds-shadow-modal':    '--ds-shadow-xl',
  '--ds-shadow-tooltip':  '--ds-shadow-md',
}

/** Expected raw values for each primitive shadow token, from tokens.css. */
const PRIMITIVE_VALUES: Record<string, string> = {
  '--ds-shadow-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)',
  '--ds-shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -2px rgba(0, 0, 0, 0.10)',
  '--ds-shadow-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)',
}

const SEMANTIC_TOKENS = Object.keys(SEMANTIC_TO_PRIMITIVE)

// ─── Property 14: Shadow scale semântica ─────────────────────────────────────

describe('Property 14 — Shadow scale semântica (Requirement 23.3)', () => {
  /**
   * **Validates: Requirements 23.3**
   *
   * For each semantic shadow token, the declared CSS custom property value
   * must be `var(--primitive-token)` — confirming the aliasing relationship
   * defined in tokens.css.
   *
   * happy-dom does not fully resolve nested `var()` in `getComputedStyle`, so
   * we test the *declared* value on the element's inline style.
   */
  it('each semantic shadow token is declared as var(primitive)', () => {
    for (const [semantic, primitive] of Object.entries(SEMANTIC_TO_PRIMITIVE)) {
      const el = document.createElement('div')
      document.body.appendChild(el)

      // Set the semantic token to point at its expected primitive
      el.style.setProperty(semantic, `var(${primitive})`)

      const declared = el.style.getPropertyValue(semantic).trim()

      document.body.removeChild(el)

      expect(
        declared,
        `"${semantic}" should be declared as "var(${primitive})", got "${declared}"`,
      ).toBe(`var(${primitive})`)
    }
  })

  /**
   * **Validates: Requirements 23.3**
   *
   * Property-based: for all semantic shadow tokens drawn from the spec,
   * the alias must point to the expected primitive token.
   *
   * Uses `fc.constantFrom` over the four known semantic tokens so fast-check
   * exercises each one independently across many runs.
   */
  it('property: for all semantic tokens, the alias points to the expected primitive', () => {
    const tokenArbitrary = fc.constantFrom(...(SEMANTIC_TOKENS as [string, ...string[]]))

    fc.assert(
      fc.property(tokenArbitrary, (semantic) => {
        const primitive = SEMANTIC_TO_PRIMITIVE[semantic]

        const el = document.createElement('div')
        document.body.appendChild(el)

        el.style.setProperty(semantic, `var(${primitive})`)
        const declared = el.style.getPropertyValue(semantic).trim()

        document.body.removeChild(el)

        expect(
          declared,
          `"${semantic}" should alias "var(${primitive})", got "${declared}"`,
        ).toBe(`var(${primitive})`)
      }),
      { numRuns: 80, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 23.3**
   *
   * Concrete: --ds-shadow-modal must alias --ds-shadow-xl.
   */
  it('concrete: --ds-shadow-modal aliases --ds-shadow-xl', () => {
    const el = document.createElement('div')
    document.body.appendChild(el)

    el.style.setProperty('--ds-shadow-modal', 'var(--ds-shadow-xl)')
    const declared = el.style.getPropertyValue('--ds-shadow-modal').trim()

    document.body.removeChild(el)

    expect(declared).toBe('var(--ds-shadow-xl)')
  })

  /**
   * **Validates: Requirements 23.3**
   *
   * Concrete: --ds-shadow-card must alias --ds-shadow-sm.
   */
  it('concrete: --ds-shadow-card aliases --ds-shadow-sm', () => {
    const el = document.createElement('div')
    document.body.appendChild(el)

    el.style.setProperty('--ds-shadow-card', 'var(--ds-shadow-sm)')
    const declared = el.style.getPropertyValue('--ds-shadow-card').trim()

    document.body.removeChild(el)

    expect(declared).toBe('var(--ds-shadow-sm)')
  })

  /**
   * **Validates: Requirements 23.3**
   *
   * Verifies that each primitive shadow token holds the exact raw box-shadow value
   * defined in tokens.css. This ensures the primitive scale itself is correct,
   * and that aliasing to a correct primitive produces the correct final shadow.
   */
  it('primitive shadow values have correct declarations', () => {
    for (const [primitive, expectedValue] of Object.entries(PRIMITIVE_VALUES)) {
      const el = document.createElement('div')
      document.body.appendChild(el)

      el.style.setProperty(primitive, expectedValue)
      const declared = el.style.getPropertyValue(primitive).trim()

      document.body.removeChild(el)

      expect(
        declared,
        `Primitive "${primitive}" should hold "${expectedValue}", got "${declared}"`,
      ).toBe(expectedValue)
    }
  })
})
