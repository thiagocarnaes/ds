import type { ComponentCatalogEntry } from './types'
import { componentCatalogEntries } from './entries'
import { usageSnippets } from './usageSnippets'

export type {
  CatalogComposable,
  CatalogComposableMethod,
  CatalogEvent,
  CatalogModel,
  CatalogProp,
  CatalogSlot,
  ComponentCatalogEntry,
} from './types'

export { cls, e, m, p, s } from './helpers'
export { componentCatalogEntries } from './entries'
export { usageSnippets } from './usageSnippets'

export function getComponentCatalogEntry(name: string): ComponentCatalogEntry | undefined {
  return componentCatalogEntries[name]
}

export function getComponentUsage(name: string): string {
  return usageSnippets[name] ?? componentCatalogEntries[name]?.usage ?? ''
}
