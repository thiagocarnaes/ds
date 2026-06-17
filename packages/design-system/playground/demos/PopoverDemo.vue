<script setup lang="ts">
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { Button, Popover } from '@/index'

const { t, messages } = usePlaygroundLocale()

const copy = messages.value.popoverPlayground

const code = `<Popover>
  <template #trigger>
    <Button appearance="outline">Open</Button>
  </template>
  <template #content>
    <p>Popover content</p>
  </template>
</Popover>`
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 rounded-xl p-4">
      <div class="pg-playground-preview flex items-center justify-center rounded-xl py-8">
        <Popover>
          <template #trigger>
            <Button appearance="outline">{{ copy.trigger }}</Button>
          </template>
          <template #content>
            <p class="mb-2 text-sm font-medium text-foreground">{{ copy.title }}</p>
            <p class="text-xs text-muted-foreground">{{ copy.body }}</p>
          </template>
        </Popover>
      </div>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
