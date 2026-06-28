<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { Flag, FlagGroup, Switch } from '@/index'

const { t } = usePlaygroundLocale()

const isDismissible = ref(false)

const code = computed((): string => {
  const dismissAttr = isDismissible.value ? '\n    :is-dismissible="true"' : ''
  return `<FlagGroup>
  <Flag
    :variant="'success'"${dismissAttr}
    :title="'Changes saved'"
    :description="'Your changes were saved successfully.'"
  />
  <Flag
    :variant="'warning'"${dismissAttr}
    :title="'Deploy queued'"
    :description="'Deployment is pending. Check status in a moment.'"
  />
</FlagGroup>`
})
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
      {{ t('drawer.livePlayground') }}
    </p>
    <label class="mb-4 flex items-center gap-2">
      <Switch v-model="isDismissible" size="sm" />
      <span class="text-xs text-[#4D6A87]">isDismissible</span>
    </label>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="pg-playground-preview flex min-h-[80px] items-center justify-center rounded-xl py-4">
        <p class="text-xs text-[#4D6A87]">Flags are rendered via Teleport at top-right of the viewport.</p>
      </div>
      <FlagGroup>
        <Flag
          :variant="'success'"
          :is-dismissible="isDismissible"
          :title="'Changes saved'"
          :description="'Your changes were saved successfully.'"
        />
        <Flag
          :variant="'warning'"
          :is-dismissible="isDismissible"
          :title="'Deploy queued'"
          :description="'Deployment is pending. Check status in a moment.'"
        />
      </FlagGroup>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
