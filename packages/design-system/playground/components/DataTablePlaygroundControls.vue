<script setup lang="ts">
import { Switch } from '@/index'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { propTemplateBinding } from '../utils/propTemplateName'

defineProps<{
  showSearch: boolean
  showSort: boolean
  showColumnFilter: boolean
  showTotalRecords: boolean
  showPageSize: boolean
  striped: boolean
  forceLoading: boolean
  showToolbar: boolean
  forceEmpty: boolean
  searchPlaceholder: string
  emptyTitle: string
  emptyDescription: string
  pageSizePreset: 'default' | 'compact'
}>()

defineEmits<{
  'update:showSearch': [value: boolean]
  'update:showSort': [value: boolean]
  'update:showColumnFilter': [value: boolean]
  'update:showTotalRecords': [value: boolean]
  'update:showPageSize': [value: boolean]
  'update:striped': [value: boolean]
  'update:forceLoading': [value: boolean]
  'update:showToolbar': [value: boolean]
  'update:forceEmpty': [value: boolean]
  'update:searchPlaceholder': [value: string]
  'update:emptyTitle': [value: string]
  'update:emptyDescription': [value: string]
  'update:pageSizePreset': [value: 'default' | 'compact']
}>()

const { t } = usePlaygroundLocale()

function optionStyle(active: boolean) {
  return active
    ? { background: 'rgba(41,121,255,0.15)', color: '#2979FF' }
    : { color: '#4D6A87' }
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
        {{ t('dataTable.controls.features') }}
      </p>
      <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch :model-value="showSearch" size="sm" @update:model-value="$emit('update:showSearch', $event)" />
          {{ propTemplateBinding('searchable') }}
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch :model-value="showSort" size="sm" @update:model-value="$emit('update:showSort', $event)" />
          sort
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch
            :model-value="showColumnFilter"
            size="sm"
            @update:model-value="$emit('update:showColumnFilter', $event)"
          />
          column filter
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch
            :model-value="showTotalRecords"
            size="sm"
            @update:model-value="$emit('update:showTotalRecords', $event)"
          />
          {{ propTemplateBinding('showTotalRecords') }}
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch :model-value="showPageSize" size="sm" @update:model-value="$emit('update:showPageSize', $event)" />
          {{ propTemplateBinding('showPageSize') }}
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch :model-value="striped" size="sm" @update:model-value="$emit('update:striped', $event)" />
          {{ propTemplateBinding('striped') }}
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch :model-value="forceLoading" size="sm" @update:model-value="$emit('update:forceLoading', $event)" />
          {{ propTemplateBinding('loading') }}
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch :model-value="showToolbar" size="sm" @update:model-value="$emit('update:showToolbar', $event)" />
          toolbar slot
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch :model-value="forceEmpty" size="sm" @update:model-value="$emit('update:forceEmpty', $event)" />
          empty state
        </label>
      </div>
    </div>

    <div>
      <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
        {{ t('dataTable.controls.pageSizeOptions') }}
      </p>
      <div class="flex flex-wrap gap-1">
        <button
          type="button"
          class="rounded px-2 py-1 font-mono text-xs"
          :style="optionStyle(pageSizePreset === 'default')"
          @click="$emit('update:pageSizePreset', 'default')"
        >
          [5, 10, 25, 50]
        </button>
        <button
          type="button"
          class="rounded px-2 py-1 font-mono text-xs"
          :style="optionStyle(pageSizePreset === 'compact')"
          @click="$emit('update:pageSizePreset', 'compact')"
        >
          [3, 5, 10]
        </button>
      </div>
    </div>

    <div>
      <p class="mb-2 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
        {{ t('dataTable.controls.textFields') }}
      </p>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label class="mb-1 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
            search-placeholder
          </label>
          <input
            :value="searchPlaceholder"
            type="text"
            class="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
            @input="$emit('update:searchPlaceholder', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div>
          <label class="mb-1 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">empty-title</label>
          <input
            :value="emptyTitle"
            type="text"
            class="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
            :placeholder="t('dataTable.controls.emptyTitlePlaceholder')"
            @input="$emit('update:emptyTitle', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="sm:col-span-2">
          <label class="mb-1 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
            empty-description
          </label>
          <input
            :value="emptyDescription"
            type="text"
            class="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground"
            :placeholder="t('dataTable.controls.emptyDescriptionPlaceholder')"
            @input="$emit('update:emptyDescription', ($event.target as HTMLInputElement).value)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
