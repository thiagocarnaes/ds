<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import Avatar, { type AvatarSize } from './Avatar.vue'

export interface AvatarGroupMember {
  name: string
}

export interface AvatarGroupProps {
  members: AvatarGroupMember[]
  max?: number
  size?: AvatarSize
  class?: string
}

const props = withDefaults(defineProps<AvatarGroupProps>(), {
  max: 4,
  size: 'md',
})

const visible = computed(() => props.members.slice(0, props.max))
const overflow = computed(() => Math.max(0, props.members.length - props.max))

const overflowSizeClasses: Record<AvatarSize, string> = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-14 text-lg',
}
</script>

<template>
  <div :class="cn('flex items-center', props.class)">
    <div class="flex -space-x-2">
      <Avatar
        v-for="member in visible"
        :key="member.name"
        :name="member.name"
        :size="size"
        class="ring-2 ring-[#0D1B2E]"
      />
    </div>
    <span
      v-if="overflow > 0"
      :class="
        cn(
          'ml-1 inline-flex items-center justify-center rounded-full bg-[#1E3A5A] font-medium text-[#7BA3C8] ring-2 ring-[#0D1B2E]',
          overflowSizeClasses[size],
        )
      "
    >
      +{{ overflow }}
    </span>
  </div>
</template>
