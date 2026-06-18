<script setup lang="ts">
import { computed, inject, onBeforeMount, toValue } from 'vue'
import type { Component } from 'vue'
import { cn } from '@/lib/utils'
import { SIDEBAR_MENU_INJECTION_KEY } from './sidebarMenuContext'
import {
  sidebarMenuChevronClass,
  sidebarMenuIconClass,
  sidebarMenuIconStateClass,
  sidebarMenuLabelClass,
  sidebarMenuStateClass,
  sidebarMenuTriggerClass,
} from './sidebarMenuStyles'

const props = defineProps<{
  id: string
  label: string
  icon?: Component
}>()

const injectedMenu = inject(SIDEBAR_MENU_INJECTION_KEY)

if (!injectedMenu) {
  throw new Error('SidebarMenuItem must be used inside SidebarMenu')
}

const menu = injectedMenu
const active = computed(() => menu.isActive(props.id))

const classes = computed(() =>
  cn(sidebarMenuTriggerClass(), sidebarMenuStateClass(active.value)),
)

const iconClasses = computed(() =>
  cn(
    sidebarMenuIconClass(),
    sidebarMenuIconStateClass(active.value, toValue(menu.collapsed)),
  ),
)

onBeforeMount(() => {
  const isTopLevel = !menu.parentGroupId
  menu.registerMenuItem(props.id, isTopLevel)

  if (menu.parentGroupId) {
    menu.registerGroupItem(menu.parentGroupId, props.id)
  }
})
</script>

<template>
  <button
    type="button"
    :class="classes"
    :title="menu.collapsed.value ? label : undefined"
    :aria-current="active ? 'page' : undefined"
    @click="menu.setActive(id)"
  >
    <span :class="iconClasses">
      <component :is="icon" v-if="icon" :size="16" class="shrink-0" />
    </span>
    <span :class="sidebarMenuLabelClass()">{{ label }}</span>
  </button>
</template>
