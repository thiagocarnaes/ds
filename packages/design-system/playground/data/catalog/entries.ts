import type { ComponentCatalogEntry } from './types'
import { c, cls, e, m, p, s } from './helpers'
import { usageSnippets } from './usageSnippets'

export const componentCatalogEntries: Record<string, ComponentCatalogEntry> = {
  Button: {
    usage: usageSnippets.Button!,
    props: [
      p('variant', "'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'clean' | 'link'", 'default', 'Visual style of the button.'),
      p('size', "'default' | 'md' | 'sm' | 'lg' | 'icon'", 'default', 'Button size'),
      p('icon', 'ButtonIconName', undefined, 'Leading icon by registered name'),
      p('type', "'button' | 'submit' | 'reset'", 'button', 'Native button type'),
      p('disabled', 'boolean', 'false', 'Disables interaction'),
      p('loading', 'boolean', 'false', 'Shows loading spinner and disables clicks'),
      cls(),
    ],
    slots: [s('default', undefined, 'Button label content')],
    events: [e('click', 'MouseEvent', 'Fired when the button is clicked')],
  },

  IconButton: {
    usage: usageSnippets.IconButton!,
    props: [
      p('aria-label', 'string', undefined, 'Accessible label for icon-only buttons (required via TypeScript — Required<>)'),
      p('variant', "'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'clean' | 'link'", 'default', 'Button variant'),
      p('size', "'default' | 'md' | 'sm' | 'lg' | 'icon'", 'icon', 'Button size (defaults to icon)'),
      p('disabled', 'boolean', 'false', 'Disables interaction'),
      p('loading', 'boolean', 'false', 'Shows loading spinner and disables clicks'),
      cls(),
    ],
    slots: [s('default', undefined, 'Icon content (e.g. Lucide icon component)')],
    events: [e('click', 'MouseEvent', 'Fired when the button is clicked')],
  },

  Link: {
    usage: usageSnippets.Link!,
    props: [
      p('href', 'string', undefined, 'Anchor href'),
      p('to', 'string', undefined, 'Router-friendly href alias'),
      p('external', 'boolean', 'false', 'Opens in a new tab with rel="noopener noreferrer"'),
      cls(),
    ],
    slots: [s('default', undefined, 'Link text content')],
  },

  Input: {
    usage: usageSnippets.Input!,
    props: [
      p('type', "'text' | 'email' | 'password' | 'search' | 'date'", 'text', 'Native input type'),
      p('size', "'sm' | 'md' | 'lg'", 'md', 'Input size'),
      p('placeholder', 'string', undefined, 'Placeholder text'),
      p('minLength', 'number', undefined, 'Minimum allowed input length (native minlength attribute)'),
      p('maxLength', 'number', undefined, 'Maximum allowed input length (native maxlength attribute)'),
      p('disabled', 'boolean', 'false', 'Disables the input'),
      p('readonly', 'boolean', 'false', 'Makes the input read-only'),
      p('error', 'boolean', 'false', 'Error validation state'),
      p('success', 'boolean', 'false', 'Success validation state'),
      p('message', 'string', undefined, 'Validation or helper message shown when :error is true'),
      p('id', 'string', undefined, 'Input element id'),
      p('lang', 'string', undefined, 'Language for the input element'),
      cls(),
    ],
    models: [m('modelValue', 'string', "''", 'Current input value')],
    events: [e('update:modelValue', 'string', 'Emitted when the value changes')],
  },

  DateInput: {
    usage: usageSnippets.DateInput!,
    props: [
      p('size', "'sm' | 'md' | 'lg'", 'md', 'Input size'),
      p('locale', 'string', 'en', 'Locale for formatting and calendar labels'),
      p('placeholder', 'string', undefined, 'Input placeholder (defaults by locale when omitted)'),
      p('disabled', 'boolean', 'false', 'Disables the date picker'),
      p('clearLabel', 'string', undefined, 'Label for the clear button (defaults by locale)'),
      p('todayLabel', 'string', undefined, 'Label for the today button (defaults by locale)'),
      p('id', 'string', undefined, 'Input element id'),
      p('aria-label', 'string', undefined, 'Accessible label for the input'),
      cls(),
    ],
    models: [m('modelValue', 'string', "''", 'Selected date as ISO string (YYYY-MM-DD)')],
    events: [e('update:modelValue', 'string', 'Emitted when the selected date changes')],
  },

  Textarea: {
    usage: usageSnippets.Textarea!,
    props: [
      p('size', "'sm' | 'md' | 'lg'", 'md', 'Textarea size'),
      p('placeholder', 'string', undefined, 'Placeholder text'),
      p('disabled', 'boolean', 'false', 'Disables the textarea'),
      p('readonly', 'boolean', 'false', 'Makes the textarea read-only'),
      p('error', 'boolean', 'false', 'Error validation state'),
      p('message', 'string', undefined, 'Error message shown when :error is true'),
      p('rows', 'number', undefined, 'Visible textarea rows (native rows attribute)'),
      p('id', 'string', undefined, 'Textarea element id'),
      cls(),
    ],
    models: [m('modelValue', 'string', "''", 'Current textarea value')],
    events: [e('update:modelValue', 'string', 'Emitted when the value changes')],
  },

  Checkbox: {
    usage: usageSnippets.Checkbox!,
    props: [
      p('label', 'string', undefined, 'Fallback label text when default slot is empty'),
      p('indeterminate', 'boolean', 'false', 'Indeterminate visual state'),
      p('isIndeterminate', 'boolean', 'false', 'Alias for indeterminate'),
      p('cycleIndeterminate', 'boolean', 'false', 'When checked, next click returns to indeterminate instead of unchecked'),
      p('disabled', 'boolean', 'false', 'Disables the checkbox'),
      p('id', 'string', undefined, 'Input element id'),
      cls(),
    ],
    models: [
      m('modelValue', 'boolean', 'false', 'Checked state'),
      m('indeterminate', 'boolean', 'false', 'Indeterminate state (v-model:indeterminate)'),
    ],
    slots: [s('default', undefined, 'Custom label content (falls back to :label)')],
    events: [
      e('update:modelValue', 'boolean', 'Emitted when checked state changes'),
      e('update:indeterminate', 'boolean', 'Emitted when indeterminate state changes'),
    ],
  },

  Radio: {
    usage: usageSnippets.Radio!,
    props: [
      p('value', 'string | number', undefined, 'Radio option value (required)'),
      p('name', 'string', undefined, 'Radio group name (inherited from RadioGroup when nested)'),
      p('disabled', 'boolean', undefined, 'Disables this radio option'),
      p('id', 'string', undefined, 'Input element id'),
      cls(),
    ],
    models: [m('modelValue', 'string | number', undefined, 'Selected value when used standalone')],
    slots: [s('default', undefined, 'Radio option label')],
    events: [e('update:modelValue', 'string | number', 'Emitted when selected (standalone usage)')],
  },

  RadioGroup: {
    usage: usageSnippets.RadioGroup!,
    props: [
      p('name', 'string', undefined, 'Shared name for nested Radio inputs (required)'),
      p('disabled', 'boolean', 'false', 'Disables all nested Radio options'),
      cls(),
    ],
    models: [m('modelValue', 'string | number', undefined, 'Currently selected value')],
    slots: [s('default', '{ modelValue, name, disabled }', 'Radio options')],
    events: [e('update:modelValue', 'string | number', 'Emitted when selection changes')],
  },

  Switch: {
    usage: usageSnippets.Switch!,
    props: [
      p('size', "'sm' | 'md'", 'md', 'Switch track size'),
      p('disabled', 'boolean', 'false', 'Disables the switch'),
      p('id', 'string', undefined, 'Button element id'),
      cls(),
    ],
    models: [m('modelValue', 'boolean', 'false', 'On/off state')],
    events: [e('update:modelValue', 'boolean', 'Emitted when toggled')],
  },

  Toggle: {
    usage: usageSnippets.Toggle!,
    props: [
      p('label', 'string', undefined, 'Fallback label text when default slot is empty'),
      p('disabled', 'boolean', 'false', 'Disables the toggle'),
      cls(),
    ],
    models: [m('modelValue', 'boolean', 'false', 'On/off state')],
    slots: [s('default', undefined, 'Toggle label (falls back to :label)')],
  },

  Select: {
    usage: usageSnippets.Select!,
    props: [
      p('options', 'SelectOption[]', undefined, 'Available options ({ label, value })'),
      p('multiple', 'boolean', 'false', 'Allow multiple selection'),
      p('searchable', 'boolean', 'true', 'Enable option search/filter'),
      p('disabled', 'boolean', 'false', 'Disables the select'),
      p('placeholder', 'string', 'Select an option...', 'Placeholder when nothing is selected'),
      p('id', 'string', undefined, 'Trigger element id'),
      cls(),
    ],
    models: [m('modelValue', 'string | string[]', "''", 'Selected value(s)')],
    events: [e('update:modelValue', 'string | string[]', 'Emitted when selection changes')],
  },

  Label: {
    usage: usageSnippets.Label!,
    props: [
      p('for', 'string', undefined, 'Associates the label with a form control id'),
      cls(),
    ],
    slots: [s('default', undefined, 'Label text')],
  },

  FormField: {
    usage: usageSnippets.FormField!,
    props: [
      p('label', 'string', undefined, 'Field label text'),
      p('helper', 'string', undefined, 'Helper text below the control'),
      p('error', 'string', undefined, 'Error message (takes precedence over helper)'),
      p('success', 'boolean', undefined, 'Styles helper text as success when :success is true'),
      p('required', 'boolean', undefined, 'Shows required asterisk on label'),
      cls(),
    ],
    slots: [s('default', '{ id: string }', 'Form control; receives auto-generated id for label association')],
  },

  Chip: {
    usage: usageSnippets.Chip!,
    props: [
      p('size', "'sm' | 'md' | 'lg'", 'md', 'Input and chip size'),
      p('placeholder', 'string', undefined, 'Placeholder text for the input'),
      p('disabled', 'boolean', 'false', 'Disables adding/removing chips'),
      p('error', 'boolean', 'false', 'Error validation state'),
      p('message', 'string', undefined, 'Error message shown when :error is true'),
      p('variant', "'default' | 'success' | 'danger' | 'progress' | 'warning' | 'new'", 'progress', 'Visual variant for chip lozenges'),
      p('id', 'string', undefined, 'Input element id'),
      cls(),
    ],
    models: [m('modelValue', 'string[]', '[]', 'Array of chip values')],
    events: [e('update:modelValue', 'string[]', 'Emitted when chips are added or removed')],
  },

  Alert: {
    usage: usageSnippets.Alert!,
    props: [
      p('variant', "'info' | 'success' | 'warning' | 'error'", 'info', 'Alert color variant'),
      p('title', 'string', undefined, 'Optional alert title'),
      p('dismissible', 'boolean', 'false', 'Shows dismiss button'),
      cls(),
    ],
    slots: [s('default', undefined, 'Alert body content')],
    events: [e('dismiss', undefined, 'Fired when the alert is dismissed')],
  },

  Badge: {
    usage: usageSnippets.Badge!,
    props: [
      p('value', 'number', undefined, 'Numeric value — renders as text (99+ when above 99)'),
      p('variant', "'default' | 'primary' | 'important' | 'added' | 'removed' | 'success' | 'warning' | 'destructive' | 'secondary' | 'outline'", 'default', 'Badge color variant. Legacy names (success, warning, destructive, secondary, outline) map to canonical appearances.'),
      p('size', "'sm' | 'md'", 'md', 'Badge size'),
      cls(),
    ],
    slots: [s('default', undefined, 'Custom badge content (falls back to formatted value)')],
  },

  Flag: {
    usage: usageSnippets.Flag!,
    props: [
      p('title', 'string', undefined, 'Flag heading (required)'),
      p('description', 'string', undefined, 'Optional supporting text below the title'),
      p('variant', "'normal' | 'warning' | 'error' | 'success' | 'discovery'", 'normal', 'Color variant for the left border and icon'),
      p('actions', 'FlagAction[]', undefined, 'Action buttons — each { label: string; onClick: () => void }'),
      p('isDismissible', 'boolean', 'false', 'Shows a close button that emits dismiss when clicked'),
      p('flagId', 'string', undefined, 'Unique id used by FlagGroup to manage the visible queue; auto-generated if omitted'),
      cls(),
    ],
    events: [e('dismiss', undefined, 'Fired when the dismiss button is clicked (only when isDismissible is true)')],
  },

  FlagGroup: {
    usage: usageSnippets.FlagGroup!,
    props: [],
    slots: [s('default', undefined, 'Flag children managed in a visible queue (max 3 at a time via internal MAX_VISIBLE constant)')],
  },

  SectionMessage: {
    usage: usageSnippets.SectionMessage!,
    props: [
      p('variant', "'information' | 'warning' | 'error' | 'success' | 'discovery' | 'change'", 'information', 'Color variant. Sets aria-live="assertive" when "error", "polite" for all others.'),
      p('title', 'string', undefined, 'Optional bold heading above the body slot'),
      cls(),
    ],
    slots: [
      s('default', undefined, 'Body content — rendered below the title'),
      s('actions', undefined, 'Action buttons shown below the body (optional)'),
    ],
  },

  Spinner: {
    usage: usageSnippets.Spinner!,
    props: [
      p('size', "'xs' | 'sm' | 'md' | 'lg'", 'md', 'Spinner size'),
      p('color', 'string', 'var(--primary)', 'Border top color'),
      p('glow', 'boolean', 'true', 'Adds a glow effect around the spinner'),
      p('ariaLabel', 'string', 'Loading', 'Accessible label (maps to aria-label)'),
      cls(),
    ],
  },

  Progress: {
    usage: usageSnippets.Progress!,
    props: [
      p('value', 'number', '0', 'Progress percentage (0–100) when determinate'),
      p('indeterminate', 'boolean', 'false', 'Shows indeterminate animation'),
      cls(),
    ],
  },

  Skeleton: {
    usage: usageSnippets.Skeleton!,
    props: [cls('Placeholder sizing and shape via Tailwind classes')],
  },

  Toast: {
    usage: usageSnippets.Toast!,
    props: [
      p('variant', "'success' | 'error' | 'info' | 'warning'", 'info', 'Toast color variant'),
      p('dismissible', 'boolean', 'false', 'Shows dismiss button'),
      cls(),
    ],
    slots: [s('default', undefined, 'Toast message content')],
    events: [e('dismiss', undefined, 'Fired when the toast is dismissed')],
    composable: {
      name: 'useToast()',
      description: 'Mount ToastHost once, then call useToast() to trigger live notifications.',
      optionsName: 'ShowToastOptions',
      options: [
        p(
          'position',
          "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
          'top-right',
          'Viewport corner where ToastHost renders the notification',
        ),
        p('dismissible', 'boolean', 'false', 'Shows dismiss button on the toast'),
      ],
      methods: [
        { name: 'success', signature: "(message, { position?, dismissible? })", description: 'Show success toast' },
        { name: 'error', signature: "(message, { position?, dismissible? })", description: 'Show error toast' },
        { name: 'info', signature: "(message, { position?, dismissible? })", description: 'Show info toast' },
        { name: 'warning', signature: "(message, { position?, dismissible? })", description: 'Show warning toast' },
        { name: 'dismiss', signature: '(id: string)', description: 'Dismiss a toast by id' },
      ],
    },
  },

  ToastHost: {
    usage: usageSnippets.ToastHost!,
    props: [],
    composable: {
      name: 'useToast()',
      description: 'ToastHost renders toasts pushed by useToast(). Position and dismissible are set per call.',
      optionsName: 'ShowToastOptions',
      options: [
        p(
          'position',
          "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
          'top-right',
          'Viewport corner where ToastHost renders the notification',
        ),
        p('dismissible', 'boolean', 'false', 'Shows dismiss button on the toast'),
      ],
      methods: [
        { name: 'success | error | info | warning', signature: "(message, 'top-right' | ShowToastOptions)", description: 'Trigger a live notification' },
        { name: 'dismiss', signature: '(id: string)', description: 'Dismiss a toast by id' },
      ],
    },
  },

  Tabs: {
    usage: usageSnippets.Tabs!,
    props: [cls()],
    models: [m('activeTab', 'string', undefined, 'Currently active tab value (v-model, required)')],
    slots: [s('default', undefined, 'TabList and TabPanel children')],
  },

  TabList: {
    usage: usageSnippets.TabList!,
    props: [cls()],
    slots: [s('default', undefined, 'Tab components')],
  },

  Tab: {
    usage: usageSnippets.Tab!,
    props: [
      p('value', 'string', undefined, 'Tab identifier (required)'),
      p('id', 'string', undefined, 'Alias for value'),
      p('disabled', 'boolean', 'false', 'Disables tab selection'),
      cls(),
    ],
    slots: [s('default', undefined, 'Tab label')],
  },

  TabPanel: {
    usage: usageSnippets.TabPanel!,
    props: [
      p('value', 'string', undefined, 'Tab identifier matching a Tab (required)'),
      cls(),
    ],
    slots: [s('default', undefined, 'Panel content shown when tab is active')],
  },

  Breadcrumb: {
    usage: usageSnippets.Breadcrumb!,
    props: [
      p('separator', 'string', '/', 'Separator character between items'),
      cls(),
    ],
    slots: [s('default', undefined, 'BreadcrumbItem children')],
  },

  BreadcrumbItem: {
    usage: usageSnippets.BreadcrumbItem!,
    props: [
      p('href', 'string', undefined, 'Link href (renders anchor when set and not current)'),
      p('current', 'boolean', 'false', 'Marks item as current page'),
      cls(),
    ],
    slots: [s('default', undefined, 'Breadcrumb label')],
  },

  Pagination: {
    usage: usageSnippets.Pagination!,
    props: [
      p('total', 'number', undefined, 'Total number of records (required)'),
      p('pageSize', 'number', undefined, 'Records per page (required)'),
      p('currentPage', 'number', '1', 'Current page number'),
      cls(),
    ],
    models: [m('currentPage', 'number', '1', 'Current page (v-model:current-page)')],
    events: [e('update:currentPage', 'number', 'Emitted when page changes')],
  },

  SidebarMenu: {
    usage: usageSnippets.SidebarMenu!,
    props: [
      p('collapsed', 'boolean', 'false', 'Collapsed sidebar mode (icon-only labels)'),
      cls(),
    ],
    models: [
      m('activeId', 'string', "''", 'Active menu item id — auto-selects the first SidebarMenuItem when empty'),
      m('openKeys', 'string[]', '[]', 'Expanded group keys (v-model:open-keys)'),
    ],
    slots: [s('default', undefined, 'SidebarMenuItem and SidebarMenuGroup children')],
  },

  SidebarMenuItem: {
    usage: usageSnippets.SidebarMenuItem!,
    props: [
      p('id', 'string', undefined, 'Unique item identifier (required) — top-level items should not share a group id prefix (use all not todos.all beside group todos)'),
      p('label', 'string', undefined, 'Item label (required)'),
      p('icon', 'Component', undefined, 'Optional Lucide or custom icon component'),
    ],
  },

  SidebarMenuGroup: {
    usage: usageSnippets.SidebarMenuGroup!,
    props: [
      p('id', 'string', undefined, 'Unique group identifier (required)'),
      p('label', 'string', undefined, 'Group label (required)'),
      p('icon', 'Component', undefined, 'Optional icon component'),
      p('defaultOpen', 'boolean', 'false', 'Expand group on mount'),
      p(
        'flyoutPlacement',
        "'auto' | 'down' | 'up'",
        'auto',
        'Vertical flyout alignment — auto opens upward when the group is near the viewport bottom',
      ),
    ],
    slots: [s('default', undefined, 'Nested SidebarMenuItem children')],
  },

  SidebarMenuShell: {
    usage: usageSnippets.SidebarMenuShell!,
    props: [
      p('collapsed', 'boolean', undefined, 'Whether the menu is collapsed (required)'),
      p('menuLabel', 'string', undefined, 'Uppercase label above the menu'),
      p('menuWidth', 'string', undefined, 'Menu content width CSS value (required)'),
      p('collapsedWidth', 'string', undefined, 'Collapsed menu width CSS value'),
    ],
    slots: [
      s('toggle', undefined, 'Collapse/expand toggle control'),
      s('default', undefined, 'SidebarMenu content'),
    ],
  },

  Card: {
    usage: usageSnippets.Card!,
    props: [
      p('variant', "'elevated' | 'outlined' | 'flat' | 'ghost'", 'outlined', 'Card surface style'),
      cls(),
    ],
    slots: [
      s('header', undefined, 'Optional card header'),
      s('default', undefined, 'Card body content'),
      s('footer', undefined, 'Optional card footer'),
    ],
  },

  Divider: {
    usage: usageSnippets.Divider!,
    props: [
      p('orientation', "'horizontal' | 'vertical'", 'horizontal', 'Separator orientation'),
      cls(),
    ],
  },

  Avatar: {
    usage: usageSnippets.Avatar!,
    props: [
      p('src', 'string', undefined, 'Image URL'),
      p('name', 'string', undefined, 'Display name for initials and alt text'),
      p('size', "'xs' | 'sm' | 'md' | 'lg' | 'xl'", 'md', 'Avatar size'),
      cls(),
    ],
  },

  AvatarGroup: {
    usage: usageSnippets.AvatarGroup!,
    props: [
      p('members', 'AvatarGroupMember[]', undefined, 'Array of { name } objects (required)'),
      p('max', 'number', '4', 'Maximum avatars shown before overflow count'),
      p('size', "'xs' | 'sm' | 'md' | 'lg' | 'xl'", 'md', 'Avatar size for all members'),
      cls(),
    ],
  },

  Lozenge: {
    usage: usageSnippets.Lozenge!,
    props: [
      p('variant', "'default' | 'success' | 'danger' | 'progress' | 'warning' | 'new'", 'default', 'Color variant'),
      p('bold', 'boolean', 'false', 'Bold/high-contrast style'),
      p('isBold', 'boolean', 'false', 'Alias for bold'),
      cls(),
    ],
    slots: [s('default', undefined, 'Lozenge label text')],
  },

  Table: {
    usage: usageSnippets.Table!,
    props: [
      p('striped', 'boolean', 'false', 'Alternating row background on tbody'),
      cls(),
    ],
    slots: [s('default', undefined, 'TableHead and TableBody sections')],
  },

  TableHead: {
    usage: usageSnippets.TableHead!,
    props: [cls()],
    slots: [s('default', undefined, 'Header TableRow')],
  },

  TableBody: {
    usage: usageSnippets.TableBody!,
    props: [cls()],
    slots: [s('default', undefined, 'Body TableRow elements')],
  },

  TableRow: {
    usage: usageSnippets.TableRow!,
    props: [cls()],
    slots: [s('default', undefined, 'TableCell elements')],
  },

  TableCell: {
    usage: usageSnippets.TableCell!,
    props: [
      p('colspan', 'number', undefined, 'Column span for the cell'),
      cls(),
    ],
    slots: [s('default', undefined, 'Cell content')],
  },

  DataTable: {
    usage: usageSnippets.DataTable!,
    props: [
      p('columns', 'DataTableColumn[]', undefined, 'Column definitions (required)'),
      p('rows', 'Record<string, unknown>[]', undefined, 'Row data (required)'),
      p('rowKey', 'string | ((row, index) => string)', undefined, 'Unique row key field or resolver'),
      p('pageSizeOptions', 'number[]', '[5, 10, 25, 50]', 'Page size dropdown options'),
      p('searchable', 'boolean', 'true', 'Show search input'),
      p('showTotalRecords', 'boolean', 'true', 'Show record and page counts'),
      p('showPageSize', 'boolean', 'true', 'Show page size selector'),
      p('searchPlaceholder', 'string', 'Search…', 'Search input placeholder'),
      p('loading', 'boolean', 'false', 'Loading overlay state'),
      p('total', 'number', undefined, 'Total records (server-side mode)'),
      p('serverSide', 'boolean', 'false', 'Emit request events instead of client filtering/sorting'),
      p('striped', 'boolean', 'true', 'Striped table rows'),
      p('emptyTitle', 'string', 'No results', 'Empty state title'),
      p('emptyDescription', 'string', 'Try adjusting your search or filters.', 'Empty state description'),
      p('labels', 'DataTableLabels', undefined, 'Localized label overrides'),
      p('locale', 'string', 'en', 'Locale for formatting'),
      cls(),
    ],
    models: [
      m('search', 'string', "''", 'Search query (v-model:search)'),
      m('currentPage', 'number', '1', 'Current page (v-model:current-page)'),
      m('pageSize', 'number', '10', 'Rows per page (v-model:page-size)'),
      m('sortStack', 'DataTableSortEntry[]', '[]', 'Multi-column sort stack (v-model:sort-stack)'),
      m('columnFilters', 'DataTableColumnFilters', '{}', 'Column filter values (v-model:column-filters)'),
      m('sortKey', 'string | null', 'null', 'Legacy single sort key (v-model:sort-key)'),
      m('sortDirection', "'asc' | 'desc' | null", 'null', 'Legacy sort direction (v-model:sort-direction)'),
    ],
    slots: [
      s('toolbar', undefined, 'Extra controls beside the search bar'),
      s('cell-{key}', '{ row, value, index }', 'Custom cell renderer per column key'),
    ],
    events: [e('request', 'DataTableRequestParams', 'Emitted in server-side mode when data should be refetched')],
  },

  DataTableColumnFilter: {
    usage: usageSnippets.DataTableColumnFilter!,
    props: [
      p('column', 'DataTableColumn', undefined, 'Column to filter (required)'),
      p('disabled', 'boolean', undefined, 'Disables filter inputs'),
      p('labels', 'Required<DataTableLabels>', undefined, 'Localized filter labels (required)'),
      p('locale', 'string', 'en', 'Locale for date inputs'),
      p('layout', "'inline' | 'popover'", 'inline', 'Filter control layout'),
    ],
    models: [m('modelValue', 'DataTableColumnFilters', undefined, 'All column filters (v-model, required)')],
  },

  DataTableColumnFilterMenu: {
    usage: usageSnippets.DataTableColumnFilterMenu!,
    props: [
      p('column', 'DataTableColumn', undefined, 'Column to filter (required)'),
      p('disabled', 'boolean', undefined, 'Disables the filter trigger'),
      p('labels', 'Required<DataTableLabels>', undefined, 'Localized filter labels (required)'),
      p('locale', 'string', undefined, 'Locale for date inputs'),
      p('open', 'boolean', undefined, 'Whether the filter popover is open'),
    ],
    models: [
      m('modelValue', 'DataTableColumnFilters', undefined, 'All column filters (v-model, required)'),
      m('open', 'boolean', undefined, 'Popover open state (v-model:open)'),
    ],
    events: [e('update:open', 'boolean', 'Emitted when popover open state changes')],
  },

  PageSizeSelect: {
    usage: usageSnippets.PageSizeSelect!,
    props: [
      p('options', 'number[]', '[5, 10, 25, 50]', 'Available page sizes'),
      p('label', 'string', 'Rows per page', 'Label beside the select'),
      p('disabled', 'boolean', 'false', 'Disables the select'),
      cls(),
    ],
    models: [m('modelValue', 'number', '10', 'Selected page size (v-model)')],
  },

  List: {
    usage: usageSnippets.List!,
    props: [cls()],
    slots: [s('default', undefined, 'ListItem children')],
  },

  ListItem: {
    usage: usageSnippets.ListItem!,
    props: [cls()],
    slots: [s('default', undefined, 'List item content')],
  },

  EmptyState: {
    usage: usageSnippets.EmptyState!,
    props: [
      p('title', 'string', undefined, 'Empty state heading (required)'),
      p('description', 'string', undefined, 'Supporting description text'),
      cls(),
    ],
    slots: [s('default', undefined, 'Optional action buttons or illustration')],
  },

  Modal: {
    usage: usageSnippets.Modal!,
    props: [
      p('closeOnOverlay', 'boolean', 'true', 'Close when clicking the backdrop'),
      cls('Panel width, padding, and layout classes'),
    ],
    models: [m('open', 'boolean', 'false', 'Visibility state (v-model:open)')],
    slots: [s('default', undefined, 'Modal content — compose header, body, and footer manually')],
    composition: {
      description:
        'Modal exposes one default slot. Use class="max-w-md overflow-hidden p-0" on the panel and compose header, body, and footer as separate blocks inside it.',
      parts: [
        c('header', 'Title row with border-b — title on the left'),
        c('close button', 'Optional × in the header with aria-label="Close" wired to close the modal', true),
        c('body', 'Main message, form fields, or alerts with px-6 py-4 padding'),
        c(
          'footer',
          'Optional action row with border-t — align buttons to the end (justify-end gap-2)',
          true,
        ),
        c('cancel action', 'Optional ghost Button that closes the modal', true),
        c('primary action', 'Optional primary or danger Button for the main action', true),
      ],
    },
  },

  Dialog: {
    usage: usageSnippets.Dialog!,
    props: [
      p('closeOnOverlay', 'boolean', 'true', 'Close when clicking the backdrop'),
      cls('Dialog panel classes'),
    ],
    models: [m('open', 'boolean', 'false', 'Visibility state (v-model:open)')],
    slots: [
      s('title', undefined, 'Dialog title (no :title prop — use this slot)'),
      s('description', undefined, 'Optional description below the title'),
      s('default', undefined, 'Main dialog body content'),
      s('footer', undefined, 'Footer actions aligned to the end'),
    ],
  },

  Tooltip: {
    usage: usageSnippets.Tooltip!,
    props: [
      p('content', 'string', undefined, 'Tooltip text (required)'),
      p('placement', "'top' | 'bottom' | 'left' | 'right'", 'top', 'Tooltip position relative to trigger'),
      p('variant', "'primary' | 'ghost' | 'outline' | 'danger'", 'outline', 'Tooltip bubble visual style'),
      cls(),
    ],
    slots: [s('default', undefined, 'Trigger element (hover/focus target)')],
  },

  Popover: {
    usage: usageSnippets.Popover!,
    props: [
      p('variant', "'primary' | 'ghost' | 'outline' | 'danger'", 'outline', 'Popover panel visual style'),
      cls('Popover panel classes'),
    ],
    models: [m('open', 'boolean', 'false', 'Open state (v-model:open)')],
    slots: [
      s('trigger', undefined, 'Click target that toggles the popover — commonly a Button'),
      s('content', undefined, 'Floating panel body — compose title, text, and actions inside'),
    ],
    composition: {
      description:
        'Popover uses #trigger and #content slots. Set :variant on Popover for panel styling; style the trigger with its own component props (e.g. Button :variant).',
      parts: [
        c('trigger', 'Click target in #trigger — typically a Button'),
        c('content', 'Panel markup rendered when open'),
        c('content title', 'Optional heading inside #content (e.g. p.text-sm.font-medium)', true),
        c('content body', 'Optional supporting copy inside #content (e.g. p.text-xs.text-muted-foreground)', true),
      ],
    },
  },

  Drawer: {
    usage: usageSnippets.Drawer!,
    props: [
      p('placement', "'left' | 'right' | 'top' | 'bottom'", 'right', 'Edge from which the drawer slides in'),
      p('closeOnOverlay', 'boolean', 'true', 'Close when clicking the backdrop'),
      cls('Drawer panel width and padding classes'),
    ],
    models: [m('open', 'boolean', 'false', 'Visibility state (v-model:open)')],
    slots: [s('default', undefined, 'Drawer content — compose title and body manually (no :title prop)')],
  },

  Container: {
    usage: usageSnippets.Container!,
    props: [
      p('maxWidth', "'sm' | 'md' | 'lg' | 'xl' | 'full'", 'lg', 'Maximum content width'),
      cls(),
    ],
    slots: [s('default', undefined, 'Page content')],
  },

  Stack: {
    usage: usageSnippets.Stack!,
    props: [
      p('direction', "'vertical' | 'horizontal'", 'vertical', 'Flex direction'),
      p('gap', '1 | 2 | 3 | 4 | 5 | 6 | 7 | 8', '4', 'Gap between items (Tailwind spacing scale)'),
      p('align', "'start' | 'center' | 'end' | 'stretch' | 'baseline'", 'stretch', 'Cross-axis alignment'),
      p('justify', "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", 'start', 'Main-axis justification'),
      cls(),
    ],
    slots: [s('default', undefined, 'Stacked children')],
  },

  Grid: {
    usage: usageSnippets.Grid!,
    props: [
      p('cols', 'number', '1', 'Default column count (1–12)'),
      p('mdCols', 'number', undefined, 'Column count at md breakpoint'),
      p('lgCols', 'number', undefined, 'Column count at lg breakpoint'),
      cls(),
    ],
    slots: [s('default', undefined, 'Grid cell children')],
  },

  AppLayout: {
    usage: usageSnippets.AppLayout!,
    props: [
      p('menuWidth', 'string', '12rem', 'Expanded sidebar width'),
      p('menuCollapsedWidth', 'string', '3rem', 'Collapsed sidebar width'),
      p('menuLabel', 'string', 'Menu', 'Label shown in sidebar shell'),
      p('defaultMenuCollapsed', 'boolean', 'false', 'Start with collapsed menu'),
      p('menuCollapsible', 'boolean', 'true', 'Allow menu collapse'),
      p('panelWidth', 'string', 'min(24rem, 50%)', 'Side panel initial width'),
      p('panelMinWidth', 'string', '12rem', 'Side panel minimum width when resizing'),
      p('panelMaxWidth', 'string', '75%', 'Side panel maximum width when resizing'),
      p('panelResizable', 'boolean', 'true', 'Allow panel width drag resize'),
      p('panelBackdrop', 'boolean', 'true', 'Dim content behind open panel'),
      p('showHeader', 'boolean', 'true', 'Render header region'),
      p('showMenu', 'boolean', 'true', 'Render sidebar menu region'),
      p('showFooter', 'boolean', 'true', 'Render footer region'),
      p('settingsMenu', 'boolean', 'false', 'Pin a SidebarMenuGroup or SidebarMenuItem whose id matches settingsMenuId to the menu footer'),
      p('settingsMenuId', 'string', 'settings', 'Id of the SidebarMenuGroup or lone SidebarMenuItem to pin when settingsMenu is true'),
      p('footerWidth', "'full' | 'content'", 'full', 'Footer spans full width or content column only'),
      cls('Shell sizing — use class="min-h-svh" (or h-full on #app) for full-viewport apps; does not style slot content'),
    ],
    models: [
      m('menuCollapsed', 'boolean', 'false', 'Sidebar collapsed state (v-model:menu-collapsed)'),
      m('panelOpen', 'boolean', 'false', 'Side panel open state (v-model:panel-open)'),
      m('activeMenuId', 'string', "''", 'Active sidebar item id — auto-selects first menu item when empty (v-model:active-menu-id)'),
      m('openMenuKeys', 'string[]', '[]', 'Expanded sidebar group keys (v-model:open-menu-keys)'),
    ],
    slots: [
      s('header', undefined, 'Top header bar — compose markup and Tailwind classes inside the slot'),
      s('menu', undefined, 'SidebarMenuItem / SidebarMenuGroup — use id="settings" (or settingsMenuId) on a group or lone item to pin it to the footer when settingsMenu is true'),
      s('default', undefined, 'Main content — fills available height by default; add your layout/spacing classes inside'),
      s('panel', '{ closePanel }', 'Resizable side panel — compose header, body, and actions with Tailwind classes'),
      s('footer', undefined, 'Bottom footer bar — compose markup and Tailwind classes inside the slot'),
    ],
    composition: {
      description:
        'AppLayout only arranges page regions (grid + panel overlay). It does not ship styled header, menu, content, or footer — wrap each slot with Tailwind utility classes in your app. Declare refs for v-model and layout props in script setup (see Usage).',
      parts: [
        c('script refs', 'menuCollapsed, panelOpen, activeId, openKeys, settingsMenu, pageTitle, etc.'),
        c('header slot', 'Brand bar with border-b, px-4 py-3, typography classes'),
        c('menu slot', 'Navigation items — pin settings with SidebarMenuGroup id="settings" or lone SidebarMenuItem id="settings"'),
        c('menu toggle', 'Built-in chevron button with tooltip — no extra component required'),
        c('settingsMenu prop', 'When true, the menu node whose id matches settingsMenuId is pinned to the footer', true),
        c('default slot', 'Main page body — AppLayout stretches this region to full content height'),
        c('panel slot', 'Optional detail drawer with border-l, padding, and close action', true),
        c('footer slot', 'Status/meta row with border-t and muted text', true),
      ],
    },
  },
}
