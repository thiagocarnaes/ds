<script setup lang="ts">
import { computed, ref } from 'vue'
import { Zap } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import {
  Button,
  Select,
  Switch,
  iconographySelectOptions,
  type ButtonIconName,
} from '@/index'

const { t } = usePlaygroundLocale()

const sizes = ['sm', 'md', 'lg'] as const

type Appearance = 'primary' | 'ghost' | 'outline' | 'destructive'
type Size = (typeof sizes)[number]

const appearance = ref<Appearance>('primary')
const size = ref<Size>('md')
const disabled = ref(false)
const iconValue = ref('')

const appearances = [
  { id: 'primary', variant: 'primary' as const },
  { id: 'ghost', variant: 'ghost' as const },
  { id: 'outline', variant: 'outline' as const },
  { id: 'danger', variant: 'destructive' as const },
] as const

const icon = computed<ButtonIconName | undefined>(() =>
  iconValue.value ? (iconValue.value as ButtonIconName) : undefined,
)

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
  <PlayCard :label="t('cards.button.label')" accent-color="#00D4FF" :tag="t('cards.button.tag')">
    <template #icon><Zap :size="14" /></template>
    <div class="flex flex-col gap-3">
      <div class="pg-playground-preview flex h-16 items-center justify-center rounded-xl">
        <Button
          :appearance="appearance === 'destructive' ? 'danger' : appearance === 'default' ? 'primary' : appearance"
          :size="size"
          :icon="icon"
          :disabled="disabled"
          :class="appearance === 'primary' ? 'ds-glow-primary' : undefined"
        >
          {{ t('buttonPlayground.previewAction') }}
        </Button>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div class="min-w-0">
          <p class="mb-1.5 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
            {{ t('buttonPlayground.appearanceLabel') }}
          </p>
          <button
            v-for="item in appearances"
            :key="item.id"
            type="button"
            class="mb-0.5 block w-full rounded px-2 py-0.5 text-left text-xs transition-all"
            :style="optionStyle(appearance === item.variant)"
            @click="appearance = item.variant"
          >
            {{ item.id }}
          </button>
        </div>
        <div class="min-w-0">
          <p class="mb-1.5 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
            {{ t('buttonPlayground.sizeLabel') }}
          </p>
          <button
            v-for="item in sizes"
            :key="item"
            type="button"
            class="mb-0.5 block w-full rounded px-2 py-0.5 text-left text-xs transition-all"
            :style="optionStyle(size === item)"
            @click="size = item"
          >
            {{ item }}
          </button>
        </div>
        <div class="min-w-0">
          <p class="mb-1.5 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
            {{ t('buttonPlayground.stateLabel') }}
          </p>
          <label class="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-0.5 text-xs text-[#4D6A87]">
            <Switch v-model="disabled" size="sm" />
            disabled
          </label>
        </div>
      </div>
      <div>
        <p class="mb-1.5 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
          {{ t('buttonPlayground.iconLabel') }}
        </p>
        <Select
          v-model="iconValue"
          :options="iconographySelectOptions"
          :placeholder="t('buttonPlayground.iconPlaceholder')"
          :searchable="false"
        />
      </div>
    </div>
  </PlayCard>
</template>
