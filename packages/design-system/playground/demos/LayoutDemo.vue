<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  AlertCircle,
  BarChart2,
  Box,
  Gem,
  Info,
  Layers,
  Palette,
  Settings,
  Target,
  Type,
  Users,
} from 'lucide-vue-next'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr, propTemplateBinding, templateStringAttr } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import {
  AppLayout,
  Button,
  Lozenge,
  SidebarMenu,
  SidebarMenuGroup,
  SidebarMenuItem,
  SidebarMenuShell,
  Switch,
  Tooltip,
} from '@/index'

const { messages, t } = usePlaygroundLocale()

const showHeader = ref(true)
const showMenu = ref(true)
const showFooter = ref(true)
const showPanel = ref(true)
const footerWidth = ref<'full' | 'content'>('full')
const menuWidthRem = ref(12)
const menuWidth = computed(() => `${menuWidthRem.value}rem`)
const menuCollapsedWidthRem = ref(3)
const menuCollapsedWidth = computed(() => `${menuCollapsedWidthRem.value}rem`)
const menuLabel = ref('Menu')
const menuCollapsible = ref(true)
const menuCollapsed = ref(false)
const defaultCollapsed = ref(false)
const panelOpen = ref(false)
const panelWidth = ref('min(24rem, 50%)')
const panelMinWidthRem = ref(12)
const panelMinWidth = computed(() => `${panelMinWidthRem.value}rem`)
const panelMaxWidth = ref('75%')
const panelResizable = ref(true)
const panelBackdrop = ref(true)
const activeNav = ref('components.forms.input')
const openKeys = ref(['components', 'components.forms'])

const navLabels = computed(() => messages.value.layoutPlayground.navLabels)
const sidebar = computed(() => messages.value.layoutPlayground.sidebar)

watch(defaultCollapsed, (collapsed) => {
  menuCollapsed.value = collapsed
})

watch(showPanel, (enabled) => {
  if (!enabled) {
    panelOpen.value = false
  }
})

const previewKey = computed(
  () =>
    [
      showHeader.value,
      showMenu.value,
      showFooter.value,
      showPanel.value,
      footerWidth.value,
      menuWidthRem.value,
      menuCollapsedWidthRem.value,
      menuLabel.value,
      menuCollapsible.value,
      defaultCollapsed.value,
      panelWidth.value,
      panelMinWidthRem.value,
      panelMaxWidth.value,
      panelResizable.value,
      panelBackdrop.value,
    ].join('-'),
)

const code = computed(() => {
  const props = [
    '  v-model:menu-collapsed="menuCollapsed"',
    '  v-model:panel-open="panelOpen"',
    `  ${playgroundSnippetAttr('menuWidth', menuWidth.value)}`,
    `  ${playgroundSnippetAttr('menuCollapsedWidth', menuCollapsedWidth.value)}`,
    `  ${playgroundSnippetAttr('menuLabel', menuLabel.value)}`,
    `  ${playgroundSnippetAttr('menuCollapsible', menuCollapsible.value)}`,
    `  ${playgroundSnippetAttr('defaultMenuCollapsed', defaultCollapsed.value)}`,
    `  ${playgroundSnippetAttr('panelWidth', panelWidth.value)}`,
    `  ${playgroundSnippetAttr('panelMinWidth', panelMinWidth.value)}`,
    `  ${playgroundSnippetAttr('panelMaxWidth', panelMaxWidth.value)}`,
    `  ${playgroundSnippetAttr('panelResizable', panelResizable.value)}`,
    `  ${playgroundSnippetAttr('panelBackdrop', panelBackdrop.value)}`,
    `  ${playgroundSnippetAttr('showHeader', showHeader.value)}`,
    `  ${playgroundSnippetAttr('showMenu', showMenu.value)}`,
    `  ${playgroundSnippetAttr('showFooter', showFooter.value)}`,
    `  ${playgroundSnippetAttr('footerWidth', footerWidth.value)}`,
  ]

  const lines = [
    '<AppLayout',
    ...props,
    '>',
    '  <template #menu="{ collapsed }">',
    '    <SidebarMenu v-model:active-id="activeId" v-model:open-keys="openKeys" :collapsed="collapsed">',
    `      <SidebarMenuItem ${templateStringAttr('id', 'dashboard')} ${templateStringAttr('label', 'Dashboard')} />`,
    '    </SidebarMenu>',
    '  </template>',
    '',
    '  <div>',
    '    <p>{{ pageTitle }}</p>',
  ]

  if (showPanel.value) {
    lines.push('    <Button @click="panelOpen = true">View details</Button>')
  }

  lines.push('  </div>', '')

  if (showPanel.value) {
    lines.push(
      '  <template #panel="{ closePanel }">',
      '    <div>Detail panel<button @click="closePanel()">Close</button></div>',
      '  </template>',
    )
  }

  lines.push('</AppLayout>')

  return lines.join('\n')
})
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>

    <div
      class="mb-4 rounded-xl border border-[#00E5B0]/15 p-4"
      style="background: rgba(0,229,176,0.04)"
    >
      <p class="mb-3 text-xs leading-relaxed text-[#7BA3C8]">
        <strong class="text-[#E8EDF5]">AppLayout</strong> {{ t('layoutPlayground.introLead') }}
        {{ t('layoutPlayground.introBody') }}
      </p>
      <div class="grid grid-cols-1 gap-2 text-[10px] sm:grid-cols-2">
        <div class="rounded-md px-2 py-1.5" style="background: rgba(0,212,255,0.08); color: #00D4FF">
          <span class="font-mono uppercase">{{ t('layoutPlayground.slots.header') }}</span>
        </div>
        <div class="rounded-md px-2 py-1.5" style="background: rgba(167,139,250,0.08); color: #A78BFA">
          <span class="font-mono uppercase">{{ t('layoutPlayground.slots.menu') }}</span>
        </div>
        <div class="rounded-md px-2 py-1.5" style="background: rgba(0,229,176,0.08); color: #00E5B0">
          <span class="font-mono uppercase">{{ t('layoutPlayground.slots.default') }}</span>
        </div>
        <div class="rounded-md px-2 py-1.5" style="background: rgba(0,212,255,0.08); color: #00D4FF">
          <span class="font-mono uppercase">{{ t('layoutPlayground.slots.panel') }}</span>
        </div>
        <div class="rounded-md px-2 py-1.5" style="background: rgba(255,139,0,0.08); color: #FF8B00">
          <span class="font-mono uppercase">{{ t('layoutPlayground.slots.footer') }}</span>
        </div>
      </div>
    </div>

    <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
      <p class="font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('layoutPlayground.preview') }}</p>

      <AppLayout
        :key="previewKey"
        v-model:menu-collapsed="menuCollapsed"
        v-model:panel-open="panelOpen"
        :default-menu-collapsed="defaultCollapsed"
        :menu-width="menuWidth"
        :menu-collapsed-width="menuCollapsedWidth"
        :menu-label="menuLabel"
        :menu-collapsible="menuCollapsible"
        :panel-width="panelWidth"
        :panel-min-width="panelMinWidth"
        :panel-max-width="panelMaxWidth"
        :panel-resizable="panelResizable"
        :panel-backdrop="panelBackdrop"
        :show-header="showHeader"
        :show-menu="showMenu"
        :show-footer="showFooter"
        :footer-width="footerWidth"
        class="min-h-[26rem] border-[#00E5B0]/20"
      >
        <template #header>
          <div
            class="flex w-full items-center justify-between gap-3 rounded p-2"
            style="background: rgba(0,212,255,0.06)"
          >
            <div class="flex items-center gap-2">
              <span class="font-mono text-[8px] uppercase tracking-wider text-[#00D4FF]">{{ t('layoutPlayground.regions.header.label') }}</span>
              <span
                class="flex size-6 items-center justify-center rounded-md text-[10px] font-bold text-[#060D18]"
                style="background: linear-gradient(135deg, #0052CC, #00D4FF)"
              >
                DS
              </span>
              <span class="text-sm font-semibold text-foreground">Design System</span>
            </div>
            <Lozenge variant="success">{{ t('app.stable') }}</Lozenge>
          </div>
        </template>

        <template #menu="{ collapsed, toggleMenu, menuLabel, menuWidth: slotMenuWidth, menuCollapsedWidth }">
          <div class="w-full overflow-hidden rounded" style="background: rgba(167,139,250,0.06)">
            <SidebarMenuShell
              :collapsed="collapsed"
              :menu-label="menuLabel"
              :menu-width="slotMenuWidth"
              :collapsed-width="menuCollapsedWidth"
            >
              <template #toggle>
                <Tooltip
                  :content="collapsed ? t('layoutPlayground.expandMenu') : t('layoutPlayground.collapseMenu')"
                  placement="right"
                >
                  <button
                    type="button"
                    class="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    :aria-label="collapsed ? t('layoutPlayground.expandMenu') : t('layoutPlayground.collapseMenu')"
                    :aria-expanded="!collapsed"
                    @click="toggleMenu()"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      class="size-3.5 shrink-0 transition-transform duration-300 ease-in-out"
                      :class="collapsed ? 'rotate-180' : ''"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      aria-hidden="true"
                    >
                      <path d="M10 3 5 8l5 5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </Tooltip>
              </template>

              <SidebarMenu
                v-model:active-id="activeNav"
                v-model:open-keys="openKeys"
                :collapsed="collapsed"
              >
                <SidebarMenuItem id="dashboard" :label="sidebar.dashboard" :icon="BarChart2" />

                <SidebarMenuGroup id="components" :label="sidebar.components" :icon="Gem" default-open>
                  <SidebarMenuItem id="components.overview" :label="sidebar.overview" :icon="Layers" />
                  <SidebarMenuItem id="components.button" :label="sidebar.button" :icon="Box" />

                  <SidebarMenuGroup id="components.forms" :label="sidebar.forms" :icon="Type" default-open>
                    <SidebarMenuItem id="components.forms.input" :label="sidebar.input" :icon="Type" />
                    <SidebarMenuItem id="components.forms.select" :label="sidebar.select" :icon="Target" />
                  </SidebarMenuGroup>

                  <SidebarMenuGroup id="components.feedback" :label="sidebar.feedback" :icon="AlertCircle">
                    <SidebarMenuItem id="components.feedback.alert" :label="sidebar.alert" :icon="AlertCircle" />
                    <SidebarMenuItem id="components.feedback.toast" :label="sidebar.toast" :icon="Info" />
                  </SidebarMenuGroup>
                </SidebarMenuGroup>

                <SidebarMenuGroup id="foundations" :label="sidebar.foundations" :icon="Palette">
                  <SidebarMenuItem id="foundations.colors" :label="sidebar.colors" :icon="Palette" />
                  <SidebarMenuItem id="foundations.typography" :label="sidebar.typography" :icon="Type" />
                </SidebarMenuGroup>

                <SidebarMenuGroup id="settings" :label="sidebar.settings" :icon="Settings">
                  <SidebarMenuItem id="settings.profile" :label="sidebar.profile" :icon="Users" />
                  <SidebarMenuItem id="settings.team" :label="sidebar.team" :icon="Users" />
                </SidebarMenuGroup>
              </SidebarMenu>
            </SidebarMenuShell>
          </div>
        </template>

        <div
          class="flex h-full min-h-0 w-full flex-col rounded p-2"
          style="background: rgba(0,229,176,0.06)"
        >
          <p class="mb-2 font-mono text-[8px] uppercase tracking-wider text-[#00E5B0]">{{ t('layoutPlayground.slots.content') }}</p>
          <div
            class="pg-playground-preview flex flex-1 flex-col items-center justify-center gap-3 rounded-lg px-4 py-6 text-center"
          >
            <p class="text-sm text-[#7BA3C8]">
              {{ navLabels[activeNav] ?? activeNav }}
            </p>
            <Button v-if="showPanel" variant="outline" size="sm" @click="panelOpen = true">
              {{ t('layoutPlayground.viewDetails') }}
            </Button>
          </div>
        </div>

        <template v-if="showPanel" #panel="{ closePanel }">
          <div
            class="flex h-full min-h-0 w-full flex-col rounded p-2"
            style="background: rgba(0,212,255,0.06)"
          >
            <div class="mb-3 flex items-center justify-between gap-2 border-b border-[#00D4FF]/20 pb-2">
              <span class="font-mono text-[8px] uppercase tracking-wider text-[#00D4FF]">{{ t('layoutPlayground.panelTag') }}</span>
              <button
                type="button"
                class="rounded px-2 py-0.5 font-mono text-[10px] text-[#4D6A87] transition-colors hover:bg-muted/40 hover:text-foreground"
                @click="closePanel()"
              >
                {{ t('layoutPlayground.close') }}
              </button>
            </div>
            <p class="mb-2 text-sm font-medium text-foreground">
              {{ navLabels[activeNav] ?? activeNav }}
            </p>
            <p class="text-xs leading-relaxed text-[#7BA3C8]">
              {{ t('layoutPlayground.panelDescription') }}
            </p>
          </div>
        </template>

        <template #footer>
          <div
            class="flex w-full items-center justify-between gap-3 rounded p-2 text-xs"
            style="background: rgba(255,139,0,0.06)"
          >
            <span class="font-mono text-[8px] uppercase tracking-wider text-[#FF8B00]">{{ t('layoutPlayground.regions.footer.label') }}</span>
            <span class="font-mono text-[10px] text-[#4D6A87]">{{ t('app.footer') }}</span>
          </div>
        </template>
      </AppLayout>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div class="min-w-0 space-y-2">
          <p class="mb-1 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('layoutPlayground.regionsTitle') }}</p>
          <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
            <Switch v-model="showHeader" size="sm" />
            {{ propTemplateBinding('showHeader') }}
          </label>
          <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
            <Switch v-model="showMenu" size="sm" />
            {{ propTemplateBinding('showMenu') }}
          </label>
          <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
            <Switch v-model="showFooter" size="sm" />
            {{ propTemplateBinding('showFooter') }}
          </label>
          <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
            <Switch v-model="showPanel" size="sm" />
            {{ t('layoutPlayground.panelTag') }}
          </label>
        </div>

        <div class="min-w-0 space-y-4">
          <div>
            <label class="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
              {{ t('layoutPlayground.menuWidthLabel', { width: menuWidth }) }}
            </label>
            <input
              v-model.number="menuWidthRem"
              type="range"
              min="8"
              max="16"
              step="1"
              class="w-full accent-[#00E5B0]"
            />
          </div>
          <div>
            <label class="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
              {{ propTemplateBinding('menuCollapsedWidth') }} — {{ menuCollapsedWidth }}
            </label>
            <input
              v-model.number="menuCollapsedWidthRem"
              type="range"
              min="2"
              max="6"
              step="0.5"
              class="w-full accent-[#00E5B0]"
            />
          </div>
          <div>
            <label class="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ propTemplateBinding('menuLabel') }}</label>
            <input
              v-model="menuLabel"
              type="text"
              class="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
            />
          </div>
          <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
            <Switch v-model="defaultCollapsed" size="sm" />
            {{ propTemplateBinding('defaultMenuCollapsed') }}
          </label>
          <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
            <Switch v-model="menuCollapsible" size="sm" />
            {{ propTemplateBinding('menuCollapsible') }}
          </label>

          <div v-if="showPanel">
            <p class="mb-2 mt-1 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">panel</p>
            <label class="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ propTemplateBinding('panelWidth') }}</label>
            <input
              v-model="panelWidth"
              type="text"
              class="mb-3 w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
            />
            <label class="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
              {{ propTemplateBinding('panelMinWidth') }} — {{ panelMinWidth }}
            </label>
            <input
              v-model.number="panelMinWidthRem"
              type="range"
              min="8"
              max="20"
              step="1"
              class="mb-3 w-full accent-[#00E5B0]"
            />
            <label class="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ propTemplateBinding('panelMaxWidth') }}</label>
            <input
              v-model="panelMaxWidth"
              type="text"
              class="mb-3 w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
            />
            <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
              <Switch v-model="panelResizable" size="sm" />
              {{ propTemplateBinding('panelResizable') }}
            </label>
            <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
              <Switch v-model="panelBackdrop" size="sm" />
              {{ propTemplateBinding('panelBackdrop') }}
            </label>
          </div>

          <div v-if="showFooter && showMenu">
            <p class="mb-2 mt-1 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
              {{ t('layoutPlayground.footerWidthLabel') }}
            </p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in (['full', 'content'] as const)"
                :key="option"
                type="button"
                class="rounded-md px-2.5 py-1 font-mono text-[10px] transition-colors"
                :style="playgroundOptionStyle(footerWidth === option)"
                @click="footerWidth = option"
              >
                {{ t(`layoutPlayground.footerWidth.${option}`) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <UsageBlock :code="code" />
  </div>
</template>
