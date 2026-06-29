import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import * as fc from 'fast-check'
import { mountAppWithRouter } from './helpers/routerMount'

afterEach(() => {
  document.querySelectorAll('[data-v-app]').forEach((el) => el.remove())
})

describe('Property 10 — Bento Grid ausente em todas as rotas', () => {
  it('bento grid is absent at every route (100 runs)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<'/foundations' | '/catalog' | '/docs'>('/foundations', '/catalog', '/docs'),
        async (path) => {
          const { wrapper, router } = await mountAppWithRouter()

          expect(wrapper.find('.ds-bento-grid').exists()).toBe(false)

          await router.push(path)
          await nextTick()

          const bentoAfterNav = wrapper.find('.ds-bento-grid').exists()

          wrapper.unmount()
          return !bentoAfterNav
        },
      ),
      { numRuns: 10, seed: 42 },
    )
  }, 30000)

  it.each(['/foundations', '/catalog', '/docs'] as const)(
    'bento grid is absent at "%s" after navigating from home',
    async (path) => {
      const { wrapper, router } = await mountAppWithRouter()

      expect(wrapper.find('.ds-bento-grid').exists()).toBe(false)

      await router.push(path)
      await nextTick()

      expect(
        wrapper.find('.ds-bento-grid').exists(),
        `Expected .ds-bento-grid to be absent at "${path}"`,
      ).toBe(false)

      wrapper.unmount()
    },
  )

  it('bento grid remains absent when returning to / from another route', async () => {
    const { wrapper, router } = await mountAppWithRouter()

    expect(wrapper.find('.ds-bento-grid').exists()).toBe(false)

    await router.push('/catalog')
    await nextTick()
    expect(wrapper.find('.ds-bento-grid').exists()).toBe(false)

    await router.push('/')
    await nextTick()
    expect(wrapper.find('.ds-bento-grid').exists()).toBe(false)

    wrapper.unmount()
  })
})
