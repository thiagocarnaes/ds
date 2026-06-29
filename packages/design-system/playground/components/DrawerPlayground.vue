<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import {
  ArrowRight,
  ArrowUpRight,
  Gem,
  Target,
  Zap,
} from 'lucide-vue-next'
import UsageBlock from './UsageBlock.vue'
import {
  Alert,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Input,
  Select,
  Switch,
  Toast,
  iconographySelectOptions,
  useToast,
  type ButtonIconName,
  type ToastPosition,
} from '@/index'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import {
  templateBooleanAttr,
  templateStringAttr,
  playgroundSnippetAttr,
} from '../utils/propTemplateName'
import { resolveChatReply } from '../utils/chatPlayground'
import { getPlaygroundDemoComponent } from '../demos/registry'

const props = defineProps<{ name: string }>()
const externalDemo = computed(() => getPlaygroundDemoComponent(props.name))
const { t, messages, locale } = usePlaygroundLocale()

const selectMultiple = ref(false)
const selectValue = ref('')
const selectMultipleValue = ref<string[]>(['design-system', 'react'])
const selectSearchable = ref(true)
const selectDisabled = ref(false)
const selectPlaceholderSingle = ref('')
const selectPlaceholderMulti = ref('')

const buttonVariant = ref<
  'default' | 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive' | 'clean' | 'link'
>('primary')
const buttonSize = ref<'sm' | 'md' | 'lg'>('md')
const buttonDisabled = ref(false)
const buttonLoading = ref(false)
const buttonIconValue = ref('')

const buttonIcon = computed<ButtonIconName | undefined>(() =>
  buttonIconValue.value ? (buttonIconValue.value as ButtonIconName) : undefined,
)

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
const breadcrumbDepth = ref(3)
const breadcrumbSeparator = ref('/')

const breadcrumbSeparatorPresets = ['/', '>', '·', '→'] as const

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

const alertVariant = ref<AlertVariant>('success')
const alertDismissible = ref(false)
const alertShowTitle = ref(false)
const alertTitle = ref('Deployment status')
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

const selectPlayground = computed(() => messages.value.selectPlayground)
const breadcrumbItems = computed(() => messages.value.breadcrumbPlayground.items)

const selectOptions = [
  { label: 'Design System', value: 'design-system' },
  { label: 'React', value: 'react' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Tailwind CSS', value: 'tailwind' },
  { label: 'Figma', value: 'figma' },
]

const codeSnippet = computed(() => {
  const buttonAttrs = [
    playgroundSnippetAttr('variant', buttonVariant.value),
    playgroundSnippetAttr('size', buttonSize.value),
  ]
  if (buttonIcon.value) buttonAttrs.push(playgroundSnippetAttr('icon', buttonIcon.value))
  if (buttonDisabled.value) buttonAttrs.push(templateBooleanAttr('disabled', true))
  if (buttonLoading.value) buttonAttrs.push(templateBooleanAttr('loading', true))

  const PACKAGE = '@tcarnaes/design-system'

  const map: Record<string, string> = {
    Button: `<script setup lang="ts">
import { Button } from '${PACKAGE}'
<\/script>

<template>
  <Button
  ${buttonAttrs.join('\n  ')}
  >
    Action
  </Button>
</template>`,
    Select: selectMultiple.value
      ? `<Select
  v-model="tags"
  ${templateBooleanAttr('multiple', true)}
  ${templateStringAttr('placeholder', selectPlaceholderMulti.value || 'Select technologies...')}
  ${playgroundSnippetAttr('searchable', selectSearchable.value)}
  ${playgroundSnippetAttr('disabled', selectDisabled.value)}
  :options="options"
/>`
      : `<Select
  v-model="value"
  ${templateStringAttr('placeholder', selectPlaceholderSingle.value || 'Select an option...')}
  ${playgroundSnippetAttr('searchable', selectSearchable.value)}
  ${playgroundSnippetAttr('disabled', selectDisabled.value)}
  :options="options"
/>`,
    Breadcrumbs: `<Breadcrumb ${playgroundSnippetAttr('separator', breadcrumbSeparator.value)}>
${breadcrumbItems.value
  .slice(0, breadcrumbDepth.value)
  .map((item, index, items) =>
    `  <BreadcrumbItem${index === items.length - 1 ? ` ${templateBooleanAttr('current', true)}` : ''}>${item}</BreadcrumbItem>`,
  )
  .join('\n')}
</Breadcrumb>`,
    Alert: `<Alert ${playgroundSnippetAttr('variant', alertVariant.value)}${alertShowTitle.value ? `\n  ${playgroundSnippetAttr('title', alertTitle.value)}` : ''}${alertDismissible.value ? `\n  ${templateBooleanAttr('dismissible', true)}` : ''}>
  ${alertMessages.value[alertVariant.value]}
</Alert>`,
    Toast: `<Toast ${playgroundSnippetAttr('variant', toastVariant.value)}${toastDismissible.value ? `\n  ${templateBooleanAttr('dismissible', true)}` : ''}>
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
    <!-- Button -->
    <template v-if="name === 'Button'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
      <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-6">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div class="pg-playground-preview flex h-24 items-center justify-center rounded-xl">
            <Button
              :variant="buttonVariant"
              :size="buttonSize"
              :icon="buttonIcon"
              :disabled="buttonDisabled"
              :loading="buttonLoading"
            >
              {{ t('buttonPlayground.previewAction') }}
            </Button>
          </div>
          <div>
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">Button States</p>
            <div class="flex items-center gap-3">
              <div class="flex flex-col items-center gap-1">
                <span class="text-[9px] text-[#4D6A87]">default</span>
                <Button :variant="buttonVariant" size="sm">Btn</Button>
              </div>
              <ArrowRight :size="14" class="text-[#4D6A87]" />
              <div class="flex flex-col items-center gap-1">
                <span class="text-[9px] text-[#4D6A87]">hover</span>
                <Button :variant="buttonVariant" size="sm" style="box-shadow: var(--ds-button-shadow-hover); transform: translateY(-2px)">Btn</Button>
              </div>
              <ArrowRight :size="14" class="text-[#4D6A87]" />
              <div class="flex flex-col items-center gap-1">
                <span class="text-[9px] text-[#4D6A87]">pressed</span>
                <Button :variant="buttonVariant" size="sm" style="box-shadow: var(--ds-button-shadow-pressed); transform: translateY(1px) scale(0.98)">Btn</Button>
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div class="min-w-0">
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('buttonPlayground.variantLabel') }}</p>
            <button
              v-for="item in ['default', 'primary', 'secondary', 'ghost', 'outline', 'destructive', 'clean', 'link']"
              :key="item"
              type="button"
              class="mb-1 block w-full rounded px-2 py-1 text-left text-xs"
              :style="optionStyle(buttonVariant === item)"
              @click="buttonVariant = item as typeof buttonVariant"
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
            <label class="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
              <Switch v-model="buttonLoading" size="sm" />
              loading
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

    <!-- Select -->
    <template v-else-if="name === 'Select'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
      <div class="pg-playground-panel mb-6 w-full space-y-4 rounded-xl p-4">
        <div class="flex gap-2">
          <button type="button" class="rounded-md px-3 py-1.5 text-xs font-medium" :style="!selectMultiple ? { background: 'rgba(0,212,255,0.15)', color: '#00D4FF' } : { color: '#4D6A87' }" @click="selectMultiple = false">{{ selectPlayground.modeSingle }}</button>
          <button type="button" class="rounded-md px-3 py-1.5 text-xs font-medium" :style="selectMultiple ? { background: 'rgba(0,212,255,0.15)', color: '#00D4FF' } : { color: '#4D6A87' }" @click="selectMultiple = true">{{ selectPlayground.modeMulti }}</button>
        </div>
        <Select v-if="!selectMultiple" v-model="selectValue" :options="selectOptions" :searchable="selectSearchable" :disabled="selectDisabled" :placeholder="selectPlaceholderSingle || selectPlayground.placeholderSingle" />
        <Select v-else v-model="selectMultipleValue" multiple :options="selectOptions" :searchable="selectSearchable" :disabled="selectDisabled" :placeholder="selectPlaceholderMulti || selectPlayground.placeholderMulti" />
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label class="flex cursor-pointer items-center gap-2 text-xs text-[#4D6A87]">
            <Switch v-model="selectSearchable" size="sm" />
            searchable
          </label>
          <label class="flex cursor-pointer items-center gap-2 text-xs text-[#4D6A87]">
            <Switch v-model="selectDisabled" size="sm" />
            disabled
          </label>
        </div>
        <div>
          <label class="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">placeholder</label>
          <input
            v-if="!selectMultiple"
            v-model="selectPlaceholderSingle"
            type="text"
            :placeholder="selectPlayground.placeholderSingle"
            class="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
          />
          <input
            v-else
            v-model="selectPlaceholderMulti"
            type="text"
            :placeholder="selectPlayground.placeholderMulti"
            class="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
          />
        </div>
      </div>
    </template>

    <!-- Breadcrumbs -->
    <template v-else-if="name === 'Breadcrumbs'">
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
      <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
        <Breadcrumb :separator="breadcrumbSeparator" class="text-sm">
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
          <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
            {{ t('breadcrumbPlayground.separatorLabel') }}
          </p>
          <div class="mb-3 flex flex-wrap gap-1">
            <button
              v-for="item in breadcrumbSeparatorPresets"
              :key="item"
              type="button"
              class="min-w-[2.25rem] rounded px-2 py-1 font-mono text-xs"
              :style="optionStyle(breadcrumbSeparator === item)"
              @click="breadcrumbSeparator = item"
            >
              {{ item }}
            </button>
          </div>
          <input
            v-model="breadcrumbSeparator"
            type="text"
            maxlength="3"
            class="w-full rounded-md border border-border bg-background px-2 py-1.5 font-mono text-xs text-foreground"
            :placeholder="t('breadcrumbPlayground.separatorPlaceholder')"
          />
        </div>
        <div>
          <label class="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
            {{ t('breadcrumbPlayground.depthLabel', { depth: breadcrumbDepth }) }}
          </label>
          <input v-model.number="breadcrumbDepth" type="range" min="1" max="10" class="w-full accent-[#00D4FF]" />
        </div>
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
          :title="alertShowTitle ? alertTitle : undefined"
          :dismissible="alertDismissible"
          @dismiss="resetAlertPreview"
        >
          {{ alertMessages[alertVariant] }}
        </Alert>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            <div class="mt-2 flex w-full items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
              <Switch v-model="alertShowTitle" size="sm" @update:model-value="resetAlertPreview()" />
              title
            </div>
            <input
              v-if="alertShowTitle"
              v-model="alertTitle"
              type="text"
              class="mt-2 w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
              @input="resetAlertPreview()"
            />
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
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

    <!-- External registry demos -->
    <component :is="externalDemo" v-else-if="externalDemo" />

    <!-- Fallback -->
    <template v-else>
      <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
      <div class="pg-playground-panel mb-6 flex min-h-[120px] items-center justify-center rounded-xl p-6">
        <span class="text-sm text-[#4D6A87]">{{ t('drawer.previewFallback', { name }) }}</span>
      </div>
    </template>

    <UsageBlock v-if="!externalDemo" :code="codeSnippet" />
  </div>
</template>
