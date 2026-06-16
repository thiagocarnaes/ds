<script setup lang="ts">
import { computed } from 'vue'
import Button from './Button.vue'
import { buttonVariants, type ButtonVariants } from './buttonVariants'
import { cn } from '@/lib/utils'

export interface IconButtonProps extends /* @vue-ignore */ ButtonVariants {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  /** Accessible label for icon-only buttons. */
  ariaLabel: string
  disabled?: boolean
  loading?: boolean
  class?: string
}

const props = withDefaults(defineProps<IconButtonProps>(), {
  variant: 'default',
  size: 'icon',
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const classes = computed(() =>
  cn(buttonVariants({ variant: props.variant, size: 'icon' }), props.class),
)
</script>

<template>
  <Button
    :class="classes"
    :variant="props.variant"
    size="icon"
    :disabled="disabled"
    :loading="loading"
    :aria-label="ariaLabel"
    @click="emit('click', $event)"
  >
    <slot />
  </Button>
</template>
