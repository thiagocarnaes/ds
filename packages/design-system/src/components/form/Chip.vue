<script setup lang="ts">
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import { formInputVariants, type FormInputVariants } from './formInputVariants'
import Lozenge from '../data-display/Lozenge.vue'

export interface ChipProps extends /* @vue-ignore */ FormInputVariants {
  size?: FormInputVariants['size']
  modelValue?: string[]
  placeholder?: string
  disabled?: boolean
  error?: boolean
  message?: string
  variant?: 'default' | 'success' | 'danger' | 'progress' | 'warning' | 'new'
  id?: string
  class?: string
}

const props = withDefaults(defineProps<ChipProps>(), {
  modelValue: () => [],
  disabled: false,
  error: false,
  size: 'md',
  variant: 'progress',
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const inputValue = ref('')

const classes = computed(() =>
  cn(
    formInputVariants({
      size: props.size,
      error: props.error,
    }),
    props.class,
  ),
)

function addChip(value: string): void {
  const trimmedValue = value.trim()
  if (trimmedValue && !props.modelValue.includes(trimmedValue)) {
    emit('update:modelValue', [...props.modelValue, trimmedValue])
    inputValue.value = ''
  }
}

function removeChip(index: number): void {
  const newChips = props.modelValue.filter((_, i) => i !== index)
  emit('update:modelValue', newChips)
}

function handleKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    event.preventDefault()
    addChip(inputValue.value)
  } else if (event.key === 'Backspace' && !inputValue.value && props.modelValue.length > 0) {
    removeChip(props.modelValue.length - 1)
  }
}
</script>

<template>
  <div class="w-full">
    <div
      class="flex flex-wrap gap-2 items-center rounded-md border bg-input-background transition-colors"
      :class="[
        {
          'border-destructive bg-destructive/5': props.error,
          'border-border': !props.error,
          'opacity-50 cursor-not-allowed': props.disabled,
          'min-h-8 px-2 py-1.5': props.size === 'sm',
          'min-h-9 px-3 py-2': props.size === 'md',
          'min-h-10 px-4 py-2.5': props.size === 'lg',
        },
      ]"
    >
      <!-- Chips -->
      <Lozenge
        v-for="(chip, index) in props.modelValue"
        :key="index"
        :variant="props.variant"
        class="inline-flex items-center gap-2 flex-shrink-0"
      >
        <span :class="{ 'text-xs': props.size === 'sm', 'text-sm': props.size === 'md', 'text-base': props.size === 'lg' }">{{ chip }}</span>
        <button
          type="button"
          :disabled="props.disabled"
          @click="removeChip(index)"
          class="ml-1 -mr-1 inline-flex items-center justify-center rounded-full cursor-pointer transition-colors disabled:cursor-not-allowed bg-black/10 hover:bg-black/30"
          :class="{ 
            'w-4 h-4': props.size === 'sm',
            'w-5 h-5': props.size === 'md',
            'w-6 h-6': props.size === 'lg'
          }"
          :aria-label="`Remove ${chip}`"
        >
          <span :style="{ fontSize: props.size === 'sm' ? '0.75rem' : props.size === 'md' ? '1rem' : '1.5rem' }" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; line-height: 1">×</span>
        </button>
      </Lozenge>

      <!-- Input -->
      <input
        :id="props.id"
        v-model="inputValue"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        type="text"
        class="flex-1 min-w-[120px] border-0 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
        :class="{ 'text-xs': props.size === 'sm', 'text-sm': props.size === 'md', 'text-base': props.size === 'lg' }"
        :aria-invalid="props.error || undefined"
        :aria-describedby="props.error && props.message ? `${props.id}-error` : undefined"
        @keydown="handleKeyDown"
        @keyup.enter="addChip(inputValue)"
      />
    </div>

    <p
      v-if="props.error && props.message"
      :id="props.id ? `${props.id}-error` : undefined"
      class="mt-1.5 text-sm text-destructive"
    >
      {{ props.message }}
    </p>
  </div>
</template>
