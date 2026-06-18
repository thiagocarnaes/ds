<script setup lang="ts">
import { computed, ref } from 'vue'
import { Settings } from 'lucide-vue-next'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr, templateBooleanAttr } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { IconButton, Switch } from '@/index'

const { t } = usePlaygroundLocale()

const variantOptions = ['default', 'primary', 'secondary', 'outline', 'ghost', 'destructive'] as const
const sizeOptions = ['sm', 'md', 'lg', 'icon'] as const

type IconButtonVariant = (typeof variantOptions)[number]
type IconButtonSize = (typeof sizeOptions)[number]

const variant = ref<IconButtonVariant>('outline')
const size = ref<IconButtonSize>('icon')
const ariaLabel = ref('Settings')
const disabled = ref(false)
const loading = ref(false)

const code = computed(() => {
  const lines = [
    `<IconButton`,
    `  ${playgroundSnippetAttr('aria-label', ariaLabel.value)}`,
    `  ${playgroundSnippetAttr('variant', variant.value)}`,
    `  ${playgroundSnippetAttr('size', size.value)}`,
  ]

  if (disabled.value) lines.push(`  ${templateBooleanAttr('disabled', true)}`)
  if (loading.value) lines.push(`  ${templateBooleanAttr('loading', true)}`)

  lines.push('>', '  <Settings :size="16" />', '</IconButton>')
  return lines.join('\n')
})
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="pg-playground-preview flex items-center justify-center rounded-xl py-8">
        <IconButton
          :key="`${variant}-${size}-${disabled}-${loading}`"
          :aria-label="ariaLabel"
          :variant="variant"
          :size="size"
          :disabled="disabled"
          :loading="loading"
        >
          <Settings :size="16" />
        </IconButton>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">variant</p>
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
      </div>

      <div class="space-y-2">
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch v-model="disabled" size="sm" />
          disabled
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch v-model="loading" size="sm" />
          loading
        </label>
      </div>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
