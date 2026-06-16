<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  sections: Array<{ id: string; label: string }>
}>()

const active = defineModel<string>({ required: true })

function scrollTo(id: string): void {
  active.value = id
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <aside
    class="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-border/60 bg-background/95 py-8 pl-6 pr-4 lg:flex"
  >
    <p class="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Playground</p>
    <p class="mb-8 text-sm font-semibold text-foreground">Design System</p>
    <nav class="flex flex-col gap-1">
      <button
        v-for="section in props.sections"
        :key="section.id"
        type="button"
        class="rounded-lg px-3 py-2 text-left text-sm transition-colors"
        :class="
          active === section.id
            ? 'bg-primary/10 font-medium text-primary'
            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
        "
        @click="scrollTo(section.id)"
      >
        {{ section.label }}
      </button>
    </nav>
  </aside>
</template>
