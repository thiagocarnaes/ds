<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr, propTemplateBinding, templateBooleanAttr } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Flag, Switch } from '@/index'
import type { FlagVariant } from '@/components/feedback/Flag.vue'

const { t } = usePlaygroundLocale()

const variantOptions: FlagVariant[] = ['normal', 'warning', 'error', 'success', 'discovery']

const variant = ref<FlagVariant>('normal')
const isDismissible = ref(false)
const flagKey = ref(0)

function onDismiss(): void {
  // increment key to re-mount Flag after dismiss (restore behavior)
  flagKey.value += 1
}

const code = computed(() => {
  const lines = [
    `<Flag`,
    `  ${playgroundSnippetAttr('variant', variant.value)}`,
    `  :title="'Deployment alert'"`,
    `  :description="'Something needs your attention.'"`,
  ]
  if (isDismissible.value) lines.push(`  ${templateBooleanAttr('is-dismissible', true)}`)
  lines.push('/>')
  return lines.join('\n')
})
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="pg-playground-preview flex items-center justify-center rounded-xl py-8">
        <Flag
          :key="flagKey"
          :variant="variant"
          :title="'Deployment alert'"
          :description="'Something needs your attention.'"
          :is-dismissible="isDismissible"
          @dismiss="onDismiss"
        />
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

      <label class="flex cursor-pointer items-center gap-3 rounded px-2 py-1 text-xs text-[#7BA3C8]">
        <Switch v-model="isDismissible" size="sm" />
        is-dismissible
      </label>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
