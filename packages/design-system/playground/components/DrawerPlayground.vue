<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import {
  AlertCircle,
  ArrowUpRight,
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
  Zap,
} from 'lucide-vue-next'
import UsageBlock from './UsageBlock.vue'
import ColorPalettePicker from './ColorPalettePicker.vue'
import {
  Alert,
  AppLayout,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Checkbox,
  Input,
  Label,
  Lozenge,
  Modal,
  Pagination,
  DataTable,
  Select,
  SidebarMenu,
  SidebarMenuGroup,
  SidebarMenuItem,
  SidebarMenuShell,
  Spinner,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Textarea,
  Toggle,
  Toast,
  Tooltip,
  iconographySelectOptions,
  useToast,
  type ButtonIconName,
  type ToastPosition,
} from '@/index'
import PageSizeSelect from '@/components/data-display/PageSizeSelect.vue'
import type { DataTableColumnFilters, DataTableSortEntry } from '@/components/data-display/dataTableTypes'
import {
  fetchUsers,
  mockUsers,
  type UserRow,
} from '../data/mockUsers'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { useDataTableLabels, useStatusLabel, useUserTableColumns } from '../composables/useUserTableColumns'
import DataTablePlaygroundHints from './DataTablePlaygroundHints.vue'
import { resolveChatReply } from '../utils/chatPlayground'

const props = defineProps<{ name: string }>()
const { t, messages, locale } = usePlaygroundLocale()
const userTableColumns = useUserTableColumns()
const dataTableLabels = useDataTableLabels()
const { formatStatus } = useStatusLabel()

const badgeCount = ref(21)
const selectMultiple = ref(false)
const selectValue = ref('')
const selectMultipleValue = ref<string[]>(['design-system', 'react'])

const buttonAppearance = ref<'primary' | 'ghost' | 'outline' | 'danger'>('primary')
const buttonSize = ref<'sm' | 'md' | 'lg'>('md')
const buttonDisabled = ref(false)
const buttonIconValue = ref('')

const buttonIcon = computed<ButtonIconName | undefined>(() =>
  buttonIconValue.value ? (buttonIconValue.value as ButtonIconName) : undefined,
)

const toggles = ref({
  notifications: true,
  darkMode: false,
  autoSave: true,
  analytics: false,
  beta: false,
})

const checks = ref({ terms: true, newsletter: false, twoFactor: false })
const partialChecked = ref(false)
const partialIndeterminate = ref(true)

type ChatModel = 'fast' | 'balanced' | 'deep'
type ChatMessage = { id: string; role: 'user' | 'assistant'; text: string; time: string }

const chatModels = computed(() => {
  const { models } = messages.value.chatPlayground
  return [
    { id: 'fast' as const, label: models.fast, icon: Zap },
    { id: 'balanced' as const, label: models.balanced, icon: Target },
    { id: 'deep' as const, label: models.deep, icon: Gem },
  ]
})

const chatSuggestions = computed(() => messages.value.chatPlayground.suggestions)

const chatModel = ref<ChatModel>('balanced')
const chatInput = ref('')
const chatMessages = ref<ChatMessage[]>([])
const chatTyping = ref(false)
const chatScrollRef = ref<HTMLElement | null>(null)
let chatReplyTimer: ReturnType<typeof setTimeout> | null = null

async function scrollChatToBottom(): Promise<void> {
  await nextTick()
  const el = chatScrollRef.value
  if (el) el.scrollTop = el.scrollHeight
}

function chatTime(): string {
  const timeLocale = locale.value === 'pt-BR' ? 'pt-BR' : 'en-US'
  return new Date().toLocaleTimeString(timeLocale, { hour: '2-digit', minute: '2-digit' })
}

function resetChat(): void {
  if (chatReplyTimer) clearTimeout(chatReplyTimer)
  chatReplyTimer = null
  chatModel.value = 'balanced'
  chatInput.value = ''
  chatTyping.value = false

  const { welcome, preview } = messages.value.chatPlayground
  const time = chatTime()

  chatMessages.value = [
    { id: 'welcome', role: 'assistant', text: welcome, time },
    { id: 'demo-u1', role: 'user', text: preview.userQuestion1, time },
    { id: 'demo-a1', role: 'assistant', text: preview.assistantAnswer1, time },
    { id: 'demo-u2', role: 'user', text: preview.userQuestion2, time },
  ]
}

function chatReply(text: string): string {
  return resolveChatReply(text, messages.value.chatPlayground.replies)
}

function sendChatMessage(text?: string): void {
  const message = (text ?? chatInput.value).trim()
  if (!message || chatTyping.value) return

  chatMessages.value.push({
    id: `user-${Date.now()}`,
    role: 'user',
    text: message,
    time: chatTime(),
  })
  chatInput.value = ''
  chatTyping.value = true
  scrollChatToBottom()

  if (chatReplyTimer) clearTimeout(chatReplyTimer)
  const delay = chatModel.value === 'fast' ? 800 : chatModel.value === 'deep' ? 2000 : 1400
  chatReplyTimer = setTimeout(() => {
    chatTyping.value = false
    chatMessages.value.push({
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      text: chatReply(message),
      time: chatTime(),
    })
    chatReplyTimer = null
    scrollChatToBottom()
  }, delay)
}

function onChatKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendChatMessage()
  }
}

watch(
  () => props.name,
  (name) => {
    if (name === 'Checkbox') {
      checks.value = { terms: true, newsletter: false, twoFactor: false }
      partialChecked.value = false
      partialIndeterminate.value = true
    }
    if (name === 'AI Chat') {
      resetChat()
      scrollChatToBottom()
    }
  },
  { immediate: true },
)

watch(locale, () => {
  if (props.name === 'AI Chat') {
    resetChat()
    scrollChatToBottom()
  }
})

onUnmounted(() => {
  if (chatReplyTimer) clearTimeout(chatReplyTimer)
})
const lozengeBold = ref(false)
const breadcrumbDepth = ref(3)
const pgPageSize = ref(10)
const pgTotalRecords = ref(70)
const pgCurrentPage = ref(3)
const pgPageSizeOptions = [5, 10, 25, 50] as const

const pgTotalPages = computed(() => {
  if (pgTotalRecords.value === 0) return 0
  return Math.ceil(pgTotalRecords.value / pgPageSize.value)
})

watch([pgPageSize, pgTotalRecords], () => {
  const maxPage = Math.max(1, Math.ceil(pgTotalRecords.value / pgPageSize.value))
  if (pgCurrentPage.value > maxPage) pgCurrentPage.value = maxPage
})
const dtSearch = ref('')
const dtPage = ref(1)
const dtPageSize = ref(5)
const dtMode = ref<'client' | 'api'>('api')
const dtSortStack = ref<DataTableSortEntry[]>([])
const dtColumnFilters = ref<DataTableColumnFilters>({})
const dtLoading = ref(false)
const dtRows = ref<UserRow[]>([])
const dtTotal = ref(0)

async function loadDrawerTable(): Promise<void> {
  dtLoading.value = true
  try {
    const result = await fetchUsers({
      page: dtPage.value,
      pageSize: dtPageSize.value,
      search: dtSearch.value,
      sortStack: dtSortStack.value,
      columnFilters: dtColumnFilters.value,
      sortKey: dtSortStack.value[0]?.key ?? null,
      sortDirection: dtSortStack.value[0]?.direction ?? null,
    })
    dtRows.value = result.rows
    dtTotal.value = result.total
  } finally {
    dtLoading.value = false
  }
}

watch([dtMode, dtPage, dtPageSize, dtSearch, dtSortStack, dtColumnFilters], () => {
  if (dtMode.value === 'api') void loadDrawerTable()
}, { immediate: true, deep: true })

function setDrawerTableMode(next: 'client' | 'api'): void {
  if (dtMode.value === next) return
  dtMode.value = next
  dtSearch.value = ''
  dtPage.value = 1
  dtSortStack.value = []
  dtColumnFilters.value = {}
}

const spinnerColor = ref('#00D4FF')
const activeTab = ref('overview')

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

const alertVariant = ref<AlertVariant>('success')
const alertDismissible = ref(false)
const alertPreviewKey = ref(0)

const alertMessages = computed(() => {
  const copy = messages.value.messagesPlayground
  return {
    info: copy.deployQueued,
    success: copy.savedSuccessfully,
    warning: copy.rateLimit,
    error: copy.buildFailed,
  }
})

function resetAlertPreview(): void {
  alertPreviewKey.value += 1
}

const toastVariant = ref<AlertVariant>('success')
const toastPosition = ref<ToastPosition>('top-right')
const toastDismissible = ref(false)
const toastPreviewKey = ref(0)
const toastDemo = useToast()

const toastPositionRows: { label: string; value: ToastPosition }[][] = [
  [
    { label: 'top-left', value: 'top-left' },
    { label: 'top-center', value: 'top-center' },
    { label: 'top-right', value: 'top-right' },
  ],
  [
    { label: 'bottom-left', value: 'bottom-left' },
    { label: 'bottom-center', value: 'bottom-center' },
    { label: 'bottom-right', value: 'bottom-right' },
  ],
]

function showLiveToast(): void {
  toastDemo[toastVariant.value](alertMessages.value[toastVariant.value], {
    position: toastPosition.value,
    dismissible: toastDismissible.value,
  })
}

function resetToastPreview(): void {
  toastPreviewKey.value += 1
}

type ModalVariant = 'confirm' | 'form' | 'danger'

const modalVariant = ref<ModalVariant>('confirm')
const modalOpen = ref(false)
const modalProjectName = ref('')
const modalProjectDescription = ref('')

const modalVariants: ModalVariant[] = ['confirm', 'form', 'danger']

const modalTitles = computed(() => messages.value.modalPlayground.titles)
const modalActions = computed(() => messages.value.modalPlayground.actions)
const modalCopy = computed(() => messages.value.modalPlayground)

function variantPillStyle(active: boolean) {
  return active
    ? { background: 'rgba(0,212,255,0.12)', color: '#00D4FF' }
    : { background: 'rgba(0,0,0,0.25)', color: '#4D6A87' }
}

function openModalPreview(): void {
  modalOpen.value = true
}

const layoutShowHeader = ref(true)
const layoutShowMenu = ref(true)
const layoutShowFooter = ref(true)
const layoutMenuWidthRem = ref(12)
const layoutMenuWidth = computed(() => `${layoutMenuWidthRem.value}rem`)
const layoutMenuCollapsed = ref(false)
const layoutDefaultCollapsed = ref(false)
const layoutPanelOpen = ref(false)
const layoutActiveNav = ref('components.forms.input')
const layoutOpenKeys = ref(['components', 'components.forms'])

const layoutNavLabels = computed(() => messages.value.layoutPlayground.navLabels)
const layoutSidebar = computed(() => messages.value.layoutPlayground.sidebar)
const controlToggles = computed(() => messages.value.controlsPlayground.toggles)
const drawerCheckboxes = computed(() => messages.value.controlsPlayground.drawerCheckboxes)
const selectPlayground = computed(() => messages.value.selectPlayground)
const tabsPlayground = computed(() => messages.value.tabsPlayground)
const breadcrumbItems = computed(() => messages.value.breadcrumbPlayground.items)
const spinnerSizes = ['xs', 'sm', 'md', 'lg'] as const

const badgeAppearances = ['default', 'primary', 'important', 'added', 'removed'] as const

const selectOptions = [
  { label: 'Design System', value: 'design-system' },
  { label: 'React', value: 'react' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Tailwind CSS', value: 'tailwind' },
  { label: 'Figma', value: 'figma' },
]

const avatarMembers = [
  { name: 'Ana Martins' },
  { name: 'Bruno Silva' },
  { name: 'Carla Souza' },
  { name: 'Daniel Lima' },
  { name: 'Eva Costa' },
  { name: 'Fabio Rocha' },
  { name: 'Gabi Nunes' },
  { name: 'Hugo Alves' },
  { name: 'Iris Mendes' },
  { name: 'João Pereira' },
  { name: 'Karla Dias' },
  { name: 'Leo Martins' },
]

const codeSnippet = computed(() => {
  const buttonDisabledAttr = buttonDisabled.value ? '\n  disabled' : ''
  const buttonIconAttr = buttonIcon.value ? `\n  icon="${buttonIcon.value}"` : ''

  const map: Record<string, string> = {
    Button: `<Button
  appearance="${buttonAppearance.value}"
  size="${buttonSize.value}"${buttonIconAttr}${buttonDisabledAttr}
>
  Action
</Button>`,
    Toggle: `<Toggle label="Notifications" defaultChecked />`,
    Checkbox: `<Checkbox label="Accept terms" defaultChecked />
<Checkbox label="Indeterminate" isIndeterminate />`,
    Select: selectMultiple.value
      ? `<Select
  v-model="tags"
  multiple
  placeholder="Select technologies..."
  :options="options"
/>`
      : `<Select
  v-model="value"
  placeholder="Select an option..."
  :options="options"
/>`,
    Badge: `<Badge
  :value="${badgeCount.value}"
  appearance="primary"
/>`,
    Lozenge: `<Lozenge appearance="success"${lozengeBold.value ? ' bold' : ''}>
  Done
</Lozenge>`,
    Avatar: `<Avatar name="Ana Martins" size="lg" />
<AvatarGroup
  :members="people"
  :max="4"
/>`,
    Tabs: `<Tabs v-model="activeTab">
  <TabList>
    <Tab value="overview">Overview</Tab>
    <Tab value="issues">Issues</Tab>
  </TabList>
</Tabs>`,
    Breadcrumbs: `<Breadcrumb>
${breadcrumbItems.value
  .slice(0, breadcrumbDepth.value)
  .map((item, index, items) =>
    `  <BreadcrumbItem${index === items.length - 1 ? ' current' : ''}>${item}</BreadcrumbItem>`,
  )
  .join('\n')}
</Breadcrumb>`,
    Pagination: `<div class="flex items-center justify-between gap-4 border-t border-border pt-4">
  <div class="flex items-center gap-4">
    <p class="text-sm text-muted-foreground">
      <span class="font-medium text-foreground">${pgTotalRecords.value}</span> records ·
      <span class="font-medium text-foreground">${pgTotalPages.value}</span> pages
    </p>
    <PageSizeSelect v-model="pageSize" :options="[5, 10, 25, 50]" label="Rows per page" />
  </div>
  <Pagination
    v-model:current-page="currentPage"
    :total="${pgTotalRecords.value}"
    :page-size="${pgPageSize.value}"
  />
</div>`,
    DataTable: `const columns = [
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
  { key: 'lastLogin', label: 'Last login', sortable: true, filter: 'date' },
]

<DataTable
  v-model:search="search"
  v-model:current-page="page"
  v-model:page-size="pageSize"
  v-model:sort-stack="sortStack"
  v-model:column-filters="columnFilters"
  :columns="columns"
  :rows="rows"
  server-side
  :total="total"
  :loading="loading"
  row-key="id"
  @request="fetchRows"
>
  <template #cell-status="{ value }">
    <Lozenge appearance="success">{{ value }}</Lozenge>
  </template>
</DataTable>

// Click header → single sort. Ctrl+click → multi-sort.
// Filter icon in header → text / date range / enum popover.`,
    Spinner: `<Spinner
  size="md"
  color="${spinnerColor.value}"
/>`,
    Alert: `<Alert variant="${alertVariant.value}"${alertDismissible.value ? '\n  dismissible' : ''}>
  ${alertMessages.value[alertVariant.value]}
</Alert>`,
    Toast: `<Toast variant="${toastVariant.value}"${toastDismissible.value ? '\n  dismissible' : ''}>
  ${alertMessages.value[toastVariant.value]}
</Toast>

// trigger live notification
toast.${toastVariant.value}("${alertMessages.value[toastVariant.value]}", {
  position: "${toastPosition.value}",
  dismissible: ${toastDismissible.value},
})`,
    'AI Chat': messages.value.chatPlayground.usageCode
      .replace('{model}', chatModel.value)
      .replace('{placeholder}', messages.value.chatPlayground.inputPlaceholder),
    Modal: `<Modal variant="${modalVariant.value}" v-model:open="modalOpen">
  <!-- ${modalTitles.value[modalVariant.value]} -->
</Modal>`,
    Layout: `<AppLayout v-model:menu-collapsed="menuCollapsed" v-model:panel-open="panelOpen" menu-width="${layoutMenuWidth.value}">
  <template #menu="{ collapsed }">
    <SidebarMenu v-model:active-id="activeId" v-model:open-keys="openKeys" :collapsed="collapsed">
      <SidebarMenuItem id="dashboard" label="Dashboard" />
    </SidebarMenu>
  </template>

  <div>
    <p>{{ pageTitle }}</p>
    <Button @click="panelOpen = true">View details</Button>
  </div>

  <template #panel="{ closePanel }">
    <div>Detail panel<button @click="closePanel()">Close</button></div>
  </template>
</AppLayout>`,
  }
  return map[props.name] ?? `<!-- ${props.name} -->`
})

function optionStyle(active: boolean) {
  return active
    ? { background: 'rgba(0,212,255,0.12)', color: '#00D4FF', borderLeft: '2px solid #00D4FF' }
    : { color: '#4D6A87' }
}
</script>

<template>
  <div>
    <!-- Badge -->
    <template v-if="name === 'Badge'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
      <div class="pg-playground-panel mb-6 rounded-xl p-6">
        <div class="flex flex-wrap justify-center gap-6 py-2">
          <div v-for="appearance in badgeAppearances" :key="appearance" class="flex flex-col items-center gap-2">
            <Badge :value="badgeCount" :appearance="appearance" />
            <span class="font-mono text-[10px] text-[#4D6A87]">{{ appearance }}</span>
          </div>
        </div>
        <div class="mt-6">
          <label class="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
            {{ t('badgePlayground.countLabel', { count: badgeCount }) }}
          </label>
          <input v-model.number="badgeCount" type="range" min="1" max="99" class="w-full accent-[#00D4FF]" />
        </div>
      </div>
    </template>

    <!-- Button -->
    <template v-else-if="name === 'Button'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
      <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-6">
        <div class="pg-playground-preview flex h-24 items-center justify-center rounded-xl">
          <Button
            :appearance="buttonAppearance"
            :size="buttonSize"
            :icon="buttonIcon"
            :disabled="buttonDisabled"
            :class="buttonAppearance === 'primary' ? 'ds-glow-primary' : undefined"
          >
            {{ t('buttonPlayground.previewAction') }}
          </Button>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div class="min-w-0">
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('buttonPlayground.appearanceLabel') }}</p>
            <button
              v-for="item in ['primary', 'ghost', 'outline', 'danger']"
              :key="item"
              type="button"
              class="mb-1 block w-full rounded px-2 py-1 text-left text-xs"
              :style="optionStyle(buttonAppearance === item)"
              @click="buttonAppearance = item as typeof buttonAppearance"
            >
              {{ item }}
            </button>
          </div>
          <div class="min-w-0">
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('buttonPlayground.sizeLabel') }}</p>
            <button
              v-for="item in ['sm', 'md', 'lg']"
              :key="item"
              type="button"
              class="mb-1 block w-full rounded px-2 py-1 text-left text-xs"
              :style="optionStyle(buttonSize === item)"
              @click="buttonSize = item as typeof buttonSize"
            >
              {{ item }}
            </button>
          </div>
          <div class="min-w-0">
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('buttonPlayground.stateLabel') }}</p>
            <label class="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
              <Switch v-model="buttonDisabled" size="sm" />
              disabled
            </label>
          </div>
        </div>
        <div class="mt-4">
          <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('buttonPlayground.iconLabel') }}</p>
          <Select
            v-model="buttonIconValue"
            :options="iconographySelectOptions"
            :placeholder="t('buttonPlayground.iconPlaceholder')"
            :searchable="false"
          />
        </div>
      </div>
    </template>

    <!-- Toggle -->
    <template v-else-if="name === 'Toggle'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
      <div class="pg-playground-panel mb-6 space-y-2 rounded-xl p-4">
        <Toggle v-model="toggles.notifications">{{ controlToggles.notifications }}</Toggle>
        <Toggle v-model="toggles.darkMode">{{ controlToggles.darkMode }}</Toggle>
        <Toggle v-model="toggles.autoSave">{{ controlToggles.autoSave }}</Toggle>
        <Toggle v-model="toggles.analytics">{{ controlToggles.analytics }}</Toggle>
        <Toggle v-model="toggles.beta">{{ controlToggles.beta }}</Toggle>
      </div>
    </template>

    <!-- Checkbox -->
    <template v-else-if="name === 'Checkbox'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
      <div class="pg-playground-panel mb-6 space-y-2 rounded-xl p-4">
        <div class="pg-playground-row rounded-lg px-4 py-3.5">
          <Checkbox v-model="checks.terms">{{ drawerCheckboxes.terms }}</Checkbox>
        </div>
        <div class="pg-playground-row rounded-lg px-4 py-3.5">
          <Checkbox v-model="checks.newsletter">{{ drawerCheckboxes.newsletter }}</Checkbox>
        </div>
        <div class="pg-playground-row rounded-lg px-4 py-3.5">
          <Checkbox v-model="checks.twoFactor">{{ drawerCheckboxes.twoFactor }}</Checkbox>
        </div>
        <div class="pg-playground-row rounded-lg px-4 py-3.5">
          <Checkbox
            v-model="partialChecked"
            :indeterminate="partialIndeterminate"
            cycle-indeterminate
            @update:indeterminate="partialIndeterminate = $event"
          >
            {{ drawerCheckboxes.partial }}
          </Checkbox>
        </div>
      </div>
    </template>

    <!-- Select -->
    <template v-else-if="name === 'Select'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
      <div class="pg-playground-panel mb-6 w-full space-y-4 rounded-xl p-4">
        <div class="flex gap-2">
          <button type="button" class="rounded-md px-3 py-1.5 text-xs font-medium" :style="!selectMultiple ? { background: 'rgba(0,212,255,0.15)', color: '#00D4FF' } : { color: '#4D6A87' }" @click="selectMultiple = false">{{ selectPlayground.modeSingle }}</button>
          <button type="button" class="rounded-md px-3 py-1.5 text-xs font-medium" :style="selectMultiple ? { background: 'rgba(0,212,255,0.15)', color: '#00D4FF' } : { color: '#4D6A87' }" @click="selectMultiple = true">{{ selectPlayground.modeMulti }}</button>
        </div>
        <Select v-if="!selectMultiple" v-model="selectValue" :options="selectOptions" :placeholder="selectPlayground.placeholderSingle" />
        <Select v-else v-model="selectMultipleValue" multiple :options="selectOptions" :placeholder="selectPlayground.placeholderMulti" />
      </div>
    </template>

    <!-- Lozenge -->
    <template v-else-if="name === 'Lozenge'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
      <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
        <div class="flex flex-wrap gap-2">
          <Lozenge appearance="default" :bold="lozengeBold">{{ t('labelsPlayground.statuses.backlog') }}</Lozenge>
          <Lozenge appearance="success" :bold="lozengeBold">{{ t('labelsPlayground.statuses.done') }}</Lozenge>
          <Lozenge appearance="danger" :bold="lozengeBold">{{ t('labelsPlayground.statuses.blocked') }}</Lozenge>
          <Lozenge appearance="progress" :bold="lozengeBold">{{ t('labelsPlayground.statuses.inProgress') }}</Lozenge>
          <Lozenge appearance="warning" :bold="lozengeBold">{{ t('labelsPlayground.statuses.review') }}</Lozenge>
          <Lozenge appearance="new" :bold="lozengeBold">{{ t('labelsPlayground.statuses.new') }}</Lozenge>
        </div>
        <label class="flex cursor-pointer items-center gap-3 text-xs text-[#7BA3C8]">
          <Switch v-model="lozengeBold" size="sm" />
          {{ t('labelsPlayground.boldAppearance') }}
        </label>
      </div>
    </template>

    <!-- Avatar -->
    <template v-else-if="name === 'Avatar'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
      <div class="pg-playground-panel mb-6 space-y-6 rounded-xl p-4">
        <div>
          <p class="mb-3 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">sizes</p>
          <div class="flex flex-wrap items-end gap-4">
            <div v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size" class="flex flex-col items-center gap-2">
              <Avatar name="Ana Martins" :size="size as 'xs'" />
              <span class="font-mono text-[10px] text-[#4D6A87]">{{ size }}</span>
            </div>
          </div>
        </div>
        <div>
          <p class="mb-3 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">group</p>
          <AvatarGroup :members="avatarMembers" :max="4" size="md" />
        </div>
      </div>
    </template>

    <!-- Tabs -->
    <template v-else-if="name === 'Tabs'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
      <div class="pg-playground-panel mb-6 w-full rounded-xl p-4">
        <Tabs v-model="activeTab" class="ds-drawer-tabs w-full">
          <TabList class="h-auto w-full justify-start gap-1 bg-transparent p-0">
            <Tab value="overview" class="inline-flex items-center gap-1.5 px-3 py-2">
              <Info :size="14" /> {{ tabsPlayground.tabs.overview }}
            </Tab>
            <Tab value="issues" class="inline-flex items-center gap-1.5 px-3 py-2">
              <AlertCircle :size="14" /> {{ tabsPlayground.tabs.issues }}
            </Tab>
            <Tab value="reports" class="inline-flex items-center gap-1.5 px-3 py-2">
              <BarChart2 :size="14" /> {{ tabsPlayground.tabs.reports }}
            </Tab>
            <Tab value="settings" class="inline-flex items-center gap-1.5 px-3 py-2">
              <Settings :size="14" /> {{ tabsPlayground.tabs.settings }}
            </Tab>
          </TabList>
          <TabPanel value="overview" class="pt-4 text-xs leading-relaxed text-[#7BA3C8]">
            {{ tabsPlayground.panels.overview }}
          </TabPanel>
          <TabPanel value="issues" class="pt-4 text-xs text-[#7BA3C8]">{{ tabsPlayground.panels.issues }}</TabPanel>
          <TabPanel value="reports" class="pt-4 text-xs text-[#7BA3C8]">{{ tabsPlayground.panels.reports }}</TabPanel>
          <TabPanel value="settings" class="pt-4 text-xs text-[#7BA3C8]">{{ tabsPlayground.panels.settings }}</TabPanel>
        </Tabs>
      </div>
    </template>

    <!-- Breadcrumbs -->
    <template v-else-if="name === 'Breadcrumbs'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
      <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
        <Breadcrumb separator=">" class="text-sm">
          <BreadcrumbItem
            v-for="(item, index) in breadcrumbItems.slice(0, breadcrumbDepth)"
            :key="item"
            :href="index < breadcrumbDepth - 1 ? '#' : undefined"
            :current="index === breadcrumbDepth - 1"
          >
            {{ item }}
          </BreadcrumbItem>
        </Breadcrumb>
        <div>
          <label class="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
            {{ t('breadcrumbPlayground.depthLabel', { depth: breadcrumbDepth }) }}
          </label>
          <input v-model.number="breadcrumbDepth" type="range" min="1" max="10" class="w-full accent-[#00D4FF]" />
        </div>
      </div>
    </template>

    <!-- Pagination -->
    <template v-else-if="name === 'Pagination'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
      <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
        <div
          class="min-h-[8rem] rounded-lg border border-dashed border-border/60 bg-muted/20"
          aria-hidden="true"
        />

        <div class="flex items-center justify-between gap-4 overflow-x-auto border-t border-border pt-4">
          <div class="flex shrink-0 items-center gap-4 whitespace-nowrap">
            <p class="text-sm text-muted-foreground">
              <span class="font-medium text-foreground">{{ pgTotalRecords }}</span>
              {{ pgTotalRecords === 1 ? dataTableLabels.record : dataTableLabels.records }}
              ·
              <span class="font-medium text-foreground">{{ pgTotalPages }}</span>
              {{ pgTotalPages === 1 ? dataTableLabels.page : dataTableLabels.pages }}
            </p>
            <PageSizeSelect
              v-model="pgPageSize"
              :options="[...pgPageSizeOptions]"
              :label="dataTableLabels.pageSize"
              class="shrink-0"
            />
          </div>

          <Pagination
            v-model:current-page="pgCurrentPage"
            :total="pgTotalRecords"
            :page-size="pgPageSize"
            class="shrink-0"
          />
        </div>

        <div>
          <label class="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
            {{ t('paginationPlayground.totalRecordsLabel', { count: pgTotalRecords }) }}
          </label>
          <input
            v-model.number="pgTotalRecords"
            type="range"
            min="10"
            max="120"
            step="10"
            class="w-full accent-[#00D4FF]"
          />
        </div>
      </div>
    </template>

    <!-- DataTable -->
    <template v-else-if="name === 'DataTable'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
      <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
        <DataTablePlaygroundHints
          :sort-stack="dtSortStack"
          :column-filters="dtColumnFilters"
        />

        <div
          class="inline-flex rounded-lg p-0.5"
          style="background: var(--pg-nav-active-bg); border: 1px solid var(--pg-card-border)"
        >
          <button
            type="button"
            class="rounded-md px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors"
            :style="
              dtMode === 'client'
                ? { background: '#2979FF22', color: '#2979FF' }
                : { color: 'var(--pg-text-muted)' }
            "
            @click="setDrawerTableMode('client')"
          >
            {{ t('dataTable.modeClient') }}
          </button>
          <button
            type="button"
            class="rounded-md px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors"
            :style="
              dtMode === 'api'
                ? { background: '#2979FF22', color: '#2979FF' }
                : { color: 'var(--pg-text-muted)' }
            "
            @click="setDrawerTableMode('api')"
          >
            {{ t('dataTable.modeApi') }}
          </button>
        </div>

        <DataTable
          v-model:search="dtSearch"
          v-model:current-page="dtPage"
          v-model:page-size="dtPageSize"
          v-model:sort-stack="dtSortStack"
          v-model:column-filters="dtColumnFilters"
          :columns="userTableColumns"
          :rows="dtMode === 'client' ? mockUsers : dtRows"
          :server-side="dtMode === 'api'"
          :total="dtMode === 'api' ? dtTotal : undefined"
          :loading="dtMode === 'api' && dtLoading"
          row-key="id"
          :search-placeholder="t('dataTable.searchPlaceholder')"
          :empty-title="dataTableLabels.emptyTitle"
          :empty-description="dataTableLabels.emptyDescription"
          :labels="dataTableLabels"
          @request="loadDrawerTable"
        >
          <template #cell-status="{ value }">
            <Lozenge
              :appearance="
                value === 'active' ? 'success' : value === 'pending' ? 'warning' : 'default'
              "
            >
              {{ formatStatus(value as UserRow['status']) }}
            </Lozenge>
          </template>
        </DataTable>
      </div>
    </template>

    <!-- Spinner -->
    <template v-else-if="name === 'Spinner'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
      <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
        <div class="flex flex-wrap items-end justify-around gap-4 py-4">
          <div v-for="size in spinnerSizes" :key="size" class="flex flex-col items-center gap-2">
            <Spinner :size="size" :color="spinnerColor" />
            <span class="font-mono text-[10px] text-[#4D6A87]">{{ size }}</span>
          </div>
        </div>
        <ColorPalettePicker v-model="spinnerColor" label="color" />
      </div>
    </template>

    <!-- AI Chat -->
    <template v-else-if="name === 'AI Chat'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
      <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
        <p class="font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('chatPlayground.live.modelsLabel') }}</p>
        <div class="flex gap-2">
          <button
            v-for="model in chatModels"
            :key="model.id"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors"
            :style="
              chatModel === model.id
                ? { background: 'rgba(0,212,255,0.15)', color: '#00D4FF', border: '1px solid rgba(0,212,255,0.3)' }
                : { color: '#4D6A87', border: '1px solid transparent' }
            "
            @click="chatModel = model.id"
          >
            <component :is="model.icon" :size="12" />
            {{ model.label }}
          </button>
        </div>
        <div
          ref="chatScrollRef"
          class="pg-chat-surface max-h-64 space-y-3 overflow-y-auto rounded-xl p-4 playground-scroll"
        >
          <template v-for="msg in chatMessages" :key="msg.id">
            <div v-if="msg.role === 'user'" class="flex justify-end gap-2">
              <div class="pg-chat-user-bubble max-w-[85%] rounded-xl rounded-tr-sm px-3 py-2 text-xs">
                {{ msg.text }}
                <p class="mt-1.5 text-right text-[10px] text-[#4D6A87]">{{ msg.time }}</p>
              </div>
              <span
                class="flex size-6 shrink-0 items-center justify-center rounded text-[10px] font-semibold text-[#7BA3C8]"
                style="background: rgba(0,212,255,0.15); border: 1px solid rgba(0,212,255,0.2)"
              >
                {{ t('chatPlayground.live.userBadge') }}
              </span>
            </div>
            <div v-else class="flex gap-2">
              <span class="flex size-6 shrink-0 items-center justify-center rounded bg-primary/20 text-primary">
                <Zap :size="12" />
              </span>
              <div class="pg-chat-ai-bubble max-w-[85%] rounded-xl rounded-tl-sm px-3 py-2 text-xs leading-relaxed">
                {{ msg.text }}
                <p class="mt-2 text-[10px] text-[#4D6A87]">{{ msg.time }}</p>
              </div>
            </div>
          </template>
          <div v-if="chatTyping" class="flex gap-2">
            <span class="flex size-6 shrink-0 items-center justify-center rounded bg-primary/20 text-primary">
              <Zap :size="12" />
            </span>
            <div
              class="pg-chat-ai-bubble flex items-center gap-1 rounded-xl rounded-tl-sm px-4 py-3"
              :aria-label="t('chatPlayground.live.typingAriaLabel')"
            >
              <span
                v-for="dot in 3"
                :key="dot"
                class="size-1.5 animate-pulse rounded-full bg-[#00D4FF]"
                :style="{ animationDelay: `${(dot - 1) * 0.15}s` }"
              />
            </div>
          </div>
        </div>
        <p class="font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('chatPlayground.live.suggestionsLabel') }}</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="chip in chatSuggestions"
            :key="chip"
            type="button"
            class="rounded-full border border-border px-3 py-1 text-[10px] text-[#7BA3C8] transition-colors hover:border-primary/40 hover:text-primary"
            @click="sendChatMessage(chip)"
          >
            {{ chip }}
          </button>
        </div>
        <div class="relative">
          <input
            v-model="chatInput"
            :placeholder="t('chatPlayground.inputPlaceholder')"
            class="w-full rounded-lg border border-border bg-input py-2.5 pl-3 pr-10 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring/30"
            @keydown="onChatKeydown"
          />
          <button
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#4D6A87] transition-colors hover:text-primary disabled:opacity-40"
            :aria-label="t('chatPlayground.live.sendAriaLabel')"
            :disabled="!chatInput.trim() || chatTyping"
            @click="sendChatMessage()"
          >
            <ArrowUpRight :size="14" />
          </button>
        </div>
      </div>
    </template>

    <!-- Alert -->
    <template v-else-if="name === 'Alert'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
      <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
        <Alert
          :key="alertPreviewKey"
          :variant="alertVariant"
          :dismissible="alertDismissible"
          @dismiss="resetAlertPreview"
        >
          {{ alertMessages[alertVariant] }}
        </Alert>
        <div class="grid grid-cols-2 gap-3">
          <div class="min-w-0">
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">variant</p>
            <button
              v-for="item in ['info', 'success', 'warning', 'error']"
              :key="item"
              type="button"
              class="mb-1 block w-full rounded px-2 py-1 text-left text-xs"
              :style="optionStyle(alertVariant === item)"
              @click="alertVariant = item as AlertVariant; resetAlertPreview()"
            >
              {{ item }}
            </button>
          </div>
          <div class="min-w-0">
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">options</p>
            <div class="flex w-full items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
              <Switch v-model="alertDismissible" size="sm" @update:model-value="resetAlertPreview()" />
              dismissible
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Toast -->
    <template v-else-if="name === 'Toast'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
      <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
        <Toast
          :key="toastPreviewKey"
          :variant="toastVariant"
          :dismissible="toastDismissible"
          @dismiss="resetToastPreview"
        >
          {{ alertMessages[toastVariant] }}
        </Toast>
        <div class="grid grid-cols-2 gap-3">
          <div class="min-w-0">
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">variant</p>
            <button
              v-for="item in ['info', 'success', 'warning', 'error']"
              :key="item"
              type="button"
              class="mb-1 block w-full rounded px-2 py-1 text-left text-xs"
              :style="optionStyle(toastVariant === item)"
              @click="toastVariant = item as AlertVariant"
            >
              {{ item }}
            </button>
          </div>
          <div class="min-w-0">
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">position</p>
            <div class="space-y-1">
              <div
                v-for="(row, rowIndex) in toastPositionRows"
                :key="rowIndex"
                class="grid grid-cols-3 gap-1"
              >
                <button
                  v-for="item in row"
                  :key="item.value"
                  type="button"
                  class="rounded px-1 py-1.5 text-center font-mono text-[9px] uppercase tracking-wide"
                  :style="optionStyle(toastPosition === item.value)"
                  @click="toastPosition = item.value"
                >
                  {{ item.label.replace('-', ' ') }}
                </button>
              </div>
            </div>
            <p class="mb-2 mt-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">options</p>
            <div class="flex w-full items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
              <Switch v-model="toastDismissible" size="sm" @update:model-value="resetToastPreview()" />
              dismissible
            </div>
          </div>
        </div>
        <button
          type="button"
          class="w-full rounded-md border border-border px-3 py-2 text-xs text-[#7BA3C8] transition-colors hover:border-primary/40 hover:text-primary"
          @click="showLiveToast()"
        >
          {{ t('toastPlayground.showAt', { position: toastPosition.replace('-', ' ') }) }}
        </button>
      </div>
    </template>

    <!-- Modal -->
    <template v-else-if="name === 'Modal'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
      <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
        <div class="flex gap-2">
          <button
            v-for="item in modalVariants"
            :key="item"
            type="button"
            class="flex-1 rounded-md px-3 py-2 font-mono text-[10px] uppercase tracking-wide transition-colors"
            :style="variantPillStyle(modalVariant === item)"
            @click="modalVariant = item"
          >
            {{ item }}
          </button>
        </div>
        <button
          type="button"
          class="flex w-full items-center justify-center gap-2 rounded-md border border-primary/40 px-3 py-2.5 text-xs text-primary transition-colors hover:border-primary hover:bg-primary/5"
          @click="openModalPreview()"
        >
          {{ modalCopy.openButton }}
          <ArrowUpRight :size="14" />
        </button>
      </div>

      <Modal v-model:open="modalOpen" class="max-w-md overflow-hidden p-0">
        <div class="flex items-start justify-between border-b border-border px-6 py-4">
          <h2 class="text-lg font-semibold leading-none text-foreground">
            {{ modalTitles[modalVariant] }}
          </h2>
          <button
            type="button"
            class="rounded-sm text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            :aria-label="modalCopy.closeAriaLabel"
            @click="modalOpen = false"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="space-y-4 px-6 py-4">
          <template v-if="modalVariant === 'confirm'">
            <p class="text-sm leading-relaxed text-[#7BA3C8]">
              {{ modalCopy.confirmBody }}
            </p>
          </template>

          <template v-else-if="modalVariant === 'form'">
            <div class="space-y-2">
              <Label class="text-[#7BA3C8]">{{ modalCopy.fields.projectName }}</Label>
              <Input v-model="modalProjectName" :placeholder="modalCopy.placeholders.projectName" />
            </div>
            <div class="space-y-2">
              <Label class="text-[#7BA3C8]">{{ modalCopy.fields.description }}</Label>
              <Textarea
                v-model="modalProjectDescription"
                :placeholder="modalCopy.placeholders.description"
                class="min-h-24"
              />
            </div>
          </template>

          <template v-else>
            <p class="text-sm leading-relaxed text-[#7BA3C8]">
              {{ modalCopy.dangerIntro }}
              <strong class="text-foreground">ATLAS-42</strong>
              {{ modalCopy.dangerOutro }}
            </p>
            <Alert variant="error">
              {{ modalCopy.dangerAlert }}
            </Alert>
          </template>
        </div>

        <div class="flex justify-end gap-2 border-t border-border px-6 py-4">
          <Button appearance="ghost" @click="modalOpen = false">
            {{ modalCopy.cancel }}
          </Button>
          <Button
            :appearance="modalVariant === 'danger' ? 'danger' : 'primary'"
            :class="modalVariant !== 'danger' ? 'ds-glow-primary' : undefined"
            @click="modalOpen = false"
          >
            {{ modalActions[modalVariant] }}
          </Button>
        </div>
      </Modal>
    </template>

    <!-- Layout -->
    <template v-else-if="name === 'Layout'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>

      <div
        class="mb-4 rounded-xl border border-[#00E5B0]/15 p-4"
        style="background: rgba(0,229,176,0.04)"
      >
        <p class="mb-3 text-xs leading-relaxed text-[#7BA3C8]">
          <strong class="text-[#E8EDF5]">AppLayout</strong> {{ t('layoutPlayground.introLead') }}
          {{ t('layoutPlayground.introBody') }}
        </p>
        <div class="grid grid-cols-2 gap-2 text-[10px]">
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
          v-model:menu-collapsed="layoutMenuCollapsed"
          v-model:panel-open="layoutPanelOpen"
          :default-menu-collapsed="layoutDefaultCollapsed"
          :menu-width="layoutMenuWidth"
          :show-header="layoutShowHeader"
          :show-menu="layoutShowMenu"
          :show-footer="layoutShowFooter"
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
              <Lozenge appearance="success">{{ t('app.stable') }}</Lozenge>
            </div>
          </template>

          <template #menu="{ collapsed, toggleMenu, menuLabel, menuWidth, menuCollapsedWidth }">
            <div
              class="w-full overflow-hidden rounded"
              style="background: rgba(167,139,250,0.06)"
            >
              <SidebarMenuShell
                :collapsed="collapsed"
                :menu-label="menuLabel"
                :menu-width="menuWidth"
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
                  v-model:active-id="layoutActiveNav"
                  v-model:open-keys="layoutOpenKeys"
                  :collapsed="collapsed"
                >
                  <SidebarMenuItem id="dashboard" :label="layoutSidebar.dashboard" :icon="BarChart2" />

                  <SidebarMenuGroup id="components" :label="layoutSidebar.components" :icon="Gem" default-open>
                    <SidebarMenuItem id="components.overview" :label="layoutSidebar.overview" :icon="Layers" />
                    <SidebarMenuItem id="components.button" :label="layoutSidebar.button" :icon="Box" />

                    <SidebarMenuGroup id="components.forms" :label="layoutSidebar.forms" :icon="Type" default-open>
                      <SidebarMenuItem id="components.forms.input" :label="layoutSidebar.input" :icon="Type" />
                      <SidebarMenuItem id="components.forms.select" :label="layoutSidebar.select" :icon="Target" />
                    </SidebarMenuGroup>

                    <SidebarMenuGroup id="components.feedback" :label="layoutSidebar.feedback" :icon="AlertCircle">
                      <SidebarMenuItem id="components.feedback.alert" :label="layoutSidebar.alert" :icon="AlertCircle" />
                      <SidebarMenuItem id="components.feedback.toast" :label="layoutSidebar.toast" :icon="Info" />
                    </SidebarMenuGroup>
                  </SidebarMenuGroup>

                  <SidebarMenuGroup id="foundations" :label="layoutSidebar.foundations" :icon="Palette">
                    <SidebarMenuItem id="foundations.colors" :label="layoutSidebar.colors" :icon="Palette" />
                    <SidebarMenuItem id="foundations.typography" :label="layoutSidebar.typography" :icon="Type" />
                  </SidebarMenuGroup>

                  <SidebarMenuGroup id="settings" :label="layoutSidebar.settings" :icon="Settings">
                    <SidebarMenuItem id="settings.profile" :label="layoutSidebar.profile" :icon="Users" />
                    <SidebarMenuItem id="settings.team" :label="layoutSidebar.team" :icon="Users" />
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
                {{ layoutNavLabels[layoutActiveNav] ?? layoutActiveNav }}
              </p>
              <Button appearance="outline" size="sm" @click="layoutPanelOpen = true">
                {{ t('layoutPlayground.viewDetails') }}
              </Button>
            </div>
          </div>

          <template #panel="{ closePanel }">
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
                {{ layoutNavLabels[layoutActiveNav] ?? layoutActiveNav }}
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

        <div class="grid grid-cols-2 gap-3">
          <div class="min-w-0">
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('layoutPlayground.regionsTitle') }}</p>
            <button
              type="button"
              class="mb-1 flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs text-[#4D6A87]"
              @click="layoutShowHeader = !layoutShowHeader"
            >
              <span
                class="inline-flex h-4 w-8 shrink-0 items-center rounded-full p-0.5 transition-colors"
                :class="layoutShowHeader ? 'justify-end bg-[#00E5B0]' : 'justify-start bg-[#1E3A5A]'"
              >
                <span class="size-3 rounded-full bg-white shadow" />
              </span>
              {{ t('layoutPlayground.regions.header.label').toLowerCase() }}
            </button>
            <button
              type="button"
              class="mb-1 flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs text-[#4D6A87]"
              @click="layoutShowMenu = !layoutShowMenu"
            >
              <span
                class="inline-flex h-4 w-8 shrink-0 items-center rounded-full p-0.5 transition-colors"
                :class="layoutShowMenu ? 'justify-end bg-[#00E5B0]' : 'justify-start bg-[#1E3A5A]'"
              >
                <span class="size-3 rounded-full bg-white shadow" />
              </span>
              {{ t('layoutPlayground.regions.menu.label').toLowerCase() }}
            </button>
            <button
              type="button"
              class="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs text-[#4D6A87]"
              @click="layoutShowFooter = !layoutShowFooter"
            >
              <span
                class="inline-flex h-4 w-8 shrink-0 items-center rounded-full p-0.5 transition-colors"
                :class="layoutShowFooter ? 'justify-end bg-[#00E5B0]' : 'justify-start bg-[#1E3A5A]'"
              >
                <span class="size-3 rounded-full bg-white shadow" />
              </span>
              {{ t('layoutPlayground.regions.footer.label').toLowerCase() }}
            </button>
          </div>
          <div
            class="min-w-0"
          >
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
              {{ t('layoutPlayground.menuWidthLabel', { width: layoutMenuWidth }) }}
            </p>
            <input
              v-model.number="layoutMenuWidthRem"
              type="range"
              min="8"
              max="16"
              step="1"
              class="mb-4 w-full accent-[#00E5B0]"
            />
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('layoutPlayground.regions.menu.label').toLowerCase() }}</p>
            <button
              type="button"
              class="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs text-[#4D6A87]"
              @click="layoutDefaultCollapsed = !layoutDefaultCollapsed; layoutMenuCollapsed = layoutDefaultCollapsed"
            >
              <span
                class="inline-flex h-4 w-8 shrink-0 items-center rounded-full p-0.5 transition-colors"
                :class="layoutDefaultCollapsed ? 'justify-end bg-[#00E5B0]' : 'justify-start bg-[#1E3A5A]'"
              >
                <span class="size-3 rounded-full bg-white shadow" />
              </span>
              {{ t('layoutPlayground.startCollapsed') }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Fallback -->
    <template v-else>
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
      <div class="pg-playground-panel mb-6 flex min-h-[120px] items-center justify-center rounded-xl p-6">
        <span class="text-sm text-[#4D6A87]">{{ t('drawer.previewFallback', { name }) }}</span>
      </div>
    </template>

    <UsageBlock :code="codeSnippet" />
  </div>
</template>
