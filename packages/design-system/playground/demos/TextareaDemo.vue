<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr, templateBooleanAttr, templateStringAttr } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Switch, Textarea } from '@/index'

const { t } = usePlaygroundLocale()

const sizeOptions = ['sm', 'md', 'lg'] as const
const stateOptions = ['default', 'error', 'disabled'] as const

type TextareaSize = (typeof sizeOptions)[number]
type TextareaState = (typeof stateOptions)[number]

const value = ref('Add a note about this item.')
const size = ref<TextareaSize>('md')
const placeholder = ref('Add a note…')
const rows = ref(4)
const readonly = ref(false)
const state = ref<TextareaState>('default')

const errorMessage = 'Required field'

const code = computed(() => {
  const lines = [
    '<Textarea',
    '  v-model="notes"',
    `  ${playgroundSnippetAttr('size', size.value)}`,
    `  ${playgroundSnippetAttr('placeholder', placeholder.value)}`,
    `  ${playgroundSnippetAttr('rows', rows.value)}`,
  ]

  if (readonly.value) lines.push(`  ${templateBooleanAttr('readonly', true)}`)
  if (state.value === 'error') {
    lines.push(`  ${templateBooleanAttr('error', true)}`)
    lines.push(`  ${templateStringAttr('message', errorMessage)}`)
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
        <Textarea
          :key="`${size}-${state}-${readonly}-${rows}`"
          v-model="value"
          class="max-w-sm"
          :size="size"
          :placeholder="placeholder"
          :rows="rows"
          :readonly="readonly"
          :error="state === 'error'"
          :disabled="state === 'disabled'"
          :message="state === 'error' ? errorMessage : undefined"
        />
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">size</p>
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

      <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
        <Switch v-model="readonly" size="sm" />
        readonly
      </label>

      <div>
        <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">rows</p>
        <input
          v-model.number="rows"
          type="number"
          min="2"
          max="12"
          class="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
        />
      </div>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
