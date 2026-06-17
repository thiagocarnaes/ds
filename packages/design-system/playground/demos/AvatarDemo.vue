<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Avatar, AvatarGroup } from '@/index'
import type { AvatarSize } from '@/components/data-display/Avatar.vue'

const { t } = usePlaygroundLocale()

const previewModes = ['single', 'group'] as const
type PreviewMode = (typeof previewModes)[number]

const sizeOptions: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl']
const nameOptions = ['Ana Martins', 'Bruno Silva', 'Carla Souza', 'Daniel Lima'] as const

const members = [
  { name: 'Ana Martins' },
  { name: 'Bruno Silva' },
  { name: 'Carla Souza' },
  { name: 'Daniel Lima' },
  { name: 'Eva Costa' },
  { name: 'Fabio Rocha' },
  { name: 'Gabi Nunes' },
  { name: 'Hugo Alves' },
  { name: 'Iris Mendes' },
  { name: 'João Pereira' },
  { name: 'Karla Dias' },
  { name: 'Leo Martins' },
]

const mode = ref<PreviewMode>('single')
const size = ref<AvatarSize>('lg')
const name = ref<(typeof nameOptions)[number]>('Ana Martins')
const max = ref(4)

const code = computed(() => {
  if (mode.value === 'group') {
    return `<AvatarGroup
  :members="people"
  ${playgroundSnippetAttr('max', max.value)}
  ${playgroundSnippetAttr('size', size.value)}
/>`
  }

  return `<Avatar
  ${playgroundSnippetAttr('name', name.value)}
  ${playgroundSnippetAttr('size', size.value)}
/>`
})
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="flex gap-2">
        <button
          v-for="item in previewModes"
          :key="item"
          type="button"
          class="rounded-md px-2 py-1 text-[10px] font-medium transition-colors"
          :style="
            mode === item
              ? { background: 'rgba(0,212,255,0.15)', color: '#00D4FF' }
              : { color: '#4D6A87' }
          "
          @click="mode = item"
        >
          {{ item }}
        </button>
      </div>

      <div class="pg-playground-preview flex items-center justify-center rounded-xl py-8">
        <Avatar
          v-if="mode === 'single'"
          :key="`${name}-${size}`"
          :name="name"
          :size="size"
        />
        <AvatarGroup
          v-else
          :key="`${size}-${max}`"
          :members="members"
          :max="max"
          :size="size"
        />
      </div>

      <div>
        <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">size</p>
        <button
          v-for="item in sizeOptions"
          :key="item"
          type="button"
          class="mb-1 block w-full rounded px-2 py-1 text-left text-xs transition-all"
          :style="playgroundOptionStyle(size === item)"
          @click="size = item"
        >
          {{ item }}
        </button>
      </div>

      <div v-if="mode === 'single'">
        <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">name</p>
        <button
          v-for="item in nameOptions"
          :key="item"
          type="button"
          class="mb-1 block w-full rounded px-2 py-1 text-left text-xs transition-all"
          :style="playgroundOptionStyle(name === item)"
          @click="name = item"
        >
          {{ item }}
        </button>
      </div>

      <div v-else>
        <label class="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
          max — {{ max }}
        </label>
        <input v-model.number="max" type="range" min="2" max="10" class="w-full accent-[#00D4FF]" />
      </div>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
