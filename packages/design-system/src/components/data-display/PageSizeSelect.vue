<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import Select from '@/components/form/Select.vue'

export interface PageSizeSelectProps {
  options?: number[]
  label?: string
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<PageSizeSelectProps>(), {
  options: () => [5, 10, 25, 50],
  label: 'Rows per page',
  disabled: false,
})

const pageSize = defineModel<number>({ default: 10 })

const selectOptions = computed(() =>
  props.options.map((value) => ({
    label: String(value),
    value: String(value),
  })),
)

const selectValue = computed({
  get: () => String(pageSize.value),
  set: (value: string) => {
    pageSize.value = Number(value)
  },
})
</script>

<template>
  <div :class="cn('flex items-center gap-2 whitespace-nowrap', props.class)">
    <label class="text-sm text-muted-foreground">{{ label }}</label>
    <Select
      v-model="selectValue"
      :options="selectOptions"
      :searchable="false"
      :disabled="disabled"
      class="w-[4.5rem] shrink-0"
      aria-label="Rows per page"
    />
  </div>
</template>
