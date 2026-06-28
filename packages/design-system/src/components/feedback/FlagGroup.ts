import type { InjectionKey } from 'vue'

/**
 * Shared types and injection key for FlagGroup / Flag integration.
 * Kept in a separate .ts file to avoid ES module export errors inside <script setup>.
 */

export interface FlagGroupItem {
  id: string
  [key: string]: unknown
}

export interface FlagGroupState {
  register: (id: string) => void
  unregister: (id: string) => void
  isVisible: (id: string) => boolean
}

export const FLAG_GROUP_KEY: InjectionKey<FlagGroupState> = Symbol('FlagGroup')
