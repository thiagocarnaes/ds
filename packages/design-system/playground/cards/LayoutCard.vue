<script setup lang="ts">
import { computed, ref } from 'vue'
import { LayoutTemplate } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { AppLayout, Button } from '@/index'

const { messages, t } = usePlaygroundLocale()

const panelOpen = ref(false)

const regions = computed(() => {
  const { regions: regionCopy } = messages.value.layoutPlayground
  return [
    { id: 'header', ...regionCopy.header, color: '#00D4FF' },
    { id: 'menu', ...regionCopy.menu, color: '#A78BFA' },
    { id: 'content', ...regionCopy.content, color: '#00E5B0' },
    { id: 'footer', ...regionCopy.footer, color: '#FF8B00' },
  ]
})

const regionShellClass =
  'flex w-full items-center justify-center rounded border border-dashed p-2'
</script>

<template>
  <PlayCard :label="t('cards.layout.label')" accent-color="#00E5B0" :tag="t('cards.layout.tag')">
    <template #icon><LayoutTemplate :size="14" /></template>

    <div class="flex min-h-0 flex-1 flex-col">
      <p class="mb-4 shrink-0 text-[11px] leading-relaxed text-[#7BA3C8]">
        {{ t('layoutPlayground.description') }}
      </p>

      <AppLayout
        v-model:panel-open="panelOpen"
        class="mb-4 min-h-[300px] flex-1"
        :menu-width="'10rem'"
        :menu-collapsible="false"
      >
        <template #header>
          <div
            :class="[regionShellClass, 'min-h-8']"
            style="background: rgba(0,212,255,0.08); border-color: rgba(0,212,255,0.35)"
          >
            <span class="font-mono text-[9px] uppercase tracking-wider text-[#00D4FF]">
              {{ t('layoutPlayground.regions.header.label') }}
            </span>
          </div>
        </template>

        <template #menu-items>
          <div
            :class="[regionShellClass, 'h-full min-h-[10rem]']"
            style="background: rgba(167,139,250,0.08); border-color: rgba(167,139,250,0.35)"
          >
            <span class="font-mono text-[8px] uppercase tracking-wider text-[#A78BFA]">
              {{ t('layoutPlayground.regions.menu.label') }}
            </span>
          </div>
        </template>

        <div
          :class="[regionShellClass, 'h-full min-h-[10rem] flex-col gap-2']"
          style="background: rgba(0,229,176,0.08); border-color: rgba(0,229,176,0.35)"
        >
          <span class="font-mono text-[9px] uppercase tracking-wider text-[#00E5B0]">
            {{ t('layoutPlayground.regions.content.label') }}
          </span>
          <Button variant="outline" size="sm" @click="panelOpen = true">
            {{ t('layoutPlayground.openPanel') }}
          </Button>
        </div>

        <template #panel="{ closePanel }">
          <div
            :class="[regionShellClass, 'h-full min-h-[10rem]']"
            style="background: rgba(0,212,255,0.08); border-color: rgba(0,212,255,0.35)"
          >
            <button
              type="button"
              class="font-mono text-[9px] uppercase tracking-wider text-[#00D4FF] underline-offset-2 hover:underline"
              @click="closePanel()"
            >
              {{ t('layoutPlayground.panelClose') }}
            </button>
          </div>
        </template>

        <template #footer>
          <div
            :class="[regionShellClass, 'min-h-8']"
            style="background: rgba(255,139,0,0.08); border-color: rgba(255,139,0,0.35)"
          >
            <span class="font-mono text-[9px] uppercase tracking-wider text-[#FF8B00]">
              {{ t('layoutPlayground.regions.footer.label') }}
            </span>
          </div>
        </template>
      </AppLayout>

      <div class="mb-4 grid shrink-0 grid-cols-1 gap-2 sm:grid-cols-2">
        <div
          v-for="region in regions"
          :key="region.id"
          class="rounded-lg px-2.5 py-2"
          :style="{ background: `${region.color}08`, border: `1px solid ${region.color}20` }"
        >
          <p class="text-[10px] font-medium text-[#E8EDF5]">{{ region.label }}</p>
          <p class="text-[9px] text-[#4D6A87]">{{ region.hint }}</p>
        </div>
      </div>
    </div>
  </PlayCard>
</template>
