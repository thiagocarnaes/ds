<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr, templateStringAttr } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import {
  Button,
  Container,
  Grid,
  Stack,
  type ContainerMaxWidth,
  type StackAlign,
  type StackDirection,
  type StackGap,
  type StackJustify,
} from '@/index'

const { t, messages } = usePlaygroundLocale()

const tab = ref<'container' | 'stack' | 'grid'>('container')
const containerMaxWidth = ref<ContainerMaxWidth>('lg')
const stackDirection = ref<StackDirection>('vertical')
const stackGap = ref<StackGap>(3)
const stackAlign = ref<StackAlign>('stretch')
const stackJustify = ref<StackJustify>('start')
const gridCols = ref<1 | 2 | 3>(2)
const gridMdCols = ref<1 | 2 | 3 | null>(null)
const gridLgCols = ref<1 | 2 | 3 | null>(null)

const copy = computed(() => messages.value.layoutPrimitivesPlayground)

const containerMaxWidthOptions: ContainerMaxWidth[] = ['sm', 'md', 'lg', 'xl', 'full']
const stackDirectionOptions: StackDirection[] = ['vertical', 'horizontal']
const stackGapOptions: StackGap[] = [1, 2, 3, 4, 6, 8]
const stackAlignOptions: StackAlign[] = ['start', 'center', 'end', 'stretch']
const stackJustifyOptions: StackJustify[] = ['start', 'center', 'end', 'between']
const gridColOptions = [1, 2, 3] as const
const gridBreakpointOptions = [null, 1, 2, 3] as const

const previewKey = computed(
  () =>
    `${tab.value}-${containerMaxWidth.value}-${stackDirection.value}-${stackGap.value}-${stackAlign.value}-${stackJustify.value}-${gridCols.value}-${gridMdCols.value}-${gridLgCols.value}`,
)

function formatOptionalCols(value: number | null, prop: 'md-cols' | 'lg-cols'): string | null {
  return value === null ? null : `  :${prop}="${value}"`
}

const code = computed(() => {
  if (tab.value === 'container') {
    const maxWidthAttr =
      containerMaxWidth.value === 'lg'
        ? ''
        : `\n  ${templateStringAttr('maxWidth', containerMaxWidth.value)}`
    return `<Container${maxWidthAttr} class="py-4">
  <p>Page content</p>
</Container>`
  }

  if (tab.value === 'stack') {
    const attrs = [
      playgroundSnippetAttr('direction', stackDirection.value),
      playgroundSnippetAttr('gap', stackGap.value),
      playgroundSnippetAttr('align', stackAlign.value),
      playgroundSnippetAttr('justify', stackJustify.value),
    ]
    return [
      `<Stack ${attrs.join(' ')}>`,
      '  <div>Item A</div>',
      '  <div>Item B</div>',
      `  <Button ${templateStringAttr('variant', 'outline')}>${copy.value.action}</Button>`,
      '</Stack>',
    ].join('\n')
  }

  const gridAttrs = [`:cols="${gridCols.value}"`]
  const md = formatOptionalCols(gridMdCols.value, 'md-cols')
  const lg = formatOptionalCols(gridLgCols.value, 'lg-cols')
  if (md) gridAttrs.push(md.trim())
  if (lg) gridAttrs.push(lg.trim())

  return [`<Grid ${gridAttrs.join(' ')}>`, '  <Card />', '  <Card />', '  <Card />', '</Grid>'].join(
    '\n',
  )
})

function breakpointLabel(value: number | null): string {
  return value === null ? '—' : String(value)
}
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
    <div class="pg-playground-panel mb-6 space-y-4 rounded-xl p-4">
      <template v-if="tab === 'container'">
        <div>
          <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">max-width</p>
          <div class="flex flex-wrap gap-1">
            <button
              v-for="item in containerMaxWidthOptions"
              :key="item"
              type="button"
              class="rounded px-2 py-1 font-mono text-xs"
              :style="playgroundOptionStyle(containerMaxWidth === item)"
              @click="containerMaxWidth = item"
            >
              {{ item }}
            </button>
          </div>
        </div>
        <div class="rounded-lg border border-dashed border-border/60 bg-muted/20 p-2">
          <Container :key="previewKey" :max-width="containerMaxWidth" class="rounded-lg border border-dashed border-primary/30 bg-primary/5 px-4 py-6 text-center">
            <p class="text-sm font-medium text-foreground">{{ copy.containerContent }}</p>
            <p class="mt-1 text-xs text-muted-foreground">{{ copy.containerHint }}</p>
          </Container>
        </div>
      </template>

      <template v-else-if="tab === 'stack'">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">direction</p>
            <button
              v-for="item in stackDirectionOptions"
              :key="item"
              type="button"
              class="mb-1 block w-full rounded px-2 py-1 text-left text-xs"
              :style="playgroundOptionStyle(stackDirection === item)"
              @click="stackDirection = item"
            >
              {{ item }}
            </button>
          </div>
          <div>
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">gap</p>
            <div class="flex flex-wrap gap-1">
              <button
                v-for="item in stackGapOptions"
                :key="item"
                type="button"
                class="rounded px-2 py-1 font-mono text-xs"
                :style="playgroundOptionStyle(stackGap === item)"
                @click="stackGap = item"
              >
                {{ item }}
              </button>
            </div>
          </div>
          <div>
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">align</p>
            <button
              v-for="item in stackAlignOptions"
              :key="item"
              type="button"
              class="mb-1 block w-full rounded px-2 py-1 text-left text-xs"
              :style="playgroundOptionStyle(stackAlign === item)"
              @click="stackAlign = item"
            >
              {{ item }}
            </button>
          </div>
          <div>
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">justify</p>
            <button
              v-for="item in stackJustifyOptions"
              :key="item"
              type="button"
              class="mb-1 block w-full rounded px-2 py-1 text-left text-xs"
              :style="playgroundOptionStyle(stackJustify === item)"
              @click="stackJustify = item"
            >
              {{ item }}
            </button>
          </div>
        </div>
        <div class="pg-playground-preview rounded-xl p-4">
          <Stack
            :key="previewKey"
            :direction="stackDirection"
            :gap="stackGap"
            :align="stackAlign"
            :justify="stackJustify"
          >
            <div class="rounded-md bg-primary/10 px-4 py-2 text-xs text-primary">Item A</div>
            <div class="rounded-md bg-primary/10 px-4 py-2 text-xs text-primary">Item B</div>
            <Button variant="outline" size="sm">{{ copy.action }}</Button>
          </Stack>
        </div>
      </template>

      <template v-else>
        <div class="space-y-3">
          <div>
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">cols</p>
            <div class="flex flex-wrap gap-1">
              <button
                v-for="item in gridColOptions"
                :key="item"
                type="button"
                class="rounded px-2 py-1 font-mono text-xs"
                :style="playgroundOptionStyle(gridCols === item)"
                @click="gridCols = item"
              >
                {{ item }}
              </button>
            </div>
          </div>
          <div>
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">md-cols</p>
            <div class="flex flex-wrap gap-1">
              <button
                v-for="item in gridBreakpointOptions"
                :key="String(item)"
                type="button"
                class="rounded px-2 py-1 font-mono text-xs"
                :style="playgroundOptionStyle(gridMdCols === item)"
                @click="gridMdCols = item"
              >
                {{ breakpointLabel(item) }}
              </button>
            </div>
          </div>
          <div>
            <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">lg-cols</p>
            <div class="flex flex-wrap gap-1">
              <button
                v-for="item in gridBreakpointOptions"
                :key="String(item)"
                type="button"
                class="rounded px-2 py-1 font-mono text-xs"
                :style="playgroundOptionStyle(gridLgCols === item)"
                @click="gridLgCols = item"
              >
                {{ breakpointLabel(item) }}
              </button>
            </div>
          </div>
        </div>
        <div class="pg-playground-preview rounded-xl p-4">
          <Grid
            :key="previewKey"
            :cols="gridCols"
            :md-cols="gridMdCols ?? undefined"
            :lg-cols="gridLgCols ?? undefined"
          >
            <div
              v-for="n in gridCols * 2"
              :key="n"
              class="rounded-md bg-secondary/60 px-3 py-4 text-center text-xs text-secondary-foreground"
            >
              {{ n }}
            </div>
          </Grid>
        </div>
      </template>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
