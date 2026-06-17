<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'
import GlowDot from './GlowDot.vue'
import DrawerPlayground from './DrawerPlayground.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'

const props = defineProps<{ name: string | null }>()
const open = defineModel<boolean>('open', { default: false })
const { messages, t } = usePlaygroundLocale()

const description = computed(() => {
  if (!props.name) return ''
  return messages.value.drawer.descriptions[props.name] ?? ''
})

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
        class="ds-slide-in absolute right-0 top-0 flex h-full w-1/2 flex-col overflow-hidden"
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
              <span class="pg-text-muted font-mono text-[10px] uppercase tracking-wider">{{ t('drawer.component') }}</span>
            </div>
            <h2 class="text-xl font-bold" style="color: var(--pg-text)">{{ name }}</h2>
            <p v-if="description" class="pg-text-muted mt-1 text-xs leading-relaxed">
              {{ description }}
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
