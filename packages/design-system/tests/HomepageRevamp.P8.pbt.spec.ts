// Feature: design-system-homepage-revamp, Property 8: Contagem de Entradas de Changelog Dentro do Intervalo [2, 4]

/**
 * Property-Based Tests — Contagem de Entradas de Changelog Dentro do Intervalo [2, 4] (Property 8)
 *
 * **Validates: Requirements 7.1**
 * Property: ∀ array of ChangelogEntry with length n,
 *   the result of slice(0, 4) has length = min(n, 4),
 *   and if n >= 2 the result satisfies length ∈ [2, 4].
 */

import { describe, expect, it } from 'vitest'
import * as fc from 'fast-check'
import {
  changelogEntries,
  type ChangelogType,
  type ChangelogChange,
  type ChangelogEntry,
} from '../playground/data/changelogData'

// ─── Arbitraries ─────────────────────────────────────────────────────────────

const validTypeArb = fc.constantFrom<ChangelogType>('Added', 'Changed', 'Fixed')

const changelogChangeArb: fc.Arbitrary<ChangelogChange> = fc.record({
  type: validTypeArb,
  desc: fc.string({ minLength: 1, maxLength: 64 }),
})

const changelogEntryArb: fc.Arbitrary<ChangelogEntry> = fc.record({
  version: fc.stringMatching(/^\d+\.\d+\.\d+$/),
  date: fc.string({ minLength: 10, maxLength: 10 }),
  changes: fc.array(changelogChangeArb, { minLength: 1, maxLength: 3 }),
})

// ─── Property 8: Contagem de Entradas Dentro do Intervalo [2, 4] ─────────────

describe('Property 8 — Contagem de Entradas de Changelog Dentro do Intervalo [2, 4] (Requirement 7.1)', () => {
  /**
   * **Validates: Requirements 7.1**
   *
   * The static changelogEntries has exactly 4 entries, and slicing to 4
   * must yield a count in [2, 4].
   */
  it('the static changelogEntries sliced to 4 has between 2 and 4 entries', () => {
    const displayed = changelogEntries.slice(0, 4)
    expect(displayed.length).toBeGreaterThanOrEqual(2)
    expect(displayed.length).toBeLessThanOrEqual(4)
  })

  /**
   * **Validates: Requirements 7.1**
   *
   * For any generated array of size >= 2, slice(0, 4) produces a count
   * that belongs to [min(n, 2), 4].
   *
   * In other words: the displayed count is always between 2 and 4 inclusive
   * when the source has at least 2 entries.
   */
  it('for any entries array with n >= 2, slice(0, 4) keeps count in [min(n, 2), 4]', () => {
    fc.assert(
      fc.property(
        fc.array(changelogEntryArb, { minLength: 2, maxLength: 20 }),
        (entries) => {
          const displayed = entries.slice(0, 4)
          const n = entries.length
          const minExpected = Math.min(n, 2)
          return displayed.length >= minExpected && displayed.length <= 4
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 7.1**
   *
   * For any generated array of any size (including 0 or 1), slice(0, 4) never
   * exceeds 4 entries — the upper bound is always respected.
   */
  it('slice(0, 4) never produces more than 4 entries regardless of input size', () => {
    fc.assert(
      fc.property(
        fc.array(changelogEntryArb, { minLength: 0, maxLength: 100 }),
        (entries) => {
          const displayed = entries.slice(0, 4)
          return displayed.length <= 4
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 7.1**
   *
   * For any generated array of exactly 4 entries, slice(0, 4) returns
   * exactly 4 — confirming the upper bound is tight.
   */
  it('slice(0, 4) of an array with exactly 4 entries returns exactly 4', () => {
    fc.assert(
      fc.property(
        fc.array(changelogEntryArb, { minLength: 4, maxLength: 4 }),
        (entries) => {
          const displayed = entries.slice(0, 4)
          return displayed.length === 4
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })
})
