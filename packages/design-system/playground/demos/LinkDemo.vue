<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr, templateBooleanAttr } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Link } from '@/index'

const { t } = usePlaygroundLocale()

const modeOptions = ['internal', 'external', 'router'] as const
type LinkMode = (typeof modeOptions)[number]

const mode = ref<LinkMode>('internal')
const label = ref('Documentation')

const code = computed(() => {
  const attrs: string[] = []

  if (mode.value === 'router') {
    attrs.push(playgroundSnippetAttr('to', '/docs'))
  } else {
    attrs.push(playgroundSnippetAttr('href', 'https://example.com/docs'))
  }

  if (mode.value === 'external') {
    attrs.push(templateBooleanAttr('external', true))
  }

  return `<Link ${attrs.join(' ')}>
  ${label.value}
</Link>`
})
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="pg-playground-preview flex items-center justify-center rounded-xl py-8">
        <Link
          v-if="mode === 'router'"
          to="/docs"
        >
          {{ label }}
        </Link>
        <Link
          v-else
          href="https://example.com/docs"
          :external="mode === 'external'"
        >
          {{ label }}
        </Link>
      </div>

      <div>
        <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">mode</p>
        <button
          v-for="item in modeOptions"
          :key="item"
          type="button"
          class="mb-1 block w-full rounded px-2 py-1 text-left text-xs transition-all"
          :style="playgroundOptionStyle(mode === item)"
          @click="mode = item"
        >
          {{ item }}
        </button>
      </div>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
