<script setup lang="ts">
import { Tag } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'
import { Badge, Lozenge } from '@/index'
</script>

<template>
  <PlayCard label="Labels" accent-color="#A78BFA" tag="lozenge · badge">
    <template #icon><Tag :size="14" /></template>
    <div class="space-y-4">
      <div>
        <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">lozenge</p>
        <div class="flex flex-wrap gap-2">
          <Lozenge appearance="default">Backlog</Lozenge>
          <Lozenge appearance="success">Done</Lozenge>
          <Lozenge appearance="danger">Blocked</Lozenge>
          <Lozenge appearance="progress">In Progress</Lozenge>
          <Lozenge appearance="warning">Review</Lozenge>
          <Lozenge appearance="new">New</Lozenge>
        </div>
      </div>
      <div>
        <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">badge</p>
        <div class="flex flex-wrap gap-3">
          <Badge :value="3" appearance="default" />
          <Badge :value="12" appearance="primary" />
          <Badge :value="47" appearance="added" />
          <Badge :value="100" appearance="important" />
          <Badge :value="0" appearance="removed" />
        </div>
      </div>
    </div>
  </PlayCard>
</template>
