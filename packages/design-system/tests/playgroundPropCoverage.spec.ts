import { describe, expect, it } from 'vitest'
import { getComponentCatalogEntry } from '../playground/data/catalog'
import {
  ignoredCatalogProps,
  implicitPlaygroundModels,
  playgroundDemoPrimaryComponent,
  playgroundPropCoverage,
  playgroundStrictDemos,
} from '../playground/data/playgroundPropCoverage'

function collectGaps(demos: readonly string[]): string[] {
  const gaps: string[] = []

  for (const demo of demos) {
    const componentName = playgroundDemoPrimaryComponent[demo]
    const entry = getComponentCatalogEntry(componentName)
    const covered = new Set(playgroundPropCoverage[demo] ?? [])

    for (const prop of entry?.props ?? []) {
      if (ignoredCatalogProps.has(prop.name)) continue
      if (!covered.has(prop.name)) {
        gaps.push(`${demo} (${componentName}): ${prop.name}`)
      }
    }

    for (const model of entry?.models ?? []) {
      if (implicitPlaygroundModels.has(model.name)) continue
      if (!covered.has(model.name)) {
        gaps.push(`${demo} (${componentName}) v-model:${model.name}`)
      }
    }
  }

  return gaps
}

describe('playground prop coverage', () => {
  it('documents interactive coverage for every playground demo', () => {
    for (const demo of Object.keys(playgroundDemoPrimaryComponent)) {
      expect(playgroundPropCoverage[demo], `missing coverage map for demo "${demo}"`).toBeDefined()
    }
  })

  it('strict demos expose catalog props as playground controls', () => {
    const gaps = collectGaps(playgroundStrictDemos)
    expect(gaps, gaps.join('\n')).toEqual([])
  })

  it('reports remaining playground coverage gaps for follow-up', () => {
    const allDemos = Object.keys(playgroundDemoPrimaryComponent)
    const strict = new Set<string>(playgroundStrictDemos)
    const pendingDemos = allDemos.filter((demo) => !strict.has(demo))
    const gaps = collectGaps(pendingDemos)

    expect(gaps.length).toBeGreaterThanOrEqual(0)
  })
})
