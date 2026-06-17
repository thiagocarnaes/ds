<script setup lang="ts">
import { computed, ref } from 'vue'
import { AlertCircle, BarChart2, Info, Settings } from 'lucide-vue-next'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { templateStringAttr } from '../utils/propTemplateName'
import { Tab, TabList, TabPanel, Tabs } from '@/index'

const { messages, t } = usePlaygroundLocale()

const tabKeys = ['overview', 'issues', 'reports', 'settings'] as const
type TabKey = (typeof tabKeys)[number]

const activeTab = ref<TabKey>('overview')

const tabs = computed(() => messages.value.tabsPlayground.tabs)
const panels = computed(() => messages.value.tabsPlayground.panels)

const code = computed(() => {
  const lines = ['<Tabs v-model="activeTab">', '  <TabList>']

  for (const key of tabKeys) {
    lines.push(`    <Tab ${templateStringAttr('value', key)}>${tabs.value[key]}</Tab>`)
  }

  lines.push('  </TabList>')

  for (const key of tabKeys) {
    lines.push(`  <TabPanel ${templateStringAttr('value', key)}>`, `    ${panels.value[key]}`, '  </TabPanel>')
  }

  lines.push('</Tabs>')
  return lines.join('\n')
})
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 w-full rounded-xl p-4">
      <Tabs v-model="activeTab" class="ds-drawer-tabs w-full">
        <TabList class="h-auto w-full justify-start gap-1 bg-transparent p-0">
          <Tab value="overview" class="inline-flex items-center gap-1.5 px-3 py-2">
            <Info :size="14" />
            {{ tabs.overview }}
          </Tab>
          <Tab value="issues" class="inline-flex items-center gap-1.5 px-3 py-2">
            <AlertCircle :size="14" />
            {{ tabs.issues }}
          </Tab>
          <Tab value="reports" class="inline-flex items-center gap-1.5 px-3 py-2">
            <BarChart2 :size="14" />
            {{ tabs.reports }}
          </Tab>
          <Tab value="settings" class="inline-flex items-center gap-1.5 px-3 py-2">
            <Settings :size="14" />
            {{ tabs.settings }}
          </Tab>
        </TabList>
        <TabPanel value="overview" class="pt-4 text-xs leading-relaxed text-[#7BA3C8]">
          {{ panels.overview }}
        </TabPanel>
        <TabPanel value="issues" class="pt-4 text-xs text-[#7BA3C8]">
          {{ panels.issues }}
        </TabPanel>
        <TabPanel value="reports" class="pt-4 text-xs text-[#7BA3C8]">
          {{ panels.reports }}
        </TabPanel>
        <TabPanel value="settings" class="pt-4 text-xs text-[#7BA3C8]">
          {{ panels.settings }}
        </TabPanel>
      </Tabs>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
