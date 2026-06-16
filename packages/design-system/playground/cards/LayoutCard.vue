<script setup lang="ts">
import { ref } from 'vue'
import { LayoutTemplate } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'
import { AppLayout, Button } from '@/index'

defineEmits<{
  open: []
}>()

const panelOpen = ref(false)

const regions = [
  { id: 'header', label: 'Header', hint: 'Brand, nav, actions', color: '#00D4FF' },
  { id: 'menu', label: 'Menu', hint: 'Sidebar navigation', color: '#A78BFA' },
  { id: 'content', label: 'Content', hint: 'Main page area', color: '#00E5B0' },
  { id: 'footer', label: 'Footer', hint: 'Status, links, meta', color: '#FF8B00' },
]

const regionShellClass =
  'flex w-full items-center justify-center rounded border border-dashed p-2'
</script>

<template>
  <PlayCard label="Layout" accent-color="#00E5B0" tag="interactive">
    <template #icon><LayoutTemplate :size="14" /></template>

    <div class="flex min-h-0 flex-1 flex-col">
      <p class="mb-4 shrink-0 text-[11px] leading-relaxed text-[#7BA3C8]">
        Application shell with four composable regions. Each slot maps to a persistent area of the page grid.
      </p>

      <AppLayout
        v-model:panel-open="panelOpen"
        class="mb-4 min-h-[300px] flex-1"
        menu-width="10rem"
        :menu-collapsible="false"
      >
        <template #header>
          <div
            :class="[regionShellClass, 'min-h-8']"
            style="background: rgba(0,212,255,0.08); border-color: rgba(0,212,255,0.35)"
          >
            <span class="font-mono text-[9px] uppercase tracking-wider text-[#00D4FF]">Header</span>
          </div>
        </template>

        <template #menu>
          <div
            :class="[regionShellClass, 'h-full min-h-[10rem]']"
            style="background: rgba(167,139,250,0.08); border-color: rgba(167,139,250,0.35)"
          >
            <span class="font-mono text-[8px] uppercase tracking-wider text-[#A78BFA]">Menu</span>
          </div>
        </template>

        <div
          :class="[regionShellClass, 'h-full min-h-[10rem] flex-col gap-2']"
          style="background: rgba(0,229,176,0.08); border-color: rgba(0,229,176,0.35)"
        >
          <span class="font-mono text-[9px] uppercase tracking-wider text-[#00E5B0]">Content</span>
          <Button appearance="outline" size="sm" @click="panelOpen = true">
            Open panel
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
              Panel — close
            </button>
          </div>
        </template>

        <template #footer>
          <div
            :class="[regionShellClass, 'min-h-8']"
            style="background: rgba(255,139,0,0.08); border-color: rgba(255,139,0,0.35)"
          >
            <span class="font-mono text-[9px] uppercase tracking-wider text-[#FF8B00]">Footer</span>
          </div>
        </template>
      </AppLayout>

      <div class="mb-4 grid shrink-0 grid-cols-2 gap-2">
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

      <button
        type="button"
        class="w-full shrink-0 rounded-md border border-[#00E5B0]/30 px-3 py-2 text-xs text-[#00E5B0] transition-colors hover:border-[#00E5B0]/60 hover:bg-[#00E5B0]/5"
        @click="$emit('open')"
      >
        Open layout playground →
      </button>
    </div>
  </PlayCard>
</template>
