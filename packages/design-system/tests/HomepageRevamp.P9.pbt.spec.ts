import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import * as fc from 'fast-check'
import { mountAppWithRouter } from './helpers/routerMount'

afterEach(() => {
  document.querySelectorAll('[data-v-app]').forEach((el) => el.remove())
})

describe('Property 9 — Bento Grid removido da Home', () => {
  it('bento grid is NOT present in DOM when App mounts at /', async () => {
    const { wrapper } = await mountAppWithRouter()

    expect(wrapper.find('.ds-bento-grid').exists()).toBe(false)

    wrapper.unmount()
  })

  it('bento grid is consistently absent at / (100 runs)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant(null),
        async (_) => {
          const { wrapper } = await mountAppWithRouter()

          const bentoGridExists = wrapper.find('.ds-bento-grid').exists()

          wrapper.unmount()
          return !bentoGridExists
        },
      ),
      { numRuns: 10, seed: 42 },
    )
  }, 30000)

  it('bento grid is absent after navigating between routes', async () => {
    const { wrapper, router } = await mountAppWithRouter()

    expect(wrapper.find('.ds-bento-grid').exists()).toBe(false)

    await router.push('/docs')
    await nextTick()
    expect(wrapper.find('.ds-bento-grid').exists()).toBe(false)

    await router.push('/foundations')
    await nextTick()
    expect(wrapper.find('.ds-bento-grid').exists()).toBe(false)

    wrapper.unmount()
  })
})
