<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr, propTemplateBinding, templateBooleanAttr } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Lozenge, Switch } from '@/index'
import type { LozengeAppearance } from '@/components/data-display/Lozenge.vue'

const { messages, t } = usePlaygroundLocale()

const variantOptions: LozengeAppearance[] = [
  'default',
  'success',
  'danger',
  'progress',
  'warning',
  'new',
]

const variantStatusKey: Record<LozengeAppearance, keyof typeof messages.value.labelsPlayground.statuses> = {
  default: 'backlog',
  success: 'done',
  danger: 'blocked',
  progress: 'inProgress',
  warning: 'review',
  new: 'new',
  inprogress: 'inProgress',
  moved: 'review',
  removed: 'blocked',
}

const variant = ref<LozengeAppearance>('success')
const bold = ref(false)

const statuses = computed(() => messages.value.labelsPlayground.statuses)
const label = computed(() => statuses.value[variantStatusKey[variant.value]])

const code = computed(() => {
  const lines = [`<Lozenge ${playgroundSnippetAttr('variant', variant.value)}`]
  if (bold.value) lines[0] += ` ${templateBooleanAttr('bold', true)}`
  lines.push('>', `  ${label.value}`, '</Lozenge>')
  return lines.join('\n')
})
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="pg-playground-preview flex items-center justify-center rounded-xl py-8">
        <Lozenge :key="`${variant}-${bold}`" :variant="variant" :bold="bold">
          {{ label }}
        </Lozenge>
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
        <Switch v-model="bold" size="sm" />
        {{ t('labelsPlayground.boldAppearance') }}
      </label>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
