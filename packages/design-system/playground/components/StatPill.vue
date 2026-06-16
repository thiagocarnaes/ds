<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{ label: string; target: number; suffix?: string; color: string }>()

const value = ref(0)

onMounted(() => {
  const steps = 40
  const step = props.target / steps
  let current = 0
  const timer = setInterval(() => {
    current += step
    if (current >= props.target) {
      value.value = props.target
      clearInterval(timer)
    } else {
      value.value = Math.floor(current)
    }
  }, 30)
})
</script>

<template>
  <div
    class="flex min-w-[120px] flex-col gap-1 rounded-xl px-4 py-3"
    :style="{ background: color + '10', border: `1px solid ${color}20` }"
  >
    <span class="font-mono text-2xl font-bold" :style="{ color }">
      {{ value }}{{ suffix }}
    </span>
    <span class="text-[10px] uppercase tracking-wider text-[#4D6A87]">{{ label }}</span>
  </div>
</template>
