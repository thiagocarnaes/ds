<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import PageSizeSelect from '@/components/data-display/PageSizeSelect.vue'
import { useDataTableLabels } from '../composables/useUserTableColumns'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { Pagination, Switch } from '@/index'

const { t } = usePlaygroundLocale()
const dataTableLabels = useDataTableLabels()

const pageSizeOptions = [5, 10, 25, 50] as const

const currentPage = ref(3)
const pageSize = ref(10)
const totalRecords = ref(70)
const showTotalRecords = ref(true)
const showPageSize = ref(true)

const totalPages = computed(() => {
  if (totalRecords.value === 0) return 0
  return Math.ceil(totalRecords.value / pageSize.value)
})

watch([pageSize, totalRecords], () => {
  const maxPage = Math.max(1, Math.ceil(totalRecords.value / pageSize.value))
  if (currentPage.value > maxPage) currentPage.value = maxPage
})

const code = computed(() => {
  const hasMeta = showTotalRecords.value || showPageSize.value

  if (!hasMeta) {
    return `<Pagination
  v-model:current-page="currentPage"
  :total="${totalRecords.value}"
  :page-size="${pageSize.value}"
/>`
  }

  const lines = [
    '<div class="flex items-center justify-between gap-4 border-t border-border pt-4">',
    '  <div class="flex items-center gap-4">',
  ]

  if (showTotalRecords.value) {
    lines.push(
      '    <p class="text-sm text-muted-foreground">',
      `      <span class="font-medium text-foreground">${totalRecords.value}</span> records ·`,
      `      <span class="font-medium text-foreground">${totalPages.value}</span> pages`,
      '    </p>',
    )
  }

  if (showPageSize.value) {
    lines.push(
      '    <PageSizeSelect',
      '      v-model="pageSize"',
      '      :options="[5, 10, 25, 50]"',
      '      label="Rows per page"',
      '    />',
    )
  }

  lines.push(
    '  </div>',
    '  <Pagination',
    '    v-model:current-page="currentPage"',
    `    :total="${totalRecords.value}"`,
    `    :page-size="${pageSize.value}"`,
    '  />',
    '</div>',
  )

  return lines.join('\n')
})
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">{{ t('drawer.livePlayground') }}</p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <div
        class="min-h-[8rem] rounded-lg border border-dashed border-border/60 bg-muted/20"
        aria-hidden="true"
      />

      <div class="pg-table-footer">
        <div v-if="showTotalRecords || showPageSize" class="pg-table-footer__meta">
          <p v-if="showTotalRecords" class="text-sm text-muted-foreground">
            <span class="font-medium text-foreground">{{ totalRecords }}</span>
            {{ totalRecords === 1 ? dataTableLabels.record : dataTableLabels.records }}
            ·
            <span class="font-medium text-foreground">{{ totalPages }}</span>
            {{ totalPages === 1 ? dataTableLabels.page : dataTableLabels.pages }}
          </p>
          <PageSizeSelect
            v-if="showPageSize"
            v-model="pageSize"
            :options="[...pageSizeOptions]"
            :label="dataTableLabels.pageSize"
            class="shrink-0"
          />
        </div>

        <div
          class="pg-table-footer__actions"
          :class="{ 'w-full justify-center': !showTotalRecords && !showPageSize }"
        >
          <Pagination
            v-model:current-page="currentPage"
            :total="totalRecords"
            :page-size="pageSize"
            class="shrink-0"
          />
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-4">
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch v-model="showTotalRecords" size="sm" />
          total records
        </label>
        <label class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-[#4D6A87]">
          <Switch v-model="showPageSize" size="sm" />
          rows per page
        </label>
      </div>

      <div>
        <label class="mb-2 block font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
          {{ t('paginationPlayground.totalRecordsLabel', { count: totalRecords }) }}
        </label>
        <input
          v-model.number="totalRecords"
          type="range"
          min="10"
          max="120"
          step="10"
          class="w-full accent-[#00D4FF]"
        />
      </div>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
