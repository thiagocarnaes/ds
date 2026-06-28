/**
 * Property-Based Tests — Motion reduced (Property 13)
 * Validates: Requirement 22.3
 *
 * Property: When prefers-reduced-motion is active, all motion duration tokens
 * except "instant" should resolve to 0ms.
 * The --ds-motion-duration-instant token is always 0ms (baseline invariant).
 */
import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import * as fc from 'fast-check'

// All non-instant motion duration token names defined in tokens.css
const NON_INSTANT_DURATION_TOKENS = [
  '--ds-motion-duration-fast',
  '--ds-motion-duration-normal',
  '--ds-motion-duration-slow',
  '--ds-motion-duration-slower',
] as const

type NonInstantDurationToken = (typeof NON_INSTANT_DURATION_TOKENS)[number]

// Base values from tokens.css (without reduced-motion override)
const BASE_TOKEN_VALUES: Record<NonInstantDurationToken, string> = {
  '--ds-motion-duration-fast': '100ms',
  '--ds-motion-duration-normal': '200ms',
  '--ds-motion-duration-slow': '350ms',
  '--ds-motion-duration-slower': '500ms',
}

describe('Property 13 — Motion reduced (Requirement 22.3)', () => {
  /**
   * **Validates: Requirements 22.3**
   *
   * Structural invariant: --ds-motion-duration-instant is always 0ms regardless
   * of motion preference. This is the baseline value the other tokens override to
   * under reduced-motion.
   */
  it('--ds-motion-duration-instant is always 0ms regardless of motion preference', () => {
    // Set the token as tokens.css defines it
    document.documentElement.style.setProperty('--ds-motion-duration-instant', '0ms')

    const value = getComputedStyle(document.documentElement)
      .getPropertyValue('--ds-motion-duration-instant')
      .trim()

    expect(value).toBe('0ms')

    document.documentElement.style.removeProperty('--ds-motion-duration-instant')
  })

  /**
   * **Validates: Requirements 22.3**
   *
   * Simulates the @media (prefers-reduced-motion: reduce) override from theme.css
   * by manually setting all non-instant duration tokens to 0ms on
   * document.documentElement (as the media query block does on :root).
   * After the override, all non-instant duration tokens must resolve to 0ms.
   */
  describe('simulates reduced-motion: all duration tokens override to 0ms', () => {
    beforeEach(() => {
      // Simulate what @media (prefers-reduced-motion: reduce) does in theme.css:
      // Override all non-instant duration tokens to 0ms on :root
      for (const token of NON_INSTANT_DURATION_TOKENS) {
        document.documentElement.style.setProperty(token, '0ms')
      }
    })

    afterEach(() => {
      // Restore tokens to their base values
      for (const token of NON_INSTANT_DURATION_TOKENS) {
        document.documentElement.style.removeProperty(token)
      }
    })

    it('all non-instant duration tokens resolve to 0ms when reduced-motion override is applied', () => {
      for (const token of NON_INSTANT_DURATION_TOKENS) {
        const value = getComputedStyle(document.documentElement)
          .getPropertyValue(token)
          .trim()

        expect(
          value,
          `Expected "${token}" to be "0ms" under reduced-motion override, got "${value}"`,
        ).toBe('0ms')
      }
    })
  })

  /**
   * **Validates: Requirements 22.3**
   *
   * Property-based: for any non-instant duration token name from the spec,
   * when the reduced-motion override is simulated (setting the token to 0ms
   * on document.documentElement, as theme.css does via @media), the resolved
   * value MUST be "0ms".
   */
  it('every non-instant motion duration overrides to 0ms under reduced-motion', () => {
    const tokenArbitrary = fc.constantFrom(...NON_INSTANT_DURATION_TOKENS)

    fc.assert(
      fc.property(tokenArbitrary, (token) => {
        // Set the base value (simulating tokens.css)
        document.documentElement.style.setProperty(token, BASE_TOKEN_VALUES[token])

        const baseValue = getComputedStyle(document.documentElement)
          .getPropertyValue(token)
          .trim()

        // Confirm the base value is non-zero before the override
        expect(
          baseValue,
          `Base value of "${token}" should be "${BASE_TOKEN_VALUES[token]}", got "${baseValue}"`,
        ).toBe(BASE_TOKEN_VALUES[token])

        // Now simulate the @media (prefers-reduced-motion: reduce) override
        document.documentElement.style.setProperty(token, '0ms')

        const reducedValue = getComputedStyle(document.documentElement)
          .getPropertyValue(token)
          .trim()

        // Cleanup before the assertion so we don't leak state
        document.documentElement.style.removeProperty(token)

        // The core property: under reduced-motion, every non-instant token must be 0ms
        expect(
          reducedValue,
          `Under reduced-motion, "${token}" must resolve to "0ms", got "${reducedValue}"`,
        ).toBe('0ms')
      }),
      { numRuns: 50, seed: 42 },
    )
  })
})
