import { playgroundDemoComponents } from '../designSystemMeta'
import { PACKAGE } from './componentCatalogConstants'
import {
  getComponentCatalogEntry,
  getComponentUsage as getCatalogUsage,
} from './catalog'
import { resolvePlaygroundDemo } from './playgroundAliases'

export { PACKAGE, getComponentCatalogEntry }
export type { ComponentCatalogEntry } from './catalog'

export interface CatalogGroup {
  category: string
  items: string[]
}

export const catalogGroups: CatalogGroup[] = [
  { category: 'Layout', items: ['AppLayout', 'Container', 'Stack', 'Grid'] },
  { category: 'Actions', items: ['Button', 'IconButton', 'Link'] },
  {
    category: 'Forms',
    items: [
      'Input',
      'DateInput',
      'Textarea',
      'Checkbox',
      'Radio',
      'RadioGroup',
      'Switch',
      'Toggle',
      'Select',
      'Label',
      'FormField',
    ],
  },
  {
    category: 'Feedback',
    items: ['Alert', 'Badge', 'Spinner', 'Progress', 'Skeleton', 'Toast', 'ToastHost'],
  },
  {
    category: 'Navigation',
    items: [
      'Tabs',
      'TabList',
      'Tab',
      'TabPanel',
      'Breadcrumb',
      'BreadcrumbItem',
      'Pagination',
      'SidebarMenu',
      'SidebarMenuItem',
      'SidebarMenuGroup',
      'SidebarMenuShell',
    ],
  },
  {
    category: 'Data display',
    items: [
      'Card',
      'Divider',
      'Avatar',
      'AvatarGroup',
      'Lozenge',
      'Table',
      'TableHead',
      'TableBody',
      'TableRow',
      'TableCell',
      'DataTable',
      'DataTableColumnFilter',
      'DataTableColumnFilterMenu',
      'PageSizeSelect',
      'List',
      'ListItem',
      'EmptyState',
    ],
  },
  { category: 'Overlay', items: ['Modal', 'Dialog', 'Tooltip', 'Popover', 'Drawer'] },
]

const playgroundSet = new Set<string>(playgroundDemoComponents)

export function hasPlaygroundDemo(name: string): boolean {
  return playgroundSet.has(resolvePlaygroundDemo(name))
}

export function playgroundDemoName(name: string): string | null {
  const demo = resolvePlaygroundDemo(name)
  return playgroundSet.has(demo) ? demo : null
}

export function getComponentUsage(name: string): string {
  const usage = getCatalogUsage(name)
  if (usage) return usage
  return `<script setup lang="ts">
import { ${name} } from '${PACKAGE}'
<\/script>

<template>
  <${name} />
</template>`
}

export const catalogComponentCount = catalogGroups.reduce((total, group) => total + group.items.length, 0)
