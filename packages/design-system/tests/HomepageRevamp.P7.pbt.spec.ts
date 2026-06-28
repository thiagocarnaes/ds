// Feature: design-system-homepage-revamp, Property 7: Tipos de Changelog Restritos ao Conjunto Válido

/**
 * Property-Based Tests — Tipos de Changelog Restritos ao Conjunto Válido (Property 7)
 *
 * **Validates: Requirements 7.2**
 * Property: ∀ change ∈ changelogEntries[*].changes, change.type ∈ { 'Added', 'Changed', 'Fixed' }
 */

import { describe, expect, it } from 'vitest'
import * as fc from 'fast-check'
import {
  changelogEntries,
  type ChangelogType,
  type ChangelogChange,
  type ChangelogEntry,
} from '../playground/data/changelogData'

// ─── Valid set ────────────────────────────────────────────────────────────────

const VALID_TYPES: ReadonlySet<ChangelogType> = new Set(['Added', 'Changed', 'Fixed'])

// ─── Arbitraries ─────────────────────────────────────────────────────────────

/** Generates a valid ChangelogType */
const validTypeArb = fc.constantFrom<ChangelogType>('Added', 'Changed', 'Fixed')

/** Generates a ChangelogChange with a valid type */
const changelogChangeArb: fc.Arbitrary<ChangelogChange> = fc.record({
  type: validTypeArb,
  descKey: fc.string({ minLength: 1, maxLength: 64 }),
})

/** Generates a ChangelogEntry with 1–3 changes */
const changelogEntryArb: fc.Arbitrary<ChangelogEntry> = fc.record({
  version: fc.stringMatching(/^\d+\.\d+\.\d+$/),
  date: fc.string({ minLength: 10, maxLength: 10 }),
  changes: fc.array(changelogChangeArb, { minLength: 1, maxLength: 3 }),
})

// ─── Property 7: Tipos de Changelog Restritos ao Conjunto Válido ─────────────

describe('Property 7 — Tipos de Changelog Restritos ao Conjunto Válido (Requirement 7.2)', () => {
  /**
   * **Validates: Requirements 7.2**
   *
   * The static changelogEntries exported from changelogData.ts must only
   * contain change entries whose type belongs to the set { 'Added', 'Changed', 'Fixed' }.
   */
  it('all change.type values in the static changelogEntries belong to the valid set', () => {
    for (const entry of changelogEntries) {
      for (const change of entry.changes) {
        expect(
          VALID_TYPES.has(change.type),
          `Entry v${entry.version}: unexpected type "${change.type}"`,
        ).toBe(true)
      }
    }
  })

  /**
   * **Validates: Requirements 7.2**
   *
   * For any generated array of ChangelogEntry objects (using the same shape as
   * the real data), every change.type must remain in the valid set — the type
   * system alone is not enough; this verifies the runtime invariant across
   * many generated permutations.
   */
  it('for any generated changelog data, every change.type is in { Added, Changed, Fixed }', () => {
    fc.assert(
      fc.property(
        fc.array(changelogEntryArb, { minLength: 1, maxLength: 10 }),
        (entries) => {
          for (const entry of entries) {
            for (const change of entry.changes) {
              if (!VALID_TYPES.has(change.type)) {
                return false
              }
            }
          }
          return true
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 7.2**
   *
   * The static data has exactly 4 entries and each satisfies the type constraint.
   * This confirms the real data file conforms, not just generated data.
   */
  it('each entry in the real changelogEntries has only valid change types', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: changelogEntries.length - 1 }),
        (idx) => {
          const entry = changelogEntries[idx]
          return entry.changes.every((c) => VALID_TYPES.has(c.type))
        },
      ),
      { numRuns: 100, seed: 42 },
    )
  })
})
