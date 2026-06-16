<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { buttonVariants, type ButtonVariants } from './buttonVariants'
import { buttonIcons, type ButtonIconName } from '@/icons/iconography'

export interface ButtonProps extends /* @vue-ignore */ ButtonVariants {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  /** Visual style alias matching Figma appearances. */
  appearance?: 'primary' | 'ghost' | 'outline' | 'danger' | 'default' | 'secondary' | 'destructive' | 'link'
  /** Leading icon by name. */
  icon?: ButtonIconName
  /** Native button type. */
  type?: 'button' | 'submit' | 'reset'
  /** Disables interaction. */
  disabled?: boolean
  /** Shows loading spinner and disables clicks. */
  loading?: boolean
  /** Additional CSS classes. */
  class?: string
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  variant: 'default',
  size: 'default',
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const resolvedVariant = computed(() => {
  if (props.appearance === 'danger') return 'destructive'
  if (props.appearance) return props.appearance === 'primary' ? 'primary' : props.appearance
  return props.variant
})

const resolvedSize = computed(() => (props.size === 'default' ? 'default' : props.size))

const iconSize = computed(() => {
  if (props.size === 'sm') return 10
  if (props.size === 'lg') return 14
  return 12
})

const iconComponent = computed(() => (props.icon ? buttonIcons[props.icon] : undefined))

const classes = computed(() =>
  cn(buttonVariants({ variant: resolvedVariant.value, size: resolvedSize.value }), props.class),
)

function onClick(event: MouseEvent): void {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<template>
  <button
    :type="type"
    :class="classes"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    v-bind="$attrs"
    @click="onClick"
  >
    <span
      v-if="loading"
      class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
    <component :is="iconComponent" v-if="iconComponent" :size="iconSize" aria-hidden="true" />
    <slot />
  </button>
</template>
