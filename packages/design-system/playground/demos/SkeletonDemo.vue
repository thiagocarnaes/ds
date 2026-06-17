<script setup lang="ts">
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { Skeleton } from '@/index'

const { t } = usePlaygroundLocale()

const code = `<Skeleton class="h-8 w-full" />
<Skeleton class="h-4 w-3/4" />
<Skeleton class="size-12 rounded-full" />`
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
      <div class="flex items-center gap-3">
        <Skeleton class="size-12 shrink-0 rounded-full" />
        <div class="min-w-0 flex-1 space-y-2">
          <Skeleton class="h-4 w-2/3" />
          <Skeleton class="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton class="h-24 w-full rounded-lg" />
      <div class="grid grid-cols-3 gap-2">
        <Skeleton class="h-8" />
        <Skeleton class="h-8" />
        <Skeleton class="h-8" />
      </div>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
