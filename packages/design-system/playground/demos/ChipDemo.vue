<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr, templateBooleanAttr, templateStringAttr } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Chip } from '@/index'

const { t } = usePlaygroundLocale()

const sizeOptions = ['sm', 'md', 'lg'] as const
const stateOptions = ['default', 'error', 'disabled'] as const
const variantOptions = ['default', 'success', 'danger', 'progress', 'warning', 'new'] as const

type ChipsInputSize = (typeof sizeOptions)[number]
type ChipsInputState = (typeof stateOptions)[number]
type ChipsInputVariant = (typeof variantOptions)[number]

const chips = ref(['Vue', 'TypeScript'])
const size = ref<ChipsInputSize>('md')
const placeholder = ref('Digite e pressione Enter...')
const state = ref<ChipsInputState>('default')
const chipVariant = ref<ChipsInputVariant>('progress')

const errorMessage = 'Invalid value'

const code = computed(() => {
  const lines = [
    '<Chip',
    '  v-model="tags"',
    `  ${playgroundSnippetAttr('size', size.value)}`,
    `  ${playgroundSnippetAttr('placeholder', placeholder.value)}`,
    `  ${playgroundSnippetAttr('variant', chipVariant.value)}`,
  ]

  if (state.value === 'error') {
    lines.push(`  ${templateBooleanAttr('error', true)}`)
    lines.push(`  ${templateStringAttr('message', errorMessage)}`)
  } else if (state.value === 'disabled') {
    lines.push(`  ${templateBooleanAttr('disabled', true)}`)
  }

  lines.push('/>')
  return lines.join('\n')
})
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="pg-playground-preview flex items-center justify-center rounded-xl">
        <Chip
          :key="`${size}-${state}-${chipVariant}`"
          v-model="chips"
          :size="size"
          :placeholder="placeholder"
          :variant="chipVariant"
          class="max-w-sm"
          :error="state === 'error'"
          :disabled="state === 'disabled'"
          :message="state === 'error' ? errorMessage : undefined"
        />
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

        <div>
          <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">state</p>
          <button
            v-for="item in stateOptions"
            :key="item"
            type="button"
            class="mb-1 block w-full rounded px-2 py-1 text-left text-xs transition-all"
            :style="playgroundOptionStyle(state === item)"
            @click="state = item"
          >
            {{ item }}
          </button>
        </div>

        <div>
          <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">variant</p>
          <button
            v-for="item in variantOptions"
            :key="item"
            type="button"
            class="mb-1 block w-full rounded px-2 py-1 text-left text-xs transition-all"
            :style="playgroundOptionStyle(chipVariant === item)"
            @click="chipVariant = item"
          >
            {{ item }}
          </button>
        </div>
      </div>
    </div>

    <UsageBlock :code="code" />
  </div>
</template>
