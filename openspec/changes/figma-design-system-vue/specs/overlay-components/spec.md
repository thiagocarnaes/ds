## ADDED Requirements

### Requirement: Modal and Dialog components

The design system SHALL provide `DsModal` and `DsDialog` with `v-model:open`, focus trap, Escape to close, and overlay click behavior configurable via props.

#### Scenario: Modal opens and closes

- **WHEN** `open` becomes `true` on `<DsModal v-model:open="open">`
- **THEN** the modal overlay and content are visible and focus moves inside the dialog

#### Scenario: Escape closes modal

- **WHEN** the user presses Escape while a modal is open
- **THEN** `open` becomes `false` and focus returns to the trigger element

### Requirement: Tooltip component

The design system SHALL provide `DsTooltip` wrapping a trigger element with configurable placement (`top`, `bottom`, `left`, `right`).

#### Scenario: Tooltip shows on hover

- **WHEN** a user hovers the trigger of `<DsTooltip content="Help text">`
- **THEN** a tooltip with "Help text" becomes visible near the trigger

### Requirement: Popover component

The design system SHALL provide `DsPopover` with trigger and content slots, supporting click-to-toggle interaction.

#### Scenario: Popover toggles on click

- **WHEN** a user clicks the popover trigger twice
- **THEN** the popover opens on first click and closes on second click

### Requirement: Drawer component

The design system SHALL provide `DsDrawer` sliding from `left`, `right`, `top`, or `bottom` with `v-model:open`.

#### Scenario: Drawer slides from right

- **WHEN** `<DsDrawer v-model:open="open" placement="right">` opens
- **THEN** a panel slides in from the right edge with an overlay behind it
