<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr, propTemplateBinding } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { SectionMessage } from '@/index'
import type { SectionMessageVariant } from '@/components/feedback/SectionMessage.vue'

const { t } = usePlaygroundLocale()

const variantOptions: SectionMessageVariant[] = [
  'information', 'warning', 'error', 'success', 'discovery', 'change',
]

const variant = ref<SectionMessageVariant>('information')

const code = computed(
  () => `<SectionMessage
  ${playgroundSnippetAttr('variant', variant.value)}
  :title="'Important notice'"
>
  This is a contextual message to inform the user.
</SectionMessage>`,
)
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="pg-playground-preview flex items-center justify-center rounded-xl py-8">
        <SectionMessage
          :variant="variant"
          title="Important notice"
        >
          This is a contextual message to inform the user.
        </SectionMessage>
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
    <UsageBlock :code="code" />
  </div>
</template>
