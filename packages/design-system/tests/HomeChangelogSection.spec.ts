/**
 * Unit Tests — HomeChangelogSection
 *
 * Requirements 7.1, 7.2
 *
 * 7.1 — Changelog_Section SHALL display between 2 and 4 entries.
 * 7.2 — Each change SHALL be classified as "Added", "Changed" or "Fixed",
 *        with visually distinct color per type.
 *
 * The component is mocked via vi.mock to control test data precisely.
 */

import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import HomeChangelogSection from '../playground/components/HomeChangelogSection.vue'
import {
  providePlaygroundLocale,
} from '../playground/composables/usePlaygroundLocale'
import type { ChangelogEntry } from '../playground/data/changelogData'

// ─── Mock changelogData ────────────────────────────────────────────────────────
// We override the module so each test can control which entries are exported.

const mockEntries: { value: ChangelogEntry[] } = { value: [] }

vi.mock('../playground/data/changelogData', () => ({
  get changelogEntries() {
    return mockEntries.value
  },
}))

// ─── Mounting helpers ──────────────────────────────────────────────────────────

function createLocaleWrapper() {
  const Wrapper = defineComponent({
    setup(_, { slots }) {
      const ctx = providePlaygroundLocale()
      ctx.setLocale('en')
      return () => slots.default?.()
    },
  })
  return Wrapper
}

function mountChangelog() {
  const Wrapper = createLocaleWrapper()
  return mount(Wrapper, {
    slots: {
      default: () => h(HomeChangelogSection),
    },
    attachTo: document.body,
  })
}

// ─── Cleanup ──────────────────────────────────────────────────────────────────

afterEach(() => {
  document.querySelectorAll('[data-v-app]').forEach((el) => el.remove())
  vi.restoreAllMocks()
  mockEntries.value = []
})

// ─── Tests: Entry count ────────────────────────────────────────────────────────

describe('HomeChangelogSection — entry count (Requirement 7.1)', () => {
  /**
   * Requirement 7.1
   * With exactly 4 entries provided, all 4 should be rendered.
   */
  it('renders exactly 4 changelog entries when 4 are provided', async () => {
    mockEntries.value = [
      {
        version: '1.0.0',
        date: '2025-01-01',
        changes: [{ type: 'Added', descKey: 'changelog.v0170.added1' }],
      },
      {
        version: '0.9.0',
        date: '2024-12-01',
        changes: [{ type: 'Fixed', descKey: 'changelog.v0160.fixed1' }],
      },
      {
        version: '0.8.0',
        date: '2024-11-01',
        changes: [{ type: 'Changed', descKey: 'changelog.v0140.changed1' }],
      },
      {
        version: '0.7.0',
        date: '2024-10-01',
        changes: [{ type: 'Added', descKey: 'changelog.v0150.added1' }],
      },
    ]

    const wrapper = mountChangelog()
    await nextTick()

    const entries = wrapper.findAll('.changelog-entry')
    expect(entries).toHaveLength(4)

    // Also verify the version texts are present
    const text = wrapper.text()
    expect(text).toContain('1.0.0')
    expect(text).toContain('0.9.0')
    expect(text).toContain('0.8.0')
    expect(text).toContain('0.7.0')

    wrapper.unmount()
  })

  /**
   * Requirement 7.1
   * When more than 4 entries are provided, only the first 4 are rendered
   * (component uses slice(0, 4)).
   */
  it('renders at most 4 entries even when more than 4 are provided', async () => {
    mockEntries.value = [
      {
        version: '1.0.0',
        date: '2025-01-01',
        changes: [{ type: 'Added', descKey: 'changelog.v0170.added1' }],
      },
      {
        version: '0.9.0',
        date: '2024-12-01',
        changes: [{ type: 'Fixed', descKey: 'changelog.v0160.fixed1' }],
      },
      {
        version: '0.8.0',
        date: '2024-11-01',
        changes: [{ type: 'Changed', descKey: 'changelog.v0140.changed1' }],
      },
      {
        version: '0.7.0',
        date: '2024-10-01',
        changes: [{ type: 'Added', descKey: 'changelog.v0150.added1' }],
      },
      {
        version: '0.6.0',
        date: '2024-09-01',
        changes: [{ type: 'Fixed', descKey: 'changelog.v0140.fixed1' }],
      },
    ]

    const wrapper = mountChangelog()
    await nextTick()

    const entries = wrapper.findAll('.changelog-entry')
    expect(entries).toHaveLength(4)

    // The 5th entry (v0.6.0) must not appear
    expect(wrapper.text()).not.toContain('0.6.0')

    wrapper.unmount()
  })
})

// ─── Tests: Empty changes filtered ────────────────────────────────────────────

describe('HomeChangelogSection — empty changes filter (Requirement 7.1)', () => {
  /**
   * Requirement 7.1
   * An entry with an empty changes array should be filtered out and not rendered.
   */
  it('does not render entries whose changes array is empty', async () => {
    mockEntries.value = [
      {
        version: '1.0.0',
        date: '2025-01-01',
        changes: [{ type: 'Added', descKey: 'changelog.v0170.added1' }],
      },
      {
        // This entry has no changes — should be filtered out
        version: '0.9.0',
        date: '2024-12-01',
        changes: [],
      },
      {
        version: '0.8.0',
        date: '2024-11-01',
        changes: [{ type: 'Changed', descKey: 'changelog.v0140.changed1' }],
      },
    ]

    const wrapper = mountChangelog()
    await nextTick()

    // Only the 2 entries with non-empty changes should appear
    const entries = wrapper.findAll('.changelog-entry')
    expect(entries).toHaveLength(2)

    // The empty-changes version must not be in the DOM
    expect(wrapper.text()).not.toContain('0.9.0')

    wrapper.unmount()
  })

  /**
   * Requirement 7.1
   * Multiple empty entries among 4 total should all be filtered out.
   */
  it('filters out multiple empty-changes entries', async () => {
    mockEntries.value = [
      {
        version: '1.0.0',
        date: '2025-01-01',
        changes: [{ type: 'Added', descKey: 'changelog.v0170.added1' }],
      },
      { version: '0.9.0', date: '2024-12-01', changes: [] },
      { version: '0.8.0', date: '2024-11-01', changes: [] },
      {
        version: '0.7.0',
        date: '2024-10-01',
        changes: [{ type: 'Fixed', descKey: 'changelog.v0160.fixed1' }],
      },
    ]

    const wrapper = mountChangelog()
    await nextTick()

    const entries = wrapper.findAll('.changelog-entry')
    expect(entries).toHaveLength(2)

    expect(wrapper.text()).toContain('1.0.0')
    expect(wrapper.text()).toContain('0.7.0')
    expect(wrapper.text()).not.toContain('0.9.0')
    expect(wrapper.text()).not.toContain('0.8.0')

    wrapper.unmount()
  })
})

// ─── Tests: Badge colors differ by type ───────────────────────────────────────

describe('HomeChangelogSection — badge color per type (Requirement 7.2)', () => {
  /**
   * Requirement 7.2
   * "Added" badges must use the green color classes (bg-green-500/20 text-green-400).
   * "Fixed" badges must use the yellow color classes (bg-yellow-500/20 text-yellow-400).
   * These two sets of classes must be distinct from each other.
   */
  it('applies different color classes to "Added" and "Fixed" badges', async () => {
    mockEntries.value = [
      {
        version: '1.0.0',
        date: '2025-01-01',
        changes: [
          { type: 'Added', descKey: 'changelog.v0170.added1' },
          { type: 'Fixed', descKey: 'changelog.v0160.fixed1' },
        ],
      },
    ]

    const wrapper = mountChangelog()
    await nextTick()

    // Find all badge elements within the entry
    const badges = wrapper.findAll('.changelog-entry span[class*="rounded-md"]')
    expect(badges.length).toBeGreaterThanOrEqual(2)

    // Locate the Added and Fixed badges by their text content
    const addedBadge = badges.find((b) => b.text().toLowerCase().includes('added'))
    const fixedBadge = badges.find((b) => b.text().toLowerCase().includes('fixed'))

    expect(addedBadge).toBeDefined()
    expect(fixedBadge).toBeDefined()

    const addedClass = addedBadge!.classes().join(' ')
    const fixedClass = fixedBadge!.classes().join(' ')

    // Both must contain "green" and "yellow" respectively
    expect(addedClass).toContain('green')
    expect(fixedClass).toContain('yellow')

    // They must differ from each other
    expect(addedClass).not.toBe(fixedClass)

    wrapper.unmount()
  })

  /**
   * Requirement 7.2
   * "Changed" badges use cyan classes; they differ from both "Added" (green)
   * and "Fixed" (yellow).
   */
  it('applies distinct color classes to all three badge types', async () => {
    mockEntries.value = [
      {
        version: '1.0.0',
        date: '2025-01-01',
        changes: [
          { type: 'Added', descKey: 'changelog.v0170.added1' },
          { type: 'Changed', descKey: 'changelog.v0170.changed1' },
          { type: 'Fixed', descKey: 'changelog.v0160.fixed1' },
        ],
      },
    ]

    const wrapper = mountChangelog()
    await nextTick()

    const badges = wrapper.findAll('.changelog-entry span[class*="rounded-md"]')
    expect(badges.length).toBeGreaterThanOrEqual(3)

    const addedBadge = badges.find((b) => b.text().toLowerCase().includes('added'))
    const changedBadge = badges.find((b) => b.text().toLowerCase().includes('changed'))
    const fixedBadge = badges.find((b) => b.text().toLowerCase().includes('fixed'))

    expect(addedBadge).toBeDefined()
    expect(changedBadge).toBeDefined()
    expect(fixedBadge).toBeDefined()

    const addedClass = addedBadge!.classes().join(' ')
    const changedClass = changedBadge!.classes().join(' ')
    const fixedClass = fixedBadge!.classes().join(' ')

    // Verify the specific color tokens
    expect(addedClass).toContain('green')
    expect(changedClass).toContain('cyan')
    expect(fixedClass).toContain('yellow')

    // All three must be distinct
    expect(addedClass).not.toBe(changedClass)
    expect(addedClass).not.toBe(fixedClass)
    expect(changedClass).not.toBe(fixedClass)

    wrapper.unmount()
  })
})
