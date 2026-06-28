<script setup lang="ts">
defineProps<{
  hasCloseButton?: boolean
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
    <slot />
    <button
      v-if="hasCloseButton"
      type="button"
      aria-label="Fechar"
      class="ml-2 inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-[--ds-color-bg-hovered] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      @click="emit('close')"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  </div>
</template>
