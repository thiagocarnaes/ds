<script setup lang="ts">
import { computed, ref } from 'vue'
import ColorPalettePicker from '../components/ColorPalettePicker.vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr, templateBooleanAttr } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Spinner, Switch } from '@/index'

const { t } = usePlaygroundLocale()

const sizeOptions = ['xs', 'sm', 'md', 'lg'] as const
type SpinnerSize = (typeof sizeOptions)[number]

const size = ref<SpinnerSize>('md')
const color = ref('#00D4FF')
const glow = ref(true)
const ariaLabel = ref('Loading')

const code = computed(
  () => `<Spinner
  ${playgroundSnippetAttr('size', size.value)}
  ${playgroundSnippetAttr('color', color.value)}${glow.value ? `\n  ${templateBooleanAttr('glow', true)}` : `\n  ${templateBooleanAttr('glow', false)}`}
  ${playgroundSnippetAttr('ariaLabel', ariaLabel.value)}
/>`,
)
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="pg-playground-preview flex items-center justify-center rounded-xl py-10">
        <Spinner
          :key="`${size}-${color}-${glow}-${ariaLabel}`"
          :size="size"
          :color="color"
          :glow="glow"
          :aria-label="ariaLabel"
        />
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

      <label class="flex cursor-pointer items-center gap-2 text-xs text-[#4D6A87]">
        <Switch v-model="glow" size="sm" />
        glow
      </label>

      <div>
        <label class="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">ariaLabel</label>
        <input
          v-model="ariaLabel"
          type="text"
          class="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
        />
      </div>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
