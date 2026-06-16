<script setup lang="ts">
defineProps<{
  id: string
  title: string
  description?: string
}>()
</script>

<template>
  <section :id="id" class="scroll-mt-24">
    <div class="mb-5">
      <h2 class="text-lg font-semibold tracking-tight text-foreground">{{ title }}</h2>
      <p v-if="description" class="mt-1 text-sm text-muted-foreground">{{ description }}</p>
    </div>
    <div
      class="rounded-2xl border border-border/80 bg-card/60 p-6 shadow-lg backdrop-blur-sm"
      style="box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03)"
    >
      <slot />
    </div>
  </section>
</template>
