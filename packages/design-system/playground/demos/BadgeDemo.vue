<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { propTemplateBinding, playgroundSnippetAttr } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Badge } from '@/index'

const { t } = usePlaygroundLocale()

const variantOptions = ['default', 'primary', 'important', 'added', 'removed'] as const
const sizeOptions = ['sm', 'md'] as const
type BadgeVariant = (typeof variantOptions)[number]
type BadgeSize = (typeof sizeOptions)[number]

const count = ref(58)
const variant = ref<BadgeVariant>('primary')
const size = ref<BadgeSize>('md')

const code = computed(
  () => `<Badge
  ${playgroundSnippetAttr('value', count.value)}
  ${playgroundSnippetAttr('variant', variant.value)}
  ${playgroundSnippetAttr('size', size.value)}
/>`,
)
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="pg-playground-preview flex items-center justify-center rounded-xl py-8">
        <Badge :key="`${variant}-${size}-${count}`" :value="count" :variant="variant" :size="size" />
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

      <div>
        <label class="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
          {{ t('badgePlayground.countLabel', { count }) }}
        </label>
        <input v-model.number="count" type="range" min="1" max="99" class="w-full accent-[#00D4FF]" />
      </div>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
