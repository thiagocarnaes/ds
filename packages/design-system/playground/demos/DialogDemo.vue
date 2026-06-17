<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { templateBooleanAttr, templateStringAttr } from '../utils/propTemplateName'
import { Button, Dialog, Switch } from '@/index'

const { t, messages } = usePlaygroundLocale()

const open = ref(false)
const closeOnOverlay = ref(true)
const showTitle = ref(true)
const showDescription = ref(true)
const showBody = ref(true)
const showFooter = ref(true)
const showCancelButton = ref(true)
const showConfirmButton = ref(true)

const copy = computed(() => messages.value.dialogPlayground)

function controlLabelStyle(enabled: boolean) {
  return enabled ? undefined : { opacity: '0.45' }
}

function buildCodeLines(): string[] {
  const lines = ['<Dialog v-model:open="open"']

  if (!closeOnOverlay.value) {
    lines[0] += ` ${templateBooleanAttr('closeOnOverlay', false)}`
  }

  lines[0] += '>'

  if (showTitle.value) {
    lines.push(`  <template #title>${copy.value.title}</template>`)
  }

  if (showDescription.value) {
    lines.push(`  <template #description>${copy.value.description}</template>`)
  }

  if (showBody.value) {
    lines.push(`  <p class="text-sm text-muted-foreground">${copy.value.body}</p>`)
  }

  if (showFooter.value) {
    lines.push('  <template #footer>')

    if (showCancelButton.value) {
      lines.push(`    <Button ${templateStringAttr('variant', 'ghost')} @click="open = false">${copy.value.cancel}</Button>`)
    }

    if (showConfirmButton.value) {
      lines.push(`    <Button ${templateStringAttr('variant', 'primary')} @click="confirm">${copy.value.confirm}</Button>`)
    }

    lines.push('  </template>')
  }

  lines.push('</Dialog>')
  return lines
}

const code = computed(() => buildCodeLines().join('\n'))
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
      <Button variant="primary" @click="open = true">{{ copy.open }}</Button>

      <div class="space-y-2 border-t border-border/60 pt-4">
        <p class="font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ copy.controlsTitle }}</p>
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch v-model="closeOnOverlay" size="sm" />
          {{ copy.closeOnOverlay }}
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch v-model="showTitle" size="sm" />
          {{ copy.showTitle }}
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch v-model="showDescription" size="sm" />
          {{ copy.showDescription }}
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch v-model="showBody" size="sm" />
          {{ copy.showBody }}
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch v-model="showFooter" size="sm" />
          {{ copy.showFooter }}
        </label>
        <label
          class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]"
          :style="controlLabelStyle(showFooter)"
        >
          <Switch v-model="showCancelButton" size="sm" :disabled="!showFooter" />
          {{ copy.showCancelButton }}
        </label>
        <label
          class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]"
          :style="controlLabelStyle(showFooter)"
        >
          <Switch v-model="showConfirmButton" size="sm" :disabled="!showFooter" />
          {{ copy.showConfirmButton }}
        </label>
      </div>

      <Dialog v-model:open="open" :close-on-overlay="closeOnOverlay">
        <template v-if="showTitle" #title>{{ copy.title }}</template>
        <template v-if="showDescription" #description>{{ copy.description }}</template>
        <p v-if="showBody" class="text-sm text-muted-foreground">{{ copy.body }}</p>
        <template v-if="showFooter" #footer>
          <Button v-if="showCancelButton" variant="ghost" @click="open = false">
            {{ copy.cancel }}
          </Button>
          <Button v-if="showConfirmButton" variant="primary" @click="open = false">
            {{ copy.confirm }}
          </Button>
        </template>
      </Dialog>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
