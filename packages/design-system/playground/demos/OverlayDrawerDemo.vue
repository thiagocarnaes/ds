<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr, templateBooleanAttr } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Button, Drawer, Switch } from '@/index'

const { t, messages } = usePlaygroundLocale()

const open = ref(false)
const placement = ref<'left' | 'right' | 'top' | 'bottom'>('right')
const closeOnOverlay = ref(true)

const placementOptions = ['left', 'right', 'top', 'bottom'] as const

const copy = computed(() => messages.value.overlayDrawerPlayground)

watch(placement, () => {
  open.value = false
})

const code = computed(() => {
  const attrs = [`v-model:open="open"`, playgroundSnippetAttr('placement', placement.value)]
  if (!closeOnOverlay.value) {
    attrs.push(templateBooleanAttr('closeOnOverlay', false))
  }

  const headerLines = closeOnOverlay.value
    ? [
        '  <div class="flex items-center border-b border-border px-4 py-3">',
        `    <h3 class="text-lg font-semibold leading-none">${copy.value.title}</h3>`,
        '  </div>',
      ]
    : [
        '  <div class="flex items-center justify-between border-b border-border px-4 py-3">',
        `    <h3 class="text-lg font-semibold leading-none">${copy.value.title}</h3>`,
        `    <button type="button" class="inline-flex size-8 items-center justify-center rounded-sm text-muted-foreground opacity-70 transition-opacity hover:opacity-100" aria-label="${copy.value.closeAriaLabel}" @click="open = false">&times;</button>`,
        '  </div>',
      ]

  const openTag = `<Drawer ${attrs.join(' ')}` + '>'

  return [
    openTag,
    ...headerLines,
    '  <div class="p-6">',
    `    <p class="text-sm text-muted-foreground">${copy.value.body}</p>`,
    '  </div>',
    '</Drawer>',
  ].join('\n')
})
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in placementOptions"
          :key="item"
          type="button"
          class="rounded-md px-3 py-1.5 font-mono text-[10px] uppercase"
          :style="playgroundOptionStyle(placement === item)"
          @click="placement = item"
        >
          {{ item }}
        </button>
      </div>
      <Button variant="primary" @click="open = true">{{ copy.open }}</Button>
      <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
        <Switch v-model="closeOnOverlay" size="sm" />
        {{ copy.closeOnOverlay }}
      </label>
      <Drawer :key="`${placement}-${closeOnOverlay}`" v-model:open="open" :placement="placement" :close-on-overlay="closeOnOverlay">
        <div
          class="flex items-center border-b border-border px-4 py-3"
          :class="closeOnOverlay ? undefined : 'justify-between'"
        >
          <h3 class="text-lg font-semibold leading-none">{{ copy.title }}</h3>
          <button
            v-if="!closeOnOverlay"
            type="button"
            class="inline-flex size-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            :aria-label="copy.closeAriaLabel"
            @click="open = false"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="p-6">
          <p class="text-sm text-muted-foreground">{{ copy.body }}</p>
        </div>
      </Drawer>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
