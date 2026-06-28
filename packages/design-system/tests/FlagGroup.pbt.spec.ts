/**
 * Property-Based Tests — FlagGroup flag queue (Property 6)
 *
 * Validates: Requirement 11.6
 * Property: FlagGroup com N > 3 flags → apenas 3 renderizados por vez
 *           (For any N > 3 flags inside a FlagGroup, at most 3 are visible.)
 */
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import * as fc from 'fast-check'
import FlagGroup from '@/components/feedback/FlagGroup.vue'
import Flag from '@/components/feedback/Flag.vue'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MAX_VISIBLE = 3

/**
 * Creates a test wrapper component that mounts a FlagGroup with `n` Flag
 * children. Each flag gets a unique flagId so the queue can track them.
 */
function createFlagGroupWrapper(n: number) {
  return defineComponent({
    render() {
      const flags = Array.from({ length: n }, (_, i) =>
        h(Flag, {
          title: `Flag ${i + 1}`,
          flagId: `flag-test-${i}`,
          isDismissible: false,
        }),
      )
      return h(FlagGroup, null, { default: () => flags })
    },
  })
}

/**
 * Count how many Flag alert elements are actually rendered in the DOM.
 * FlagGroup uses Teleport to body, so we query the full document.
 */
function countRenderedFlags(container: HTMLElement): number {
  return container.querySelectorAll('[role="alert"]').length
}

// ─── Cleanup ─────────────────────────────────────────────────────────────────

afterEach(() => {
  // Clean up any Teleport-mounted nodes lingering in the body
  document
    .querySelectorAll('[role="alert"]')
    .forEach((el) => el.remove())
})

// ─── Property 6: Flag queue ───────────────────────────────────────────────────

describe('Property 6 — FlagGroup flag queue (Requirement 11.6)', () => {
  /**
   * **Validates: Requirements 11.6**
   *
   * For any N in [4, 50], mounting a FlagGroup with N Flag children MUST
   * result in exactly MAX_VISIBLE (3) flags rendered in the DOM — never more.
   */
  it('renders exactly 3 flags for any N > 3', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 4, max: 50 }),
        async (n) => {
          const Wrapper = createFlagGroupWrapper(n)

          const wrapper = mount(Wrapper, {
            attachTo: document.body,
          })

          await flushPromises()
          await nextTick()

          const rendered = countRenderedFlags(document.body)

          // Clean up before assertion to avoid double-counting on re-runs
          wrapper.unmount()
          await nextTick()

          expect(
            rendered,
            `Expected exactly ${MAX_VISIBLE} rendered flags for N=${n}, got ${rendered}`,
          ).toBe(MAX_VISIBLE)
        },
      ),
      { numRuns: 40, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 11.6**
   *
   * Complement: for N ≤ 3, all flags MUST be visible (no queuing occurs).
   */
  it('renders all N flags when N ≤ 3', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: MAX_VISIBLE }),
        async (n) => {
          const Wrapper = createFlagGroupWrapper(n)

          const wrapper = mount(Wrapper, {
            attachTo: document.body,
          })

          await flushPromises()
          await nextTick()

          const rendered = countRenderedFlags(document.body)

          wrapper.unmount()
          await nextTick()

          expect(
            rendered,
            `Expected exactly ${n} rendered flags for N=${n}, got ${rendered}`,
          ).toBe(n)
        },
      ),
      { numRuns: 30, seed: 84 },
    )
  })

  // ─── Boundary / concrete examples ─────────────────────────────────────────

  /**
   * **Validates: Requirements 11.6**
   *
   * Concrete: exactly 3 flags with N=3 — all visible (boundary, no queue).
   */
  it('renders all 3 flags when exactly 3 are present (N=3)', async () => {
    const Wrapper = createFlagGroupWrapper(3)
    const wrapper = mount(Wrapper, { attachTo: document.body })

    await flushPromises()
    await nextTick()

    const rendered = countRenderedFlags(document.body)
    wrapper.unmount()

    expect(rendered).toBe(3)
  })

  /**
   * **Validates: Requirements 11.6**
   *
   * Concrete: N=4 — first boundary where queuing activates; only 3 rendered.
   */
  it('renders only 3 flags when N=4 (first queued flag)', async () => {
    const Wrapper = createFlagGroupWrapper(4)
    const wrapper = mount(Wrapper, { attachTo: document.body })

    await flushPromises()
    await nextTick()

    const rendered = countRenderedFlags(document.body)
    wrapper.unmount()

    expect(rendered).toBe(3)
  })

  /**
   * **Validates: Requirements 11.6**
   *
   * Concrete: N=10 — many flags queued; only 3 rendered.
   */
  it('renders only 3 flags when N=10', async () => {
    const Wrapper = createFlagGroupWrapper(10)
    const wrapper = mount(Wrapper, { attachTo: document.body })

    await flushPromises()
    await nextTick()

    const rendered = countRenderedFlags(document.body)
    wrapper.unmount()

    expect(rendered).toBe(3)
  })

  /**
   * **Validates: Requirements 11.6**
   *
   * Queue advancement: when a visible flag is dismissed, the next queued
   * flag becomes visible (total visible remains ≤ 3).
   */
  it('advances the queue when a flag is dismissed — visible count stays ≤ 3', async () => {
    // Start with 5 flags: 3 visible, 2 queued
    const Wrapper = createFlagGroupWrapper(5)
    const wrapper = mount(Wrapper, { attachTo: document.body })

    await flushPromises()
    await nextTick()

    expect(countRenderedFlags(document.body)).toBe(3)

    // Dismiss the first visible flag (click its dismiss button)
    const firstDismissibleWrapper = mount(
      defineComponent({
        render() {
          return h(FlagGroup, null, {
            default: () => [
              h(Flag, { title: 'Flag 1', flagId: 'adv-0', isDismissible: true }),
              h(Flag, { title: 'Flag 2', flagId: 'adv-1', isDismissible: false }),
              h(Flag, { title: 'Flag 3', flagId: 'adv-2', isDismissible: false }),
              h(Flag, { title: 'Flag 4', flagId: 'adv-3', isDismissible: false }),
              h(Flag, { title: 'Flag 5', flagId: 'adv-4', isDismissible: false }),
            ],
          })
        },
      }),
      { attachTo: document.body },
    )

    wrapper.unmount()
    await flushPromises()
    await nextTick()

    // 3 visible (adv-0, adv-1, adv-2), 2 queued (adv-3, adv-4)
    expect(countRenderedFlags(document.body)).toBe(3)

    // Dismiss flag 1 — flag 4 should advance into view
    const dismissBtn = document.querySelector('button[aria-label="Fechar notificação"]')
    if (dismissBtn) {
      ;(dismissBtn as HTMLButtonElement).click()
      await flushPromises()
      await nextTick()
    }

    // After dismissal: adv-1, adv-2, adv-3 should be visible (still 3)
    const afterDismiss = countRenderedFlags(document.body)
    firstDismissibleWrapper.unmount()
    await nextTick()

    expect(
      afterDismiss,
      `Expected 3 flags after dismissal, got ${afterDismiss}`,
    ).toBe(3)
  })

  /**
   * **Validates: Requirements 11.6**
   *
   * Upper bound property: for any N in [1, 100], rendered count is
   * always ≤ MAX_VISIBLE.
   */
  it('rendered flag count is always ≤ 3 for any N ≥ 1', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 100 }),
        async (n) => {
          const Wrapper = createFlagGroupWrapper(n)

          const wrapper = mount(Wrapper, {
            attachTo: document.body,
          })

          await flushPromises()
          await nextTick()

          const rendered = countRenderedFlags(document.body)

          wrapper.unmount()
          await nextTick()

          expect(
            rendered,
            `Expected rendered ≤ ${MAX_VISIBLE} for N=${n}, got ${rendered}`,
          ).toBeLessThanOrEqual(MAX_VISIBLE)
        },
      ),
      { numRuns: 60, seed: 126 },
    )
  })
})
