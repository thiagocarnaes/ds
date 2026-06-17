<script setup lang="ts">
import { Palette } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'

const { t } = usePlaygroundLocale()

const palette = [
  { hex: '#00D4FF', name: 'Cyan 500', token: '--primary' },
  { hex: '#2979FF', name: 'Blue 600', token: '--accent' },
  { hex: '#00E5B0', name: 'Teal 400', token: '--success' },
  { hex: '#FF3D57', name: 'Red 500', token: '--destructive' },
  { hex: '#FF8B00', name: 'Amber 500', token: '--warning' },
  { hex: '#0D1B2E', name: 'Navy 800', token: '--card' },
  { hex: '#122236', name: 'Navy 700', token: '--secondary' },
  { hex: '#4D6A87', name: 'Slate 500', token: '--muted-foreground' },
]
async function copyHex(hex: string): Promise<void> {
  await navigator.clipboard.writeText(hex)
}
</script>

<template>
  <PlayCard :label="t('cards.color.label')" accent-color="#2979FF" :tag="t('cards.color.tag')">
    <template #icon><Palette :size="14" /></template>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <button
        v-for="color in palette"
        :key="color.token"
        type="button"
        class="group flex flex-col gap-1.5 text-left"
        @click="copyHex(color.hex)"
      >
        <div
          class="h-10 w-full rounded-lg transition-transform group-hover:scale-105"
          :style="{
            backgroundColor: color.hex,
            boxShadow: `0 0 12px ${color.hex}40`,
          }"
        />
        <p class="text-[11px] font-medium text-[#E8EDF5]">{{ color.name }}</p>
        <p class="font-mono text-[10px] text-[#4D6A87]">{{ color.hex }}</p>
      </button>
    </div>
    <p class="mt-4 text-[10px] text-[#4D6A87]">{{ t('colorPlayground.footerHint') }}</p>
  </PlayCard>
</template>
