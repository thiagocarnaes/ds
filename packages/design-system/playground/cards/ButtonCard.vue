<script setup lang="ts">
import { computed, ref } from 'vue'
import { Zap } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'
import UsageBlock from '../components/UsageBlock.vue'
import {
  Button,
  Select,
  Switch,
  iconographySelectOptions,
  type ButtonIconName,
} from '@/index'

const appearances = [
  { id: 'primary', variant: 'primary' as const, label: 'primary' },
  { id: 'ghost', variant: 'ghost' as const, label: 'ghost' },
  { id: 'outline', variant: 'outline' as const, label: 'outline' },
  { id: 'danger', variant: 'destructive' as const, label: 'danger' },
]
const sizes = ['sm', 'md', 'lg'] as const

type Appearance = (typeof appearances)[number]['variant']
type Size = (typeof sizes)[number]

const appearance = ref<Appearance>('primary')
const size = ref<Size>('md')
const disabled = ref(false)
const iconValue = ref('')

const icon = computed<ButtonIconName | undefined>(() =>
  iconValue.value ? (iconValue.value as ButtonIconName) : undefined,
)

const codeSnippet = computed(() => {
  const disabledAttr = disabled.value ? '\n  disabled' : ''
  const iconAttr = icon.value ? `\n  icon="${icon.value}"` : ''
  return `<Button
  appearance="${appearance.value === 'destructive' ? 'danger' : appearance.value === 'default' ? 'primary' : appearance.value}"
  size="${size.value}"${iconAttr}${disabledAttr}
>
  Action
</Button>`
})

function optionStyle(active: boolean) {
  return active
    ? {
        background: 'rgba(0,212,255,0.12)',
        color: '#00D4FF',
        borderLeft: '2px solid #00D4FF',
      }
    : { color: '#4D6A87' }
}
</script>

<template>
  <PlayCard label="Button" accent-color="#00D4FF" tag="interactive">
    <template #icon><Zap :size="14" /></template>
    <div class="flex flex-col gap-5">
      <div
        class="pg-playground-preview flex h-24 items-center justify-center rounded-xl"
      >
        <Button
          :appearance="appearance === 'destructive' ? 'danger' : appearance === 'default' ? 'primary' : appearance"
          :size="size"
          :icon="icon"
          :disabled="disabled"
          :class="appearance === 'primary' ? 'ds-glow-primary' : undefined"
        >
          Action
        </Button>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div class="min-w-0">
          <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">appearance</p>
          <button
            v-for="item in appearances"
            :key="item.id"
            type="button"
            class="mb-1 block w-full rounded px-2 py-1 text-left text-xs transition-all"
            :style="optionStyle(appearance === item.variant)"
            @click="appearance = item.variant"
          >
            {{ item.label }}
          </button>
        </div>
        <div class="min-w-0">
          <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">size</p>
          <button
            v-for="item in sizes"
            :key="item"
            type="button"
            class="mb-1 block w-full rounded px-2 py-1 text-left text-xs transition-all"
            :style="optionStyle(size === item)"
            @click="size = item"
          >
            {{ item }}
          </button>
        </div>
        <div class="min-w-0">
          <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">state</p>
          <label class="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
            <Switch v-model="disabled" size="sm" />
            disabled
          </label>
        </div>
      </div>
      <div>
        <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">icon</p>
        <Select
          v-model="iconValue"
          :options="iconographySelectOptions"
          placeholder="Select an icon..."
        />
      </div>
      <UsageBlock :code="codeSnippet" />
    </div>
  </PlayCard>
</template>
