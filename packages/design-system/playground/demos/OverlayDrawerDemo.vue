<script setup lang="ts">
import { ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Button, Drawer } from '@/index'

const { t, messages } = usePlaygroundLocale()

const open = ref(false)
const placement = ref<'left' | 'right' | 'top' | 'bottom'>('right')
const copy = messages.value.overlayDrawerPlayground

const code = `<Drawer v-model:open="open" placement="right" title="Details">
  <p>Drawer content</p>
</Drawer>`
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in ['left', 'right', 'top', 'bottom']"
          :key="item"
          type="button"
          class="rounded-md px-3 py-1.5 font-mono text-[10px] uppercase"
          :style="playgroundOptionStyle(placement === item)"
          @click="placement = item as typeof placement"
        >
          {{ item }}
        </button>
      </div>
      <Button appearance="primary" @click="open = true">{{ copy.open }}</Button>
      <Drawer v-model:open="open" :placement="placement">
        <div class="p-6">
          <h3 class="mb-2 text-lg font-semibold">{{ copy.title }}</h3>
          <p class="text-sm text-muted-foreground">{{ copy.body }}</p>
        </div>
      </Drawer>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
