<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'
import GlowDot from './GlowDot.vue'
import DrawerPlayground from './DrawerPlayground.vue'

const props = defineProps<{ name: string | null }>()
const open = defineModel<boolean>('open', { default: false })

const isWidePreview = computed(() => props.name === 'Layout' || props.name === 'DataTable')

const descriptions: Record<string, string> = {
  Button: 'Triggers an event or action. Use appearance to communicate hierarchy.',
  Toggle: 'An on/off switch for binary settings. Action takes immediate effect.',
  Checkbox: 'Allows multiple concurrent selections. Supports indeterminate state.',
  Select: 'Single or multi-select with search filtering from a dropdown list.',
  Badge: 'Displays a numeric value with semantic glow colors.',
  Lozenge: 'Status highlight for quick at-a-glance recognition.',
  Avatar: 'Represents a user or entity. Shows photo or initials fallback.',
  Tabs: 'Groups related content on the same page with switchable panels.',
  Breadcrumbs: 'Shows the user their location within the site hierarchy.',
  Pagination: 'Divides content into pages and lets users navigate between them.',
  DataTable: 'Full datatable with Ctrl+click multi-sort, column filter popovers, pagination, and client or server-side data.',
  Layout: 'Application shell with collapsible header, menu, content, and footer regions.',
  Modal: 'Presents content in an overlay requiring interaction.',
  Spinner: 'Animated indicator while content or data is being fetched.',
  Alert: 'Inline feedback banner that stays in the page layout.',
  Toast: 'Transient notification that auto-dismisses. Use for quick action feedback.',
  'AI Chat': 'Conversational interface with streaming-style responses and suggestion chips.',
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div v-if="open && name" class="fixed inset-0 z-50">
      <div
        class="absolute inset-0 backdrop-blur-sm"
        style="background: var(--pg-drawer-backdrop)"
        @click="open = false"
      />
      <aside
        :class="[
          'ds-slide-in absolute right-0 top-0 flex h-full flex-col overflow-hidden',
          isWidePreview ? 'w-1/2' : 'w-full max-w-lg',
        ]"
        :style="{
          background: 'var(--pg-drawer-bg)',
          borderLeft: '1px solid var(--pg-drawer-border)',
          boxShadow: '-20px 0 60px var(--pg-drawer-shadow)',
        }"
      >
        <div
          class="flex shrink-0 items-center justify-between px-6 py-5"
          style="border-bottom: 1px solid var(--pg-border)"
        >
          <div>
            <div class="mb-0.5 flex items-center gap-2">
              <GlowDot />
              <span class="pg-text-muted font-mono text-[10px] uppercase tracking-wider">Component</span>
            </div>
            <h2 class="text-xl font-bold" style="color: var(--pg-text)">{{ name }}</h2>
            <p v-if="descriptions[name]" class="pg-text-muted mt-1 text-xs leading-relaxed">
              {{ descriptions[name] }}
            </p>
          </div>
          <button
            type="button"
            class="pg-text-muted rounded-lg p-2 transition-colors hover:bg-black/5 hover:text-[var(--pg-text)] dark:hover:bg-white/5"
            @click="open = false"
          >
            <X :size="16" />
          </button>
        </div>
        <div class="playground-scroll flex-1 overflow-y-auto overflow-x-hidden px-6 py-6">
          <DrawerPlayground :name="name" />
        </div>
      </aside>
    </div>
  </Teleport>
</template>
