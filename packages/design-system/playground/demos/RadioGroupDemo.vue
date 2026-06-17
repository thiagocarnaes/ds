<script setup lang="ts">
import { ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { Radio, RadioGroup } from '@/index'

const { t } = usePlaygroundLocale()

const plan = ref('pro')
const disabled = ref(false)

const options = [
  { value: 'basic', label: 'Basic' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' },
]

const code = `<RadioGroup v-model="plan" name="plan" :disabled="disabled">
  <Radio value="basic">Basic</Radio>
  <Radio value="pro">Pro</Radio>
  <Radio value="enterprise">Enterprise</Radio>
</RadioGroup>`
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
      <RadioGroup v-model="plan" name="plan-demo" :disabled="disabled">
        <Radio v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </Radio>
      </RadioGroup>
      <label class="flex cursor-pointer items-center gap-2 text-xs text-[#4D6A87]">
        <input v-model="disabled" type="checkbox" class="accent-[#00D4FF]" />
        disabled
      </label>
      <p class="font-mono text-[10px] text-[#4D6A87]">
        selected: {{ plan }}
      </p>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
