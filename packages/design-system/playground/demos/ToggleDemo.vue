<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr, templateBooleanAttr } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Switch, Toggle } from '@/index'

const { messages, t } = usePlaygroundLocale()

const labelOptions = ['notifications', 'darkMode', 'autoSave', 'analytics', 'beta'] as const
type ToggleLabelKey = (typeof labelOptions)[number]

const enabled = ref(true)
const disabled = ref(false)
const labelKey = ref<ToggleLabelKey>('notifications')

const toggleLabels = computed(() => messages.value.controlsPlayground.toggles)
const currentLabel = computed(() => toggleLabels.value[labelKey.value])

const code = computed(() => {
  const lines = [
    '<Toggle',
    '  v-model="enabled"',
    `  ${playgroundSnippetAttr('label', currentLabel.value)}`,
  ]

  if (disabled.value) {
    lines.push(`  ${templateBooleanAttr('disabled', true)}`)
  }

  lines.push('/>')
  return lines.join('\n')
})
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
      <div class="pg-playground-preview rounded-xl p-4">
        <Toggle
          :key="`${labelKey}-${disabled}`"
          v-model="enabled"
          :disabled="disabled"
        >
          {{ currentLabel }}
        </Toggle>
      </div>

      <div>
        <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">label</p>
        <button
          v-for="item in labelOptions"
          :key="item"
          type="button"
          class="mb-1 block w-full rounded px-2 py-1 text-left text-xs transition-all"
          :style="playgroundOptionStyle(labelKey === item)"
          @click="labelKey = item"
        >
          {{ toggleLabels[item] }}
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-4">
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch v-model="disabled" size="sm" />
          disabled
        </label>
        <p class="font-mono text-[10px] text-[#4D6A87]">
          state: {{ enabled ? 'on' : 'off' }}
        </p>
      </div>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
