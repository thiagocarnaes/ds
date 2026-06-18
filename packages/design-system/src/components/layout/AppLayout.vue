<script setup lang="ts">
import { computed, onBeforeMount, onUnmounted, watch } from 'vue'
import { cn } from '@/lib/utils'
import AppLayoutPanelOverlay from './AppLayoutPanelOverlay.vue'
import AppLayoutSidebarMenu from './AppLayoutSidebarMenu.vue'

export interface AppLayoutProps {
  menuWidth?: string
  menuCollapsedWidth?: string
  menuLabel?: string
  defaultMenuCollapsed?: boolean
  menuCollapsible?: boolean
  panelWidth?: string
  panelMinWidth?: string
  panelMaxWidth?: string
  panelResizable?: boolean
  panelBackdrop?: boolean
  showHeader?: boolean
  showMenu?: boolean
  showFooter?: boolean
  /** Pin a Settings group at the bottom of the composed sidebar menu. */
  settingsMenu?: boolean
  /** Label for the settings group when `settingsMenu` is true. */
  settingsMenuLabel?: string
  /** Id prefix for the settings group when `settingsMenu` is true. */
  settingsMenuId?: string
  /** `full` spans header/menu/content; `content` keeps footer under main content only. */
  footerWidth?: 'full' | 'content'
  class?: string
}

const props = withDefaults(defineProps<AppLayoutProps>(), {
  menuWidth: '12rem',
  menuCollapsedWidth: '3rem',
  menuLabel: 'Menu',
  defaultMenuCollapsed: false,
  menuCollapsible: true,
  panelWidth: 'min(24rem, 50%)',
  panelMinWidth: '12rem',
  panelMaxWidth: '75%',
  panelResizable: true,
  panelBackdrop: true,
  showHeader: true,
  showMenu: true,
  showFooter: true,
  settingsMenu: false,
  settingsMenuLabel: 'Settings',
  settingsMenuId: 'settings',
  footerWidth: 'full',
})

const menuCollapsed = defineModel<boolean>('menuCollapsed', { default: false })
const panelOpen = defineModel<boolean>('panelOpen', { default: false })
const activeMenuId = defineModel<string>('activeMenuId', { default: '' })
const openMenuKeys = defineModel<string[]>('openMenuKeys', { default: () => [] })

onBeforeMount(() => {
  if (props.defaultMenuCollapsed) {
    menuCollapsed.value = true
  }
})

const activeMenuWidth = computed(() =>
  menuCollapsed.value ? props.menuCollapsedWidth : props.menuWidth,
)

const usesGridFooter = computed(
  () => props.showFooter && !(props.footerWidth === 'content' && props.showMenu),
)

const usesContentFooter = computed(
  () => props.showFooter && props.footerWidth === 'content' && props.showMenu,
)

const gridStyle = computed(() => {
  if (props.showMenu) {
    return {
      gridTemplateAreas: props.showHeader && usesGridFooter.value
        ? '"header header" "shell shell" "footer footer"'
        : props.showHeader
          ? '"header header" "shell shell"'
          : usesGridFooter.value
            ? '"shell shell" "footer footer"'
            : '"shell shell"',
      gridTemplateColumns: 'minmax(0, 1fr)',
      gridTemplateRows: [
        props.showHeader ? 'auto' : null,
        'minmax(0, 1fr)',
        usesGridFooter.value ? 'auto' : null,
      ]
        .filter(Boolean)
        .join(' '),
    }
  }

  return {
    gridTemplateAreas: props.showHeader && usesGridFooter.value
      ? '"header" "content" "footer"'
      : props.showHeader
        ? '"header" "content"'
        : usesGridFooter.value
          ? '"content" "footer"'
          : '"content"',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gridTemplateRows: [
      props.showHeader ? 'auto' : null,
      'minmax(0, 1fr)',
      usesGridFooter.value ? 'auto' : null,
    ]
      .filter(Boolean)
      .join(' '),
  }
})

function toggleMenu(): void {
  menuCollapsed.value = !menuCollapsed.value
}

function closePanel(): void {
  panelOpen.value = false
}

function onEscape(event: KeyboardEvent): void {
  if (event.key === 'Escape' && panelOpen.value) {
    closePanel()
  }
}

watch(panelOpen, (open) => {
  if (open) {
    document.addEventListener('keydown', onEscape)
    return
  }

  document.removeEventListener('keydown', onEscape)
}, { immediate: true })

onUnmounted(() => {
  document.removeEventListener('keydown', onEscape)
})
</script>

<template>
  <div
    :class="cn('grid h-full min-h-0 overflow-hidden rounded-lg border border-border bg-background', props.class)"
    :style="gridStyle"
  >
    <header
      v-if="showHeader"
      class="border-b border-border bg-card"
      style="grid-area: header"
    >
      <slot name="header" />
    </header>

    <div
      v-if="showMenu"
      class="relative grid min-h-0 min-w-0 overflow-hidden bg-background"
      style="grid-area: shell; grid-template-columns: auto minmax(0, 1fr); grid-template-rows: minmax(0, 1fr)"
    >
      <aside
        :class="
          cn(
            'flex h-full min-h-0 shrink-0 flex-col overflow-hidden border-r border-border bg-card/60 px-0 py-0 transition-[width] duration-300 ease-in-out',
          )
        "
        :style="{ width: activeMenuWidth }"
        :data-menu-collapsed="menuCollapsed ? 'true' : 'false'"
      >
        <div class="flex min-h-0 h-full w-full flex-1 flex-col">
          <AppLayoutSidebarMenu
            v-model:active-id="activeMenuId"
            v-model:open-keys="openMenuKeys"
            :collapsed="menuCollapsed"
            :menu-label="menuLabel"
            :menu-width="menuWidth"
            :menu-collapsed-width="menuCollapsedWidth"
            :toggle-menu="toggleMenu"
            :settings-menu="settingsMenu"
            :settings-menu-label="settingsMenuLabel"
            :settings-menu-id="settingsMenuId"
          >
            <template #toggle="toggleProps">
              <slot name="menu-toggle" v-bind="toggleProps" />
            </template>
            <slot name="menu-items" />
            <template #settings>
              <slot name="settings-menu" />
            </template>
          </AppLayoutSidebarMenu>
        </div>
      </aside>

      <div class="relative flex min-h-0 min-w-0 flex-col overflow-hidden">
        <div class="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <main class="flex h-full min-h-0 flex-1 flex-col overflow-y-auto">
            <div class="flex h-full min-h-0 flex-1 flex-col">
              <slot />
            </div>
          </main>

          <AppLayoutPanelOverlay
            v-model:open="panelOpen"
            :backdrop="panelBackdrop"
            :initial-width="panelWidth"
            :min-width="panelMinWidth"
            :max-width="panelMaxWidth"
            :resizable="panelResizable"
          >
            <template #default="panelSlot">
              <slot name="panel" v-bind="panelSlot" />
            </template>
          </AppLayoutPanelOverlay>
        </div>

        <footer
          v-if="usesContentFooter"
          class="shrink-0 border-t border-border bg-card"
        >
          <slot name="footer" />
        </footer>
      </div>
    </div>

    <div
      v-else
      class="relative flex h-full min-h-0 flex-col overflow-hidden bg-background"
      style="grid-area: content"
    >
      <main class="flex h-full min-h-0 flex-1 flex-col overflow-y-auto">
        <div class="flex h-full min-h-0 flex-1 flex-col">
          <slot />
        </div>
      </main>

      <AppLayoutPanelOverlay
        v-model:open="panelOpen"
        :backdrop="panelBackdrop"
        :initial-width="panelWidth"
        :min-width="panelMinWidth"
        :max-width="panelMaxWidth"
        :resizable="panelResizable"
      >
        <template #default="panelSlot">
          <slot name="panel" v-bind="panelSlot" />
        </template>
      </AppLayoutPanelOverlay>
    </div>

    <footer
      v-if="usesGridFooter"
      class="border-t border-border bg-card"
      style="grid-area: footer"
    >
      <slot name="footer" />
    </footer>
  </div>
</template>
