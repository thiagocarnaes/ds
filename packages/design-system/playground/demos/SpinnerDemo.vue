<script setup lang="ts">
import { computed, ref } from 'vue'
import ColorPalettePicker from '../components/ColorPalettePicker.vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Spinner } from '@/index'

const { t } = usePlaygroundLocale()

const sizeOptions = ['xs', 'sm', 'md', 'lg'] as const
type SpinnerSize = (typeof sizeOptions)[number]

const size = ref<SpinnerSize>('md')
const color = ref('#00D4FF')

const code = computed(
  () => `<Spinner
  size="${size.value}"
  color="${color.value}"
/>`,
)
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="pg-playground-preview flex items-center justify-center rounded-xl py-10">
        <Spinner :key="`${size}-${color}`" :size="size" :color="color" />
      </div>

      <div>
        <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
          {{ t('buttonPlayground.sizeLabel').toLowerCase() }}
        </p>
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

      <ColorPalettePicker v-model="color" label="color" />
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
