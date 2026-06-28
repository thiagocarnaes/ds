<script setup lang="ts">
withDefaults(
  defineProps<{
    id?: string
    as?: string
  }>(),
  {
    as: 'h2',
  },
)
</script>

<template>
  <component :is="as" :id="id" class="text-lg font-semibold text-card-foreground">
    <slot />
  </component>
</template>
