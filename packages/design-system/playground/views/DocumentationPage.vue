<script setup lang="ts">
import { computed } from 'vue'
import { BookOpen, ExternalLink, Package } from 'lucide-vue-next'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'

const PACKAGE = '@tcarnaes/design-system'
const VERSION = '0.1.2'

const { messages, t, locale } = usePlaygroundLocale()

const installCmd = `npm install ${PACKAGE} vue`

const mainTs = `import { createApp } from 'vue'
import App from './App.vue'
import '${PACKAGE}/styles.css'

createApp(App).mount('#app')`

const basicUsage = `<script setup lang="ts">
import { Button, FormField, Input } from '${PACKAGE}'
import { ref } from 'vue'

const email = ref('')
<\/script>

<template>
  <FormField :label="'Email'">
    <Input v-model="email" :placeholder="'you@company.com'" />
  </FormField>
  <Button :variant="'primary'">Save</Button>
</template>`

const toastUsage = `<script setup lang="ts">
import { Button, ToastHost, useToast } from '${PACKAGE}'

const toast = useToast()

function onSave() {
  toast.success('Changes saved.')
}
<\/script>

<template>
  <ToastHost />
  <Button :variant="'primary'" @click="onSave">Save</Button>
</template>`

const darkMode = `document.documentElement.classList.toggle('dark', isDark)`

const dataTableUsage = `<script setup lang="ts">
import { DataTable, Lozenge } from '${PACKAGE}'
import type { DataTableColumn, DataTableColumnFilters, DataTableSortEntry } from '${PACKAGE}'
import { ref } from 'vue'

const columns: DataTableColumn[] = [
  { key: 'name', label: 'Name', sortable: true, filter: 'text' },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    filter: 'enum',
    filterOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
  },
  { key: 'createdAt', label: 'Created', sortable: true, filter: 'date' },
]

const rows = ref([{ id: '1', name: 'Ana', status: 'active', createdAt: '2026-06-01' }])
const sortStack = ref<DataTableSortEntry[]>([])
const columnFilters = ref<DataTableColumnFilters>({})
<\/script>

<template>
  <DataTable
    v-model:sort-stack="sortStack"
    v-model:column-filters="columnFilters"
    :columns="columns"
    :rows="rows"
    :row-key="'id'"
  >
    <template #cell-status="{ value }">
      <Lozenge :variant="'success'">{{ value }}</Lozenge>
    </template>
  </DataTable>
</template>

<!-- Click header: single sort. Ctrl+click: multi-sort. Filter icon: column popover. -->`

const componentGroups = [
  { category: 'Actions', items: ['Button', 'IconButton', 'Link'] },
  {
    category: 'Forms',
    items: ['Input', 'Textarea', 'Checkbox', 'Radio', 'RadioGroup', 'Switch', 'Toggle', 'Select', 'Label', 'FormField'],
  },
  {
    category: 'Feedback',
    items: ['Alert', 'Badge', 'Spinner', 'Progress', 'Skeleton', 'Toast', 'ToastHost'],
  },
  {
    category: 'Navigation',
    items: ['Tabs', 'TabList', 'Tab', 'TabPanel', 'Breadcrumb', 'BreadcrumbItem', 'Pagination', 'SidebarMenu*'],
  },
  {
    category: 'Data display',
    items: ['Card', 'Divider', 'Avatar', 'AvatarGroup', 'Lozenge', 'Table*', 'DataTable', 'DataTableColumnFilterMenu', 'PageSizeSelect', 'List', 'ListItem', 'EmptyState'],
  },
  { category: 'Overlay', items: ['Modal', 'Dialog', 'Tooltip', 'Popover', 'Drawer'] },
  { category: 'Layout', items: ['Container', 'Stack', 'Grid', 'AppLayout'] },
  { category: 'Utils', items: ['cn', 'useToast', 'buttonVariants', 'iconography'] },
]

const localizedGroups = computed(() =>
  componentGroups.map((group) => ({
    ...group,
    label: messages.value.docs.groupCategories[group.category] ?? group.category,
  })),
)
</script>

<template>
  <div class="pg-docs">
    <div class="pg-docs-hero pg-playground-panel rounded-2xl p-4 sm:p-6 md:p-8">
      <div class="mb-4 flex items-center gap-2">
        <BookOpen :size="16" class="text-primary" />
        <span class="pg-text-muted font-mono text-[10px] uppercase tracking-wider">{{ t('docs.badge') }}</span>
      </div>
      <h2 class="mb-2 text-xl font-bold sm:text-2xl" style="color: var(--pg-text)">{{ t('docs.title') }}</h2>
      <p class="pg-text-subtle mb-6 max-w-2xl text-sm leading-relaxed">
        {{ t('docs.subtitle') }}
      </p>
      <div class="flex flex-wrap items-center gap-3">
        <span
          class="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-xs"
          style="background: var(--pg-nav-active-bg); color: var(--pg-accent)"
        >
          <Package :size="14" />
          {{ PACKAGE }}@{{ VERSION }}
        </span>
        <a
          href="https://www.npmjs.com/package/@tcarnaes/design-system"
          target="_blank"
          rel="noopener noreferrer"
          class="pg-text-muted inline-flex items-center gap-1.5 text-xs transition-colors hover:text-[var(--pg-accent)]"
        >
          npm
          <ExternalLink :size="12" />
        </a>
        <a
          href="https://github.com/thiagocarnaes/ds"
          target="_blank"
          rel="noopener noreferrer"
          class="pg-text-muted inline-flex items-center gap-1.5 text-xs transition-colors hover:text-[var(--pg-accent)]"
        >
          GitHub
          <ExternalLink :size="12" />
        </a>
      </div>
    </div>

    <section class="pg-docs-section">
      <h3 class="pg-docs-heading">{{ t('docs.requirements') }}</h3>
      <ul class="pg-text-subtle list-inside list-disc space-y-1 text-sm">
        <li>{{ t('docs.reqVue') }}</li>
        <li>{{ t('docs.reqNode') }}</li>
      </ul>
    </section>

    <section class="pg-docs-section">
      <h3 class="pg-docs-heading">{{ t('docs.installTitle') }}</h3>
      <p class="pg-text-subtle mb-3 text-sm">{{ t('docs.installBody') }}</p>
      <UsageBlock :code="installCmd" />
    </section>

    <section class="pg-docs-section">
      <h3 class="pg-docs-heading">{{ t('docs.stylesTitle') }}</h3>
      <p class="pg-text-subtle mb-3 text-sm">{{ t('docs.stylesBody') }}</p>
      <UsageBlock :code="mainTs" />
    </section>

    <section class="pg-docs-section">
      <h3 class="pg-docs-heading">{{ t('docs.componentsTitle') }}</h3>
      <p class="pg-text-subtle mb-3 text-sm">{{ t('docs.componentsBody') }}</p>
      <UsageBlock :code="basicUsage" />
    </section>

    <section class="pg-docs-section">
      <h3 class="pg-docs-heading">{{ t('docs.toastsTitle') }}</h3>
      <p class="pg-text-subtle mb-3 text-sm">
        {{ t('docs.toastsBody') }}
      </p>
      <UsageBlock :code="toastUsage" />
    </section>

    <section class="pg-docs-section">
      <h3 class="pg-docs-heading">{{ t('docs.darkModeTitle') }}</h3>
      <p class="pg-text-subtle mb-3 text-sm">
        {{ t('docs.darkModeBody') }}
      </p>
      <UsageBlock :code="darkMode" />
    </section>

    <section class="pg-docs-section">
      <h3 class="pg-docs-heading">{{ t('docs.dataTableTitle') }}</h3>
      <p class="pg-text-subtle mb-3 text-sm">
        {{ t('docs.dataTableBody') }}
        <code class="pg-docs-inline">{{ t('docs.dataTableBodyFilter') }}</code>,
        use
        <code class="pg-docs-inline">{{ t('docs.dataTableBodySortStack') }}</code>
        {{ locale === 'pt-BR' ? 'para multi-sort (Ctrl+clique na UI), e' : 'for multi-sort (Ctrl+click in UI), and' }}
        <code class="pg-docs-inline">{{ t('docs.dataTableBodyColumnFilters') }}</code>
        {{ locale === 'pt-BR' ? 'para filtros por coluna abertos pelo ícone no cabeçalho.' : 'for per-column filters opened from the header icon.' }}
      </p>
      <UsageBlock :code="dataTableUsage" />
    </section>

    <section class="pg-docs-section">
      <h3 class="pg-docs-heading">{{ t('docs.exportedTitle') }}</h3>
      <div class="pg-playground-panel overflow-hidden rounded-xl">
        <div
          v-for="group in localizedGroups"
          :key="group.category"
          class="border-b px-4 py-3 last:border-b-0"
          style="border-color: var(--pg-border)"
        >
          <p class="pg-text-muted mb-2 font-mono text-[10px] uppercase tracking-wider">
            {{ group.label }}
          </p>
          <div class="flex flex-wrap gap-2">
            <code
              v-for="item in group.items"
              :key="item"
              class="pg-docs-tag rounded-md px-2 py-0.5 font-mono text-[10px]"
            >
              {{ item }}
            </code>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
