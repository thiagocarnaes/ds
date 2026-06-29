import type { VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import * as fc from 'fast-check'
import type App from '../playground/App.vue'
import { mountAppWithRouter } from './helpers/routerMount'

type AppWrapper = VueWrapper<InstanceType<typeof App>>

function isPurposeSectionVisible(wrapper: AppWrapper): boolean {
  const purposeCards = wrapper.findAll('.purpose-benefit-card')
  return purposeCards.length > 0
}

function isPrinciplesSectionVisible(wrapper: AppWrapper): boolean {
  const principleCards = wrapper.findAll('.principle-card')
  return principleCards.length > 0
}

function isChangelogSectionVisible(wrapper: AppWrapper): boolean {
  const changelogEntries = wrapper.findAll('.changelog-entry')
  return changelogEntries.length > 0
}

afterEach(() => {
  document.querySelectorAll('[data-v-app]').forEach((el) => el.remove())
})

describe('Property 5 — Seções Condicionais Ocultas quando fora da Home (Requirements 3.6, 4.6, 7.5)', () => {
  it('editorial sections are absent from DOM when navigating away from home (100 runs)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<'/foundations' | '/catalog' | '/docs'>('/foundations', '/catalog', '/docs'),
        async (path) => {
          const { wrapper, router } = await mountAppWithRouter()

          await router.push(path)
          await nextTick()

          const purposeVisible = isPurposeSectionVisible(wrapper)
          const principlesVisible = isPrinciplesSectionVisible(wrapper)
          const changelogVisible = isChangelogSectionVisible(wrapper)

          wrapper.unmount()

          return !purposeVisible && !principlesVisible && !changelogVisible
        },
      ),
      { numRuns: 10, seed: 42 },
    )
  }, 30000)

  it.each(['/foundations', '/catalog', '/docs'] as const)(
    'HomePurposeSection is absent from DOM when at path="%s"',
    async (path) => {
      const { wrapper, router } = await mountAppWithRouter()

      expect(
        isPurposeSectionVisible(wrapper),
        'HomePurposeSection should be present in the initial home state',
      ).toBe(true)

      await router.push(path)
      await nextTick()

      expect(
        isPurposeSectionVisible(wrapper),
        `HomePurposeSection must be absent from DOM when at "${path}"`,
      ).toBe(false)

      wrapper.unmount()
    },
  )

  it.each(['/foundations', '/catalog', '/docs'] as const)(
    'HomePrinciplesSection is absent from DOM when at path="%s"',
    async (path) => {
      const { wrapper, router } = await mountAppWithRouter()
      await nextTick()

      expect(
        isPrinciplesSectionVisible(wrapper),
        'HomePrinciplesSection should be present in the initial home state',
      ).toBe(true)

      await router.push(path)
      await nextTick()

      expect(
        isPrinciplesSectionVisible(wrapper),
        `HomePrinciplesSection must be absent from DOM when at "${path}"`,
      ).toBe(false)

      wrapper.unmount()
    },
  )

  it.each(['/foundations', '/catalog', '/docs'] as const)(
    'HomeChangelogSection is absent from DOM when at path="%s"',
    async (path) => {
      const { wrapper, router } = await mountAppWithRouter()
      await nextTick()

      expect(
        isChangelogSectionVisible(wrapper),
        'HomeChangelogSection should be present in the initial home state',
      ).toBe(true)

      await router.push(path)
      await nextTick()

      expect(
        isChangelogSectionVisible(wrapper),
        `HomeChangelogSection must be absent from DOM when at "${path}"`,
      ).toBe(false)

      wrapper.unmount()
    },
  )

  it('conditional sections appear/disappear reactively as route changes', async () => {
    const { wrapper, router } = await mountAppWithRouter()
    await nextTick()

    expect(isPurposeSectionVisible(wrapper), 'Purpose: present at /').toBe(true)
    expect(isPrinciplesSectionVisible(wrapper), 'Principles: present at /').toBe(true)
    expect(isChangelogSectionVisible(wrapper), 'Changelog: present at /').toBe(true)

    await router.push('/foundations')
    await nextTick()
    expect(isPurposeSectionVisible(wrapper), 'Purpose: absent at /foundations').toBe(false)
    expect(isPrinciplesSectionVisible(wrapper), 'Principles: absent at /foundations').toBe(false)
    expect(isChangelogSectionVisible(wrapper), 'Changelog: absent at /foundations').toBe(false)

    await router.push('/')
    await nextTick()
    expect(isPurposeSectionVisible(wrapper), 'Purpose: present again after returning to /').toBe(true)
    expect(isPrinciplesSectionVisible(wrapper), 'Principles: present again after returning to /').toBe(true)
    expect(isChangelogSectionVisible(wrapper), 'Changelog: present again after returning to /').toBe(true)

    wrapper.unmount()
  })

  it('all three conditional sections are simultaneously absent for any non-home path', async () => {
    for (const path of ['/foundations', '/catalog', '/docs'] as const) {
      const { wrapper, router } = await mountAppWithRouter()
      await nextTick()

      await router.push(path)
      await nextTick()

      expect(
        isPurposeSectionVisible(wrapper),
        `Purpose visible at "${path}" — must be false`,
      ).toBe(false)
      expect(
        isPrinciplesSectionVisible(wrapper),
        `Principles visible at "${path}" — must be false`,
      ).toBe(false)
      expect(
        isChangelogSectionVisible(wrapper),
        `Changelog visible at "${path}" — must be false`,
      ).toBe(false)

      wrapper.unmount()
    }
  })
})
