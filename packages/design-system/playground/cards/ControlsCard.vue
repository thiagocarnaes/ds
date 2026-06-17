<script setup lang="ts">
import { computed, ref } from 'vue'
import { ToggleLeft } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { Checkbox, Toggle } from '@/index'

const { t, messages } = usePlaygroundLocale()

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

const toggleLabels = computed(() => messages.value.controlsPlayground.toggles)
const checkboxLabels = computed(() => messages.value.controlsPlayground.checkboxes)
</script>

<template>
  <PlayCard :label="t('cards.controls.label')" accent-color="#FF8B00" :tag="t('cards.controls.tag')">
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
        {{ t('controlsPlayground.tabToggle') }}
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
        {{ t('controlsPlayground.tabCheckbox') }}
      </button>
    </div>
    <div v-if="tab === 'toggle'" class="space-y-2">
      <Toggle v-model="toggles.notifications">{{ toggleLabels.notifications }}</Toggle>
      <Toggle v-model="toggles.darkMode">{{ toggleLabels.darkMode }}</Toggle>
      <Toggle v-model="toggles.autoSave">{{ toggleLabels.autoSave }}</Toggle>
      <Toggle v-model="toggles.analytics">{{ toggleLabels.analytics }}</Toggle>
    </div>
    <div v-else class="space-y-2">
      <Checkbox v-model="checks.digest">{{ checkboxLabels.digest }}</Checkbox>
      <Checkbox v-model="checks.cookies">{{ checkboxLabels.cookies }}</Checkbox>
      <Checkbox v-model="checks.beta">{{ checkboxLabels.beta }}</Checkbox>
    </div>
  </PlayCard>
</template>
