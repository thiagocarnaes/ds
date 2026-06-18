<script setup lang="ts">
import { Settings } from 'lucide-vue-next'
import SidebarMenu from '../navigation/SidebarMenu.vue'
import SidebarMenuGroup from '../navigation/SidebarMenuGroup.vue'
import SidebarMenuShell from '../navigation/SidebarMenuShell.vue'

const props = withDefaults(
  defineProps<{
    collapsed: boolean
    menuLabel?: string
    menuWidth: string
    menuCollapsedWidth?: string
    toggleMenu: () => void
    settingsMenu?: boolean
    settingsMenuLabel?: string
    settingsMenuId?: string
  }>(),
  {
    settingsMenu: false,
    settingsMenuLabel: 'Settings',
    settingsMenuId: 'settings',
  },
)

const activeId = defineModel<string>('activeId', { default: '' })
const openKeys = defineModel<string[]>('openKeys', { default: () => [] })
</script>

<template>
  <SidebarMenuShell
    class="h-full"
    :collapsed="collapsed"
    :menu-label="menuLabel"
    :menu-width="menuWidth"
    :collapsed-width="menuCollapsedWidth ?? menuWidth"
  >
    <template #toggle>
      <slot name="toggle" :collapsed="collapsed" :toggle-menu="toggleMenu">
        <button
          type="button"
          class="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
          :aria-label="collapsed ? 'Expand menu' : 'Collapse menu'"
          @click="toggleMenu()"
        >
          ☰
        </button>
      </slot>
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

        <div v-if="settingsMenu" class="mt-auto shrink-0 border-t border-border pt-2">
          <SidebarMenuGroup
            :id="settingsMenuId"
            :label="settingsMenuLabel"
            :icon="Settings"
            flyout-placement="up"
            default-open
          >
            <slot name="settings" />
          </SidebarMenuGroup>
        </div>
      </div>
    </SidebarMenu>
  </SidebarMenuShell>
</template>
