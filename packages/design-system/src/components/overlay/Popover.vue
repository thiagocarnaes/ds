<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { cn } from '@/lib/utils'

const open = defineModel<boolean>('open', { default: false })

const props = defineProps<{
  class?: string
}>()

const triggerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

function toggle(): void {
  open.value = !open.value
}

function onDocumentClick(event: MouseEvent): void {
  if (!open.value) {
    return
  }

  const target = event.target as Node

  if (triggerRef.value?.contains(target) || contentRef.value?.contains(target)) {
    return
  }

  open.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<template>
  <span ref="triggerRef" class="relative inline-flex">
    <span @click.stop="toggle">
      <slot name="trigger" />
    </span>

    <div
      v-if="open"
      ref="contentRef"
      :class="
        cn(
          'absolute left-0 top-full z-50 mt-2 min-w-32 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md',
          props.class,
        )
      "
      @click.stop
    >
      <slot name="content" />
    </div>
  </span>
</template>
