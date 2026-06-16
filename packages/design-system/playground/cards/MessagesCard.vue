<script setup lang="ts">
import { Bell } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'
import { Alert } from '@/index'

const msgs = [
  { variant: 'info' as const, text: 'Deploy queued for production environment.' },
  { variant: 'success' as const, text: 'All 42 tests passed in 3.2s.' },
  { variant: 'warning' as const, text: 'Rate limit at 85% — throttling may occur.' },
  { variant: 'error' as const, text: 'Build failed: missing env variable API_KEY.' },
]
</script>

<template>
  <PlayCard label="Messages" accent-color="#FF8B00" tag="4 variants">
    <template #icon><Bell :size="14" /></template>
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Alert v-for="msg in msgs" :key="msg.text" :variant="msg.variant">
        {{ msg.text }}
      </Alert>
    </div>
  </PlayCard>
</template>
