<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import SidebarMenu from '../navigation/SidebarMenu.vue'
import SidebarMenuShell from '../navigation/SidebarMenuShell.vue'
import AppLayoutMenuToggle from './AppLayoutMenuToggle.vue'
import {
  APP_LAYOUT_MENU_INJECTION_KEY,
  type SettingsFooterMode,
} from './appLayoutMenuContext'

const props = withDefaults(
  defineProps<{
    collapsed: boolean
    menuLabel?: string
    menuWidth: string
    menuCollapsedWidth?: string
    menuCollapsible?: boolean
    toggleMenu: () => void
    settingsMenu?: boolean
    settingsMenuId?: string
  }>(),
  {
    menuCollapsible: true,
    settingsMenu: false,
    settingsMenuId: 'settings',
  },
)

const activeId = defineModel<string>('activeId', { default: '' })
const openKeys = defineModel<string[]>('openKeys', { default: () => [] })

const settingsFooterMode = ref<SettingsFooterMode>('none')
const settingsGroupTarget = ref<HTMLElement | null>(null)
const settingsSingleTarget = ref<HTMLElement | null>(null)

function registerSettingsGroup(): void {
  settingsFooterMode.value = 'group'
}

function registerSettingsSingle(): void {
  if (settingsFooterMode.value !== 'group') {
    settingsFooterMode.value = 'single'
  }
}

const showSettingsFooter = computed(
  () => props.settingsMenu && settingsFooterMode.value !== 'none',
)

provide(APP_LAYOUT_MENU_INJECTION_KEY, {
  settingsMenu: computed(() => props.settingsMenu),
  settingsMenuId: props.settingsMenuId,
  settingsFooterMode,
  settingsGroupTarget,
  settingsSingleTarget,
  registerSettingsGroup,
  registerSettingsSingle,
})
</script>

<template>
  <SidebarMenuShell
    class="h-full"
    :collapsed="collapsed"
    :menu-label="menuLabel"
    :menu-width="menuWidth"
    :collapsed-width="menuCollapsedWidth ?? menuWidth"
    :show-toggle="menuCollapsible"
  >
    <template v-if="menuCollapsible" #toggle>
      <AppLayoutMenuToggle :collapsed="collapsed" :toggle-menu="toggleMenu" />
    </template>

    <SidebarMenu
      v-model:active-id="activeId"
      v-model:open-keys="openKeys"
      :collapsed="collapsed"
      class="flex h-full min-h-0 flex-1 flex-col"
    >
      <div class="flex min-h-0 flex-1 flex-col">
        <div class="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain">
          <slot />
        </div>

        <div v-if="showSettingsFooter" class="mt-auto shrink-0 border-t border-border pt-2">
          <div
            v-show="settingsFooterMode === 'group'"
            ref="settingsGroupTarget"
            class="flex w-full flex-col"
          />
          <div
            v-show="settingsFooterMode === 'single'"
            ref="settingsSingleTarget"
            class="flex flex-col gap-0.5"
          />
        </div>
      </div>
    </SidebarMenu>
  </SidebarMenuShell>
</template>
