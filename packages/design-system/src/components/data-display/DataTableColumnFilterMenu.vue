<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { ListFilter } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import DataTableColumnFilter from './DataTableColumnFilter.vue'
import type { DataTableColumn, DataTableColumnFilters, DataTableLabels } from './dataTableTypes'
import { formatDataTableLabel, isColumnFilterActive } from './dataTableUtils'

const props = defineProps<{
  column: DataTableColumn
  disabled?: boolean
  labels: Required<DataTableLabels>
  locale?: string
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [open: boolean]
}>()

const filters = defineModel<DataTableColumnFilters>({ required: true })

const triggerRef = ref<HTMLButtonElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const panelStyle = ref({ top: '0px', left: '0px', minWidth: '12rem' })

const VIEWPORT_PADDING = 8

const isActive = computed(() => isColumnFilterActive(props.column, filters.value[props.column.key]))

const filterTitle = computed(() =>
  formatDataTableLabel(props.labels.filterTitle, props.column.label),
)

const filterAriaLabel = computed(() =>
  formatDataTableLabel(props.labels.filterAriaLabel, props.column.label),
)

async function updatePanelPosition(): Promise<void> {
  if (!triggerRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()
  const minWidth = Math.max(rect.width, 192)
  let top = rect.bottom + 6
  let left = rect.left

  panelStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    minWidth: `${minWidth}px`,
  }

  await nextTick()

  const panel = panelRef.value
  if (!panel) return

  const panelRect = panel.getBoundingClientRect()
  const maxLeft = window.innerWidth - panelRect.width - VIEWPORT_PADDING

  if (panelRect.right > window.innerWidth - VIEWPORT_PADDING) {
    left = Math.max(VIEWPORT_PADDING, Math.min(rect.right - panelRect.width, maxLeft))
  }

  if (left < VIEWPORT_PADDING) {
    left = VIEWPORT_PADDING
  }

  if (panelRect.bottom > window.innerHeight - VIEWPORT_PADDING) {
    top = Math.max(VIEWPORT_PADDING, rect.top - panelRect.height - 6)
  }

  panelStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
    minWidth: `${minWidth}px`,
  }
}

function toggleOpen(): void {
  if (props.disabled) return
  emit('update:open', !props.open)
}

function close(): void {
  if (props.open) emit('update:open', false)
}

function clearFilter(): void {
  const next = { ...filters.value }
  delete next[props.column.key]
  filters.value = next
}

function onDocumentClick(event: MouseEvent): void {
  if (!props.open) return
  const target = event.target as Node
  if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return
  close()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.open) close()
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) await updatePanelPosition()
  },
)

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', updatePanelPosition)
  window.addEventListener('scroll', updatePanelPosition, true)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', updatePanelPosition)
  window.removeEventListener('scroll', updatePanelPosition, true)
})
</script>

<template>
  <button
    ref="triggerRef"
    type="button"
    :class="
      cn(
        'inline-flex size-7 shrink-0 items-center justify-center rounded-md transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isActive
          ? 'bg-primary/15 text-primary shadow-[0_0_10px_rgba(0,212,255,0.25)]'
          : 'text-muted-foreground/70 hover:bg-accent hover:text-foreground',
        disabled && 'cursor-not-allowed opacity-50',
      )
    "
    :disabled="disabled"
    :aria-label="filterAriaLabel"
    :aria-expanded="open"
    @click.stop="toggleOpen"
  >
    <ListFilter :size="14" aria-hidden="true" />
  </button>

  <Teleport to="body">
    <div
      v-if="open"
      ref="panelRef"
      class="fixed z-[9999] max-w-[calc(100vw-1rem)] rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
      :style="panelStyle"
      @click.stop
    >
      <div class="mb-3 flex items-center justify-between gap-3">
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {{ filterTitle }}
        </p>
        <button
          v-if="isActive"
          type="button"
          class="text-xs font-medium text-primary transition-opacity hover:opacity-80"
          @click="clearFilter"
        >
          {{ labels.filterClear }}
        </button>
      </div>

      <DataTableColumnFilter
        v-model="filters"
        :column="column"
        :disabled="disabled"
        :labels="labels"
        :locale="locale"
        layout="popover"
      />
    </div>
  </Teleport>
</template>
