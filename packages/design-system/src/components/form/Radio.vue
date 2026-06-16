<script setup lang="ts">
import { computed, inject } from 'vue'
import { cn } from '@/lib/utils'
import { RADIO_GROUP_KEY } from './radioGroupContext'

export interface RadioProps {
  modelValue?: string | number
  value: string | number
  name?: string
  disabled?: boolean
  id?: string
  class?: string
}

const props = defineProps<RadioProps>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const group = inject(RADIO_GROUP_KEY, null)

const groupName = computed(() => group?.name ?? props.name ?? '')
const isDisabled = computed(() => props.disabled || group?.disabled.value || false)

const isChecked = computed(() => {
  const current = group?.modelValue.value ?? props.modelValue
  return current === props.value
})

function onChange(): void {
  if (isDisabled.value) return
  if (group) {
    group.update(props.value)
  } else {
    emit('update:modelValue', props.value)
  }
}
</script>

<template>
  <label
    :class="cn('inline-flex cursor-pointer items-center gap-2', isDisabled && 'cursor-not-allowed opacity-50', props.class)"
  >
    <input
      :id="id"
      type="radio"
      :name="groupName"
      :value="value"
      :checked="isChecked"
      :disabled="isDisabled"
      class="size-4 shrink-0 border border-border bg-input-background text-primary accent-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed"
      @change="onChange"
    />
    <span v-if="$slots.default" class="text-sm text-foreground">
      <slot />
    </span>
  </label>
</template>
