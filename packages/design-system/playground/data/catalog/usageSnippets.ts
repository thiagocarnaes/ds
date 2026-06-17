import { PACKAGE } from '../componentCatalogConstants'

function usage(name: string, template: string): string {
  return `<script setup lang="ts">
import { ${name} } from '${PACKAGE}'
<\/script>

<template>
${template}
</template>`
}

function usageMany(imports: string[], template: string): string {
  return `<script setup lang="ts">
import { ${imports.join(', ')} } from '${PACKAGE}'
<\/script>

<template>
${template}
</template>`
}

export const usageSnippets: Record<string, string> = {
  Button: usage(
    'Button',
    `  <Button
    :variant="'primary'"
    :size="'md'"
    :icon="'save'"
    :disabled="false"
    :loading="false"
  >
    Save
  </Button>`,
  ),
  IconButton: usage(
    'IconButton',
    `  <IconButton :aria-label="'Settings'" :variant="'outline'" :size="'icon'">
    <!-- icon slot -->
  </IconButton>`,
  ),
  Link: usage(
    'Link',
    `  <Link :href="'/docs'" :external="true">
    Documentation
  </Link>`,
  ),
  Input: usage(
    'Input',
    `  <Input
    v-model="email"
    :type="'email'"
    :size="'md'"
    :placeholder="'you@company.com'"
    :error="false"
    :success="false"
    :message="'Helper or validation text'"
    :disabled="false"
  />`,
  ),
  DateInput: usage(
    'DateInput',
    `  <DateInput
    v-model="date"
    :locale="'pt-BR'"
    :placeholder="'Select date'"
    :disabled="false"
  />`,
  ),
  Textarea: usage(
    'Textarea',
    `  <Textarea
    v-model="notes"
    :placeholder="'Add a note…'"
    :disabled="false"
    :error="false"
    :rows="4"
  />`,
  ),
  Checkbox: usage(
    'Checkbox',
    `  <Checkbox
    v-model="accepted"
    :label="'Accept terms'"
    :indeterminate="false"
    :cycle-indeterminate="false"
    :disabled="false"
  />`,
  ),
  Radio: usage(
    'Radio',
    '  <Radio v-model="plan" :value="\'pro\'" :label="\'Pro\'" :disabled="false" />',
  ),
  RadioGroup: usageMany(
    ['Radio', 'RadioGroup'],
    `  <RadioGroup v-model="plan" :disabled="false">
    <Radio :value="'basic'" :label="'Basic'" />
    <Radio :value="'pro'" :label="'Pro'" />
  </RadioGroup>`,
  ),
  Switch: usage(
    'Switch',
    `  <label class="flex items-center gap-2">
    <Switch v-model="enabled" :size="'md'" :disabled="false" />
    Enable alerts
  </label>`,
  ),
  Toggle: usage(
    'Toggle',
    `  <Toggle
    v-model="enabled"
    :label="'Dark mode'"
    :disabled="false"
  />`,
  ),
  Select: usage(
    'Select',
    `  <Select
    v-model="role"
    :placeholder="'Choose a role'"
    :options="[
      { label: 'Designer', value: 'designer' },
      { label: 'Engineer', value: 'engineer' },
    ]"
    :multiple="false"
    :searchable="true"
    :disabled="false"
  />`,
  ),
  Label: usage('Label', '  <Label :for="\'email\'" :required="true">Email</Label>'),
  FormField: `<script setup lang="ts">
import { Mail } from 'lucide-vue-next'
import { FormField, Input } from '${PACKAGE}'
<\/script>

<template>
  <FormField
    :label="'Email'"
    :helper="'Work email only'"
    :error="'Invalid email'"
    :success="false"
    :required="true"
  >
    <template #default="{ id }">
      <div class="relative">
        <Mail
          :size="14"
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input :id="id" v-model="email" :type="'email'" class="pl-9" />
      </div>
    </template>
  </FormField>
</template>`,
  Alert: usage(
    'Alert',
    `  <Alert :variant="'success'" :dismissible="true">
    Changes saved successfully.
  </Alert>`,
  ),
  Badge: usage(
    'Badge',
    `  <Badge
    :value="12"
    :variant="'primary'"
    :size="'md'"
  />`,
  ),
  Spinner: usage(
    'Spinner',
    `  <Spinner
    :size="'md'"
    :color="'#00D4FF'"
    :glow="true"
    :aria-label="'Loading'"
  />`,
  ),
  Progress: usageMany(
    ['Progress'],
    `  <!-- Determinate -->
  <Progress :value="72" />

  <!-- Indeterminate -->
  <Progress :indeterminate="true" />`,
  ),
  Skeleton: usageMany(
    ['Skeleton'],
    `  <Skeleton class="size-12 rounded-full" />
  <Skeleton class="h-4 w-2/3" />
  <Skeleton class="h-24 w-full rounded-lg" />`,
  ),
  Toast: `<script setup lang="ts">
import { Button, Toast, ToastHost, useToast } from '${PACKAGE}'

const toast = useToast()

function onSave() {
  toast.success('Changes saved.', {
    position: 'top-right',
    dismissible: true,
  })
}
<\/script>

<template>
  <ToastHost />
  <Button :variant="'primary'" @click="onSave">Save</Button>
</template>

<!-- Standalone Toast markup (ToastHost renders these via useToast) -->
<!--
<Toast :variant="'success'" :dismissible="true">
  Changes saved.
</Toast>
-->

// trigger live notification
toast.success('Changes saved.', {
  position: 'top-right',
  dismissible: true,
})`,
  ToastHost: `<script setup lang="ts">
import { Button, ToastHost, useToast } from '${PACKAGE}'

const toast = useToast()
<\/script>

<template>
  <!-- Mount once at app root -->
  <ToastHost />
  <Button :variant="'primary'" @click="toast.info('Hello', { position: 'top-right' })">
    Show toast
  </Button>
</template>

// trigger live notification
toast.info('Hello', { position: 'top-right', dismissible: true })`,
  Tabs: usageMany(
    ['Tab', 'TabList', 'TabPanel', 'Tabs'],
    `  <Tabs v-model="activeTab">
    <TabList>
      <Tab :value="'overview'">Overview</Tab>
      <Tab :value="'settings'">Settings</Tab>
    </TabList>
    <TabPanel :value="'overview'">Overview content</TabPanel>
    <TabPanel :value="'settings'">Settings content</TabPanel>
  </Tabs>`,
  ),
  TabList: usageMany(['Tab', 'TabList'], '  <TabList><Tab :value="\'one\'">One</Tab></TabList>'),
  Tab: usage('Tab', '  <Tab :value="\'overview\'">Overview</Tab>'),
  TabPanel: usage('TabPanel', '  <TabPanel :value="\'overview\'">Panel content</TabPanel>'),
  Breadcrumb: usageMany(
    ['Breadcrumb', 'BreadcrumbItem'],
    `  <Breadcrumb :separator="'/'">
    <BreadcrumbItem :href="'/'">Home</BreadcrumbItem>
    <BreadcrumbItem :href="'/projects'">Projects</BreadcrumbItem>
    <BreadcrumbItem :current="true">Settings</BreadcrumbItem>
  </Breadcrumb>`,
  ),
  BreadcrumbItem: usage(
    'BreadcrumbItem',
    '  <BreadcrumbItem :href="\'/projects\'">Projects</BreadcrumbItem>',
  ),
  Pagination: usageMany(
    ['PageSizeSelect', 'Pagination'],
    `  <Pagination
    v-model:current-page="page"
    :total="120"
    :page-size="10"
  />

  <PageSizeSelect
    v-model="pageSize"
    :options="[5, 10, 25]"
    :label="'Rows per page'"
  />`,
  ),
  SidebarMenu: usage(
    'SidebarMenu',
    `  <SidebarMenu
    v-model:active-id="activeId"
    v-model:open-keys="openKeys"
    :collapsed="false"
  />`,
  ),
  SidebarMenuItem: usage(
    'SidebarMenuItem',
    '  <SidebarMenuItem :id="\'home\'" :label="\'Home\'" :icon="HomeIcon" />',
  ),
  SidebarMenuGroup: usageMany(
    ['SidebarMenuGroup', 'SidebarMenuItem'],
    `  <SidebarMenuGroup :id="'forms'" :label="'Forms'" :default-open="true">
    <SidebarMenuItem :id="'input'" :label="'Input'" />
  </SidebarMenuGroup>`,
  ),
  SidebarMenuShell: usageMany(
    ['SidebarMenu', 'SidebarMenuShell'],
    `  <SidebarMenuShell
    :collapsed="collapsed"
    :menu-label="'Menu'"
    :menu-width="'12rem'"
  >
    <SidebarMenu v-model:active-id="activeId" :collapsed="collapsed" />
  </SidebarMenuShell>`,
  ),
  Card: usage(
    'Card',
    `  <Card :variant="'outlined'">
    <template #header>Title</template>
    Body content
    <template #footer>Footer actions</template>
  </Card>`,
  ),
  Divider: usage('Divider', '  <Divider :orientation="\'horizontal\'" />'),
  Avatar: usage(
    'Avatar',
    `  <Avatar
    :name="'Ana Martins'"
    :size="'md'"
    :src="'/photo.jpg'"
  />`,
  ),
  AvatarGroup: usage(
    'AvatarGroup',
    `  <AvatarGroup
    :members="[{ name: 'Ana' }, { name: 'Bruno' }]"
    :max="4"
    :size="'md'"
  />`,
  ),
  Lozenge: usage(
    'Lozenge',
    `  <Lozenge :variant="'success'" :bold="false">
    Active
  </Lozenge>`,
  ),
  Table: usageMany(
    ['Table', 'TableBody', 'TableCell', 'TableHead', 'TableRow'],
    `  <Table :striped="true">
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow>
        <TableCell>Ana</TableCell>
      </TableRow>
    </TableBody>
  </Table>`,
  ),
  TableHead: usageMany(
    ['TableCell', 'TableHead', 'TableRow'],
    '  <TableHead><TableRow><TableCell>Name</TableCell></TableRow></TableHead>',
  ),
  TableBody: usageMany(
    ['TableBody', 'TableCell', 'TableRow'],
    '  <TableBody><TableRow><TableCell>Ana</TableCell></TableRow></TableBody>',
  ),
  TableRow: usageMany(
    ['TableCell', 'TableRow'],
    '  <TableRow><TableCell>Ana</TableCell></TableRow>',
  ),
  TableCell: usage('TableCell', '  <TableCell>Ana</TableCell>'),
  DataTable: usage(
    'DataTable',
    `  <DataTable
    v-model:current-page="page"
    v-model:page-size="pageSize"
    v-model:sort-stack="sortStack"
    v-model:column-filters="columnFilters"
    v-model:search="search"
    :columns="columns"
    :rows="rows"
    :row-key="'id'"
    :searchable="true"
    :show-total-records="true"
    :show-page-size="true"
    :page-size-options="[5, 10, 25]"
    :loading="loading"
    :server-side="false"
    :striped="true"
  />`,
  ),
  DataTableColumnFilter: usage(
    'DataTableColumnFilter',
    `  <DataTableColumnFilter
    v-model="filters"
    :column="column"
    :labels="labels"
  />`,
  ),
  DataTableColumnFilterMenu: usage(
    'DataTableColumnFilterMenu',
    `  <DataTableColumnFilterMenu
    v-model="filters"
    v-model:open="open"
    :column="column"
    :labels="labels"
  />`,
  ),
  PageSizeSelect: usage(
    'PageSizeSelect',
    '  <PageSizeSelect v-model="pageSize" :options="[5, 10, 25]" :label="\'Rows per page\'" />',
  ),
  List: usageMany(['List', 'ListItem'], '  <List><ListItem>First item</ListItem></List>'),
  ListItem: usage('ListItem', '  <ListItem>Notification settings</ListItem>'),
  EmptyState: usage(
    'EmptyState',
    `  <EmptyState
    :title="'No results'"
    :description="'Try adjusting your filters.'"
  />`,
  ),
  Modal: usageMany(
    ['Button', 'Modal'],
    `  <Button @click="open = true">Open modal</Button>

  <Modal v-model:open="open" class="max-w-md overflow-hidden p-0">
    <div class="flex items-start justify-between border-b px-6 py-4">
      <h2 class="text-lg font-semibold">Confirm action</h2>
      <button type="button" aria-label="Close" @click="open = false">&times;</button>
    </div>
    <div class="px-6 py-4">
      <p class="text-sm text-muted-foreground">Are you sure?</p>
    </div>
    <div class="flex justify-end gap-2 border-t px-6 py-4">
      <Button :variant="'ghost'" @click="open = false">Cancel</Button>
      <Button :variant="'primary'" @click="confirm">Confirm</Button>
    </div>
  </Modal>`,
  ),
  Dialog: usageMany(
    ['Button', 'Dialog'],
    `  <Dialog v-model:open="open">
    <template #title>Confirm action</template>
    <template #description>This cannot be undone.</template>
    <p>Are you sure?</p>
    <template #footer>
      <Button :variant="'ghost'" @click="open = false">Cancel</Button>
      <Button :variant="'primary'" @click="confirm">Confirm</Button>
    </template>
  </Dialog>`,
  ),
  Tooltip: usageMany(
    ['Button', 'Tooltip'],
    `  <Tooltip :content="'Helpful hint'" :placement="'top'" :variant="'outline'">
    <Button :variant="'outline'">Hover me</Button>
  </Tooltip>`,
  ),
  Popover: usageMany(
    ['Button', 'Popover'],
    `  <Popover :variant="'outline'">
    <template #trigger>
      <Button :variant="'outline'">Open popover</Button>
    </template>
    <template #content>
      <p class="mb-2 text-sm font-medium">Quick actions</p>
      <p class="text-xs text-muted-foreground">Popover content anchored to the trigger.</p>
    </template>
  </Popover>`,
  ),
  Drawer: usageMany(
    ['Button', 'Drawer'],
    `  <Button @click="open = true">Open drawer</Button>

  <Drawer v-model:open="open" :placement="'right'" :close-on-overlay="true">
    <div class="p-6">
      <h3 class="text-lg font-semibold">Details</h3>
      <p class="text-sm text-muted-foreground">Drawer content</p>
    </div>
  </Drawer>`,
  ),
  Container: usage(
    'Container',
    `  <Container :max-width="'lg'" class="py-8">
    Page content
  </Container>`,
  ),
  Stack: usageMany(
    ['Button', 'Input', 'Stack'],
    `  <Stack :direction="'vertical'" :gap="'4'" :align="'stretch'" :justify="'start'">
    <Input v-model="email" />
    <Button :variant="'primary'">Save</Button>
  </Stack>`,
  ),
  Grid: usageMany(
    ['Card', 'Grid'],
    `  <Grid :cols="2" :md-cols="3" :lg-cols="4">
    <Card />
    <Card />
  </Grid>`,
  ),
  AppLayout: usage(
    'AppLayout',
    `  <AppLayout
    v-model:menu-collapsed="menuCollapsed"
    v-model:panel-open="panelOpen"
    :menu-width="menuWidth"
    :menu-collapsed-width="menuCollapsedWidth"
    :menu-label="menuLabel"
    :menu-collapsible="menuCollapsible"
    :default-menu-collapsed="defaultCollapsed"
    :panel-width="panelWidth"
    :panel-min-width="panelMinWidth"
    :panel-max-width="panelMaxWidth"
    :panel-resizable="panelResizable"
    :panel-backdrop="panelBackdrop"
    :show-header="showHeader"
    :show-menu="showMenu"
    :show-footer="showFooter"
    :footer-width="footerWidth"
  >
    <template #header>Header</template>
    <template #menu="{ collapsed }">Menu</template>
    <div>Main content</div>
    <template #panel="{ closePanel }">Panel</template>
    <template #footer>Footer</template>
  </AppLayout>`,
  ),
}
