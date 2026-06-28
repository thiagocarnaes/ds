/**
 * Property-Based Tests — Tag remove event (Property 8)
 *
 * Validates: Requirement 12.4
 * Property: isRemovable=true, click no botão → evento 'remove' emitido com text correto
 *           (For any arbitrary string `text`, when isRemovable=true and the remove
 *           button is clicked, the 'remove' event MUST be emitted with exactly that
 *           text value.)
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import * as fc from 'fast-check'
import Tag from '@/components/data-display/Tag.vue'

// ─── Arbitraries ─────────────────────────────────────────────────────────────

/**
 * Generates arbitrary non-empty strings to use as `text` prop values.
 * Covers single chars, long strings, unicode, and special characters —
 * the remove event must carry the exact string regardless of content.
 */
const textArbitrary = fc
  .string({ minLength: 1, maxLength: 100 })
  .filter((s) => s.trim().length > 0)

// ─── Property 8: Tag remove event ────────────────────────────────────────────

describe('Property 8 — Tag remove event (Requirement 12.4)', () => {
  /**
   * **Validates: Requirements 12.4**
   *
   * For any non-empty `text` value, mounting a Tag with isRemovable=true and
   * clicking the remove button MUST emit the 'remove' event with exactly that
   * text value — no mutation, no truncation, no coercion.
   */
  it('emits "remove" with the exact text for any arbitrary text value', async () => {
    await fc.assert(
      fc.asyncProperty(textArbitrary, async (text) => {
        const wrapper = mount(Tag, {
          props: { text, isRemovable: true },
        })

        // ── Pre-condition: remove button MUST be present ─────────────────────
        // Use find('button') instead of an attribute selector so that
        // arbitrary text values containing CSS-special characters (e.g. \, ")
        // don't break the querySelector.
        const removeButton = wrapper.find('button')
        expect(
          removeButton.exists(),
          `Expected remove button to exist for text="${text}"`,
        ).toBe(true)
        // Verify the aria-label has the correct value via DOM attribute access
        expect(
          removeButton.attributes('aria-label'),
          `Expected aria-label="Remover ${text}"`,
        ).toBe(`Remover ${text}`)

        // ── Trigger: click the remove button ─────────────────────────────────
        await removeButton.trigger('click')

        // ── Post-condition: 'remove' event MUST be emitted ───────────────────
        const emitted = wrapper.emitted('remove')
        expect(
          emitted,
          `Expected "remove" event to be emitted for text="${text}"`,
        ).toBeTruthy()

        // ── Post-condition: event payload MUST be exactly the text value ──────
        const payload = emitted![0][0]
        expect(
          payload,
          `Expected remove event payload to be "${text}", got "${payload}"`,
        ).toBe(text)
      }),
      { numRuns: 150, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 12.4**
   *
   * Complement property: when isRemovable=false, the remove button MUST NOT
   * be rendered, so no 'remove' event can fire.
   */
  it('does not render a remove button when isRemovable=false', () => {
    fc.assert(
      fc.property(textArbitrary, (text) => {
        const wrapper = mount(Tag, {
          props: { text, isRemovable: false },
        })

        const removeButton = wrapper.find('button')
        expect(
          removeButton.exists(),
          `Expected no remove button for text="${text}" with isRemovable=false`,
        ).toBe(false)
      }),
      { numRuns: 100, seed: 84 },
    )
  })

  // ─── Boundary / concrete examples ─────────────────────────────────────────

  /**
   * **Validates: Requirements 12.4**
   *
   * Concrete: single character text — minimal valid text value.
   */
  it('emits "remove" with correct payload for a single-character text', async () => {
    const wrapper = mount(Tag, { props: { text: 'A', isRemovable: true } })
    await wrapper.find('button[aria-label="Remover A"]').trigger('click')
    expect(wrapper.emitted('remove')?.[0]?.[0]).toBe('A')
  })

  /**
   * **Validates: Requirements 12.4**
   *
   * Concrete: text with spaces — ensures payload preserves whitespace.
   */
  it('emits "remove" preserving spaces in text', async () => {
    const text = 'Design System'
    const wrapper = mount(Tag, { props: { text, isRemovable: true } })
    await wrapper.find(`button[aria-label="Remover ${text}"]`).trigger('click')
    expect(wrapper.emitted('remove')?.[0]?.[0]).toBe(text)
  })

  /**
   * **Validates: Requirements 12.4**
   *
   * Concrete: remove button has the correct aria-label for accessibility.
   */
  it('remove button has aria-label "Remover [text]"', () => {
    const text = 'Etiqueta'
    const wrapper = mount(Tag, { props: { text, isRemovable: true } })
    const btn = wrapper.find('button')
    expect(btn.attributes('aria-label')).toBe(`Remover ${text}`)
  })

  /**
   * **Validates: Requirements 12.4**
   *
   * Concrete: clicking remove multiple times emits the event each time.
   */
  it('emits "remove" on each click — not just the first', async () => {
    const text = 'Multi'
    const wrapper = mount(Tag, { props: { text, isRemovable: true } })
    const btn = wrapper.find('button')
    await btn.trigger('click')
    await btn.trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(2)
    expect(wrapper.emitted('remove')![1][0]).toBe(text)
  })
})
