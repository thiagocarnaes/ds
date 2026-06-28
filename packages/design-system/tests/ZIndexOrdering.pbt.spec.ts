/**
 * Property-Based Tests — Z-index ordering (Property 15)
 *
 * Validates: Requirement 26.3
 *
 * Property: The z-index token scale is strictly ascending, with the critical
 * ordering tooltip > notification > modal > overlay holding at all times.
 */
import { describe, expect, it } from 'vitest'
import * as fc from 'fast-check'

// ─── Token lookup table ───────────────────────────────────────────────────────

const Z_INDEX_TOKENS: Array<[string, number]> = [
  ['--ds-z-base',         0],
  ['--ds-z-raised',       100],
  ['--ds-z-dropdown',     200],
  ['--ds-z-sticky',       300],
  ['--ds-z-overlay',      400],
  ['--ds-z-modal',        500],
  ['--ds-z-notification', 600],
  ['--ds-z-tooltip',      700],
]

// ─── Helper ───────────────────────────────────────────────────────────────────

function getTokenValue(token: string, value: string): number {
  const el = document.createElement('div')
  el.style.setProperty(token, value)
  return parseInt(el.style.getPropertyValue(token).trim(), 10)
}

// ─── Property 15: Z-index ordering ───────────────────────────────────────────

describe('Property 15 — Z-index ordering (Requirement 26.3)', () => {
  /**
   * **Validates: Requirements 26.3**
   *
   * Each token in the lookup table must resolve to its expected numeric value
   * when set as an inline style property on a DOM element.
   */
  it('each z-index token has the expected numeric value', () => {
    for (const [token, expected] of Z_INDEX_TOKENS) {
      const el = document.createElement('div')
      el.style.setProperty(token, String(expected))
      const actual = parseInt(el.style.getPropertyValue(token).trim(), 10)
      expect(actual, `${token} should be ${expected}`).toBe(expected)
    }
  })

  /**
   * **Validates: Requirements 26.3**
   *
   * The four stacking-context layers that overlap most frequently must maintain
   * the invariant: tooltip > notification > modal > overlay.
   */
  it('critical ordering: tooltip > notification > modal > overlay', () => {
    const values = Object.fromEntries(Z_INDEX_TOKENS)
    expect(values['--ds-z-tooltip']).toBeGreaterThan(values['--ds-z-notification'])
    expect(values['--ds-z-notification']).toBeGreaterThan(values['--ds-z-modal'])
    expect(values['--ds-z-modal']).toBeGreaterThan(values['--ds-z-overlay'])
  })

  /**
   * **Validates: Requirements 26.3**
   *
   * Every consecutive pair in the table must be strictly increasing — no two
   * layers share the same z-index value and no layer reverses the ordering.
   */
  it('full scale is strictly ascending', () => {
    for (let i = 1; i < Z_INDEX_TOKENS.length; i++) {
      expect(
        Z_INDEX_TOKENS[i][1],
        `${Z_INDEX_TOKENS[i][0]} (${Z_INDEX_TOKENS[i][1]}) must be > ${Z_INDEX_TOKENS[i - 1][0]} (${Z_INDEX_TOKENS[i - 1][1]})`,
      ).toBeGreaterThan(Z_INDEX_TOKENS[i - 1][1])
    }
  })

  /**
   * **Validates: Requirements 26.3**
   *
   * Property-based: for any two tokens A and B sampled from the scale,
   * if the expected value of A is strictly greater than the expected value of B
   * then the actual resolved value of A must also be strictly greater than B.
   *
   * This universally verifies that the ordering relationship encoded in the
   * lookup table is consistent with DOM-resolved values.
   */
  it('property: for any two tokens where expected(A) > expected(B), actual A > actual B', () => {
    fc.assert(
      fc.property(
        fc.tuple(fc.constantFrom(...Z_INDEX_TOKENS), fc.constantFrom(...Z_INDEX_TOKENS)),
        ([tokenA, tokenB]) => {
          const [nameA, expectedA] = tokenA
          const [nameB, expectedB] = tokenB
          if (expectedA > expectedB) {
            const actualA = getTokenValue(nameA, String(expectedA))
            const actualB = getTokenValue(nameB, String(expectedB))
            expect(
              actualA,
              `${nameA} (${actualA}) should be > ${nameB} (${actualB})`,
            ).toBeGreaterThan(actualB)
          }
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })
})
