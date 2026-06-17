import { playgroundDemoComponents } from '../designSystemMeta'
import { resolvePlaygroundDemo } from './playgroundAliases'

export const PACKAGE = '@tcarnaes/design-system'

export interface CatalogGroup {
  category: string
  items: string[]
}

export const catalogGroups: CatalogGroup[] = [
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
  { category: 'Layout', items: ['Container', 'Stack', 'Grid', 'AppLayout'] },
]

const playgroundSet = new Set<string>(playgroundDemoComponents)

export function hasPlaygroundDemo(name: string): boolean {
  return playgroundSet.has(resolvePlaygroundDemo(name))
}

export function playgroundDemoName(name: string): string | null {
  const demo = resolvePlaygroundDemo(name)
  return playgroundSet.has(demo) ? demo : null
}

function usage(name: string, template: string): string {
  return `<script setup lang="ts">
import { ${name} } from '${PACKAGE}'
<\/script>

<template>
${template}
</template>`
}

const usageSnippets: Record<string, string> = {
  Button: usage('Button', '  <Button appearance="primary">Save</Button>'),
  IconButton: usage('IconButton', '  <IconButton aria-label="Settings" icon="settings" />'),
  Link: usage('Link', '  <Link href="/docs">Documentation</Link>'),
  Input: usage(
    'Input',
    `  <Input v-model="email" type="email" placeholder="you@company.com" />`,
  ),
  DateInput: usage('DateInput', '  <DateInput v-model="date" locale="pt-BR" />'),
  Textarea: usage('Textarea', '  <Textarea v-model="notes" placeholder="Add a note…" />'),
  Checkbox: usage('Checkbox', '  <Checkbox v-model="accepted" label="Accept terms" />'),
  Radio: usage('Radio', '  <Radio v-model="plan" value="pro" label="Pro" />'),
  RadioGroup: `<script setup lang="ts">
import { Radio, RadioGroup } from '${PACKAGE}'
<\/script>

<template>
  <RadioGroup v-model="plan">
    <Radio value="basic" label="Basic" />
    <Radio value="pro" label="Pro" />
  </RadioGroup>
</template>`,
  Switch: usage('Switch', '  <Switch v-model="enabled" label="Enable alerts" />'),
  Toggle: usage('Toggle', '  <Toggle v-model="enabled" label="Dark mode" />'),
  Select: usage(
    'Select',
    `  <Select
    v-model="role"
    :options="[
      { label: 'Designer', value: 'designer' },
      { label: 'Engineer', value: 'engineer' },
    ]"
  />`,
  ),
  Label: usage('Label', '  <Label for="email">Email</Label>'),
  FormField: `<script setup lang="ts">
import { Mail } from 'lucide-vue-next'
import { FormField, Input } from '${PACKAGE}'
<\/script>

<template>
  <FormField label="Email" helper="Work email only" required>
    <template #default="{ id }">
      <div class="relative">
        <Mail
          :size="14"
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input :id="id" v-model="email" type="email" class="pl-9" />
      </div>
    </template>
  </FormField>
</template>`,
  Alert: usage('Alert', '  <Alert variant="success">Changes saved.</Alert>'),
  Badge: usage('Badge', '  <Badge :value="12" appearance="primary" />'),
  Spinner: usage('Spinner', '  <Spinner size="md" aria-label="Loading" />'),
  Progress: usage('Progress', '  <Progress :value="72" />'),
  Skeleton: usage('Skeleton', '  <Skeleton class="h-8 w-full" />'),
  Toast: usage('Toast', '  <Toast variant="success" title="Saved" />'),
  ToastHost: usage(
    'ToastHost',
    `  <!-- Mount once at app root -->
  <ToastHost />`,
  ),
  Tabs: usage(
    'Tabs',
    `  <Tabs v-model="activeTab">
    <TabList>
      <Tab value="overview">Overview</Tab>
      <Tab value="settings">Settings</Tab>
    </TabList>
    <TabPanel value="overview">Overview content</TabPanel>
    <TabPanel value="settings">Settings content</TabPanel>
  </Tabs>`,
  ),
  TabList: usage('TabList', '  <TabList><Tab value="one">One</Tab></TabList>'),
  Tab: usage('Tab', '  <Tab value="overview">Overview</Tab>'),
  TabPanel: usage('TabPanel', '  <TabPanel value="overview">Panel content</TabPanel>'),
  Breadcrumb: `<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem } from '${PACKAGE}'
<\/script>

<template>
  <Breadcrumb>
    <BreadcrumbItem href="/">Home</BreadcrumbItem>
    <BreadcrumbItem current>Settings</BreadcrumbItem>
  </Breadcrumb>
</template>`,
  BreadcrumbItem: usage('BreadcrumbItem', '  <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>'),
  Pagination: usage(
    'Pagination',
    '  <Pagination v-model:current-page="page" :total="120" :page-size="10" />',
  ),
  SidebarMenu: usage('SidebarMenu', '  <SidebarMenu v-model:active-id="activeId" />'),
  SidebarMenuItem: usage('SidebarMenuItem', '  <SidebarMenuItem id="home" label="Home" />'),
  SidebarMenuGroup: usage(
    'SidebarMenuGroup',
    '  <SidebarMenuGroup id="forms" label="Forms"><SidebarMenuItem id="input" label="Input" /></SidebarMenuGroup>',
  ),
  SidebarMenuShell: usage('SidebarMenuShell', '  <SidebarMenuShell><SidebarMenu /></SidebarMenuShell>'),
  Card: usage('Card', '  <Card><template #header>Title</template>Body</Card>'),
  Divider: usage('Divider', '  <Divider />'),
  Avatar: usage('Avatar', '  <Avatar name="Ana Martins" />'),
  AvatarGroup: usage(
    'AvatarGroup',
    '  <AvatarGroup :avatars="[{ name: \'Ana\' }, { name: \'Bruno\' }]" />',
  ),
  Lozenge: usage('Lozenge', '  <Lozenge appearance="success">Active</Lozenge>'),
  Table: usage(
    'Table',
    `  <Table>
    <TableHead>...</TableHead>
    <TableBody>...</TableBody>
  </Table>`,
  ),
  TableHead: usage('TableHead', '  <TableHead><TableRow><TableCell>Name</TableCell></TableRow></TableHead>'),
  TableBody: usage('TableBody', '  <TableBody><TableRow><TableCell>Ana</TableCell></TableRow></TableBody>'),
  TableRow: usage('TableRow', '  <TableRow><TableCell>Ana</TableCell></TableRow>'),
  TableCell: usage('TableCell', '  <TableCell>Ana</TableCell>'),
  DataTable: usage(
    'DataTable',
    `  <DataTable
    v-model:sort-stack="sortStack"
    v-model:column-filters="columnFilters"
    :columns="columns"
    :rows="rows"
    row-key="id"
  />`,
  ),
  DataTableColumnFilter: usage(
    'DataTableColumnFilter',
    '  <DataTableColumnFilter v-model="filters" :column="column" :labels="labels" />',
  ),
  DataTableColumnFilterMenu: usage(
    'DataTableColumnFilterMenu',
    '  <DataTableColumnFilterMenu v-model="filters" :column="column" :labels="labels" :open="open" />',
  ),
  PageSizeSelect: usage(
    'PageSizeSelect',
    '  <PageSizeSelect v-model="pageSize" :options="[5, 10, 25]" label="Rows per page" />',
  ),
  List: usage('List', '  <List><ListItem>First</ListItem></List>'),
  ListItem: usage('ListItem', '  <ListItem>Notification settings</ListItem>'),
  EmptyState: usage(
    'EmptyState',
    '  <EmptyState title="No results" description="Try adjusting your filters." />',
  ),
  Modal: usage('Modal', '  <Modal v-model:open="open" title="Confirm">Are you sure?</Modal>'),
  Dialog: usage('Dialog', '  <Dialog v-model:open="open" title="Delete item">This cannot be undone.</Dialog>'),
  Tooltip: usage('Tooltip', '  <Tooltip content="Helpful hint"><Button>Hover me</Button></Tooltip>'),
  Popover: usage('Popover', '  <Popover><template #trigger>Open</template>Popover content</Popover>'),
  Drawer: usage('Drawer', '  <Drawer v-model:open="open" title="Details">Drawer content</Drawer>'),
  Container: usage('Container', '  <Container class="py-8">Page content</Container>'),
  Stack: usage('Stack', '  <Stack gap="4"><Input /><Button>Save</Button></Stack>'),
  Grid: usage('Grid', '  <Grid cols="2" gap="4"><Card /><Card /></Grid>'),
  AppLayout: usage(
    'AppLayout',
    `  <AppLayout>
    <template #header>Header</template>
    <template #menu>Menu</template>
    <template #default>Content</template>
    <template #footer>Footer</template>
  </AppLayout>`,
  ),
}

export function getComponentUsage(name: string): string {
  return usageSnippets[name] ?? usage(name, `  <${name} />`)
}

export const catalogComponentCount = catalogGroups.reduce((total, group) => total + group.items.length, 0)
