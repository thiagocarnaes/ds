<script setup lang="ts">
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { Flag, FlagGroup } from '@/index'

const { t } = usePlaygroundLocale()

const code = `<FlagGroup>
  <Flag
    :variant="'success'"
    :title="'Changes saved'"
    :description="'Your changes were saved successfully.'"
  />
  <Flag
    :variant="'warning'"
    :title="'Deploy queued'"
    :description="'Deployment is pending. Check status in a moment.'"
  />
</FlagGroup>`
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
      {{ t('drawer.livePlayground') }}
    </p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="pg-playground-preview flex min-h-[80px] items-center justify-center rounded-xl py-4">
        <p class="text-xs text-[#4D6A87]">Flags are rendered via Teleport at top-right of the viewport.</p>
      </div>
      <FlagGroup>
        <Flag
          :variant="'success'"
          :title="'Changes saved'"
          :description="'Your changes were saved successfully.'"
        />
        <Flag
          :variant="'warning'"
          :title="'Deploy queued'"
          :description="'Deployment is pending. Check status in a moment.'"
        />
      </FlagGroup>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
