<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr } from '../utils/propTemplateName'
import { Input, Label } from '@/index'

const { t } = usePlaygroundLocale()

const fieldId = ref('email')
const labelText = ref('Email')
const value = ref('you@company.com')

const code = computed(
  () => `<Label ${playgroundSnippetAttr('for', fieldId.value)}>
  ${labelText.value}
</Label>
<Input ${playgroundSnippetAttr('id', fieldId.value)} v-model="email" ${playgroundSnippetAttr('type', 'email')} />`,
)
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
      <div class="pg-playground-preview mx-auto w-full max-w-xs space-y-2 rounded-xl p-4">
        <Label :for="fieldId">{{ labelText }}</Label>
        <Input :id="fieldId" v-model="value" type="email" :placeholder="'you@company.com'" />
      </div>

      <div>
        <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">label</p>
        <input
          v-model="labelText"
          type="text"
          class="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
        />
      </div>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
