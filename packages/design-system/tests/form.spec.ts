import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from '@/components/form/Input.vue'
import Textarea from '@/components/form/Textarea.vue'

describe('Input', () => {
  it('binds model value', async () => {
    const wrapper = mount(Input, { props: { modelValue: 'hello' } })
    const input = wrapper.find('input')
    expect((input.element as HTMLInputElement).value).toBe('hello')
    await input.setValue('world')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['world'])
  })

  it('shows error message', () => {
    const wrapper = mount(Input, {
      props: { error: true, message: 'Required' },
    })
    expect(wrapper.text()).toContain('Required')
  })
})

describe('Textarea', () => {
  it('binds model value', async () => {
    const wrapper = mount(Textarea, { props: { modelValue: 'note' } })
    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('note')
  })

  it('passes rows to the textarea element', () => {
    const wrapper = mount(Textarea, { props: { rows: 6 } })
    expect((wrapper.find('textarea').element as HTMLTextAreaElement).getAttribute('rows')).toBe('6')
  })
})
