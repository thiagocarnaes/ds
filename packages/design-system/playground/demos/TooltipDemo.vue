<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr, propTemplateBinding } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Button, Tooltip, type TooltipAppearance } from '@/index'

const { t, messages } = usePlaygroundLocale()

const placement = ref<'top' | 'bottom' | 'left' | 'right'>('top')
const variant = ref<TooltipAppearance>('outline')

const placementOptions = ['top', 'bottom', 'left', 'right'] as const
const variantOptions: TooltipAppearance[] = ['primary', 'ghost', 'outline', 'danger']

const copy = computed(() => messages.value.tooltipPlayground)

const code = computed(
  () => `<Tooltip ${playgroundSnippetAttr('content', copy.value.hint)} ${playgroundSnippetAttr('placement', placement.value)} ${playgroundSnippetAttr('variant', variant.value)}>
  <Button ${playgroundSnippetAttr('variant', 'outline')}>${copy.value.trigger}</Button>
</Tooltip>`,
)
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="pg-playground-preview flex items-center justify-center rounded-xl py-8">
        <Tooltip :content="copy.hint" :placement="placement" :variant="variant">
          <Button variant="outline">{{ copy.trigger }}</Button>
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
          <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ propTemplateBinding('variant') }}</p>
          <button
            v-for="item in variantOptions"
            :key="item"
            type="button"
            class="mb-1 block w-full rounded px-2 py-1 text-left text-xs transition-all"
            :style="playgroundOptionStyle(variant === item)"
            @click="variant = item"
          >
            {{ item }}
          </button>
        </div>
      </div>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
