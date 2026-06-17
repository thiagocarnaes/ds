<script setup lang="ts">
import { computed } from 'vue'
import { Bell } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { Alert } from '@/index'

const { t, messages } = usePlaygroundLocale()

const msgs = computed(() => {
  const copy = messages.value.messagesPlayground
  return [
    { variant: 'info' as const, text: copy.deployQueued },
    { variant: 'success' as const, text: copy.testsPassed },
    { variant: 'warning' as const, text: copy.rateLimit },
    { variant: 'error' as const, text: copy.buildFailed },
  ]
})
</script>

<template>
  <PlayCard :label="t('cards.messages.label')" accent-color="#FF8B00" :tag="t('cards.messages.tag')">
    <template #icon><Bell :size="14" /></template>
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Alert v-for="msg in msgs" :key="msg.text" :variant="msg.variant">
        {{ msg.text }}
      </Alert>
    </div>
  </PlayCard>
</template>
