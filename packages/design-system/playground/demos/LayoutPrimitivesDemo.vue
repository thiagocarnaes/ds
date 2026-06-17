<script setup lang="ts">
import { ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Button, Container, Grid, Stack } from '@/index'

const { t, messages } = usePlaygroundLocale()

const tab = ref<'container' | 'stack' | 'grid'>('stack')
const stackDirection = ref<'vertical' | 'horizontal'>('vertical')
const gridCols = ref<1 | 2 | 3>(2)
const copy = messages.value.layoutPrimitivesPlayground

const code = `<Container class="py-4">
  <Stack gap="4" direction="vertical">
    <Input />
    <Button>Save</Button>
  </Stack>
</Container>

<Grid cols="2" gap="4">
  <Card />
  <Card />
</Grid>`
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
            v-for="item in ['vertical', 'horizontal']"
            :key="item"
            type="button"
            class="rounded px-2 py-0.5 text-xs"
            :style="playgroundOptionStyle(stackDirection === item)"
            @click="stackDirection = item as typeof stackDirection"
          >
            {{ item }}
          </button>
        </div>
        <Stack :direction="stackDirection" gap="3">
          <div class="rounded-md bg-primary/10 px-4 py-2 text-xs text-primary">Item A</div>
          <div class="rounded-md bg-primary/10 px-4 py-2 text-xs text-primary">Item B</div>
          <Button appearance="outline" size="sm">{{ copy.action }}</Button>
        </Stack>
      </template>

      <template v-else>
        <div class="mb-4 flex gap-2">
          <button
            v-for="item in [1, 2, 3]"
            :key="item"
            type="button"
            class="rounded px-2 py-0.5 text-xs"
            :style="playgroundOptionStyle(gridCols === item)"
            @click="gridCols = item as typeof gridCols"
          >
            {{ item }} cols
          </button>
        </div>
        <Grid :cols="gridCols">
          <div v-for="n in gridCols * 2" :key="n" class="rounded-md bg-secondary/60 px-3 py-4 text-center text-xs text-secondary-foreground">
            {{ n }}
          </div>
        </Grid>
      </template>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
