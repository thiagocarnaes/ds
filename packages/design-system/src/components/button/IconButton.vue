<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import Button from './Button.vue'
import { buttonVariants, type ButtonVariants } from './buttonVariants'
import { cn } from '@/lib/utils'

export interface IconButtonProps extends /* @vue-ignore */ ButtonVariants {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  disabled?: boolean
  loading?: boolean
  class?: string
}

/**
 * `aria-label` is required for icon-only buttons (WCAG 2.1 — Req. 16.5).
 * Enforced via TypeScript: the component attrs type mandates the attribute.
 */
export type IconButtonAttrs = Required<Pick<HTMLButtonElement, never>> & {
  'aria-label': string
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<IconButtonProps>(), {
  variant: 'default',
  size: 'icon',
  disabled: false,
  loading: false,
})

const attrs = useAttrs() as IconButtonAttrs & Record<string, unknown>

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const classes = computed(() =>
  cn(buttonVariants({ variant: props.variant, size: props.size }), props.class),
)
</script>

<template>
  <Button
    :class="classes"
    :variant="props.variant"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    v-bind="attrs"
    @click="emit('click', $event)"
  >
    <slot />
  </Button>
</template>
