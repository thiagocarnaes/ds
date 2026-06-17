<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Switch } from '@/index'

const { t } = usePlaygroundLocale()

const sizeOptions = ['sm', 'md'] as const
type SwitchSize = (typeof sizeOptions)[number]

const enabled = ref(true)
const size = ref<SwitchSize>('md')
const disabled = ref(false)

const code = computed(() => {
  const lines = ['<Switch', '  v-model="enabled"', `  size="${size.value}"`]

  if (disabled.value) {
    lines.push('  disabled')
  }

  lines.push('/>')
  return lines.join('\n')
})
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
      <div class="pg-playground-preview flex items-center justify-center gap-3 rounded-xl">
        <Switch
          :key="`${size}-${disabled}`"
          v-model="enabled"
          :size="size"
          :disabled="disabled"
        />
        <span class="text-xs text-[#7BA3C8]">{{ enabled ? 'on' : 'off' }}</span>
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
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch v-model="disabled" size="sm" />
          disabled
        </label>
      </div>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
