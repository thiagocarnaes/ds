import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import HomeQuickNavSection from '../playground/components/HomeQuickNavSection.vue'
import {
  providePlaygroundLocale,
  type PlaygroundLocaleContext,
} from '../playground/composables/usePlaygroundLocale'

const pushMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({ push: pushMock })),
  useRoute: vi.fn(() => ({ path: '/' })),
}))

function createLocaleWrapper() {
  let ctx: PlaygroundLocaleContext | null = null

  const Wrapper = defineComponent({
    setup(_, { slots }) {
      ctx = providePlaygroundLocale()
      ctx.setLocale('en')
      return () => slots.default?.()
    },
  })

  return { Wrapper, getCtx: () => ctx }
}

function mountQuickNav() {
  const { Wrapper } = createLocaleWrapper()

  const wrapper = mount(Wrapper, {
    slots: {
      default: () => h(HomeQuickNavSection),
    },
    attachTo: document.body,
  })

  return wrapper
}

afterEach(() => {
  document.querySelectorAll('[data-v-app]').forEach((el) => el.remove())
})

describe('HomeQuickNavSection — navigation via router', () => {
  beforeEach(() => {
    pushMock.mockClear()
  })

  it('navigates to /foundations when Foundations card is clicked', async () => {
    const wrapper = mountQuickNav()
    await nextTick()

    const cards = wrapper.findAll('[role="button"]')
    expect(cards.length).toBe(3)

    await cards[0].trigger('click')
    expect(pushMock).toHaveBeenCalledWith('/foundations')

    wrapper.unmount()
  })

  it('navigates to /catalog when Components card is clicked', async () => {
    const wrapper = mountQuickNav()
    await nextTick()

    const cards = wrapper.findAll('[role="button"]')
    expect(cards.length).toBe(3)

    await cards[1].trigger('click')
    expect(pushMock).toHaveBeenCalledWith('/catalog')

    wrapper.unmount()
  })

  it('navigates to /docs when Docs card is clicked', async () => {
    const wrapper = mountQuickNav()
    await nextTick()

    const cards = wrapper.findAll('[role="button"]')
    expect(cards.length).toBe(3)

    await cards[2].trigger('click')
    expect(pushMock).toHaveBeenCalledWith('/docs')

    wrapper.unmount()
  })

  it('navigates to correct paths for all cards in sequence', async () => {
    const wrapper = mountQuickNav()
    await nextTick()

    const cards = wrapper.findAll('[role="button"]')
    expect(cards.length).toBe(3)

    await cards[0].trigger('click')
    await cards[1].trigger('click')
    await cards[2].trigger('click')

    expect(pushMock).toHaveBeenCalledTimes(3)
    expect(pushMock.mock.calls[0]).toEqual(['/foundations'])
    expect(pushMock.mock.calls[1]).toEqual(['/catalog'])
    expect(pushMock.mock.calls[2]).toEqual(['/docs'])

    wrapper.unmount()
  })

  it('navigates with correct path when Enter is pressed on each card', async () => {
    const wrapper = mountQuickNav()
    await nextTick()

    const cards = wrapper.findAll('[role="button"]')
    expect(cards.length).toBe(3)

    const expectedPaths = ['/foundations', '/catalog', '/docs']

    for (let i = 0; i < cards.length; i++) {
      await cards[i].trigger('keydown', { key: 'Enter' })
    }

    expect(pushMock).toHaveBeenCalledTimes(3)
    for (let i = 0; i < 3; i++) {
      expect(pushMock.mock.calls[i]).toEqual([expectedPaths[i]])
    }

    wrapper.unmount()
  })
})
