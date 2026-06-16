import type { InjectionKey, Ref } from 'vue'

export interface TabsContext {
  activeTab: Ref<string>
  setActiveTab: (value: string) => void
  registerTab: (value: string) => void
  unregisterTab: (value: string) => void
  tabIds: Ref<string[]>
}

export const TABS_INJECTION_KEY: InjectionKey<TabsContext> = Symbol('ds-tabs')
