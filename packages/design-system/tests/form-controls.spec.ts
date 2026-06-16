import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Checkbox from '@/components/form/Checkbox.vue'
import RadioGroup from '@/components/form/RadioGroup.vue'
import Radio from '@/components/form/Radio.vue'
import Switch from '@/components/form/Switch.vue'
import Select from '@/components/form/Select.vue'
import FormField from '@/components/form/FormField.vue'
import Input from '@/components/form/Input.vue'

describe('Checkbox', () => {
  it('toggles value', async () => {
    const wrapper = mount(Checkbox, { props: { modelValue: false } })
    await wrapper.find('input').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('cycles indeterminate to checked to unchecked', async () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: false, indeterminate: true },
    })

    await wrapper.find('input').trigger('click')
    expect(wrapper.emitted('update:indeterminate')?.[0]).toEqual([false])
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])

    await wrapper.setProps({ modelValue: true, indeterminate: false })
    await wrapper.find('input').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([false])
  })

  it('returns to indeterminate when cycleIndeterminate is enabled', async () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: true, indeterminate: false, cycleIndeterminate: true },
    })

    await wrapper.find('input').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    expect(wrapper.emitted('update:indeterminate')?.[0]).toEqual([true])
  })

  it('renders indeterminate dash', () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: false, indeterminate: true, label: 'Partial' },
    })
    expect(wrapper.text()).toContain('Partial')
    expect(wrapper.find('rect').exists()).toBe(true)
    expect(wrapper.find('path').exists()).toBe(false)
  })
})

describe('RadioGroup', () => {
  it('renders radio inputs', () => {
    const wrapper = mount(RadioGroup, {
      props: { modelValue: 'a', name: 'group' },
      slots: { default: '<input type="radio" />' },
    })
    expect(wrapper.find('input[type="radio"]').exists()).toBe(true)
  })
})

describe('Switch', () => {
  it('has switch role', () => {
    const wrapper = mount(Switch, { props: { modelValue: false } })
    expect(wrapper.find('[role="switch"]').exists()).toBe(true)
  })
})

describe('Select', () => {
  const options = [
    { label: 'One', value: '1' },
    { label: 'Two', value: '2' },
  ]

  it('opens custom dropdown and selects option', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: '', options },
      attachTo: document.body,
    })

    await wrapper.find('[role="combobox"]').trigger('click')
    await nextTick()

    expect(document.body.querySelector('[role="listbox"]')).toBeTruthy()

    const optionButtons = document.body.querySelectorAll('[role="option"]')
    expect(optionButtons).toHaveLength(2)
    ;(optionButtons[0] as HTMLButtonElement).click()
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['1'])
    wrapper.unmount()
  })

  it('filters options when searching', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: '', options },
      attachTo: document.body,
    })

    await wrapper.find('[role="combobox"]').trigger('click')
    await nextTick()

    const search = document.body.querySelector('input[placeholder="Search..."]') as HTMLInputElement
    search.value = 'Two'
    search.dispatchEvent(new Event('input'))
    await nextTick()

    expect(document.body.querySelectorAll('[role="option"]')).toHaveLength(1)
    expect(document.body.querySelector('[role="option"]')?.textContent).toContain('Two')
    wrapper.unmount()
  })

  it('supports multiple selection with tags', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: ['1'],
        multiple: true,
        options,
      },
      attachTo: document.body,
    })

    expect(wrapper.text()).toContain('One')

    await wrapper.find('[role="combobox"]').trigger('click')
    await nextTick()

    const optionsEls = document.body.querySelectorAll('[role="option"]')
    expect(optionsEls).toHaveLength(2)
    ;(optionsEls[1] as HTMLButtonElement).click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['1', '2']])

    wrapper.unmount()
  })

  it('clears all selected tags in multi mode', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: ['1', '2'],
        multiple: true,
        options,
      },
      attachTo: document.body,
    })

    await wrapper.find('[role="combobox"]').trigger('click')
    await nextTick()

    const clearButton = Array.from(document.body.querySelectorAll('button')).find(
      (btn) => btn.textContent?.trim() === 'Clear all',
    )
    expect(clearButton).toBeTruthy()
    clearButton!.click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([[]])

    wrapper.unmount()
  })
})

describe('FormField', () => {
  it('renders label text', () => {
    const wrapper = mount(FormField, {
      props: { label: 'Email', helper: 'Required field' },
      slots: { default: '<input />' },
    })
    expect(wrapper.text()).toContain('Email')
    expect(wrapper.text()).toContain('Required field')
  })
})
