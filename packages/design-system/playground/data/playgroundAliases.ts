/** Maps Library catalog component names to an existing playground drawer demo. */
export const playgroundAliases: Record<string, string> = {
  AppLayout: 'Layout',
  TabList: 'Tabs',
  Tab: 'Tabs',
  TabPanel: 'Tabs',
  Breadcrumb: 'Breadcrumbs',
  BreadcrumbItem: 'Breadcrumbs',
  SidebarMenu: 'Layout',
  SidebarMenuItem: 'Layout',
  SidebarMenuGroup: 'Layout',
  SidebarMenuShell: 'Layout',
  DataTableColumnFilter: 'DataTable',
  DataTableColumnFilterMenu: 'DataTable',
  PageSizeSelect: 'DataTable',
  Container: 'Layout Primitives',
  Stack: 'Layout Primitives',
  Grid: 'Layout Primitives',
  Radio: 'RadioGroup',
  Textarea: 'Textarea',
  Label: 'Label',
  Link: 'Link',
  IconButton: 'IconButton',
}

export function resolvePlaygroundDemo(name: string): string {
  return playgroundAliases[name] ?? name
}
