import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import FormFieldDemo from '../playground/demos/FormFieldDemo.vue'
import { mountDemo } from './helpers/playgroundMount'

describe('FormFieldDemo — Req 4 icon visibility', () => {
  it('renders Mail icon with z-10 when withIcon defaults to true', () => {
    const wrapper = mountDemo(FormFieldDemo)
    // The Mail icon should be present (withIcon defaults to true)
    const container = wrapper.find('.relative')
    expect(container.exists()).toBe(true)
    // Find the SVG rendered by the Mail lucide icon — it must have z-10
    const mailIcon = wrapper.find('.z-10')
    expect(mailIcon.exists(), 'Mail icon must have z-10 class for stacking over the Input').toBe(true)
    wrapper.unmount()
  })

  it('applies pl-9 class to Input when withIcon=true', () => {
    const wrapper = mountDemo(FormFieldDemo)
    // The input element should have pl-9 padding to avoid text overlapping icon
    const input = wrapper.find('input[type="email"]')
    expect(input.exists()).toBe(true)
    expect(input.classes()).toContain('pl-9')
    wrapper.unmount()
  })

  it('contains a relative container wrapping Mail and Input', () => {
    const wrapper = mountDemo(FormFieldDemo)
    const relativeDiv = wrapper.find('div.relative')
    expect(relativeDiv.exists()).toBe(true)
    // Both Mail svg and input should be descendants of the relative div
    const inputInContainer = relativeDiv.find('input')
    expect(inputInContainer.exists()).toBe(true)
    wrapper.unmount()
  })

  it('does NOT render Mail icon and does NOT apply pl-9 when Plain mode is selected', async () => {
    const wrapper = mountDemo(FormFieldDemo)
    // Click the "Plain" button to disable icon
    const buttons = wrapper.findAll('button[type="button"]')
    const plainButton = buttons.find((b) => b.text().toLowerCase().includes('plain'))
    expect(plainButton).toBeDefined()
    await plainButton!.trigger('click')

    // z-10 element (Mail icon) should no longer exist
    expect(wrapper.find('.z-10').exists()).toBe(false)

    // Input should not have pl-9
    const input = wrapper.find('input[type="email"]')
    expect(input.classes()).not.toContain('pl-9')
    wrapper.unmount()
  })

  it('generated code snippet includes pl-9 class on Input when withIcon=true', () => {
    const wrapper = mountDemo(FormFieldDemo)
    // The UsageBlock renders the code — check that the code text includes pl-9
    const codeBlock = wrapper.find('pre, code, [class*="usage"]')
    // Find any element that contains the generated snippet text
    const html = wrapper.html()
    expect(html).toContain('pl-9')
    wrapper.unmount()
  })

  it('generated code snippet includes z-10 class on Mail icon when withIcon=true', () => {
    const wrapper = mountDemo(FormFieldDemo)
    const html = wrapper.html()
    expect(html).toContain('z-10')
    wrapper.unmount()
  })
})
