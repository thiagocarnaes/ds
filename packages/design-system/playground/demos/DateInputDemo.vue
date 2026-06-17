<script setup lang="ts">
import { ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { DateInput } from '@/index'

const { locale, t } = usePlaygroundLocale()

const value = ref('2026-06-16')
const disabled = ref(false)

const code = `<DateInput
  v-model="date"
  locale="${locale.value}"
  :disabled="disabled"
/>`
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="pg-playground-preview flex items-center justify-center rounded-xl">
        <DateInput v-model="value" :locale="locale" :disabled="disabled" class="max-w-xs" />
      </div>
      <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
        <input v-model="disabled" type="checkbox" class="accent-[#00D4FF]" />
        disabled
      </label>
      <p class="font-mono text-[10px] text-[#4D6A87]">locale: {{ locale }}</p>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
