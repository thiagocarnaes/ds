<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Button, Container, Grid, Stack } from '@/index'

const { t, messages } = usePlaygroundLocale()

const tab = ref<'container' | 'stack' | 'grid'>('stack')
const stackDirection = ref<'vertical' | 'horizontal'>('vertical')
const gridCols = ref<1 | 2 | 3>(2)

const copy = computed(() => messages.value.layoutPrimitivesPlayground)

const stackDirectionOptions = ['vertical', 'horizontal'] as const
const gridColOptions = [1, 2, 3] as const

const previewKey = computed(() => `${tab.value}-${stackDirection.value}-${gridCols.value}`)

const code = computed(() => {
  if (tab.value === 'container') {
    return '<Container class="py-4">\n  <p>Page content</p>\n</Container>'
  }

  if (tab.value === 'stack') {
    return [
      `<Stack gap="3" direction="${stackDirection.value}">`,
      '  <Input />',
      '  <Button>Save</Button>',
      '</Stack>',
    ].join('\n')
  }

  return [
    `<Grid cols="${gridCols.value}" gap="4">`,
    '  <Card />',
    '  <Card />',
    '</Grid>',
  ].join('\n')
})
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="mb-4 flex flex-wrap gap-2">
      <button
        v-for="item in ['container', 'stack', 'grid']"
        :key="item"
        type="button"
        class="rounded-md px-3 py-1.5 font-mono text-[10px] uppercase"
        :style="playgroundOptionStyle(tab === item)"
        @click="tab = item as typeof tab"
      >
        {{ item }}
      </button>
    </div>
    <div class="pg-playground-panel mb-6 rounded-xl p-4">
      <Container v-if="tab === 'container'" class="rounded-lg border border-dashed border-primary/30 bg-primary/5 px-4 py-6 text-center">
        <p class="text-sm text-muted-foreground">{{ copy.containerHint }}</p>
      </Container>

      <template v-else-if="tab === 'stack'">
        <div class="mb-4 flex gap-2">
          <button
            v-for="item in stackDirectionOptions"
            :key="item"
            type="button"
            class="rounded px-2 py-0.5 text-xs"
            :style="playgroundOptionStyle(stackDirection === item)"
            @click="stackDirection = item"
          >
            {{ item }}
          </button>
        </div>
        <div class="pg-playground-preview rounded-xl p-4">
          <Stack
            :key="previewKey"
            :direction="stackDirection"
            :align="stackDirection === 'horizontal' ? 'start' : 'stretch'"
            gap="3"
          >
            <div class="rounded-md bg-primary/10 px-4 py-2 text-xs text-primary">Item A</div>
            <div class="rounded-md bg-primary/10 px-4 py-2 text-xs text-primary">Item B</div>
            <Button appearance="outline" size="sm">{{ copy.action }}</Button>
          </Stack>
        </div>
      </template>

      <template v-else>
        <div class="mb-4 flex gap-2">
          <button
            v-for="item in gridColOptions"
            :key="item"
            type="button"
            class="rounded px-2 py-0.5 text-xs"
            :style="playgroundOptionStyle(gridCols === item)"
            @click="gridCols = item"
          >
            {{ item }} cols
          </button>
        </div>
        <div class="pg-playground-preview rounded-xl p-4">
          <Grid :key="previewKey" :cols="gridCols">
            <div v-for="n in gridCols * 2" :key="n" class="rounded-md bg-secondary/60 px-3 py-4 text-center text-xs text-secondary-foreground">
              {{ n }}
            </div>
          </Grid>
        </div>
      </template>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
