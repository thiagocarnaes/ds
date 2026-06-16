<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { BarChart2, Loader2 } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'

const vals = ref([72, 45, 88, 23])
const labels = ['Storage', 'CPU', 'Memory', 'Network']
const colors = ['#00D4FF', '#00E5B0', '#2979FF', '#A78BFA']

let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  timer = setInterval(() => {
    vals.value = vals.value.map((v) => Math.max(5, Math.min(95, v + (Math.random() - 0.5) * 12)))
  }, 1800)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <PlayCard label="Progress" accent-color="#00E5B0" tag="live">
    <template #icon><BarChart2 :size="14" /></template>
    <div class="space-y-4">
      <div v-for="(label, i) in labels" :key="label">
        <div class="mb-1.5 flex justify-between">
          <span class="text-xs text-[#7BA3C8]">{{ label }}</span>
          <span class="font-mono text-xs" :style="{ color: colors[i] }">{{ Math.round(vals[i]!) }}%</span>
        </div>
        <div class="h-1.5 overflow-hidden rounded-full" style="background: rgba(255,255,255,0.05)">
          <div
            class="h-full rounded-full transition-all duration-1000 ease-out"
            :style="{
              width: `${vals[i]}%`,
              background: colors[i],
              boxShadow: `0 0 8px ${colors[i]}60`,
            }"
          />
        </div>
      </div>
      <div class="flex items-center gap-4 pt-2">
        <Loader2 :size="14" class="animate-spin text-primary" />
        <span class="text-xs text-[#4D6A87]">Syncing...</span>
      </div>
    </div>
  </PlayCard>
</template>
