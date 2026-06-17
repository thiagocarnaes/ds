<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowUpRight } from 'lucide-vue-next'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { templateBooleanAttr, templateStringAttr } from '../utils/propTemplateName'
import { Alert, Button, Input, Label, Modal, Switch, Textarea } from '@/index'

type ModalVariant = 'confirm' | 'form' | 'danger'

const { t, messages } = usePlaygroundLocale()

const variant = ref<ModalVariant>('confirm')
const modalOpen = ref(false)
const projectName = ref('')
const projectDescription = ref('')
const showHeader = ref(true)
const showCloseButton = ref(true)
const showBody = ref(true)
const showFooter = ref(true)
const showCancelButton = ref(true)
const showPrimaryButton = ref(true)

const variants: ModalVariant[] = ['confirm', 'form', 'danger']

const modalTitles = computed(() => messages.value.modalPlayground.titles)
const modalActions = computed(() => messages.value.modalPlayground.actions)
const copy = computed(() => messages.value.modalPlayground)

function variantPillStyle(active: boolean) {
  return active
    ? { background: 'rgba(0,212,255,0.12)', color: '#00D4FF' }
    : { background: 'rgba(0,0,0,0.25)', color: '#4D6A87' }
}

function controlLabelStyle(enabled: boolean) {
  return enabled ? undefined : { opacity: '0.45' }
}

const primaryButtonVariant = computed(() => (variant.value === 'danger' ? 'destructive' : 'primary'))

function buildBodyLines(): string[] {
  if (!showBody.value) return []

  const lines = ['  <!-- Body -->', '  <div class="space-y-4 px-6 py-4">']

  if (variant.value === 'confirm') {
    lines.push(`    <p class="text-sm text-muted-foreground">${copy.value.confirmBody}</p>`)
  } else if (variant.value === 'form') {
    lines.push(
      '    <div class="space-y-2">',
      `      <Label>${copy.value.fields.projectName}</Label>`,
      `      <Input v-model="projectName" ${templateStringAttr('placeholder', 'My awesome project')} />`,
      '    </div>',
      '    <div class="space-y-2">',
      `      <Label>${copy.value.fields.description}</Label>`,
      `      <Textarea v-model="projectDescription" ${templateStringAttr('placeholder', 'Optional description...')} />`,
      '    </div>',
    )
  } else {
    lines.push(
      `    <p class="text-sm text-muted-foreground">${copy.value.dangerIntro} <strong>ATLAS-42</strong> ${copy.value.dangerOutro}</p>`,
      `    <Alert ${templateStringAttr('variant', 'error')}>${copy.value.dangerAlert}</Alert>`,
    )
  }

  lines.push('  </div>')
  return lines
}

function buildHeaderLines(title: string): string[] {
  if (!showHeader.value) return []

  if (showCloseButton.value) {
    return [
      '  <!-- Header -->',
      '  <div class="flex items-start justify-between border-b border-border px-6 py-4">',
      `    <h2 class="text-lg font-semibold">${title}</h2>`,
      '    <button type="button" aria-label="Close" @click="modalOpen = false">&times;</button>',
      '  </div>',
    ]
  }

  return [
    '  <!-- Header -->',
    '  <div class="border-b border-border px-6 py-4">',
    `    <h2 class="text-lg font-semibold">${title}</h2>`,
    '  </div>',
  ]
}

function buildFooterLines(action: string): string[] {
  if (!showFooter.value) return []

  const lines = [
    '  <!-- Footer -->',
    '  <div class="flex justify-end gap-2 border-t border-border px-6 py-4">',
  ]

  if (showCancelButton.value) {
    lines.push(`    <Button ${templateStringAttr('variant', 'ghost')} @click="modalOpen = false">${copy.value.cancel}</Button>`)
  }

  if (showPrimaryButton.value) {
    lines.push(`    <Button ${templateStringAttr('variant', primaryButtonVariant.value)} @click="handleAction">${action}</Button>`)
  }

  lines.push('  </div>')
  return lines
}

const code = computed(() => {
  const title = modalTitles.value[variant.value]
  const action = modalActions.value[variant.value]
  const lines = [
    '<Button @click="modalOpen = true">Open Modal</Button>',
    '',
    '<Modal v-model:open="modalOpen" class="max-w-md overflow-hidden p-0">',
    ...buildHeaderLines(title),
    ...buildBodyLines(),
    ...buildFooterLines(action),
    '</Modal>',
  ]

  return lines.join('\n')
})
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
      <div class="flex gap-2">
        <button
          v-for="item in variants"
          :key="item"
          type="button"
          class="flex-1 rounded-md px-3 py-2 font-mono text-[10px] uppercase tracking-wide transition-colors"
          :style="variantPillStyle(variant === item)"
          @click="variant = item"
        >
          {{ item }}
        </button>
      </div>
      <button
        type="button"
        class="flex w-full items-center justify-center gap-2 rounded-md border border-primary/40 px-3 py-2.5 text-xs text-primary transition-colors hover:border-primary hover:bg-primary/5"
        @click="modalOpen = true"
      >
        {{ copy.openButton }}
        <ArrowUpRight :size="14" />
      </button>

      <div class="space-y-2 border-t border-border/60 pt-4">
        <p class="font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ copy.controlsTitle }}</p>
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch v-model="showHeader" size="sm" />
          {{ copy.showHeader }}
        </label>
        <label
          class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]"
          :style="controlLabelStyle(showHeader)"
        >
          <Switch v-model="showCloseButton" size="sm" :disabled="!showHeader" />
          {{ copy.showCloseButton }}
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
          <Switch v-model="showPrimaryButton" size="sm" :disabled="!showFooter" />
          {{ copy.showPrimaryButton }}
        </label>
      </div>
    </div>

    <Modal v-model:open="modalOpen" class="max-w-md overflow-hidden p-0">
      <div
        v-if="showHeader"
        class="border-b border-border px-6 py-4"
        :class="showCloseButton ? 'flex items-start justify-between' : undefined"
      >
        <h2 class="text-lg font-semibold leading-none text-foreground">
          {{ modalTitles[variant] }}
        </h2>
        <button
          v-if="showCloseButton"
          type="button"
          class="rounded-sm text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          :aria-label="copy.closeAriaLabel"
          @click="modalOpen = false"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div v-if="showBody" class="space-y-4 px-6 py-4">
        <template v-if="variant === 'confirm'">
          <p class="text-sm leading-relaxed text-[#7BA3C8]">
            {{ copy.confirmBody }}
          </p>
        </template>

        <template v-else-if="variant === 'form'">
          <div class="space-y-2">
            <Label class="text-[#7BA3C8]">{{ copy.fields.projectName }}</Label>
            <Input v-model="projectName" :placeholder="copy.placeholders.projectName" />
          </div>
          <div class="space-y-2">
            <Label class="text-[#7BA3C8]">{{ copy.fields.description }}</Label>
            <Textarea
              v-model="projectDescription"
              :placeholder="copy.placeholders.description"
              class="min-h-24"
            />
          </div>
        </template>

        <template v-else>
          <p class="text-sm leading-relaxed text-[#7BA3C8]">
            {{ copy.dangerIntro }}
            <strong class="text-foreground">ATLAS-42</strong>
            {{ copy.dangerOutro }}
          </p>
          <Alert variant="error">
            {{ copy.dangerAlert }}
          </Alert>
        </template>
      </div>

      <div v-if="showFooter" class="flex justify-end gap-2 border-t border-border px-6 py-4">
        <Button v-if="showCancelButton" variant="ghost" @click="modalOpen = false">
          {{ copy.cancel }}
        </Button>
        <Button
          v-if="showPrimaryButton"
          :variant="primaryButtonVariant"
          :class="variant !== 'danger' ? 'ds-glow-primary' : undefined"
          @click="modalOpen = false"
        >
          {{ modalActions[variant] }}
        </Button>
      </div>
    </Modal>

    <UsageBlock :code="code" />
  </div>
</template>
