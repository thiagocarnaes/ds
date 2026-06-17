<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Badge } from '@/index'

const { t } = usePlaygroundLocale()

const appearanceOptions = ['default', 'primary', 'important', 'added', 'removed'] as const
type BadgeAppearance = (typeof appearanceOptions)[number]

const count = ref(58)
const appearance = ref<BadgeAppearance>('primary')

const code = computed(
  () => `<Badge
  :value="${count.value}"
  appearance="${appearance.value}"
/>`,
)
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="pg-playground-preview flex items-center justify-center rounded-xl py-8">
        <Badge :key="`${appearance}-${count}`" :value="count" :appearance="appearance" />
      </div>

      <div>
        <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">appearance</p>
        <button
          v-for="item in appearanceOptions"
          :key="item"
          type="button"
          class="mb-1 block w-full rounded px-2 py-1 text-left text-xs transition-all"
          :style="playgroundOptionStyle(appearance === item)"
          @click="appearance = item"
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
