import type { InjectionKey, Ref } from 'vue'

export interface TabsContext {
  activeTab: Ref<string>
  setActiveTab: (value: string) => void
  registerTab: (value: string) => void
  unregisterTab: (value: string) => void
  tabIds: Ref<string[]>
}

export const TABS_INJECTION_KEY: InjectionKey<TabsContext> = Symbol('ds-tabs')

/** Provided by `Tabs` to control whether `TabPanel` unmounts inactive panels */
export const TABS_UNMOUNT_KEY: InjectionKey<boolean> = Symbol('ds-tabs-unmount')
