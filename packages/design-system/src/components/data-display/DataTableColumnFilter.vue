<script setup lang="ts">
import { computed } from 'vue'
import Input from '@/components/form/Input.vue'
import DateInput from '@/components/form/DateInput.vue'
import Select from '@/components/form/Select.vue'
import type {
  DataTableColumn,
  DataTableColumnFilters,
  DataTableDateRangeFilter,
  DataTableLabels,
} from './dataTableTypes'
import { formatDataTableLabel } from './dataTableUtils'

const props = withDefaults(
  defineProps<{
    column: DataTableColumn
    disabled?: boolean
    labels: Required<DataTableLabels>
    locale?: string
    layout?: 'inline' | 'popover'
  }>(),
  { layout: 'inline', locale: 'en' },
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

const filterPlaceholder = computed(() =>
  formatDataTableLabel(props.labels.filterPlaceholder, props.column.label.toLowerCase()),
)

const filterAriaLabel = computed(() =>
  formatDataTableLabel(props.labels.filterAriaLabel, props.column.label),
)

const enumPlaceholder = computed(() =>
  formatDataTableLabel(props.labels.filterEnumAll, props.column.label.toLowerCase()),
)
</script>

<template>
  <div v-if="column.filter === 'text'" :class="layout === 'popover' ? 'min-w-[12rem]' : 'min-w-[7rem]'">
    <Input
      v-model="textValue"
      size="sm"
      :disabled="disabled"
      :placeholder="filterPlaceholder"
      :aria-label="filterAriaLabel"
    />
  </div>

  <div
    v-else-if="column.filter === 'date'"
    :class="layout === 'popover' ? 'flex w-full min-w-[12rem] flex-col gap-2' : 'flex min-w-[12rem] flex-col gap-1.5'"
  >
    <label class="flex w-full flex-col gap-1">
      <span class="text-[11px] text-muted-foreground">{{ labels.filterDateFrom }}</span>
      <DateInput
        v-model="dateFrom"
        size="sm"
        :disabled="disabled"
        :locale="locale"
        :aria-label="labels.filterDateFromAriaLabel"
      />
    </label>
    <label class="flex w-full flex-col gap-1">
      <span class="text-[11px] text-muted-foreground">{{ labels.filterDateTo }}</span>
      <DateInput
        v-model="dateTo"
        size="sm"
        :disabled="disabled"
        :locale="locale"
        :aria-label="labels.filterDateToAriaLabel"
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
      :placeholder="enumPlaceholder"
      class="w-full"
      :aria-label="filterAriaLabel"
    />
  </div>
</template>
