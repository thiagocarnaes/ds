<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr, templateBooleanAttr } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { DateInput, Switch } from '@/index'

const { locale: appLocale, t } = usePlaygroundLocale()

const localeOptions = ['en', 'pt-BR'] as const
type DateLocale = (typeof localeOptions)[number]

const value = ref('2026-06-16')
const disabled = ref(false)
const dateLocale = ref<DateLocale>(appLocale.value === 'pt-BR' ? 'pt-BR' : 'en')

const code = computed(() => {
  const lines = [
    '<DateInput',
    '  v-model="date"',
    `  ${playgroundSnippetAttr('locale', dateLocale.value)}`,
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
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="pg-playground-preview rounded-xl p-4">
        <DateInput
          :key="`${dateLocale}-${disabled}`"
          v-model="value"
          :locale="dateLocale"
          :disabled="disabled"
          class="max-w-xs"
        />
      </div>
      <div>
        <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">locale</p>
        <button
          v-for="item in localeOptions"
          :key="item"
          type="button"
          class="mb-1 block w-full rounded px-2 py-1 text-left text-xs transition-all"
          :style="playgroundOptionStyle(dateLocale === item)"
          @click="dateLocale = item"
        >
          {{ item }}
        </button>
      </div>
      <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
        <Switch v-model="disabled" size="sm" />
        disabled
      </label>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
