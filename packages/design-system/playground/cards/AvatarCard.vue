<script setup lang="ts">
import { Users } from 'lucide-vue-next'
import PlayCard from '../components/PlayCard.vue'
import { Avatar } from '@/index'

const people = [
  { name: 'Ana Martins', role: 'Design Lead', initials: 'AM', color: '#00D4FF' },
  { name: 'Bruno Silva', role: 'Engineer', initials: 'BS', color: '#2979FF' },
  { name: 'Carla Souza', role: 'PM', initials: 'CS', color: '#00E5B0' },
]
</script>

<template>
  <PlayCard label="Avatar" accent-color="#00E5B0">
    <template #icon><Users :size="14" /></template>
    <div class="space-y-5">
      <div>
        <p class="mb-3 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">group</p>
        <div class="flex -space-x-2">
          <Avatar v-for="p in people" :key="p.name" :name="p.name" size="sm" class="ring-2 ring-[#0D1B2E]" />
          <span
            class="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground ring-2 ring-[#0D1B2E]"
          >
            +8
          </span>
        </div>
      </div>
      <div class="space-y-3">
        <div v-for="person in people" :key="person.name" class="flex items-center gap-3">
          <Avatar :name="person.name" size="md" />
          <div>
            <p class="text-xs font-medium text-[#E8EDF5]">{{ person.name }}</p>
            <p class="text-[10px] text-[#4D6A87]">{{ person.role }}</p>
          </div>
        </div>
      </div>
    </div>
  </PlayCard>
</template>
