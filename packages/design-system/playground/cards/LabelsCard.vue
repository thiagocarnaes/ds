<script setup lang="ts">
import { Tag } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { Badge, Lozenge } from '@/index'

const { t } = usePlaygroundLocale()
</script>

<template>
  <PlayCard :label="t('cards.labels.label')" accent-color="#A78BFA" :tag="t('cards.labels.tag')">
    <template #icon><Tag :size="14" /></template>
    <div class="space-y-4">
      <div>
        <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">lozenge</p>
        <div class="flex flex-wrap gap-2">
          <Lozenge variant="default">{{ t('labelsPlayground.statuses.backlog') }}</Lozenge>
          <Lozenge variant="success">{{ t('labelsPlayground.statuses.done') }}</Lozenge>
          <Lozenge variant="danger">{{ t('labelsPlayground.statuses.blocked') }}</Lozenge>
          <Lozenge variant="progress">{{ t('labelsPlayground.statuses.inProgress') }}</Lozenge>
          <Lozenge variant="warning">{{ t('labelsPlayground.statuses.review') }}</Lozenge>
          <Lozenge variant="new">{{ t('labelsPlayground.statuses.new') }}</Lozenge>
        </div>
      </div>
      <div>
        <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">badge</p>
        <div class="flex flex-wrap gap-3">
          <Badge :value="3" variant="default" />
          <Badge :value="12" variant="primary" />
          <Badge :value="47" variant="added" />
          <Badge :value="100" variant="important" />
          <Badge :value="0" variant="removed" />
        </div>
      </div>
    </div>
  </PlayCard>
</template>
