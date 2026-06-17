<script setup lang="ts">
import { Layers } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'

const { t } = usePlaygroundLocale()

const spacing = [
  { px: 2, token: 'space-0.5' },
  { px: 8, token: 'space-2' },
  { px: 12, token: 'space-3' },
  { px: 16, token: 'space-4' },
  { px: 24, token: 'space-6' },
  { px: 32, token: 'space-8' },
  { px: 48, token: 'space-12' },
]
</script>

<template>
  <PlayCard :label="t('cards.spacing.label')" accent-color="#2979FF" :tag="t('cards.spacing.tag')">
    <template #icon><Layers :size="14" /></template>
    <div class="space-y-3">
      <div v-for="item in spacing" :key="item.token" class="flex items-center gap-3">
        <span class="w-16 font-mono text-[10px] text-[#4D6A87]">{{ item.px }}px</span>
        <div class="h-2 rounded-full bg-primary/80" :style="{ width: `${item.px * 2}px` }" />
        <span class="font-mono text-[10px] text-[#4D6A87]">({{ item.token }})</span>
      </div>
    </div>
  </PlayCard>
</template>
