<script setup lang="ts">
import { computed, provide, toRef } from 'vue'
import { cn } from '@/lib/utils'
import { RADIO_GROUP_KEY } from './radioGroupContext'

export interface RadioGroupProps {
  modelValue?: string | number
  name: string
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<RadioGroupProps>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

provide(RADIO_GROUP_KEY, {
  modelValue: toRef(props, 'modelValue'),
  name: props.name,
  disabled: toRef(props, 'disabled'),
  update: (value: string | number) => emit('update:modelValue', value),
})

const slotProps = computed(() => ({
  modelValue: props.modelValue,
  name: props.name,
  disabled: props.disabled,
}))
</script>

<template>
  <div
    role="radiogroup"
    :class="cn('flex flex-col gap-2', props.class)"
  >
    <slot v-bind="slotProps" />
  </div>
</template>
