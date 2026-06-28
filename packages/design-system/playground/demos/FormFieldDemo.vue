<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, Mail } from 'lucide-vue-next'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr, templateBooleanAttr, templateStringAttr } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { FormField, Input, Switch } from '@/index'

const { t } = usePlaygroundLocale()

const stateOptions = ['default', 'helper', 'error', 'success'] as const
type FieldMode = (typeof stateOptions)[number]

const email = ref('ana@acme.io')
const fieldLabel = ref('Email')
const withIcon = ref(true)
const required = ref(true)
const mode = ref<FieldMode>('default')

const helperText = computed(() => t('inputsPlayground.helpers.emailValid'))
const errorText = 'Invalid email address'

const showHelper = computed(() => mode.value === 'helper' || mode.value === 'success')
const showTrailingIcon = computed(() => mode.value === 'success')

const inputPaddingClass = computed(() => {
  if (withIcon.value && showTrailingIcon.value) return 'pl-9 pr-9'
  if (withIcon.value) return 'pl-9'
  if (showTrailingIcon.value) return 'pr-9'
  return undefined
})

const code = computed(() => {
  const lines = ['<FormField', `  ${playgroundSnippetAttr('label', fieldLabel.value)}`]

  if (required.value) lines.push(`  ${templateBooleanAttr('required', true)}`)

  if (mode.value === 'helper') {
    lines.push(`  ${playgroundSnippetAttr('helper', helperText.value)}`)
  } else if (mode.value === 'error') {
    lines.push(`  ${templateStringAttr('error', errorText)}`)
  } else if (mode.value === 'success') {
    lines.push(`  ${playgroundSnippetAttr('helper', helperText.value)}`)
    lines.push(`  ${templateBooleanAttr('success', true)}`)
  }

  lines.push('>', '  <template #default="{ id }">', '    <div class="relative">')

  if (withIcon.value) {
    lines.push(
      '      <Mail',
      '        :size="14"',
      '        class="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground"',
      '      />',
    )
  }

  const inputAttrs = [
    '      <Input',
    '        :id="id"',
    '        v-model="email"',
    `        ${templateStringAttr('type', 'email')}`,
  ]

  if (inputPaddingClass.value) {
    inputAttrs.push(`        class="${inputPaddingClass.value}"`)
  }
  if (mode.value === 'error') inputAttrs.push(`        ${templateBooleanAttr('error', true)}`)
  if (mode.value === 'success') inputAttrs.push(`        ${templateBooleanAttr('success', true)}`)
  inputAttrs.push('      />')
  lines.push(...inputAttrs)

  if (showTrailingIcon.value) {
    lines.push(
      '      <Check',
      '        :size="14"',
      '        class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-success"',
      '      />',
    )
  }

  lines.push('    </div>', '  </template>', '</FormField>')
  return lines.join('\n')
})
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="flex gap-2">
        <button
          type="button"
          class="rounded-md px-2 py-1 text-[10px] font-medium transition-colors"
          :style="
            withIcon
              ? { background: 'rgba(0,212,255,0.15)', color: '#00D4FF' }
              : { color: '#4D6A87' }
          "
          @click="withIcon = true"
        >
          {{ t('inputsPlayground.modeWithIcon') }}
        </button>
        <button
          type="button"
          class="rounded-md px-2 py-1 text-[10px] font-medium transition-colors"
          :style="
            !withIcon
              ? { background: 'rgba(0,212,255,0.15)', color: '#00D4FF' }
              : { color: '#4D6A87' }
          "
          @click="withIcon = false"
        >
          {{ t('inputsPlayground.modePlain') }}
        </button>
      </div>

      <FormField
        :key="`${mode}-${withIcon}-${required}-${fieldLabel}`"
        :label="fieldLabel"
        :required="required"
        :helper="showHelper ? helperText : undefined"
        :error="mode === 'error' ? errorText : undefined"
        :success="mode === 'success'"
      >
        <template #default="{ id }">
          <div class="relative">
            <Mail
              v-if="withIcon"
              :size="14"
              class="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              :id="id"
              v-model="email"
              type="email"
              placeholder="you@company.com"
              :class="inputPaddingClass"
              :error="mode === 'error'"
              :success="mode === 'success'"
            />
            <Check
              v-if="showTrailingIcon"
              :size="14"
              class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-success"
            />
          </div>
        </template>
      </FormField>

      <div>
        <label class="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">label</label>
        <input
          v-model="fieldLabel"
          type="text"
          class="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
        />
      </div>

      <div>
        <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">state</p>
        <button
          v-for="item in stateOptions"
          :key="item"
          type="button"
          class="mb-1 block w-full rounded px-2 py-1 text-left text-xs transition-all"
          :style="playgroundOptionStyle(mode === item)"
          @click="mode = item"
        >
          {{ item }}
        </button>
      </div>

      <label class="flex cursor-pointer items-center gap-2 text-xs text-[#4D6A87]">
        <Switch v-model="required" size="sm" />
        required
      </label>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
