import type { Component } from 'vue'
import type { ComputedRef, InjectionKey, Ref } from 'vue'

export interface SidebarMenuContext {
  collapsed: ComputedRef<boolean>
  inFlyout: ComputedRef<boolean>
  showLabels: ComputedRef<boolean>
  activeId: Ref<string>
  openKeys: Ref<string[]>
  depth: number
  toggleOpen: (key: string) => void
  isOpen: (key: string) => boolean
  isActive: (id: string) => boolean
  isGroupActive: (id: string) => boolean
  setActive: (id: string) => void
  registerFlyoutCloser: (id: string, depth: number, close: () => void, isOpen: () => boolean) => void
  unregisterFlyoutCloser: (id: string) => void
  closePeerFlyouts: (depth: number, exceptId: string) => void
  hasOpenDescendantFlyouts: (depth: number) => boolean
  closeAllFlyouts: () => void
}

export interface SidebarMenuItemProps {
  id: string
  label: string
  icon?: Component
}

export interface SidebarMenuGroupProps extends SidebarMenuItemProps {
  defaultOpen?: boolean
}

export const SIDEBAR_MENU_INJECTION_KEY: InjectionKey<SidebarMenuContext> = Symbol('ds-sidebar-menu')
