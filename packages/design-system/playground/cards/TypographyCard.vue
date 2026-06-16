<script setup lang="ts">
import { ref } from 'vue'
import { Type } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'
import { useCopy } from '../composables/useCopy'

const preview = ref('Build anything.')

const scale = [
  { label: 'Display', size: '2rem', weight: 700 },
  { label: 'H1', size: '1.5rem', weight: 600 },
  { label: 'H2', size: '1.125rem', weight: 600 },
  { label: 'Body', size: '0.875rem', weight: 400 },
  { label: 'Caption', size: '0.75rem', weight: 400 },
  { label: 'Mono', size: '0.75rem', weight: 400, mono: true },
]

const sansCopy = useCopy('DM Sans')
const monoCopy = useCopy('DM Mono')
</script>

<template>
  <PlayCard label="Typography" accent-color="#00E5B0">
    <template #icon><Type :size="14" /></template>
    <div class="flex h-full flex-col gap-5">
      <input
        v-model="preview"
        class="w-full border-b bg-transparent pb-1 text-sm text-[#E8EDF5] outline-none"
        style="border-color: rgba(0, 229, 176, 0.2); font-family: 'DM Sans', sans-serif"
        placeholder="Type your preview text..."
      />
      <div class="flex-1 space-y-4 overflow-y-auto">
        <div v-for="row in scale" :key="row.label" class="flex items-baseline gap-4">
          <span class="w-14 shrink-0 font-mono text-[9px] uppercase text-[#4D6A87]">{{ row.label }}</span>
          <span
            class="truncate text-[#E8EDF5]"
            :style="{
              fontSize: row.size,
              fontWeight: row.weight,
              fontFamily: row.mono ? `'DM Mono', monospace` : `'DM Sans', sans-serif`,
            }"
          >
            {{ preview || '–' }}
          </span>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2 pt-3" style="border-top: 1px solid rgba(0, 229, 176, 0.08)">
        <button type="button" class="font-mono text-[10px] text-[#4D6A87]" @click="sansCopy.copy()">
          {{ sansCopy.copied.value ? 'Copied!' : 'DM Sans' }}
        </button>
        <button type="button" class="font-mono text-[10px] text-[#4D6A87]" @click="monoCopy.copy()">
          {{ monoCopy.copied.value ? 'Copied!' : 'DM Mono' }}
        </button>
      </div>
    </div>
  </PlayCard>
</template>
