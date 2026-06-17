<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { ListFilter } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import DataTableColumnFilter from './DataTableColumnFilter.vue'
import type { DataTableColumn, DataTableColumnFilters } from './dataTableTypes'
import { isColumnFilterActive } from './dataTableUtils'

const props = defineProps<{
  column: DataTableColumn
  disabled?: boolean
}>()

const filters = defineModel<DataTableColumnFilters>({ required: true })

const open = ref(false)
const triggerRef = ref<HTMLButtonElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const panelStyle = ref({ top: '0px', left: '0px', minWidth: '12rem' })

const isActive = computed(() => isColumnFilterActive(props.column, filters.value[props.column.key]))

function updatePanelPosition(): void {
  if (!triggerRef.value) return
  const rect = triggerRef.value.getBoundingClientRect()
  panelStyle.value = {
    top: `${rect.bottom + 6}px`,
    left: `${rect.left}px`,
    minWidth: `${Math.max(rect.width, 192)}px`,
  }
}

function toggleOpen(): void {
  if (props.disabled) return
  open.value = !open.value
}

function clearFilter(): void {
  const next = { ...filters.value }
  delete next[props.column.key]
  filters.value = next
}

function onDocumentClick(event: MouseEvent): void {
  if (!open.value) return
  const target = event.target as Node
  if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return
  open.value = false
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && open.value) open.value = false
}

watch(open, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    updatePanelPosition()
  }
})

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
    :aria-label="`Filter ${column.label}`"
    :aria-expanded="open"
    @click.stop="toggleOpen"
  >
    <ListFilter :size="14" aria-hidden="true" />
  </button>

  <Teleport to="body">
    <div
      v-if="open"
      ref="panelRef"
      class="fixed z-[9999] rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
      :style="panelStyle"
      @click.stop
    >
      <div class="mb-3 flex items-center justify-between gap-3">
        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Filter {{ column.label }}
        </p>
        <button
          v-if="isActive"
          type="button"
          class="text-xs font-medium text-primary transition-opacity hover:opacity-80"
          @click="clearFilter"
        >
          Clear
        </button>
      </div>

      <DataTableColumnFilter
        v-model="filters"
        :column="column"
        :disabled="disabled"
        layout="popover"
      />
    </div>
  </Teleport>
</template>
