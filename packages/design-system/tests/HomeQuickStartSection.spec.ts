/**
 * Unit Tests — HomeQuickStartSection clipboard behavior
 *
 * Requirements 5.3, 5.4, 5.5
 *
 * 5.3 — WHEN the user clicks copy button and navigator.clipboard is available,
 *        SHALL copy to clipboard.
 * 5.4 — WHEN copy is successful, SHALL show visual feedback for between
 *        1500ms and 2000ms.
 * 5.5 — IF navigator.clipboard is not available, SHALL hide copy button
 *        without error.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import HomeQuickStartSection from '../playground/components/HomeQuickStartSection.vue'
import {
  providePlaygroundLocale,
  type PlaygroundLocaleContext,
} from '../playground/composables/usePlaygroundLocale'

// ─── Mounting helpers ──────────────────────────────────────────────────────────

function createLocaleWrapper() {
  let ctx: PlaygroundLocaleContext | null = null

  const Wrapper = defineComponent({
    setup(_, { slots }) {
      ctx = providePlaygroundLocale()
      ctx.setLocale('en')
      return () => slots.default?.()
    },
  })

  return { Wrapper, getCtx: () => ctx }
}

function mountQuickStart() {
  const { Wrapper } = createLocaleWrapper()

  const wrapper = mount(Wrapper, {
    slots: {
      default: () => h(HomeQuickStartSection),
    },
    attachTo: document.body,
  })

  return wrapper
}

// ─── Cleanup ──────────────────────────────────────────────────────────────────

afterEach(() => {
  document.querySelectorAll('[data-v-app]').forEach((el) => el.remove())
  vi.restoreAllMocks()
})

// ─── Tests: Successful Copy (Requirements 5.3, 5.4) ──────────────────────────

describe('HomeQuickStartSection — successful clipboard copy', () => {
  beforeEach(() => {
    // Mock navigator.clipboard with a writeText that resolves immediately
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      writable: true,
      configurable: true,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  /**
   * Requirement 5.3
   * Clicking the copy button calls navigator.clipboard.writeText with the
   * install command.
   */
  it('calls navigator.clipboard.writeText when copy button is clicked', async () => {
    const wrapper = mountQuickStart()
    await nextTick()

    const copyBtn = wrapper.find('.pg-usage-copy')
    expect(copyBtn.exists()).toBe(true)

    await copyBtn.trigger('click')
    await nextTick()

    expect(navigator.clipboard.writeText).toHaveBeenCalledOnce()
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'npm install @tcarnaes/design-system',
    )

    wrapper.unmount()
  })

  /**
   * Requirement 5.4 — first half
   * After a successful copy, `copied` becomes true, which causes the copy
   * button to display the copiedLabel feedback text.
   */
  it('shows visual feedback (copiedLabel) immediately after a successful copy', async () => {
    const wrapper = mountQuickStart()
    await nextTick()

    const copyBtn = wrapper.find('.pg-usage-copy')
    expect(copyBtn.exists()).toBe(true)

    // Before click: shows "Copiar" / "Copy" — not the copied label
    const initialText = copyBtn.text()
    expect(initialText).not.toBe('')

    await copyBtn.trigger('click')
    // Let the microtask queue (Promise.resolve) flush
    await nextTick()
    await nextTick()

    // After click: feedback text must have changed to copiedLabel
    const quickStart = wrapper.findComponent(HomeQuickStartSection)
    const btn = quickStart.find('.pg-usage-copy')
    expect(btn.text()).not.toBe(initialText)

    wrapper.unmount()
  })

  /**
   * Requirement 5.4 — second half
   * The visual feedback disappears after 1500ms (reverts to false).
   * Uses vi.useFakeTimers() to control time.
   */
  it('reverts copied feedback to false after 1500ms', async () => {
    const wrapper = mountQuickStart()
    await nextTick()

    const quickStart = wrapper.findComponent(HomeQuickStartSection)
    const copyBtn = quickStart.find('.pg-usage-copy')
    expect(copyBtn.exists()).toBe(true)

    const initialText = copyBtn.text()

    await copyBtn.trigger('click')
    // Flush Promise microtasks so writeText resolves and copied = true
    await nextTick()
    await nextTick()

    // Advance time by 1499ms — still showing feedback
    vi.advanceTimersByTime(1499)
    await nextTick()
    expect(quickStart.find('.pg-usage-copy').text()).not.toBe(initialText)

    // Advance past the 1500ms boundary — feedback must be gone (back to initial)
    vi.advanceTimersByTime(1)
    await nextTick()
    expect(quickStart.find('.pg-usage-copy').text()).toBe(initialText)

    wrapper.unmount()
  })
})

// ─── Tests: No Clipboard (Requirement 5.5) ────────────────────────────────────

describe('HomeQuickStartSection — environment without clipboard', () => {
  beforeEach(() => {
    // Remove clipboard API to simulate an unsupported environment
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
      configurable: true,
    })
  })

  /**
   * Requirement 5.5
   * When navigator.clipboard is unavailable, the copy button must not be
   * rendered. The component must not throw any error.
   */
  it('does not render the copy button when clipboard is unavailable', async () => {
    const wrapper = mountQuickStart()
    await nextTick()

    // The copy button uses v-if="canCopy" — it must be absent
    expect(wrapper.find('.pg-usage-copy').exists()).toBe(false)

    wrapper.unmount()
  })

  /**
   * Requirement 5.5
   * The rest of the component (install command, import snippet, docs link)
   * is still rendered correctly when clipboard is unavailable.
   */
  it('still renders the install command and docs link when clipboard is unavailable', async () => {
    const wrapper = mountQuickStart()
    await nextTick()

    // Install command code block is present
    const code = wrapper.find('code')
    expect(code.exists()).toBe(true)
    expect(code.text()).toContain('@tcarnaes/design-system')

    // Docs link button is present
    const docsBtn = wrapper.find('.docs-link')
    expect(docsBtn.exists()).toBe(true)

    wrapper.unmount()
  })
})
