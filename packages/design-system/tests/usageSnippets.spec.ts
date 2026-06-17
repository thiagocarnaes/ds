import { describe, expect, it } from 'vitest'
import { componentCatalogEntries } from '../playground/data/catalog/entries'
import { usageSnippets } from '../playground/data/catalog/usageSnippets'
import {
  findBareComponentProps,
  propTemplateBinding,
} from '../playground/utils/propTemplateName'

describe('componentCatalogEntries', () => {
  it('documents :variant only — never :appearance', () => {
    for (const [name, entry] of Object.entries(componentCatalogEntries)) {
      const appearanceProps = (entry.props ?? []).filter((prop) => prop.name === 'appearance')
      expect(appearanceProps, `${name} still documents :appearance`).toEqual([])
    }
  })
})

describe('usageSnippets', () => {
  it('binds all component props with : in catalog usage templates', () => {
    for (const [name, snippet] of Object.entries(usageSnippets)) {
      const template = snippet.includes('<template>')
        ? snippet.slice(snippet.indexOf('<template>'))
        : snippet

      const violations = findBareComponentProps(template)
      expect(violations, `${name} has bare props: ${violations.join(', ')}`).toEqual([])
    }
  })

  it('never uses :appearance in catalog usage templates', () => {
    for (const [name, snippet] of Object.entries(usageSnippets)) {
      expect(snippet, `${name} usage mentions :appearance`).not.toMatch(/:appearance|appearance=/)
    }
  })
})

describe('propTemplateBinding', () => {
  it('formats camelCase and kebab-case prop names', () => {
    expect(propTemplateBinding('showHeader')).toBe(':show-header')
    expect(propTemplateBinding('aria-label')).toBe(':aria-label')
    expect(propTemplateBinding('class')).toBe(':class')
  })
})

describe('findBareComponentProps', () => {
  it('allows static class attrs', () => {
    expect(findBareComponentProps('<Skeleton class="h-4 w-full" />')).toEqual([])
  })

  it('flags bare variant attrs', () => {
    expect(findBareComponentProps('<Button variant="primary">Save</Button>')).toContain('Button.variant')
  })
})
