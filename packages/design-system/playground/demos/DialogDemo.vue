<script setup lang="ts">
import { ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { Button, Dialog } from '@/index'

const { t, messages } = usePlaygroundLocale()

const open = ref(false)
const copy = messages.value.dialogPlayground

const code = `<Dialog v-model:open="open">
  <template #title>Confirm action</template>
  <template #description>This cannot be undone.</template>
  <p>Are you sure?</p>
  <template #footer>
    <Button appearance="ghost" @click="open = false">Cancel</Button>
    <Button appearance="primary" @click="confirm">Confirm</Button>
  </template>
</Dialog>`
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
      <Button appearance="primary" @click="open = true">{{ copy.open }}</Button>
      <Dialog v-model:open="open">
        <template #title>{{ copy.title }}</template>
        <template #description>{{ copy.description }}</template>
        <p class="text-sm text-muted-foreground">{{ copy.body }}</p>
        <template #footer>
          <Button appearance="ghost" @click="open = false">{{ copy.cancel }}</Button>
          <Button appearance="primary" @click="open = false">{{ copy.confirm }}</Button>
        </template>
      </Dialog>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
