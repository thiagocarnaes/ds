<script setup lang="ts">
import { computed } from 'vue'
import Input from '@/components/form/Input.vue'
import Select from '@/components/form/Select.vue'
import type {
  DataTableColumn,
  DataTableColumnFilters,
  DataTableDateRangeFilter,
} from './dataTableTypes'

const props = withDefaults(
  defineProps<{
    column: DataTableColumn
    disabled?: boolean
    layout?: 'inline' | 'popover'
  }>(),
  { layout: 'inline' },
)

const filters = defineModel<DataTableColumnFilters>({ required: true })

function patchFilter(value: DataTableColumnFilters[string]): void {
  const next = { ...filters.value }

  if (
    value == null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' &&
      !Array.isArray(value) &&
      !(value as DataTableDateRangeFilter).from &&
      !(value as DataTableDateRangeFilter).to)
  ) {
    delete next[props.column.key]
  } else {
    next[props.column.key] = value
  }

  filters.value = next
}

const textValue = computed({
  get: () => (filters.value[props.column.key] as string) ?? '',
  set: (value: string) => patchFilter(value),
})

const dateFrom = computed({
  get: () => {
    const current = filters.value[props.column.key]
    return typeof current === 'object' && current != null && !Array.isArray(current)
      ? current.from
      : ''
  },
  set: (from: string) => {
    const current = filters.value[props.column.key]
    const to =
      typeof current === 'object' && current != null && !Array.isArray(current) ? current.to : ''
    patchFilter({ from, to })
  },
})

const dateTo = computed({
  get: () => {
    const current = filters.value[props.column.key]
    return typeof current === 'object' && current != null && !Array.isArray(current)
      ? current.to
      : ''
  },
  set: (to: string) => {
    const current = filters.value[props.column.key]
    const from =
      typeof current === 'object' && current != null && !Array.isArray(current) ? current.from : ''
    patchFilter({ from, to })
  },
})

const enumValue = computed({
  get: () => {
    const current = filters.value[props.column.key]
    return Array.isArray(current) ? current : []
  },
  set: (value: string | string[]) => {
    patchFilter(Array.isArray(value) ? value : value ? [value] : [])
  },
})

const enumOptions = computed(() =>
  (props.column.filterOptions ?? []).map((option) => ({
    label: option.label,
    value: option.value,
  })),
)
</script>

<template>
  <div v-if="column.filter === 'text'" :class="layout === 'popover' ? 'min-w-[12rem]' : 'min-w-[7rem]'">
    <Input
      v-model="textValue"
      size="sm"
      :disabled="disabled"
      :placeholder="`Filter ${column.label.toLowerCase()}…`"
      :aria-label="`Filter ${column.label}`"
    />
  </div>

  <div
    v-else-if="column.filter === 'date'"
    :class="layout === 'popover' ? 'flex min-w-[12rem] flex-col gap-2' : 'flex min-w-[12rem] flex-col gap-1.5'"
  >
    <label class="flex flex-col gap-1">
      <span class="text-[11px] text-muted-foreground">From</span>
      <Input
        v-model="dateFrom"
        type="date"
        size="sm"
        :disabled="disabled"
        aria-label="Filter from date"
      />
    </label>
    <label class="flex flex-col gap-1">
      <span class="text-[11px] text-muted-foreground">To</span>
      <Input
        v-model="dateTo"
        type="date"
        size="sm"
        :disabled="disabled"
        aria-label="Filter to date"
      />
    </label>
  </div>

  <div v-else-if="column.filter === 'enum'" :class="layout === 'popover' ? 'min-w-[12rem]' : 'min-w-[8rem]'">
    <Select
      v-model="enumValue"
      :options="enumOptions"
      multiple
      :searchable="false"
      :disabled="disabled"
      :placeholder="`All ${column.label.toLowerCase()}`"
      class="w-full"
      :aria-label="`Filter ${column.label}`"
    />
  </div>
</template>
