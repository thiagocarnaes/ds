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

const props = defineProps<{ name: string }>()

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

const chatModels = [
  { id: 'fast' as const, label: 'Fast', icon: Zap },
  { id: 'balanced' as const, label: 'Balanced', icon: Target },
  { id: 'deep' as const, label: 'Deep', icon: Gem },
]

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
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function resetChat(): void {
  if (chatReplyTimer) clearTimeout(chatReplyTimer)
  chatReplyTimer = null
  chatModel.value = 'balanced'
  chatInput.value = ''
  chatTyping.value = false
  chatMessages.value = [
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hey! I'm the design system assistant. Ask me about any component, token, or guideline.",
      time: chatTime(),
    },
  ]
}

function chatReply(text: string): string {
  const lower = text.toLowerCase()
  if (lower.includes('button')) {
    return 'Button supports appearances primary, ghost, outline, and danger. Use the icon prop for leading icons from the iconography set.'
  }
  if (lower.includes('token')) {
    return 'Design tokens are CSS custom properties for color, spacing, typography, and radius — defined in tokens.css and theme.css.'
  }
  if (lower.includes('spacing')) {
    return 'Spacing uses a 4px base scale. Common steps: 1=4px, 2=8px, 3=12px, 4=16px, 6=24px, 8=32px.'
  }
  if (lower.includes('color')) {
    return 'The palette centers on cyan primary (#00D4FF) with semantic colors for success, warning, danger, and labels.'
  }
  return 'I can help with any component, token, or guideline in this design system. Try asking about Button, spacing, or colors.'
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

onUnmounted(() => {
  if (chatReplyTimer) clearTimeout(chatReplyTimer)
})
const lozengeBold = ref(false)
const breadcrumbDepth = ref(3)
const totalPages = ref(8)
const currentPage = ref(3)
const spinnerColor = ref('#00D4FF')
const activeTab = ref('overview')

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

const alertVariant = ref<AlertVariant>('success')
const alertDismissible = ref(false)
const alertPreviewKey = ref(0)

const alertMessages: Record<AlertVariant, string> = {
  info: 'Deploy queued for production environment.',
  success: 'Saved successfully',
  warning: 'Rate limit at 85% — throttling may occur.',
  error: 'Build failed: missing env variable API_KEY.',
}

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
  toastDemo[toastVariant.value](alertMessages[toastVariant.value], {
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

const modalTitles: Record<ModalVariant, string> = {
  confirm: 'Confirm action',
  form: 'Create project',
  danger: 'Delete permanently',
}

const modalActions: Record<ModalVariant, string> = {
  confirm: 'Archive',
  form: 'Create',
  danger: 'Delete forever',
}

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

const layoutNavLabels: Record<string, string> = {
  dashboard: 'Dashboard overview',
  'components.overview': 'Components — Overview',
  'components.button': 'Components — Button',
  'components.forms.input': 'Components — Input field',
  'components.forms.select': 'Components — Select dropdown',
  'components.feedback.alert': 'Components — Alert banner',
  'components.feedback.toast': 'Components — Toast notification',
  'foundations.colors': 'Foundations — Color tokens',
  'foundations.typography': 'Foundations — Typography scale',
  'settings.profile': 'Settings — Profile',
  'settings.team': 'Settings — Team members',
}

const badgeAppearances = ['default', 'primary', 'important', 'added', 'removed'] as const
const spinnerSizes = ['xs', 'sm', 'md', 'lg'] as const

const selectOptions = [
  { label: 'Design System', value: 'design-system' },
  { label: 'React', value: 'react' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Tailwind CSS', value: 'tailwind' },
  { label: 'Figma', value: 'figma' },
]

const breadcrumbItems = [
  'Home',
  'Projects',
  'Design System',
  'Components',
  'Navigation',
  'Breadcrumbs',
  'Settings',
  'Advanced',
  'Details',
  'ATLAS-42',
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
${breadcrumbItems
  .slice(0, breadcrumbDepth.value)
  .map((item, index, items) =>
    `  <BreadcrumbItem${index === items.length - 1 ? ' current' : ''}>${item}</BreadcrumbItem>`,
  )
  .join('\n')}
</Breadcrumb>`,
    Pagination: `<Pagination
  :total="${totalPages.value * 10}"
  :page-size="10"
  :current-page="${currentPage.value}"
/>`,
    Spinner: `<Spinner
  size="md"
  color="${spinnerColor.value}"
/>`,
    Alert: `<Alert variant="${alertVariant.value}"${alertDismissible.value ? '\n  dismissible' : ''}>
  ${alertMessages[alertVariant.value]}
</Alert>`,
    Toast: `<Toast variant="${toastVariant.value}"${toastDismissible.value ? '\n  dismissible' : ''}>
  ${alertMessages[toastVariant.value]}
</Toast>

// trigger live notification
toast.${toastVariant.value}("${alertMessages[toastVariant.value]}", {
  position: "${toastPosition.value}",
  dismissible: ${toastDismissible.value},
})`,
    'AI Chat': `<AIChat
  model="${chatModel.value}"
  placeholder="Ask about any component..."
  onMessage={(msg) => getReply(msg)}
/>`,
    Modal: `<Modal variant="${modalVariant.value}" v-model:open="modalOpen">
  <!-- ${modalTitles[modalVariant.value]} -->
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
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">Live Playground</p>
      <div class="pg-playground-panel mb-6 rounded-xl p-6">
        <div class="flex flex-wrap justify-center gap-6 py-2">
          <div v-for="appearance in badgeAppearances" :key="appearance" class="flex flex-col items-center gap-2">
            <Badge :value="badgeCount" :appearance="appearance" />
            <span class="font-mono text-[10px] text-[#4D6A87]">{{ appearance }}</span>
          </div>
        </div>
        <div class="mt-6">
          <label class="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
            Count — {{ badgeCount }}
          </label>
          <input v-model.number="badgeCount" type="range" min="1" max="99" class="w-full accent-[#00D4FF]" />
        </div>
      </div>
    </template>

    <!-- Button -->
    <template v-else-if="name === 'Button'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">Live Playground</p>
      <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-6">
        <div class="pg-playground-preview flex h-24 items-center justify-center rounded-xl">
          <Button
            :appearance="buttonAppearance"
            :size="buttonSize"
            :icon="buttonIcon"
            :disabled="buttonDisabled"
            :class="buttonAppearance === 'primary' ? 'ds-glow-primary' : undefined"
          >
            Action
          </Button>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <div class="min-w-0">
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">appearance</p>
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
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">size</p>
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
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">state</p>
            <label class="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
              <Switch v-model="buttonDisabled" size="sm" />
              disabled
            </label>
          </div>
        </div>
        <div class="mt-4">
          <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">icon</p>
          <Select
            v-model="buttonIconValue"
            :options="iconographySelectOptions"
            placeholder="Select an icon..."
          />
        </div>
      </div>
    </template>

    <!-- Toggle -->
    <template v-else-if="name === 'Toggle'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">Live Playground</p>
      <div class="pg-playground-panel mb-6 space-y-2 rounded-xl p-4">
        <Toggle v-model="toggles.notifications">Notifications</Toggle>
        <Toggle v-model="toggles.darkMode">Dark mode</Toggle>
        <Toggle v-model="toggles.autoSave">Auto-save</Toggle>
        <Toggle v-model="toggles.analytics">Analytics</Toggle>
        <Toggle v-model="toggles.beta">Beta features</Toggle>
      </div>
    </template>

    <!-- Checkbox -->
    <template v-else-if="name === 'Checkbox'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">Live Playground</p>
      <div class="pg-playground-panel mb-6 space-y-2 rounded-xl p-4">
        <div class="pg-playground-row rounded-lg px-4 py-3.5">
          <Checkbox v-model="checks.terms">Accept terms and conditions</Checkbox>
        </div>
        <div class="pg-playground-row rounded-lg px-4 py-3.5">
          <Checkbox v-model="checks.newsletter">Subscribe to newsletter</Checkbox>
        </div>
        <div class="pg-playground-row rounded-lg px-4 py-3.5">
          <Checkbox v-model="checks.twoFactor">Enable two-factor auth</Checkbox>
        </div>
        <div class="pg-playground-row rounded-lg px-4 py-3.5">
          <Checkbox
            v-model="partialChecked"
            :indeterminate="partialIndeterminate"
            cycle-indeterminate
            @update:indeterminate="partialIndeterminate = $event"
          >
            Partial selection (indeterminate)
          </Checkbox>
        </div>
      </div>
    </template>

    <!-- Select -->
    <template v-else-if="name === 'Select'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">Live Playground</p>
      <div class="pg-playground-panel mb-6 w-full space-y-4 rounded-xl p-4">
        <div class="flex gap-2">
          <button type="button" class="rounded-md px-3 py-1.5 text-xs font-medium" :style="!selectMultiple ? { background: 'rgba(0,212,255,0.15)', color: '#00D4FF' } : { color: '#4D6A87' }" @click="selectMultiple = false">Single select</button>
          <button type="button" class="rounded-md px-3 py-1.5 text-xs font-medium" :style="selectMultiple ? { background: 'rgba(0,212,255,0.15)', color: '#00D4FF' } : { color: '#4D6A87' }" @click="selectMultiple = true">Multi-select</button>
        </div>
        <Select v-if="!selectMultiple" v-model="selectValue" :options="selectOptions" placeholder="Select an option..." />
        <Select v-else v-model="selectMultipleValue" multiple :options="selectOptions" placeholder="Select technologies..." />
      </div>
    </template>

    <!-- Lozenge -->
    <template v-else-if="name === 'Lozenge'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">Live Playground</p>
      <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
        <div class="flex flex-wrap gap-2">
          <Lozenge appearance="default" :bold="lozengeBold">Backlog</Lozenge>
          <Lozenge appearance="success" :bold="lozengeBold">Done</Lozenge>
          <Lozenge appearance="danger" :bold="lozengeBold">Blocked</Lozenge>
          <Lozenge appearance="progress" :bold="lozengeBold">In Progress</Lozenge>
          <Lozenge appearance="warning" :bold="lozengeBold">Review</Lozenge>
          <Lozenge appearance="new" :bold="lozengeBold">New</Lozenge>
        </div>
        <label class="flex cursor-pointer items-center gap-3 text-xs text-[#7BA3C8]">
          <Switch v-model="lozengeBold" size="sm" />
          Bold appearance
        </label>
      </div>
    </template>

    <!-- Avatar -->
    <template v-else-if="name === 'Avatar'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">Live Playground</p>
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
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">Live Playground</p>
      <div class="pg-playground-panel mb-6 w-full rounded-xl p-4">
        <Tabs v-model="activeTab" class="ds-drawer-tabs w-full">
          <TabList class="h-auto w-full justify-start gap-1 bg-transparent p-0">
            <Tab value="overview" class="inline-flex items-center gap-1.5 px-3 py-2">
              <Info :size="14" /> Overview
            </Tab>
            <Tab value="issues" class="inline-flex items-center gap-1.5 px-3 py-2">
              <AlertCircle :size="14" /> Issues
            </Tab>
            <Tab value="reports" class="inline-flex items-center gap-1.5 px-3 py-2">
              <BarChart2 :size="14" /> Reports
            </Tab>
            <Tab value="settings" class="inline-flex items-center gap-1.5 px-3 py-2">
              <Settings :size="14" /> Settings
            </Tab>
          </TabList>
          <TabPanel value="overview" class="pt-4 text-xs leading-relaxed text-[#7BA3C8]">
            Project overview showing key metrics, velocity trends, and recent team activity for the current quarter.
          </TabPanel>
          <TabPanel value="issues" class="pt-4 text-xs text-[#7BA3C8]">12 open issues across 3 epics.</TabPanel>
          <TabPanel value="reports" class="pt-4 text-xs text-[#7BA3C8]">Weekly reports and burndown charts.</TabPanel>
          <TabPanel value="settings" class="pt-4 text-xs text-[#7BA3C8]">Project settings and permissions.</TabPanel>
        </Tabs>
      </div>
    </template>

    <!-- Breadcrumbs -->
    <template v-else-if="name === 'Breadcrumbs'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">Live Playground</p>
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
            Depth — {{ breadcrumbDepth }}
          </label>
          <input v-model.number="breadcrumbDepth" type="range" min="1" max="10" class="w-full accent-[#00D4FF]" />
        </div>
      </div>
    </template>

    <!-- Pagination -->
    <template v-else-if="name === 'Pagination'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">Live Playground</p>
      <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
        <Pagination :total="totalPages * 10" :page-size="10" :current-page="currentPage" @update:current-page="currentPage = $event" />
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">Total pages — {{ totalPages }}</label>
            <input v-model.number="totalPages" type="range" min="3" max="12" class="w-full accent-[#00D4FF]" />
          </div>
          <div class="text-right">
            <p class="mb-1 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">Current</p>
            <p class="font-mono text-lg"><span class="text-primary">{{ currentPage }}</span> / {{ totalPages }}</p>
          </div>
        </div>
      </div>
    </template>

    <!-- Spinner -->
    <template v-else-if="name === 'Spinner'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">Live Playground</p>
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
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">Live Playground</p>
      <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
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
                U
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
        <div class="flex flex-wrap gap-2">
          <button
            v-for="chip in ['Tell me about Button', 'What are design tokens?', 'How does spacing work?', 'Explain the color palette']"
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
            placeholder="Ask about any component or token..."
            class="w-full rounded-lg border border-border bg-input py-2.5 pl-3 pr-10 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring/30"
            @keydown="onChatKeydown"
          />
          <button
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#4D6A87] transition-colors hover:text-primary disabled:opacity-40"
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
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">Live Playground</p>
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
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">Live Playground</p>
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
          Show toast at {{ toastPosition.replace('-', ' ') }} →
        </button>
      </div>
    </template>

    <!-- Modal -->
    <template v-else-if="name === 'Modal'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">Live Playground</p>
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
          Open Modal
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
            aria-label="Close"
            @click="modalOpen = false"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>

        <div class="space-y-4 px-6 py-4">
          <template v-if="modalVariant === 'confirm'">
            <p class="text-sm leading-relaxed text-[#7BA3C8]">
              Are you sure you want to archive this project? It will be hidden from your workspace but can be restored later.
            </p>
          </template>

          <template v-else-if="modalVariant === 'form'">
            <div class="space-y-2">
              <Label class="text-[#7BA3C8]">Project name</Label>
              <Input v-model="modalProjectName" placeholder="My awesome project" />
            </div>
            <div class="space-y-2">
              <Label class="text-[#7BA3C8]">Description</Label>
              <Textarea
                v-model="modalProjectDescription"
                placeholder="Optional description..."
                class="min-h-24"
              />
            </div>
          </template>

          <template v-else>
            <p class="text-sm leading-relaxed text-[#7BA3C8]">
              This will permanently delete
              <strong class="text-foreground">ATLAS-42</strong>
              and all 128 associated issues. This action cannot be undone.
            </p>
            <Alert variant="error">
              All data will be permanently lost.
            </Alert>
          </template>
        </div>

        <div class="flex justify-end gap-2 border-t border-border px-6 py-4">
          <Button appearance="ghost" @click="modalOpen = false">
            Cancel
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
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">Live Playground</p>

      <div
        class="mb-4 rounded-xl border border-[#00E5B0]/15 p-4"
        style="background: rgba(0,229,176,0.04)"
      >
        <p class="mb-3 text-xs leading-relaxed text-[#7BA3C8]">
          <strong class="text-[#E8EDF5]">AppLayout</strong> composes a full-page grid from four slots.
          Header and footer span the full width; menu sits beside the main content area.
          Collapse the menu to icon-only mode with the built-in toggle.
          Nested submenus use <code class="text-primary">SidebarMenuGroup</code> — some open, some closed.
          Click a button or link inside the content to open the resizable
          <code class="text-primary">#panel</code> overlay on the right.
        </p>
        <div class="grid grid-cols-2 gap-2 text-[10px]">
          <div class="rounded-md px-2 py-1.5" style="background: rgba(0,212,255,0.08); color: #00D4FF">
            <span class="font-mono uppercase">#header</span> — top bar
          </div>
          <div class="rounded-md px-2 py-1.5" style="background: rgba(167,139,250,0.08); color: #A78BFA">
            <span class="font-mono uppercase">#menu</span> — sidebar
          </div>
          <div class="rounded-md px-2 py-1.5" style="background: rgba(0,229,176,0.08); color: #00E5B0">
            <span class="font-mono uppercase">default</span> — main content
          </div>
          <div class="rounded-md px-2 py-1.5" style="background: rgba(0,212,255,0.08); color: #00D4FF">
            <span class="font-mono uppercase">#panel</span> — overlay detail
          </div>
          <div class="rounded-md px-2 py-1.5" style="background: rgba(255,139,0,0.08); color: #FF8B00">
            <span class="font-mono uppercase">#footer</span> — bottom bar
          </div>
        </div>
      </div>

      <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
        <p class="font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">Preview</p>

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
                <span class="font-mono text-[8px] uppercase tracking-wider text-[#00D4FF]">header</span>
                <span
                  class="flex size-6 items-center justify-center rounded-md text-[10px] font-bold text-[#060D18]"
                  style="background: linear-gradient(135deg, #0052CC, #00D4FF)"
                >
                  DS
                </span>
                <span class="text-sm font-semibold text-foreground">Design System</span>
              </div>
              <Lozenge appearance="success">stable</Lozenge>
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
                    :content="collapsed ? 'Expand menu' : 'Collapse menu'"
                    placement="right"
                  >
                    <button
                      type="button"
                      class="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      :aria-label="collapsed ? 'Expand menu' : 'Collapse menu'"
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
                  <SidebarMenuItem id="dashboard" label="Dashboard" :icon="BarChart2" />

                  <SidebarMenuGroup id="components" label="Components" :icon="Gem" default-open>
                    <SidebarMenuItem id="components.overview" label="Overview" :icon="Layers" />
                    <SidebarMenuItem id="components.button" label="Button" :icon="Box" />

                    <SidebarMenuGroup id="components.forms" label="Forms" :icon="Type" default-open>
                      <SidebarMenuItem id="components.forms.input" label="Input" :icon="Type" />
                      <SidebarMenuItem id="components.forms.select" label="Select" :icon="Target" />
                    </SidebarMenuGroup>

                    <SidebarMenuGroup id="components.feedback" label="Feedback" :icon="AlertCircle">
                      <SidebarMenuItem id="components.feedback.alert" label="Alert" :icon="AlertCircle" />
                      <SidebarMenuItem id="components.feedback.toast" label="Toast" :icon="Info" />
                    </SidebarMenuGroup>
                  </SidebarMenuGroup>

                  <SidebarMenuGroup id="foundations" label="Foundations" :icon="Palette">
                    <SidebarMenuItem id="foundations.colors" label="Colors" :icon="Palette" />
                    <SidebarMenuItem id="foundations.typography" label="Typography" :icon="Type" />
                  </SidebarMenuGroup>

                  <SidebarMenuGroup id="settings" label="Settings" :icon="Settings">
                    <SidebarMenuItem id="settings.profile" label="Profile" :icon="Users" />
                    <SidebarMenuItem id="settings.team" label="Team" :icon="Users" />
                  </SidebarMenuGroup>
                </SidebarMenu>
              </SidebarMenuShell>
            </div>
          </template>

          <div
            class="flex h-full min-h-0 w-full flex-col rounded p-2"
            style="background: rgba(0,229,176,0.06)"
          >
            <p class="mb-2 font-mono text-[8px] uppercase tracking-wider text-[#00E5B0]">content</p>
            <div
              class="pg-playground-preview flex flex-1 flex-col items-center justify-center gap-3 rounded-lg px-4 py-6 text-center"
            >
              <p class="text-sm text-[#7BA3C8]">
                {{ layoutNavLabels[layoutActiveNav] ?? layoutActiveNav }}
              </p>
              <Button appearance="outline" size="sm" @click="layoutPanelOpen = true">
                View details
              </Button>
            </div>
          </div>

          <template #panel="{ closePanel }">
            <div
              class="flex h-full min-h-0 w-full flex-col rounded p-2"
              style="background: rgba(0,212,255,0.06)"
            >
              <div class="mb-3 flex items-center justify-between gap-2 border-b border-[#00D4FF]/20 pb-2">
                <span class="font-mono text-[8px] uppercase tracking-wider text-[#00D4FF]">panel</span>
                <button
                  type="button"
                  class="rounded px-2 py-0.5 font-mono text-[10px] text-[#4D6A87] transition-colors hover:bg-muted/40 hover:text-foreground"
                  @click="closePanel()"
                >
                  Close
                </button>
              </div>
              <p class="mb-2 text-sm font-medium text-foreground">
                {{ layoutNavLabels[layoutActiveNav] ?? layoutActiveNav }}
              </p>
              <p class="text-xs leading-relaxed text-[#7BA3C8]">
                Secondary panel overlaying the main content. Drag the left edge to resize.
                Use the <code class="text-primary">#panel</code> slot and
                <code class="text-primary">v-model:panel-open</code> to show contextual details without leaving the page.
              </p>
            </div>
          </template>

          <template #footer>
            <div
              class="flex w-full items-center justify-between gap-3 rounded p-2 text-xs"
              style="background: rgba(255,139,0,0.06)"
            >
              <span class="font-mono text-[8px] uppercase tracking-wider text-[#FF8B00]">footer</span>
              <span class="font-mono text-[10px] text-[#4D6A87]">All systems operational</span>
            </div>
          </template>
        </AppLayout>

        <div class="grid grid-cols-2 gap-3">
          <div class="min-w-0">
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">regions</p>
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
              header
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
              menu
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
              footer
            </button>
          </div>
          <div
            class="min-w-0"
          >
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
              menu width — {{ layoutMenuWidth }}
            </p>
            <input
              v-model.number="layoutMenuWidthRem"
              type="range"
              min="8"
              max="16"
              step="1"
              class="mb-4 w-full accent-[#00E5B0]"
            />
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">menu</p>
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
              start collapsed
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Fallback -->
    <template v-else>
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">Live Playground</p>
      <div class="pg-playground-panel mb-6 flex min-h-[120px] items-center justify-center rounded-xl p-6">
        <span class="text-sm text-[#4D6A87]">{{ name }} preview</span>
      </div>
    </template>

    <UsageBlock :code="codeSnippet" />
  </div>
</template>
