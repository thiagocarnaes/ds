<script setup lang="ts">
import { computed, ref } from 'vue'
import { Search } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'
import ColorPalettePicker from '../components/ColorPalettePicker.vue'
import { useCopy } from '../composables/useCopy'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { iconography } from '@/icons/iconography'

const { t } = usePlaygroundLocale()

const query = ref('')
const iconSize = ref(20)
const iconColor = ref('#00D4FF')

const sizes = [12, 16, 20, 24]

const filtered = () =>
  iconography.filter((item) =>
    item.label.toLowerCase().includes(query.value.toLowerCase()) ||
    item.name.includes(query.value.toLowerCase()),
  )

const copy = useCopy('')

const iconTag = computed(() => `${iconography.length} ${t('cards.icons.tagSuffix')}`)

async function copyIcon(name: string, label: string): Promise<void> {
  await copy.copy(`<${label} />`)
}
</script>

<template>
  <PlayCard :label="t('cards.icons.label')" accent-color="#00D4FF" :tag="iconTag">
    <template #icon><Search :size="14" /></template>
    <input
      v-model="query"
      :placeholder="t('iconsPlayground.searchPlaceholder')"
      class="mb-3 w-full rounded-lg border border-border bg-input px-3 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring/30"
    />
    <div class="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="s in sizes"
          :key="s"
          type="button"
          class="rounded px-2 py-0.5 font-mono text-[10px] transition-colors"
          :style="
            iconSize === s
              ? { background: 'rgba(0,212,255,0.15)', color: '#00D4FF' }
              : { color: '#4D6A87' }
          "
          @click="iconSize = s"
        >
          {{ s }}
        </button>
      </div>
      <ColorPalettePicker v-model="iconColor" size="sm" />
    </div>
    <div class="playground-scroll max-h-[420px] overflow-y-auto pr-1">
      <div class="grid grid-cols-6 gap-1.5 sm:grid-cols-8 lg:grid-cols-10">
        <button
          v-for="item in filtered()"
          :key="item.name"
          type="button"
          class="flex flex-col items-center gap-1 rounded-lg p-1.5 transition-colors hover:bg-primary/10"
          @click="copyIcon(item.name, item.label.replace(/\s+/g, ''))"
        >
          <component :is="item.component" :size="iconSize" :style="{ color: iconColor }" />
          <span class="max-w-full truncate text-[7px] text-[#4D6A87]">{{ item.label }}</span>
        </button>
      </div>
    </div>
    <p class="mt-3 text-[10px] text-[#4D6A87]">{{ t('iconsPlayground.footerHint') }}</p>
  </PlayCard>
</template>
