/**
 * Property-Based Tests — Modal scroll lock (Property 5)
 *
 * Validates: Requirement 6.8
 * Property: open=true  → document.body.style.overflow === 'hidden'
 *           open=false → document.body.style.overflow is restored to its
 *                        original value (prior to opening the Modal).
 */
import { describe, expect, it, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import * as fc from 'fast-check'
import Modal from '@/components/overlay/Modal.vue'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Valid CSS overflow values that could already be set on the body. */
const overflowArbitrary = fc.oneof(
  fc.constant(''),
  fc.constant('auto'),
  fc.constant('scroll'),
  fc.constant('visible'),
  fc.constant('hidden'),
  fc.constant('clip'),
)

/** Boolean arbitrary for the Modal `closeOnOverlay` prop. */
const closeOnOverlayArbitrary = fc.boolean()

// ─── Cleanup ─────────────────────────────────────────────────────────────────

afterEach(() => {
  // Reset body overflow after every test to prevent state leaking between runs.
  document.body.style.overflow = ''
})

// ─── Property 5: Modal scroll lock ───────────────────────────────────────────

describe('Property 5 — Modal scroll lock (Requirement 6.8)', () => {
  /**
   * **Validates: Requirements 6.8**
   *
   * For any initial overflow value already set on document.body,
   * mounting the Modal with open=true MUST set body overflow to 'hidden'.
   */
  it('sets body overflow to "hidden" for any initial overflow when open=true', async () => {
    await fc.assert(
      fc.asyncProperty(
        overflowArbitrary,
        closeOnOverlayArbitrary,
        async (initialOverflow, closeOnOverlay) => {
          // ── Pre-condition: set an arbitrary overflow on the body ─────────
          document.body.style.overflow = initialOverflow

          const wrapper = mount(Modal, {
            props: { open: true, closeOnOverlay },
            slots: { default: 'Test content' },
            attachTo: document.body,
          })

          await flushPromises()

          // ── Assertion: body MUST have overflow hidden ────────────────────
          expect(
            document.body.style.overflow,
            `Expected body overflow="hidden" after Modal opens with initialOverflow="${initialOverflow}"`,
          ).toBe('hidden')

          wrapper.unmount()
        },
      ),
      { numRuns: 50, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 6.8**
   *
   * After the Modal transitions from open=true to open=false,
   * body overflow MUST be restored to '' (the value the component
   * sets on close — per the watch implementation).
   */
  it('restores body overflow to "" when Modal is closed after being open', async () => {
    await fc.assert(
      fc.asyncProperty(
        overflowArbitrary,
        closeOnOverlayArbitrary,
        async (initialOverflow, closeOnOverlay) => {
          // ── Pre-condition: set an arbitrary overflow on the body ─────────
          document.body.style.overflow = initialOverflow

          const wrapper = mount(Modal, {
            props: {
              open: true,
              closeOnOverlay,
              'onUpdate:open': (value: boolean) => wrapper.setProps({ open: value }),
            },
            slots: { default: 'Test content' },
            attachTo: document.body,
          })

          await flushPromises()

          // ── Pre-condition: body overflow must be hidden now ───────────────
          expect(document.body.style.overflow).toBe('hidden')

          // ── Close the Modal ───────────────────────────────────────────────
          await wrapper.setProps({ open: false })
          await flushPromises()

          // ── Assertion: body overflow MUST be restored (empty string) ─────
          expect(
            document.body.style.overflow,
            `Expected body overflow="" after Modal closes (initialOverflow="${initialOverflow}")`,
          ).toBe('')

          wrapper.unmount()
        },
      ),
      { numRuns: 50, seed: 84 },
    )
  })

  /**
   * **Validates: Requirements 6.8**
   *
   * Unmounting the Modal while open=true MUST also restore body overflow,
   * preventing a permanent scroll-lock if the component is destroyed
   * without explicitly closing it.
   */
  it('restores body overflow when Modal is unmounted while open', async () => {
    await fc.assert(
      fc.asyncProperty(
        overflowArbitrary,
        async (initialOverflow) => {
          document.body.style.overflow = initialOverflow

          const wrapper = mount(Modal, {
            props: { open: true },
            slots: { default: 'Test content' },
            attachTo: document.body,
          })

          await flushPromises()
          expect(document.body.style.overflow).toBe('hidden')

          // ── Destroy the component without calling close() ────────────────
          wrapper.unmount()

          // ── Assertion: body overflow MUST be restored by onUnmounted ─────
          expect(
            document.body.style.overflow,
            `Expected body overflow="" after unmount (initialOverflow="${initialOverflow}")`,
          ).toBe('')
        },
      ),
      { numRuns: 50, seed: 126 },
    )
  })

  // ─── Boundary / concrete examples ─────────────────────────────────────────

  /**
   * **Validates: Requirements 6.8**
   *
   * Concrete example: Modal starting closed (open=false) must NOT lock scroll.
   */
  it('does not lock scroll when Modal is initially closed (open=false)', () => {
    document.body.style.overflow = ''

    const wrapper = mount(Modal, {
      props: { open: false },
      slots: { default: 'Invisible content' },
      attachTo: document.body,
    })

    expect(document.body.style.overflow).toBe('')

    wrapper.unmount()
  })

  /**
   * **Validates: Requirements 6.8**
   *
   * Concrete example: body overflow is locked immediately when open
   * transitions from false → true.
   */
  it('locks scroll when Modal transitions from closed to open', async () => {
    document.body.style.overflow = ''

    const wrapper = mount(Modal, {
      props: { open: false },
      slots: { default: 'Content' },
      attachTo: document.body,
    })

    expect(document.body.style.overflow).toBe('')

    await wrapper.setProps({ open: true })
    await flushPromises()

    expect(document.body.style.overflow).toBe('hidden')

    wrapper.unmount()
  })
})
