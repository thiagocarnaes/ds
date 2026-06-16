<script setup lang="ts">
import Switch from './Switch.vue'

export interface ToggleProps {
  label?: string
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<ToggleProps>(), {
  disabled: false,
})

const modelValue = defineModel<boolean>({ default: false })
</script>

<template>
  <label
    class="flex w-full cursor-pointer items-center justify-between rounded-lg border border-border bg-muted px-4 py-3.5 transition-colors"
    :class="props.class"
  >
    <span class="text-sm text-foreground"><slot>{{ label }}</slot></span>
    <Switch v-model="modelValue" :disabled="disabled" />
  </label>
</template>
