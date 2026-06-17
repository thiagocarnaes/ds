<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Button, Tooltip } from '@/index'

const { t, messages } = usePlaygroundLocale()

const placement = ref<'top' | 'bottom' | 'left' | 'right'>('top')
const appearance = ref<'primary' | 'ghost' | 'outline' | 'danger'>('outline')

const placementOptions = ['top', 'bottom', 'left', 'right'] as const
const appearanceOptions = ['primary', 'ghost', 'outline', 'danger'] as const

const copy = computed(() => messages.value.tooltipPlayground)

const previewKey = computed(() => `${placement.value}-${appearance.value}`)

const code = computed(
  () => `<Tooltip content="${copy.value.hint}" placement="${placement.value}">
  <Button appearance="${appearance.value}">${copy.value.trigger}</Button>
</Tooltip>`,
)
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="pg-playground-preview flex items-center justify-center rounded-xl py-8">
        <Tooltip :key="previewKey" :content="copy.hint" :placement="placement">
          <Button :appearance="appearance">{{ copy.trigger }}</Button>
        </Tooltip>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">placement</p>
          <button
            v-for="item in placementOptions"
            :key="item"
            type="button"
            class="mb-1 block w-full rounded px-2 py-1 text-left text-xs transition-all"
            :style="playgroundOptionStyle(placement === item)"
            @click="placement = item"
          >
            {{ item }}
          </button>
        </div>
        <div>
          <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
            {{ t('buttonPlayground.appearanceLabel').toLowerCase() }}
          </p>
          <button
            v-for="item in appearanceOptions"
            :key="item"
            type="button"
            class="mb-1 block w-full rounded px-2 py-1 text-left text-xs transition-all"
            :style="playgroundOptionStyle(appearance === item)"
            @click="appearance = item"
          >
            {{ item }}
          </button>
        </div>
      </div>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
