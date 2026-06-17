<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

export interface PaginationProps {
  total: number
  pageSize: number
  currentPage: number
  class?: string
}

const props = withDefaults(defineProps<PaginationProps>(), {
  currentPage: 1,
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

const visiblePages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = props.currentPage

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }

  pages.push(1)

  if (current > 3) pages.push(-1)

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push(-1)

  pages.push(total)

  return pages
})

const showPagination = computed(() => props.total > props.pageSize)

function goToPage(page: number): void {
  if (page < 1 || page > totalPages.value || page === props.currentPage) return
  emit('update:currentPage', page)
}

function pageButtonClass(isActive: boolean): string {
  return cn(
    'inline-flex size-8 items-center justify-center rounded-md text-xs font-medium transition-colors sm:size-9 sm:text-sm',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    isActive
      ? 'bg-primary text-primary-foreground shadow-[0_0_12px_rgba(0,212,255,0.35)]'
      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
  )
}
</script>

<template>
  <nav
    v-if="showPagination"
    role="navigation"
    aria-label="pagination"
    :class="cn('flex w-auto items-center', props.class)"
  >
    <ul class="flex flex-row items-center gap-1">
      <li>
        <button
          type="button"
          :class="pageButtonClass(false)"
          :disabled="currentPage <= 1"
          aria-label="Go to first page"
          @click="goToPage(1)"
        >
          «
        </button>
      </li>
      <li>
        <button
          type="button"
          :class="pageButtonClass(false)"
          :disabled="currentPage <= 1"
          aria-label="Go to previous page"
          @click="goToPage(currentPage - 1)"
        >
          ‹
        </button>
      </li>
      <li v-for="(page, index) in visiblePages" :key="`${page}-${index}`">
        <span
          v-if="page === -1"
          class="flex size-8 items-center justify-center text-muted-foreground sm:size-9"
          aria-hidden="true"
        >
          …
        </span>
        <button
          v-else
          type="button"
          :class="pageButtonClass(page === currentPage)"
          :aria-current="page === currentPage ? 'page' : undefined"
          :aria-label="`Go to page ${page}`"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </li>
      <li>
        <button
          type="button"
          :class="pageButtonClass(false)"
          :disabled="currentPage >= totalPages"
          aria-label="Go to next page"
          @click="goToPage(currentPage + 1)"
        >
          ›
        </button>
      </li>
      <li>
        <button
          type="button"
          :class="pageButtonClass(false)"
          :disabled="currentPage >= totalPages"
          aria-label="Go to last page"
          @click="goToPage(totalPages)"
        >
          »
        </button>
      </li>
    </ul>
  </nav>
</template>
