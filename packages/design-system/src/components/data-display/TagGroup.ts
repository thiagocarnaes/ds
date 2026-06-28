import type { InjectionKey } from 'vue'

/**
 * Injection key used by TagGroup to signal to child Tag components
 * that they are inside a group (so they apply role="listitem").
 */
export const TAG_GROUP_KEY: InjectionKey<true> = Symbol('TagGroup')
