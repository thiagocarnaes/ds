<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { templateBooleanAttr, templateStringAttr } from '../utils/propTemplateName'
import { Radio, RadioGroup, Switch } from '@/index'

const { t } = usePlaygroundLocale()

const plan = ref('pro')
const disabled = ref(false)

const options = [
  { value: 'basic', label: 'Basic' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' },
]

const code = computed(() => {
  const attrs = ['v-model="plan"', templateStringAttr('name', 'plan')]
  if (disabled.value) attrs.push(templateBooleanAttr('disabled', true))

  const lines = [`<RadioGroup ${attrs.join(' ')}>`]

  for (const option of options) {
    lines.push(`  <Radio ${templateStringAttr('value', option.value)}>${option.label}</Radio>`)
  }

  lines.push('</RadioGroup>')
  return lines.join('\n')
})
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
      <RadioGroup
        :key="String(disabled)"
        v-model="plan"
        name="plan-demo"
        :disabled="disabled"
      >
        <Radio v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </Radio>
      </RadioGroup>
      <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
        <Switch v-model="disabled" size="sm" />
        disabled
      </label>
      <p class="font-mono text-[10px] text-[#4D6A87]">
        selected: {{ plan }}
      </p>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
