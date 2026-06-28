import packageJson from '../package.json'

export const designSystemVersion = packageJson.version

export const designSystemVersionBadge = `v${packageJson.version}`

/** Vue components exported from `@tcarnaes/design-system`. */
export const designSystemLibraryComponentCount = 62

/** Interactive demos for Library components (drawer). */
export const playgroundDemoComponents = [
  'Button',
  'IconButton',
  'Link',
  'Input',
  'Chip',
  'Textarea',
  'Label',
  'DateInput',
  'Switch',
  'RadioGroup',
  'FormField',
  'Toggle',
  'Checkbox',
  'Select',
  'Badge',
  'Lozenge',
  'Avatar',
  'Card',
  'Tabs',
  'Breadcrumbs',
  'Pagination',
  'DataTable',
  'Layout',
  'Layout Primitives',
  'Modal',
  'Dialog',
  'Drawer',
  'Tooltip',
  'Popover',
  'Spinner',
  'Progress',
  'Skeleton',
  'Alert',
  'Flag',
  'FlagGroup',
  'SectionMessage',
  'Toast',
] as const

/** Composite use-case demos — not part of the 58 Library components. */
export const showcaseDemoComponents = ['AI Chat'] as const

export const allPlaygroundDemos = [...playgroundDemoComponents, ...showcaseDemoComponents] as const

export type PlaygroundDemoComponent = (typeof playgroundDemoComponents)[number]
export type ShowcaseDemoComponent = (typeof showcaseDemoComponents)[number]

export const playgroundDemoComponentCount = playgroundDemoComponents.length

export const showcaseDemoComponentCount = showcaseDemoComponents.length
