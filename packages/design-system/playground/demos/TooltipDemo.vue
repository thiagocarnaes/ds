<script setup lang="ts">
import { ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Button, Tooltip } from '@/index'

const { t, messages } = usePlaygroundLocale()

const placement = ref<'top' | 'bottom' | 'left' | 'right'>('top')
const copy = messages.value.tooltipPlayground

const code = `<Tooltip content="Helpful hint" placement="top">
  <Button appearance="outline">Hover me</Button>
</Tooltip>`
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="pg-playground-preview flex items-center justify-center rounded-xl py-8">
        <Tooltip :content="copy.hint" :placement="placement">
          <Button appearance="outline">{{ copy.trigger }}</Button>
        </Tooltip>
      </div>
      <div>
        <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">placement</p>
        <button
          v-for="item in ['top', 'bottom', 'left', 'right']"
          :key="item"
          type="button"
          class="mb-1 block w-full rounded px-2 py-1 text-left text-xs"
          :style="playgroundOptionStyle(placement === item)"
          @click="placement = item as typeof placement"
        >
          {{ item }}
        </button>
      </div>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
