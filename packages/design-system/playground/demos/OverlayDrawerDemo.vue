<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Button, Drawer } from '@/index'

const { t, messages } = usePlaygroundLocale()

const open = ref(false)
const placement = ref<'left' | 'right' | 'top' | 'bottom'>('right')

const placementOptions = ['left', 'right', 'top', 'bottom'] as const

const copy = computed(() => messages.value.overlayDrawerPlayground)

watch(placement, () => {
  open.value = false
})

const code = computed(
  () => `<Drawer v-model:open="open" placement="${placement.value}">
  <div class="p-6">
    <h3 class="mb-2 text-lg font-semibold">${copy.value.title}</h3>
    <p class="text-sm text-muted-foreground">${copy.value.body}</p>
  </div>
</Drawer>`,
)
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in placementOptions"
          :key="item"
          type="button"
          class="rounded-md px-3 py-1.5 font-mono text-[10px] uppercase"
          :style="playgroundOptionStyle(placement === item)"
          @click="placement = item"
        >
          {{ item }}
        </button>
      </div>
      <Button appearance="primary" @click="open = true">{{ copy.open }}</Button>
      <Drawer :key="placement" v-model:open="open" :placement="placement">
        <div class="p-6">
          <h3 class="mb-2 text-lg font-semibold">{{ copy.title }}</h3>
          <p class="text-sm text-muted-foreground">{{ copy.body }}</p>
        </div>
      </Drawer>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
