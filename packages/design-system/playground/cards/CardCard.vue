<script setup lang="ts">
import { computed, ref } from 'vue'
import { Layers } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { propTemplateBinding } from '../utils/propTemplateName'
import { Card, Switch } from '@/index'
import type { CardVariant } from '@/components/data-display/Card.vue'

const { t } = usePlaygroundLocale()

const variant = ref<CardVariant>('outlined')
const showHeader = ref(true)
const showFooter = ref(true)

const variants: Array<CardVariant> = ['elevated', 'outlined', 'flat', 'ghost']

function optionStyle(active: boolean) {
  return active
    ? {
        background: 'rgba(0,229,176,0.12)',
        color: '#00E5B0',
        borderLeft: '2px solid #00E5B0',
      }
    : { color: '#4D6A87' }
}
</script>

<template>
  <PlayCard :label="t('cards.card.label')" accent-color="#00E5B0" :tag="t('cards.card.tag')">
    <template #icon><Layers :size="14" /></template>
    <div class="flex flex-col gap-3">
      <div class="pg-playground-preview flex items-center justify-center rounded-xl py-8">
        <Card :variant="variant" :class="'w-full max-w-sm'">
          <template v-if="showHeader" #header>
            <h3 class="font-semibold">{{ variant === 'ghost' ? 'Ghost Card' : 'Card Title' }}</h3>
          </template>
          <div class="space-y-2">
            <p class="text-sm">Card content goes here</p>
            <p class="text-xs text-muted-foreground">This is a demonstration of the Card component</p>
          </div>
          <template v-if="showFooter" #footer>
            <div class="flex gap-2">
              <button type="button" class="text-xs text-primary hover:underline">Action</button>
              <button type="button" class="text-xs text-muted-foreground hover:underline">Cancel</button>
            </div>
          </template>
        </Card>
      </div>

      <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div class="min-w-0">
          <p class="mb-1.5 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
            {{ propTemplateBinding('variant') }}
          </p>
          <button
            v-for="item in variants"
            :key="item"
            type="button"
            class="mb-0.5 block w-full rounded px-2 py-0.5 text-left text-xs transition-all"
            :style="optionStyle(variant === item)"
            @click="variant = item"
          >
            {{ item }}
          </button>
        </div>

        <div class="min-w-0">
          <p class="mb-1.5 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
            {{ t('buttonPlayground.stateLabel') }}
          </p>
          <label class="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-0.5 text-xs text-[#4D6A87]">
            <Switch v-model="showHeader" size="sm" />
            {{ propTemplateBinding('header') }} slot
          </label>
          <label class="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-0.5 text-xs text-[#4D6A87]">
            <Switch v-model="showFooter" size="sm" />
            {{ propTemplateBinding('footer') }} slot
          </label>
        </div>
      </div>
    </div>
  </PlayCard>
</template>
