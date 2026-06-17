<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr, templateBooleanAttr } from '../utils/propTemplateName'
import { Progress, Switch } from '@/index'

const { t } = usePlaygroundLocale()

const value = ref(72)
const indeterminate = ref(false)

const code = computed(() =>
  indeterminate.value
    ? `<Progress ${templateBooleanAttr('indeterminate', true)} />`
    : `<Progress ${playgroundSnippetAttr('value', value.value)} />`,
)
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <Progress :value="value" :indeterminate="indeterminate" />
      <div v-if="!indeterminate">
        <label class="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
          value — {{ value }}%
        </label>
        <input v-model.number="value" type="range" min="0" max="100" class="w-full accent-[#00D4FF]" />
      </div>
      <label class="flex cursor-pointer items-center gap-2 text-xs text-[#4D6A87]">
        <Switch v-model="indeterminate" size="sm" />
        indeterminate
      </label>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
