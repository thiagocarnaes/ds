<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr, templateBooleanAttr, templateStringAttr } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Input, Switch } from '@/index'

const { t } = usePlaygroundLocale()

const typeOptions = ['text', 'email', 'password', 'search', 'date'] as const
const sizeOptions = ['sm', 'md', 'lg'] as const
const stateOptions = ['default', 'error', 'success', 'disabled'] as const

type InputType = (typeof typeOptions)[number]
type InputSize = (typeof sizeOptions)[number]
type InputState = (typeof stateOptions)[number]

const value = ref('Ana Martins')
const type = ref<InputType>('text')
const size = ref<InputSize>('md')
const placeholder = ref('Full name')
const minLength = ref(0)
const maxLength = ref(0)
const readonly = ref(false)
const state = ref<InputState>('default')

const errorMessage = 'Invalid value'

const code = computed(() => {
  const lines = [
    '<Input',
    '  v-model="name"',
    `  ${playgroundSnippetAttr('type', type.value)}`,
    `  ${playgroundSnippetAttr('size', size.value)}`,
    `  ${playgroundSnippetAttr('placeholder', placeholder.value)}`,
  ]

  if (minLength.value > 0) lines.push(`  ${templateStringAttr('minLength', minLength.value)}`)
  if (maxLength.value > 0) lines.push(`  ${templateStringAttr('maxLength', maxLength.value)}`)
  if (readonly.value) lines.push(`  ${templateBooleanAttr('readonly', true)}`)
  if (state.value === 'error') {
    lines.push(`  ${templateBooleanAttr('error', true)}`)
    lines.push(`  ${templateStringAttr('message', errorMessage)}`)
  } else if (state.value === 'success') {
    lines.push(`  ${templateBooleanAttr('success', true)}`)
  } else if (state.value === 'disabled') {
    lines.push(`  ${templateBooleanAttr('disabled', true)}`)
  }

  lines.push('/>')
  return lines.join('\n')
})
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="pg-playground-preview flex items-center justify-center rounded-xl">
        <Input
          :key="`${type}-${size}-${state}-${readonly}-${minLength}-${maxLength}`"
          v-model="value"
          :type="type"
          :size="size"
          :placeholder="placeholder"
          :min-length="minLength || undefined"
          :max-length="maxLength || undefined"
          class="max-w-xs"
          :readonly="readonly"
          :error="state === 'error'"
          :success="state === 'success'"
          :disabled="state === 'disabled'"
          :message="state === 'error' ? errorMessage : undefined"
        />
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">type</p>
          <button
            v-for="item in typeOptions"
            :key="item"
            type="button"
            class="mb-1 block w-full rounded px-2 py-1 text-left text-xs transition-all"
            :style="playgroundOptionStyle(type === item)"
            @click="type = item"
          >
            {{ item }}
          </button>
        </div>
        <div>
          <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
            {{ t('buttonPlayground.sizeLabel').toLowerCase() }}
          </p>
          <button
            v-for="item in sizeOptions"
            :key="item"
            type="button"
            class="mb-1 block w-full rounded px-2 py-1 text-left text-xs transition-all"
            :style="playgroundOptionStyle(size === item)"
            @click="size = item"
          >
            {{ item }}
          </button>
        </div>
      </div>

      <div>
        <label class="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">placeholder</label>
        <input
          v-model="placeholder"
          type="text"
          class="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
        />
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label class="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">minLength</label>
          <input
            v-model.number="minLength"
            type="number"
            min="0"
            class="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
          />
        </div>
        <div>
          <label class="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">maxLength</label>
          <input
            v-model.number="maxLength"
            type="number"
            min="0"
            class="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
          />
        </div>
      </div>

      <label class="flex cursor-pointer items-center gap-2 text-xs text-[#4D6A87]">
        <Switch v-model="readonly" size="sm" />
        readonly
      </label>

      <div>
        <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">state</p>
        <button
          v-for="item in stateOptions"
          :key="item"
          type="button"
          class="mb-1 block w-full rounded px-2 py-1 text-left text-xs transition-all"
          :style="playgroundOptionStyle(state === item)"
          @click="state = item"
        >
          {{ item }}
        </button>
      </div>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
