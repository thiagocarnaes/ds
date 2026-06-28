<script setup lang="ts">
interface ButtonGroupProps {
  /** Accessible label for the button group. */
  label?: string
}

defineProps<ButtonGroupProps>()
</script>

<template>
  <div
    class="inline-flex items-center gap-[--ds-space-100]"
    :aria-label="label"
  >
    <slot />
  </div>
</template>
