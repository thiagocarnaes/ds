<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Button, Popover } from '@/index'

const { t, messages } = usePlaygroundLocale()

const appearance = ref<'primary' | 'ghost' | 'outline' | 'danger'>('outline')

const appearanceOptions = ['primary', 'ghost', 'outline', 'danger'] as const

const copy = computed(() => messages.value.popoverPlayground)

const code = computed(
  () => `<Popover>
  <template #trigger>
    <Button appearance="${appearance.value}">${copy.value.trigger}</Button>
  </template>
  <template #content>
    <p class="mb-2 text-sm font-medium">${copy.value.title}</p>
    <p class="text-xs text-muted-foreground">${copy.value.body}</p>
  </template>
</Popover>`,
)
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div class="pg-playground-preview flex items-center justify-center rounded-xl py-8">
        <Popover>
          <template #trigger>
            <Button :key="appearance" :appearance="appearance">{{ copy.trigger }}</Button>
          </template>
          <template #content>
            <p class="mb-2 text-sm font-medium text-foreground">{{ copy.title }}</p>
            <p class="text-xs text-muted-foreground">{{ copy.body }}</p>
          </template>
        </Popover>
      </div>

      <div>
        <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
          {{ t('buttonPlayground.appearanceLabel').toLowerCase() }}
        </p>
        <button
          v-for="item in appearanceOptions"
          :key="item"
          type="button"
          class="mb-1 block w-full rounded px-2 py-1 text-left text-xs transition-all"
          :style="playgroundOptionStyle(appearance === item)"
          @click="appearance = item"
        >
          {{ item }}
        </button>
      </div>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
