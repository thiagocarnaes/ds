<template>
  <span
    class="inline-block size-1.5 animate-pulse rounded-full"
    :style="{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{ color?: string }>(), { color: '#00D4FF' })
</script>
