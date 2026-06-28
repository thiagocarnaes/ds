<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { FLAG_GROUP_KEY } from './FlagGroup'

/**
 * FlagGroup — container for Flag notifications.
 *
 * Uses Teleport to mount at body level, positioned fixed top-right.
 * Limits visible flags to MAX_VISIBLE (3); extras wait in a queue.
 *
 * Requirements: 11.1, 11.5, 11.6
 */

const MAX_VISIBLE = 3

// All registered flag IDs in insertion order
const allFlags = ref<string[]>([])

// The currently visible slice (first MAX_VISIBLE entries)
const visibleFlags = computed(() => allFlags.value.slice(0, MAX_VISIBLE))

function register(id: string): void {
  if (!allFlags.value.includes(id)) {
    allFlags.value.push(id)
  }
}

function unregister(id: string): void {
  const idx = allFlags.value.indexOf(id)
  if (idx !== -1) {
    allFlags.value.splice(idx, 1)
  }
}

function isVisible(id: string): boolean {
  return visibleFlags.value.includes(id)
}

provide(FLAG_GROUP_KEY, { register, unregister, isVisible })
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed top-4 right-4 z-[var(--ds-z-notification)] flex flex-col gap-2"
      aria-label="Notificações"
      role="region"
    >
      <slot />
    </div>
  </Teleport>
</template>
