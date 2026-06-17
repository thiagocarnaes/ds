<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { BarChart2, Loader2 } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'

const { t, messages } = usePlaygroundLocale()

const vals = ref([72, 45, 88, 23])
const colors = ['#00D4FF', '#00E5B0', '#2979FF', '#A78BFA']

const labels = computed(() => {
  const metrics = messages.value.loadingPlayground.metrics
  return [metrics.storage, metrics.cpu, metrics.memory, metrics.network]
})

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
  <PlayCard :label="t('cards.loading.label')" accent-color="#00E5B0" :tag="t('cards.loading.tag')">
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
        <span class="text-xs text-[#4D6A87]">{{ t('loadingPlayground.syncing') }}</span>
      </div>
    </div>
  </PlayCard>
</template>
