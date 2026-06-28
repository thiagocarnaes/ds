<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { buttonVariants, type ButtonVariants } from './buttonVariants'
import { buttonIcons, type ButtonIconName } from '@/icons/iconography'
import Tooltip from '@/components/overlay/Tooltip.vue'

export interface ButtonProps extends /* @vue-ignore */ ButtonVariants {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  /** Leading icon by name. */
  icon?: ButtonIconName
  /** Native button type. */
  type?: 'button' | 'submit' | 'reset'
  /** Disables interaction. */
  disabled?: boolean
  /** Shows loading spinner and disables clicks. */
  loading?: boolean
  /** Displays selected state with a ring. */
  isSelected?: boolean
  /** Makes the button fill 100% of its container width. */
  shouldFitContainer?: boolean
  /** Tooltip message shown when button is disabled. */
  tooltip?: string
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
  isSelected: false,
  shouldFitContainer: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const resolvedVariant = computed(() => props.variant)

const resolvedSize = computed(() => (props.size === 'default' ? 'default' : props.size))

const iconSize = computed(() => {
  if (props.size === 'sm') return 10
  if (props.size === 'lg') return 14
  return 12
})

const iconComponent = computed(() => (props.icon ? buttonIcons[props.icon] : undefined))

const classes = computed(() =>
  cn(
    buttonVariants({ variant: resolvedVariant.value, size: resolvedSize.value }),
    props.isSelected && 'ring-2 ring-ring',
    props.shouldFitContainer && 'w-full',
    props.class,
  ),
)

const showTooltip = computed(() => !!props.tooltip && (props.disabled || props.loading))

function onClick(event: MouseEvent): void {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<template>
  <Tooltip v-if="showTooltip" :content="tooltip!">
    <button
      :type="type"
      :class="classes"
      :disabled="disabled || loading"
      :aria-busy="loading || undefined"
      :aria-disabled="disabled || undefined"
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
  </Tooltip>

  <button
    v-else
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
