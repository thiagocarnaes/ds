<script setup lang="ts">
import { ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { Switch } from '@/index'

const { t } = usePlaygroundLocale()

const enabled = ref(true)
const size = ref<'sm' | 'md'>('md')
const disabled = ref(false)

const code = `<Switch v-model="enabled" size="md" :disabled="disabled" />`
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
      <div class="pg-playground-preview flex items-center justify-center gap-3 rounded-xl">
        <Switch v-model="enabled" :size="size" :disabled="disabled" />
        <span class="text-xs text-[#7BA3C8]">{{ enabled ? 'on' : 'off' }}</span>
      </div>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">size</p>
          <button
            v-for="item in ['sm', 'md']"
            :key="item"
            type="button"
            class="mb-1 mr-2 rounded px-2 py-0.5 text-xs"
            :style="size === item ? { background: 'rgba(0,212,255,0.15)', color: '#00D4FF' } : { color: '#4D6A87' }"
            @click="size = item as typeof size"
          >
            {{ item }}
          </button>
        </div>
        <label class="flex cursor-pointer items-center gap-2 text-xs text-[#4D6A87]">
          <Switch v-model="disabled" size="sm" />
          disabled
        </label>
      </div>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
