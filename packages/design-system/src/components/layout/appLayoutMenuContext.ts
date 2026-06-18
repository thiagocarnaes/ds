import type { ComputedRef, InjectionKey, Ref } from 'vue'

export type SettingsFooterMode = 'none' | 'group' | 'single'

export interface AppLayoutMenuContext {
  settingsMenu: ComputedRef<boolean>
  settingsMenuId: string
  settingsFooterMode: Ref<SettingsFooterMode>
  settingsGroupTarget: Ref<HTMLElement | null>
  settingsSingleTarget: Ref<HTMLElement | null>
  registerSettingsGroup: () => void
  registerSettingsSingle: () => void
}

export const APP_LAYOUT_MENU_INJECTION_KEY: InjectionKey<AppLayoutMenuContext> =
  Symbol('ds-app-layout-menu')

export function isPinnedSettingsGroupId(id: string, settingsMenuId: string): boolean {
  return id === settingsMenuId
}

export function isPinnedSettingsSingleId(
  id: string,
  settingsMenuId: string,
  parentGroupId?: string,
): boolean {
  return id === settingsMenuId && !parentGroupId
}
