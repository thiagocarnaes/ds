/**
 * Tests — usePlaygroundLocale / PlaygroundLocaleSelect (Task 8)
 *
 * Verifies:
 *   - Property 4: t() returns the value corresponding to the active locale
 *   - Property 5: setLocale persists locale in localStorage
 *   - Property 6: New context initialises with the saved locale
 *   - Edge case (Req 6.6): usePlaygroundLocale() outside providePlaygroundLocale() throws a descriptive error
 *
 * Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import * as fc from 'fast-check'
import { en, ptBR } from '../playground/i18n'
import type { PlaygroundLocale } from '../playground/i18n/types'
import {
  providePlaygroundLocale,
  usePlaygroundLocale,
} from '../playground/composables/usePlaygroundLocale'

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'ds-playground-locale'

/**
 * A representative, stable set of dot-notation paths that exist in both
 * the `en` and `pt-BR` catalogs and are simple strings (not objects).
 * These paths are used by Property 4 to verify t() returns the right value.
 */
const SAMPLE_PATHS: string[] = [
  'app.title',
  'app.stable',
  'theme.lightMode',
  'theme.darkMode',
  'locale.selectLabel',
  'hero.subtitle',
  'usage.label',
  'usage.copy',
  'usage.copied',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Resolves a dot-notation path in a plain object tree.
 * Returns undefined if any key is missing.
 */
function resolvePath(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

/**
 * Creates a minimal Vue component that calls providePlaygroundLocale()
 * and exposes the returned context for assertions.
 */
function makeProviderWrapper() {
  let ctx: ReturnType<typeof providePlaygroundLocale> | undefined

  const Wrapper = defineComponent({
    setup() {
      ctx = providePlaygroundLocale()
      return {}
    },
    template: '<slot />',
  })

  return { Wrapper, getCtx: () => ctx! }
}

// ─── Cleanup ─────────────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.removeItem(STORAGE_KEY)
})

afterEach(() => {
  localStorage.removeItem(STORAGE_KEY)
})

// ─── Property 4: t() returns the value of the active locale ──────────────────

describe('Property 4 — t() returns the value corresponding to the active locale', () => {
  /**
   * **Validates: Requirements 6.1, 6.2**
   *
   * For any locale in {'en', 'pt-BR'} and any representative translation path,
   * after calling setLocale(locale), t(path) must return the expected string
   * from the corresponding catalog.
   */
  it('returns the correct string for every sample path after each setLocale call', async () => {
    const { Wrapper, getCtx } = makeProviderWrapper()

    const wrapper = mount(Wrapper)
    await nextTick()

    const { setLocale, t } = getCtx()

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<PlaygroundLocale>('en', 'pt-BR'),
        fc.constantFrom(...SAMPLE_PATHS),
        async (locale, path) => {
          setLocale(locale)
          await nextTick()

          const catalog = locale === 'en'
            ? (en as unknown as Record<string, unknown>)
            : (ptBR as unknown as Record<string, unknown>)

          const expected = resolvePath(catalog, path)

          // Only assert when the path resolves to a plain string in the catalog
          if (typeof expected === 'string') {
            const actual = t(path)
            expect(actual, `locale=${locale}, path=${path}`).toBe(expected)
          }
        },
      ),
      { numRuns: 100, seed: 42 },
    )

    wrapper.unmount()
  })

  it('switching from en to pt-BR updates t() immediately', async () => {
    const { Wrapper, getCtx } = makeProviderWrapper()
    const wrapper = mount(Wrapper)
    await nextTick()

    const { setLocale, t } = getCtx()

    setLocale('en')
    await nextTick()
    expect(t('app.title')).toBe(en.app.title)

    setLocale('pt-BR')
    await nextTick()
    expect(t('app.title')).toBe(ptBR.app.title)

    wrapper.unmount()
  })

  it('switching from pt-BR back to en restores original values', async () => {
    const { Wrapper, getCtx } = makeProviderWrapper()
    const wrapper = mount(Wrapper)
    await nextTick()

    const { setLocale, t } = getCtx()

    setLocale('pt-BR')
    await nextTick()
    const ptTitle = t('app.title')
    expect(ptTitle).toBe(ptBR.app.title)

    setLocale('en')
    await nextTick()
    expect(t('app.title')).toBe(en.app.title)

    wrapper.unmount()
  })
})

// ─── Property 5: setLocale persists to localStorage ──────────────────────────

describe('Property 5 — setLocale persists the locale in localStorage', () => {
  /**
   * **Validates: Requirements 6.3**
   *
   * For any valid locale, after setLocale(locale),
   * localStorage.getItem(STORAGE_KEY) === locale.
   */
  it('persists any valid locale to localStorage', async () => {
    const { Wrapper, getCtx } = makeProviderWrapper()
    const wrapper = mount(Wrapper)
    await nextTick()

    const { setLocale } = getCtx()

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<PlaygroundLocale>('en', 'pt-BR'),
        async (locale) => {
          setLocale(locale)
          await nextTick()
          expect(localStorage.getItem(STORAGE_KEY)).toBe(locale)
        },
      ),
      { numRuns: 100, seed: 84 },
    )

    wrapper.unmount()
  })

  it('persists "en" to localStorage when setLocale("en") is called', async () => {
    const { Wrapper, getCtx } = makeProviderWrapper()
    const wrapper = mount(Wrapper)
    await nextTick()

    getCtx().setLocale('en')
    await nextTick()

    expect(localStorage.getItem(STORAGE_KEY)).toBe('en')
    wrapper.unmount()
  })

  it('persists "pt-BR" to localStorage when setLocale("pt-BR") is called', async () => {
    const { Wrapper, getCtx } = makeProviderWrapper()
    const wrapper = mount(Wrapper)
    await nextTick()

    getCtx().setLocale('pt-BR')
    await nextTick()

    expect(localStorage.getItem(STORAGE_KEY)).toBe('pt-BR')
    wrapper.unmount()
  })

  it('overwrites previous locale value in localStorage on subsequent calls', async () => {
    const { Wrapper, getCtx } = makeProviderWrapper()
    const wrapper = mount(Wrapper)
    await nextTick()

    const { setLocale } = getCtx()

    setLocale('pt-BR')
    await nextTick()
    expect(localStorage.getItem(STORAGE_KEY)).toBe('pt-BR')

    setLocale('en')
    await nextTick()
    expect(localStorage.getItem(STORAGE_KEY)).toBe('en')

    wrapper.unmount()
  })
})

// ─── Property 6: New context initialises with the saved locale ───────────────

describe('Property 6 — New context initialises with the locale saved in localStorage', () => {
  /**
   * **Validates: Requirements 6.4**
   *
   * For any valid locale saved in localStorage before providePlaygroundLocale()
   * is called, the new context must have locale.value equal to the saved value.
   */
  it('initialises locale.value from any saved localStorage value', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<PlaygroundLocale>('en', 'pt-BR'),
        async (savedLocale) => {
          localStorage.setItem(STORAGE_KEY, savedLocale)

          let capturedLocale: PlaygroundLocale | undefined

          const Wrapper = defineComponent({
            setup() {
              const ctx = providePlaygroundLocale()
              capturedLocale = ctx.locale.value
              return {}
            },
            template: '<div />',
          })

          const wrapper = mount(Wrapper)
          await nextTick()
          wrapper.unmount()

          expect(capturedLocale, `saved=${savedLocale}`).toBe(savedLocale)
          localStorage.removeItem(STORAGE_KEY)
        },
      ),
      { numRuns: 100, seed: 126 },
    )
  })

  it('defaults to "en" when no locale is saved in localStorage', async () => {
    localStorage.removeItem(STORAGE_KEY)

    let capturedLocale: PlaygroundLocale | undefined

    const Wrapper = defineComponent({
      setup() {
        const ctx = providePlaygroundLocale()
        capturedLocale = ctx.locale.value
        return {}
      },
      template: '<div />',
    })

    const wrapper = mount(Wrapper)
    await nextTick()
    wrapper.unmount()

    expect(capturedLocale).toBe('en')
  })

  it('ignores unknown localStorage values and defaults to "en"', async () => {
    localStorage.setItem(STORAGE_KEY, 'fr') // invalid locale

    let capturedLocale: PlaygroundLocale | undefined

    const Wrapper = defineComponent({
      setup() {
        const ctx = providePlaygroundLocale()
        capturedLocale = ctx.locale.value
        return {}
      },
      template: '<div />',
    })

    const wrapper = mount(Wrapper)
    await nextTick()
    wrapper.unmount()

    expect(capturedLocale).toBe('en')
  })
})

// ─── Edge case (Req 6.6): usePlaygroundLocale() without a provider ────────────

describe('Edge case — usePlaygroundLocale() throws outside providePlaygroundLocale()', () => {
  /**
   * **Validates: Requirements 6.6**
   *
   * Calling usePlaygroundLocale() without a parent that called
   * providePlaygroundLocale() must throw an error containing the word
   * "providePlaygroundLocale" to be self-descriptive.
   */
  it('throws a descriptive error when no provider is present in the tree', () => {
    const NoProviderWrapper = defineComponent({
      setup() {
        // This must throw
        usePlaygroundLocale()
        return {}
      },
      template: '<div />',
    })

    expect(() => {
      mount(NoProviderWrapper)
    }).toThrow(/providePlaygroundLocale/i)
  })

  it('thrown error message mentions "must be used within"', () => {
    const NoProviderWrapper = defineComponent({
      setup() {
        usePlaygroundLocale()
        return {}
      },
      template: '<div />',
    })

    expect(() => {
      mount(NoProviderWrapper)
    }).toThrow(/must be used within/i)
  })
})

// ─── Integration: locale reactivity with setLocale ───────────────────────────

describe('Integration — locale.value updates reactively when setLocale is called', () => {
  /**
   * **Validates: Requirements 6.1, 6.2, 6.5**
   *
   * locale.value must always reflect the last locale set via setLocale.
   */
  it('locale.value equals the last locale passed to setLocale', async () => {
    const { Wrapper, getCtx } = makeProviderWrapper()
    const wrapper = mount(Wrapper)
    await nextTick()

    const { locale, setLocale } = getCtx()

    setLocale('pt-BR')
    await nextTick()
    expect(locale.value).toBe('pt-BR')

    setLocale('en')
    await nextTick()
    expect(locale.value).toBe('en')

    wrapper.unmount()
  })

  it('messages computed updates when locale changes', async () => {
    const { Wrapper, getCtx } = makeProviderWrapper()
    const wrapper = mount(Wrapper)
    await nextTick()

    const { messages, setLocale } = getCtx()

    setLocale('en')
    await nextTick()
    expect(messages.value.app.title).toBe(en.app.title)

    setLocale('pt-BR')
    await nextTick()
    expect(messages.value.app.title).toBe(ptBR.app.title)

    wrapper.unmount()
  })
})
