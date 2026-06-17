<script setup lang="ts">
import { computed } from 'vue'
import { Languages } from 'lucide-vue-next'
import { Select } from '@/index'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import type { PlaygroundLocale } from '../i18n/types'

const LOCALE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'pt-BR', label: 'Português (Brasil)' },
] as const

const { locale, setLocale, t } = usePlaygroundLocale()

const localeValue = computed({
  get: () => locale.value,
  set: (value: string) => setLocale(value as PlaygroundLocale),
})
</script>

<template>
  <div class="pg-locale-select">
    <Languages :size="14" class="pg-locale-select__icon hidden shrink-0 sm:block" aria-hidden="true" />
    <Select
      v-model="localeValue"
      :options="[...LOCALE_OPTIONS]"
      :searchable="false"
      class="w-[7.5rem] shrink-0 sm:w-[10.5rem]"
      :aria-label="t('locale.selectLabel')"
    />
  </div>
</template>
