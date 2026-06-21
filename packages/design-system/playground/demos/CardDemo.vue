<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr, propTemplateBinding } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Card, Switch } from '@/index'
import type { CardVariant } from '@/components/data-display/Card.vue'

const { t } = usePlaygroundLocale()

const variant = ref<CardVariant>('outlined')
const showHeader = ref(true)
const showFooter = ref(true)

const variantOptions: CardVariant[] = ['elevated', 'outlined', 'flat', 'ghost']

const code = computed(() => {
  const lines = [`<Card ${playgroundSnippetAttr('variant', variant.value)}>`]

  if (showHeader.value) {
    lines.push('  <template #header>')
    lines.push('    <h3 class="font-semibold">Card Title</h3>')
    lines.push('  </template>')
  }

  lines.push('  <p>Card body content goes here</p>')

  if (showFooter.value) {
    lines.push('  <template #footer>')
    lines.push('    <button type="button" class="text-xs text-primary">Action</button>')
    lines.push('  </template>')
  }

  lines.push('</Card>')
  return lines.join('\n')
})
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>

    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="pg-playground-preview flex items-center justify-center rounded-xl py-8">
        <Card :variant="variant" class="w-full max-w-sm">
          <template v-if="showHeader" #header>
            <h3 class="font-semibold">{{ variant === 'ghost' ? 'Ghost Card' : 'Card Title' }}</h3>
          </template>
          <div class="space-y-2">
            <p class="text-sm">Card body content goes here</p>
            <p class="text-xs text-muted-foreground">This is a demonstration of the Card component</p>
          </div>
          <template v-if="showFooter" #footer>
            <div class="flex gap-2">
              <button type="button" class="text-xs text-primary hover:underline">Action</button>
              <button type="button" class="text-xs text-muted-foreground hover:underline">Cancel</button>
            </div>
          </template>
        </Card>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

        <div class="space-y-2">
          <p class="font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('buttonPlayground.stateLabel') }}</p>
          <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
            <Switch v-model="showHeader" size="sm" />
            {{ propTemplateBinding('header') }} slot
          </label>
          <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
            <Switch v-model="showFooter" size="sm" />
            {{ propTemplateBinding('footer') }} slot
          </label>
        </div>
      </div>
    </div>

    <UsageBlock :code="code" />
  </div>
</template>
