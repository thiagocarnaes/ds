<script setup lang="ts">
import { computed, onBeforeMount, onUnmounted, watch } from 'vue'
import { cn } from '@/lib/utils'
import AppLayoutPanelOverlay from './AppLayoutPanelOverlay.vue'

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
})

const menuCollapsed = defineModel<boolean>('menuCollapsed', { default: false })
const panelOpen = defineModel<boolean>('panelOpen', { default: false })

onBeforeMount(() => {
  if (props.defaultMenuCollapsed) {
    menuCollapsed.value = true
  }
})

const activeMenuWidth = computed(() =>
  menuCollapsed.value ? props.menuCollapsedWidth : props.menuWidth,
)

const gridStyle = computed(() => {
  if (props.showMenu) {
    return {
      gridTemplateAreas: props.showHeader && props.showFooter
        ? '"header header" "shell shell" "footer footer"'
        : props.showHeader
          ? '"header header" "shell shell"'
          : props.showFooter
            ? '"shell shell" "footer footer"'
            : '"shell shell"',
      gridTemplateColumns: 'minmax(0, 1fr)',
      gridTemplateRows: [
        props.showHeader ? 'auto' : null,
        'minmax(0, 1fr)',
        props.showFooter ? 'auto' : null,
      ]
        .filter(Boolean)
        .join(' '),
    }
  }

  return {
    gridTemplateAreas: props.showHeader && props.showFooter
      ? '"header" "content" "footer"'
      : props.showHeader
        ? '"header" "content"'
        : props.showFooter
          ? '"content" "footer"'
          : '"content"',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gridTemplateRows: [
      props.showHeader ? 'auto' : null,
      'minmax(0, 1fr)',
      props.showFooter ? 'auto' : null,
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
    :class="cn('grid min-h-0 overflow-hidden rounded-lg border border-border bg-background', props.class)"
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
      class="relative flex min-h-0 flex-1"
      style="grid-area: shell"
    >
      <aside
        :class="
          cn(
            'flex h-full min-h-0 shrink-0 flex-col overflow-x-hidden overflow-y-auto border-r border-border bg-card/60 px-0 py-0 transition-[width] duration-300 ease-in-out',
          )
        "
        :style="{ width: activeMenuWidth }"
        :data-menu-collapsed="menuCollapsed ? 'true' : 'false'"
      >
        <div class="flex min-h-0 h-full w-full flex-1 flex-col">
          <slot
            name="menu"
            :collapsed="menuCollapsed"
            :menu-width="menuWidth"
            :menu-collapsed-width="menuCollapsedWidth"
            :toggle-menu="toggleMenu"
            :menu-label="menuLabel"
          />
        </div>
      </aside>

      <div class="relative min-h-0 min-w-0 flex-1 overflow-hidden bg-background">
        <main class="h-full min-h-0 overflow-y-auto">
          <slot />
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
    </div>

    <div
      v-else
      class="relative min-h-0 overflow-hidden bg-background"
      style="grid-area: content"
    >
      <main class="h-full min-h-0 overflow-y-auto">
        <slot />
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
      v-if="showFooter"
      class="border-t border-border bg-card"
      style="grid-area: footer"
    >
      <slot name="footer" />
    </footer>
  </div>
</template>
