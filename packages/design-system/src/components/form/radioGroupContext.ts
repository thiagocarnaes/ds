import type { InjectionKey, Ref } from 'vue'

export interface RadioGroupContext {
  modelValue: Ref<string | number | undefined>
  name: string
  disabled: Ref<boolean>
  update: (value: string | number) => void
}

export const RADIO_GROUP_KEY: InjectionKey<RadioGroupContext> = Symbol('RadioGroup')
