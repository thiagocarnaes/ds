<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr, propTemplateBinding, templateStringAttr } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Button, Popover, Switch, type PopoverAppearance } from '@/index'

const { t, messages } = usePlaygroundLocale()

const variant = ref<PopoverAppearance>('outline')
const showTrigger = ref(true)
const showContent = ref(true)
const showContentTitle = ref(true)
const showContentBody = ref(true)

const variantOptions: PopoverAppearance[] = ['primary', 'ghost', 'outline', 'danger']

const copy = computed(() => messages.value.popoverPlayground)

function controlLabelStyle(enabled: boolean) {
  return enabled ? undefined : { opacity: '0.45' }
}

const previewOpen = ref(true)

function buildCodeLines(): string[] {
  const lines = [`<Popover ${playgroundSnippetAttr('variant', variant.value)}>`]

  if (showTrigger.value) {
    lines.push('  <template #trigger>')
    lines.push(`    <Button ${templateStringAttr('variant', 'outline')}>${copy.value.trigger}</Button>`)
    lines.push('  </template>')
  }

  if (showContent.value) {
    lines.push('  <template #content>')

    if (showContentTitle.value) {
      lines.push(`    <p class="mb-2 text-sm font-medium">${copy.value.title}</p>`)
    }

    if (showContentBody.value) {
      lines.push(`    <p class="text-xs opacity-80">${copy.value.body}</p>`)
    }

    lines.push('  </template>')
  }

  lines.push('</Popover>')
  return lines
}

const code = computed(() => buildCodeLines().join('\n'))
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="pg-playground-preview flex items-center justify-center rounded-xl py-8">
        <Popover v-if="showTrigger" v-model:open="previewOpen" :variant="variant">
          <template #trigger>
            <Button variant="outline">{{ copy.trigger }}</Button>
          </template>
          <template v-if="showContent" #content>
            <p v-if="showContentTitle" class="mb-2 text-sm font-medium">{{ copy.title }}</p>
            <p v-if="showContentBody" class="text-xs opacity-80">{{ copy.body }}</p>
          </template>
        </Popover>
        <p v-else class="text-xs text-[#4D6A87]">{{ copy.triggerHiddenHint }}</p>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ propTemplateBinding('variant') }}</p>
          <button
            v-for="item in variantOptions"
            :key="item"
            type="button"
            class="mb-1 block w-full rounded px-2 py-1 text-left text-xs transition-all"
            :style="playgroundOptionStyle(variant === item)"
            @click="variant = item"
          >
            {{ item }}
          </button>
        </div>

        <div class="space-y-2">
          <p class="font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ copy.controlsTitle }}</p>
          <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
            <Switch v-model="showTrigger" size="sm" />
            {{ copy.showTrigger }}
          </label>
          <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
            <Switch v-model="showContent" size="sm" />
            {{ copy.showContent }}
          </label>
          <label
            class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]"
            :style="controlLabelStyle(showContent)"
          >
            <Switch v-model="showContentTitle" size="sm" :disabled="!showContent" />
            {{ copy.showContentTitle }}
          </label>
          <label
            class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]"
            :style="controlLabelStyle(showContent)"
          >
            <Switch v-model="showContentBody" size="sm" :disabled="!showContent" />
            {{ copy.showContentBody }}
          </label>
        </div>
      </div>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
