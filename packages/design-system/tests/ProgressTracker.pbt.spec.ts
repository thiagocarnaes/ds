/**
 * Property-Based Tests — ProgressTracker aria-current (Property 7)
 *
 * Validates: Requirement 15.6
 * Property: ∀ i, i === currentIndex → li[i][aria-current] === 'step'
 *           ∀ i, i ≠ currentIndex  → li[i][aria-current] === undefined
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import * as fc from 'fast-check'
import ProgressTracker from '@/components/data-display/ProgressTracker.vue'
import type { ProgressStep } from '@/components/data-display/ProgressTracker.vue'

// ─── Arbitraries ─────────────────────────────────────────────────────────────

/**
 * Generates an arbitrary ProgressStep with a label and a percentageComplete
 * in the valid 0–100 range (inclusive).
 */
const stepArbitrary: fc.Arbitrary<ProgressStep> = fc.record({
  label: fc.string({ minLength: 1, maxLength: 30 }),
  percentageComplete: fc.integer({ min: 0, max: 100 }),
})

/**
 * Generates an array of 1–8 steps alongside a valid currentIndex for that array.
 * The currentIndex is always within bounds: [0, steps.length - 1].
 */
const stepsWithCurrentIndex = fc
  .array(stepArbitrary, { minLength: 1, maxLength: 8 })
  .chain((steps) => {
    const currentIndex = fc.integer({ min: 0, max: steps.length - 1 })
    return fc.tuple(fc.constant(steps), currentIndex)
  })

// ─── Property 7: ProgressTracker aria-current ────────────────────────────────

describe('Property 7 — ProgressTracker aria-current (Requirement 15.6)', () => {
  /**
   * **Validates: Requirements 15.6**
   *
   * For any array of steps and any valid currentIndex, the <li> at
   * currentIndex MUST have aria-current="step" and every other <li> MUST
   * NOT have aria-current set (attribute should be absent / undefined).
   */
  it('only the step at currentIndex has aria-current="step"; all others have no aria-current', () => {
    fc.assert(
      fc.property(stepsWithCurrentIndex, ([steps, currentIndex]) => {
        const wrapper = mount(ProgressTracker, {
          props: { steps, currentIndex },
        })

        const listItems = wrapper.findAll('li')

        expect(
          listItems.length,
          `Expected ${steps.length} <li> elements, got ${listItems.length}`,
        ).toBe(steps.length)

        for (let i = 0; i < listItems.length; i++) {
          const ariaCurrent = listItems[i].attributes('aria-current')

          if (i === currentIndex) {
            expect(
              ariaCurrent,
              `Expected li[${i}] to have aria-current="step" (currentIndex=${currentIndex})`,
            ).toBe('step')
          } else {
            expect(
              ariaCurrent,
              `Expected li[${i}] to have NO aria-current (currentIndex=${currentIndex}), got "${ariaCurrent}"`,
            ).toBeUndefined()
          }
        }
      }),
      { numRuns: 200, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 15.6**
   *
   * Complement: exactly one <li> must have aria-current="step" for any valid
   * input — never zero, never more than one.
   */
  it('exactly one <li> has aria-current="step" for any valid input', () => {
    fc.assert(
      fc.property(stepsWithCurrentIndex, ([steps, currentIndex]) => {
        const wrapper = mount(ProgressTracker, {
          props: { steps, currentIndex },
        })

        const listItems = wrapper.findAll('li')
        const activeCount = listItems.filter(
          (li) => li.attributes('aria-current') === 'step',
        ).length

        expect(
          activeCount,
          `Expected exactly 1 active step, got ${activeCount} (steps=${steps.length}, currentIndex=${currentIndex})`,
        ).toBe(1)
      }),
      { numRuns: 200, seed: 84 },
    )
  })

  // ─── Boundary / concrete examples ─────────────────────────────────────────

  /**
   * **Validates: Requirements 15.6**
   *
   * Concrete: single step with currentIndex=0.
   */
  it('single step — the only <li> has aria-current="step"', () => {
    const wrapper = mount(ProgressTracker, {
      props: {
        steps: [{ label: 'Only step', percentageComplete: 0 }],
        currentIndex: 0,
      },
    })
    const li = wrapper.find('li')
    expect(li.attributes('aria-current')).toBe('step')
  })

  /**
   * **Validates: Requirements 15.6**
   *
   * Concrete: first step active in a multi-step tracker.
   */
  it('first step active — only li[0] has aria-current="step"', () => {
    const steps: ProgressStep[] = [
      { label: 'Step 1', percentageComplete: 0 },
      { label: 'Step 2', percentageComplete: 0 },
      { label: 'Step 3', percentageComplete: 0 },
    ]
    const wrapper = mount(ProgressTracker, { props: { steps, currentIndex: 0 } })
    const listItems = wrapper.findAll('li')

    expect(listItems[0].attributes('aria-current')).toBe('step')
    expect(listItems[1].attributes('aria-current')).toBeUndefined()
    expect(listItems[2].attributes('aria-current')).toBeUndefined()
  })

  /**
   * **Validates: Requirements 15.6**
   *
   * Concrete: middle step active.
   */
  it('middle step active — only li[1] has aria-current="step"', () => {
    const steps: ProgressStep[] = [
      { label: 'Step 1', percentageComplete: 100 },
      { label: 'Step 2', percentageComplete: 50 },
      { label: 'Step 3', percentageComplete: 0 },
    ]
    const wrapper = mount(ProgressTracker, { props: { steps, currentIndex: 1 } })
    const listItems = wrapper.findAll('li')

    expect(listItems[0].attributes('aria-current')).toBeUndefined()
    expect(listItems[1].attributes('aria-current')).toBe('step')
    expect(listItems[2].attributes('aria-current')).toBeUndefined()
  })

  /**
   * **Validates: Requirements 15.6**
   *
   * Concrete: last step active.
   */
  it('last step active — only the last <li> has aria-current="step"', () => {
    const steps: ProgressStep[] = [
      { label: 'Step 1', percentageComplete: 100 },
      { label: 'Step 2', percentageComplete: 100 },
      { label: 'Step 3', percentageComplete: 0 },
    ]
    const wrapper = mount(ProgressTracker, { props: { steps, currentIndex: 2 } })
    const listItems = wrapper.findAll('li')

    expect(listItems[0].attributes('aria-current')).toBeUndefined()
    expect(listItems[1].attributes('aria-current')).toBeUndefined()
    expect(listItems[2].attributes('aria-current')).toBe('step')
  })

  /**
   * **Validates: Requirements 15.6**
   *
   * Concrete: a completed step (percentageComplete=100) that is NOT the
   * currentIndex must NOT have aria-current set.
   */
  it('completed steps that are not currentIndex do not have aria-current', () => {
    const steps: ProgressStep[] = [
      { label: 'Done', percentageComplete: 100 },
      { label: 'Active', percentageComplete: 0 },
      { label: 'Future', percentageComplete: 0 },
    ]
    const wrapper = mount(ProgressTracker, { props: { steps, currentIndex: 1 } })
    const listItems = wrapper.findAll('li')

    // Completed step at index 0 — aria-current must be absent
    expect(listItems[0].attributes('aria-current')).toBeUndefined()
    // Active step at index 1 — aria-current must be 'step'
    expect(listItems[1].attributes('aria-current')).toBe('step')
  })
})
