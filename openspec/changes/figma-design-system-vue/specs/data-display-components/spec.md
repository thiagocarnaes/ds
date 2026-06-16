## ADDED Requirements

### Requirement: Card component

The design system SHALL provide `DsCard` with optional header, footer, and default slots, plus variants `elevated`, `outlined`, and `flat`.

#### Scenario: Card renders header and body

- **WHEN** `<DsCard><template #header>Title</template>Body</DsCard>` is rendered
- **THEN** the card displays "Title" in the header region and "Body" in the content region

### Requirement: Avatar component

The design system SHALL provide `DsAvatar` supporting image `src`, initials fallback, and sizes `sm`, `md`, and `lg`.

#### Scenario: Initials fallback

- **WHEN** `<DsAvatar name="Jane Doe" />` is rendered without `src`
- **THEN** initials "JD" are displayed inside a circular avatar

### Requirement: Table component

The design system SHALL provide `DsTable`, `DsTableHead`, `DsTableBody`, `DsTableRow`, and `DsTableCell` with striped and hover row options.

#### Scenario: Table renders rows

- **WHEN** a table is populated with three data rows
- **THEN** three `<tr>` elements render inside `<tbody>` with aligned cells

### Requirement: List and empty state

The design system SHALL provide `DsList`, `DsListItem`, and `DsEmptyState` for structured lists and zero-data UI.

#### Scenario: Empty state shows illustration slot

- **WHEN** `<DsEmptyState title="No tasks" description="Create one to get started" />` is rendered
- **THEN** the title and description are visible with optional action slot support

### Requirement: Divider component

The design system SHALL provide `DsDivider` with horizontal and vertical orientation.

#### Scenario: Horizontal divider renders

- **WHEN** `<DsDivider />` is rendered
- **THEN** a horizontal separator line spans the container width
