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
import { PACKAGE } from '../data/componentCatalogConstants'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr, propTemplateBinding, templateStringAttr } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import {
  AppLayout,
  Button,
  Lozenge,
  SidebarMenuGroup,
  SidebarMenuItem,
  Switch,
} from '@/index'

const { messages, t } = usePlaygroundLocale()

const showHeader = ref(true)
const showMenu = ref(true)
const showFooter = ref(true)
const showPanel = ref(true)
const settingsMenu = ref(true)
const settingsAsGroup = ref(true)
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
const activeNav = ref('dashboard')
const openKeys = ref<string[]>([])

const navLabels = computed(() => messages.value.layoutPlayground.navLabels)
const sidebar = computed(() => messages.value.layoutPlayground.sidebar)
const pageTitle = computed(() => navLabels.value[activeNav.value] ?? activeNav.value)

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
      settingsMenu.value,
      settingsAsGroup.value,
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
  const scriptLines = [
    '<script setup lang="ts">',
    "import { ref } from 'vue'",
    `import { AppLayout, Button, SidebarMenuGroup, SidebarMenuItem } from '${PACKAGE}'`,
    '',
    `const menuCollapsed = ref(${menuCollapsed.value})`,
    `const panelOpen = ref(${panelOpen.value})`,
    `const menuWidth = ref('${menuWidth.value}')`,
    `const menuCollapsedWidth = ref('${menuCollapsedWidth.value}')`,
    `const menuLabel = ref('${menuLabel.value.replace(/'/g, "\\'")}')`,
    `const menuCollapsible = ref(${menuCollapsible.value})`,
    `const defaultCollapsed = ref(${defaultCollapsed.value})`,
    `const panelWidth = ref('${panelWidth.value}')`,
    `const panelMinWidth = ref('${panelMinWidth.value}')`,
    `const panelMaxWidth = ref('${panelMaxWidth.value}')`,
    `const panelResizable = ref(${panelResizable.value})`,
    `const panelBackdrop = ref(${panelBackdrop.value})`,
    `const showHeader = ref(${showHeader.value})`,
    `const showMenu = ref(${showMenu.value})`,
    `const showFooter = ref(${showFooter.value})`,
    `const settingsMenu = ref(${settingsMenu.value})`,
    `const footerWidth = ref<'full' | 'content'>('${footerWidth.value}')`,
    `const activeId = ref('${activeNav.value.replace(/'/g, "\\'")}')`,
    `const openKeys = ref<string[]>(${JSON.stringify(openKeys.value)})`,
    `const pageTitle = ref('${String(pageTitle.value).replace(/'/g, "\\'")}')`,
    '<\\/script>',
  ]

  const props = [
    '  v-model:menu-collapsed="menuCollapsed"',
    '  v-model:panel-open="panelOpen"',
    '  v-model:active-menu-id="activeId"',
    '  v-model:open-menu-keys="openKeys"',
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
    `  ${playgroundSnippetAttr('settingsMenu', settingsMenu.value)}`,
    `  ${playgroundSnippetAttr('footerWidth', footerWidth.value)}`,
  ]

  const lines = [
    ...scriptLines,
    '',
    '<template>',
    '  <!-- AppLayout only defines page regions — style each slot with Tailwind/classes -->',
    '  <AppLayout',
    ...props,
    '>',
  ]

  if (showHeader.value) {
    lines.push(
      '    <template #header>',
      '      <div class="flex items-center justify-between border-b border-border bg-card px-4 py-3">',
      '        <span class="text-sm font-semibold text-foreground">Design System</span>',
      '      </div>',
      '    </template>',
    )
  }

  if (showMenu.value) {
    lines.push(
      '    <template #menu>',
      `      <SidebarMenuItem ${templateStringAttr('id', 'dashboard')} ${templateStringAttr('label', 'Dashboard')} />`,
    )
    if (settingsMenu.value) {
      if (settingsAsGroup.value) {
        lines.push(
          `      <SidebarMenuGroup ${templateStringAttr('id', 'settings')} ${templateStringAttr('label', 'Settings')} flyout-placement="up">`,
          `        <SidebarMenuItem ${templateStringAttr('id', 'settings.profile')} ${templateStringAttr('label', 'Profile')} />`,
          `        <SidebarMenuItem ${templateStringAttr('id', 'settings.team')} ${templateStringAttr('label', 'Team')} />`,
          '      </SidebarMenuGroup>',
        )
      } else {
        lines.push(
          `      <SidebarMenuItem ${templateStringAttr('id', 'settings')} ${templateStringAttr('label', 'Settings')} />`,
        )
      }
    }
    lines.push('    </template>')
  }

  lines.push(
    '    <div class="flex flex-col gap-4 p-6">',
    '      <p class="text-sm text-muted-foreground">{{ pageTitle }}</p>',
  )

  if (showPanel.value) {
    lines.push('      <Button :variant="\'outline\'" :size="\'sm\'" @click="panelOpen = true">View details</Button>')
  }

  lines.push('    </div>')

  if (showPanel.value) {
    lines.push(
      '    <template #panel="{ closePanel }">',
      '      <div class="flex flex-col gap-4 border-l border-border p-6">',
      '        <div class="flex items-center justify-between gap-2">',
      '          <h2 class="text-sm font-semibold text-foreground">Details</h2>',
      '          <button type="button" class="rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground" @click="closePanel()">Close</button>',
      '        </div>',
      '        <p class="text-xs leading-relaxed text-muted-foreground">{{ pageTitle }}</p>',
      '      </div>',
      '    </template>',
    )
  }

  if (showFooter.value) {
    lines.push(
      '    <template #footer>',
      '      <div class="flex items-center justify-between border-t border-border bg-card px-4 py-2 text-xs text-muted-foreground">',
      '        <span>Footer</span>',
      '      </div>',
      '    </template>',
    )
  }

  lines.push('  </AppLayout>', '</template>')

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
      <p class="mb-3 rounded-md border border-[#00E5B0]/20 bg-[#00E5B0]/5 px-3 py-2 text-[11px] leading-relaxed text-[#7BA3C8]">
        {{ t('layoutPlayground.stylingNote') }}
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
        v-model:active-menu-id="activeNav"
        v-model:open-menu-keys="openKeys"
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
        :settings-menu="settingsMenu"
        :footer-width="footerWidth"
        class="min-h-[26rem] h-[26rem] border-[#00E5B0]/20"
      >
        <template #header>
          <div
            class="flex w-full items-center justify-between gap-3 rounded p-2"
            style="background: rgba(0,212,255,0.06)"
          >
            <div class="flex items-center gap-2">
              <span class="font-mono text-[10px] uppercase tracking-wider text-[#00D4FF]">{{ t('layoutPlayground.regions.header.label') }}</span>
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

        <template #menu>
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

          <SidebarMenuGroup
            v-if="settingsMenu && settingsAsGroup"
            id="settings"
            :label="sidebar.settings"
            :icon="Settings"
            flyout-placement="up"
          >
            <SidebarMenuItem id="settings.profile" :label="sidebar.profile" :icon="Users" />
            <SidebarMenuItem id="settings.team" :label="sidebar.team" :icon="Users" />
          </SidebarMenuGroup>
          <SidebarMenuItem
            v-else-if="settingsMenu"
            id="settings"
            :label="sidebar.settings"
            :icon="Settings"
          />
        </template>

        <div
          class="flex h-full min-h-0 w-full flex-col rounded p-2"
          style="background: rgba(0,229,176,0.06)"
        >
          <p class="mb-2 font-mono text-[10px] uppercase tracking-wider text-[#00E5B0]">{{ t('layoutPlayground.slots.content') }}</p>
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
              <span class="font-mono text-[10px] uppercase tracking-wider text-[#00D4FF]">{{ t('layoutPlayground.panelTag') }}</span>
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
            <span class="font-mono text-[10px] uppercase tracking-wider text-[#FF8B00]">{{ t('layoutPlayground.regions.footer.label') }}</span>
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
          <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
            <Switch v-model="settingsMenu" size="sm" />
            {{ propTemplateBinding('settingsMenu') }}
          </label>
          <label
            v-if="settingsMenu"
            class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]"
          >
            <Switch v-model="settingsAsGroup" size="sm" />
            {{ t('layoutPlayground.settingsAsGroup') }}
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
