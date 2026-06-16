## ADDED Requirements

### Requirement: Tabs component

The design system SHALL provide `DsTabs`, `DsTabList`, `DsTab`, and `DsTabPanel` with keyboard navigation (Arrow keys, Home, End) and `v-model` for active tab.

#### Scenario: Tab selection updates panel

- **WHEN** a user clicks the second tab in `<DsTabs v-model="active">`
- **THEN** `active` updates to the second tab id and the corresponding panel is visible

### Requirement: Breadcrumb component

The design system SHALL provide `DsBreadcrumb` and `DsBreadcrumbItem` with separator support and current-page indication.

#### Scenario: Current page is not a link

- **WHEN** the last breadcrumb item is marked `current`
- **THEN** it renders as text without a hyperlink and includes `aria-current="page"`

### Requirement: Pagination component

The design system SHALL provide `DsPagination` with props `total`, `pageSize`, `currentPage`, and `@update:currentPage` event.

#### Scenario: Page change emits event

- **WHEN** a user clicks page "3" in `<DsPagination :total="100" :page-size="10" :current-page="1" />`
- **THEN** the component emits `update:currentPage` with value `3`
