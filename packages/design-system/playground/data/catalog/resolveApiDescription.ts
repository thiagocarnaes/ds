import type { PlaygroundLocale } from '../../i18n/types'
import { componentCatalogApiDescriptionsPtBR } from '../../i18n/componentCatalogApiDescriptions'

export function resolveApiDescription(
  description: string | undefined,
  locale: PlaygroundLocale,
): string | undefined {
  if (!description) return description
  if (locale === 'pt-BR') {
    return componentCatalogApiDescriptionsPtBR[description] ?? description
  }
  return description
}
