<script setup lang="ts">
import { ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Input } from '@/index'

const { t } = usePlaygroundLocale()

const value = ref('Ana Martins')
const state = ref<'default' | 'error' | 'success' | 'disabled'>('default')

const code = `<Input
  v-model="name"
  type="text"
  placeholder="Full name"
  :error="hasError"
  :success="isValid"
  :disabled="isDisabled"
/>`
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="pg-playground-preview flex items-center justify-center rounded-xl">
        <Input
          v-model="value"
          type="text"
          :placeholder="t('inputsPlayground.fields.fullName')"
          class="max-w-xs"
          :error="state === 'error'"
          :success="state === 'success'"
          :disabled="state === 'disabled'"
        />
      </div>
      <div>
        <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">state</p>
        <button
          v-for="item in ['default', 'error', 'success', 'disabled']"
          :key="item"
          type="button"
          class="mb-1 block w-full rounded px-2 py-1 text-left text-xs transition-all"
          :style="playgroundOptionStyle(state === item)"
          @click="state = item as typeof state"
        >
          {{ item }}
        </button>
      </div>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
