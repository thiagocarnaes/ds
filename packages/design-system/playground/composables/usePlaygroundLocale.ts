import {
  computed,
  inject,
  onMounted,
  provide,
  ref,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from 'vue'
import { en, ptBR } from '../i18n'
import type { PlaygroundLocale, PlaygroundMessages } from '../i18n/types'

const STORAGE_KEY = 'ds-playground-locale'

const localeCatalog: Record<PlaygroundLocale, PlaygroundMessages> = {
  en,
  'pt-BR': ptBR,
}

export interface PlaygroundLocaleContext {
  locale: Ref<PlaygroundLocale>
  messages: ComputedRef<PlaygroundMessages>
  setLocale: (next: PlaygroundLocale) => void
  toggleLocale: () => void
  t: (path: string, params?: Record<string, string | number>) => string
}

const PlaygroundLocaleKey: InjectionKey<PlaygroundLocaleContext> = Symbol('playground-locale')

function applyDocumentLocale(locale: PlaygroundLocale): void {
  document.documentElement.lang = locale === 'pt-BR' ? 'pt-BR' : 'en'
}

function resolvePath(messages: PlaygroundMessages, path: string): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key]
    }
    return undefined
  }, messages)
}

function createTranslator(messages: ComputedRef<PlaygroundMessages>) {
  return (path: string, params?: Record<string, string | number>): string => {
    const value = resolvePath(messages.value, path)
    if (typeof value !== 'string') return path
    if (!params) return value
    return Object.entries(params).reduce(
      (text, [key, replacement]) => text.replace(`{${key}}`, String(replacement)),
      value,
    )
  }
}

function detectDefaultLocale(): PlaygroundLocale {
  return 'en'
}

export function providePlaygroundLocale(): PlaygroundLocaleContext {
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
  const initial: PlaygroundLocale =
    saved === 'en' || saved === 'pt-BR' ? saved : detectDefaultLocale()

  const locale = ref<PlaygroundLocale>(initial)
  const messages = computed(() => localeCatalog[locale.value])
  const t = createTranslator(messages)

  function setLocale(next: PlaygroundLocale): void {
    locale.value = next
    localStorage.setItem(STORAGE_KEY, next)
    applyDocumentLocale(next)
  }

  function toggleLocale(): void {
    setLocale(locale.value === 'en' ? 'pt-BR' : 'en')
  }

  onMounted(() => {
    applyDocumentLocale(locale.value)
  })

  const ctx: PlaygroundLocaleContext = { locale, messages, setLocale, toggleLocale, t }
  provide(PlaygroundLocaleKey, ctx)
  return ctx
}

export function usePlaygroundLocale(): PlaygroundLocaleContext {
  const ctx = inject(PlaygroundLocaleKey)
  if (!ctx) {
    throw new Error('usePlaygroundLocale() must be used within a component that calls providePlaygroundLocale()')
  }
  return ctx
}
