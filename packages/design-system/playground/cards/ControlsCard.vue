<script setup lang="ts">
import { ref } from 'vue'
import { ToggleLeft } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'
import { Checkbox, Toggle } from '@/index'

const tab = ref<'toggle' | 'checkbox'>('toggle')

const toggles = ref({
  notifications: true,
  darkMode: false,
  autoSave: true,
  analytics: false,
})

const checks = ref({
  digest: true,
  cookies: false,
  beta: false,
})
</script>

<template>
  <PlayCard label="Controls" accent-color="#FF8B00" tag="toggle · checkbox">
    <template #icon><ToggleLeft :size="14" /></template>
    <div class="mb-4 flex gap-2">
      <button
        type="button"
        class="rounded-md px-2 py-1 text-[10px] font-medium transition-colors"
        :style="
          tab === 'toggle'
            ? { background: 'rgba(255,139,0,0.15)', color: '#FF8B00' }
            : { color: '#4D6A87' }
        "
        @click="tab = 'toggle'"
      >
        toggle
      </button>
      <button
        type="button"
        class="rounded-md px-2 py-1 text-[10px] font-medium transition-colors"
        :style="
          tab === 'checkbox'
            ? { background: 'rgba(255,139,0,0.15)', color: '#FF8B00' }
            : { color: '#4D6A87' }
        "
        @click="tab = 'checkbox'"
      >
        checkbox
      </button>
    </div>
    <div v-if="tab === 'toggle'" class="space-y-2">
      <Toggle v-model="toggles.notifications">Notifications</Toggle>
      <Toggle v-model="toggles.darkMode">Dark mode</Toggle>
      <Toggle v-model="toggles.autoSave">Auto-save</Toggle>
      <Toggle v-model="toggles.analytics">Analytics</Toggle>
    </div>
    <div v-else class="space-y-2">
      <Checkbox v-model="checks.digest">Send weekly digest</Checkbox>
      <Checkbox v-model="checks.cookies">Accept all cookies</Checkbox>
      <Checkbox v-model="checks.beta">Enable beta features</Checkbox>
    </div>
  </PlayCard>
</template>
