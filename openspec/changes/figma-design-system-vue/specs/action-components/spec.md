## ADDED Requirements

### Requirement: Button component

The design system SHALL provide a `DsButton` component with variants `primary`, `secondary`, `outline`, and `ghost`, sizes `sm`, `md`, and `lg`, and states `default`, `hover`, `focus`, `disabled`, and `loading`.

#### Scenario: Primary button renders

- **WHEN** `<DsButton variant="primary">Save</DsButton>` is rendered
- **THEN** a clickable button displays with primary styling and the label "Save"

#### Scenario: Disabled button ignores clicks

- **WHEN** `<DsButton disabled @click="handler">Save</DsButton>` is rendered and clicked
- **THEN** the button appears disabled and `handler` is not invoked

#### Scenario: Loading button shows spinner

- **WHEN** `<DsButton loading>Save</DsButton>` is rendered
- **THEN** a loading indicator is visible and the button is not interactive

### Requirement: IconButton component

The design system SHALL provide a `DsIconButton` component accepting an icon slot, `aria-label`, and the same variant/size options as `DsButton`.

#### Scenario: Accessible icon button

- **WHEN** `<DsIconButton aria-label="Close"><CloseIcon /></DsIconButton>` is rendered
- **THEN** the element has `role="button"` and an accessible name of "Close"

### Requirement: Link component

The design system SHALL provide a `DsLink` component supporting `href` navigation and `router-link` integration via a `to` prop.

#### Scenario: External link opens in new tab

- **WHEN** `<DsLink href="https://example.com" external>Docs</DsLink>` is rendered
- **THEN** an anchor with `target="_blank"` and `rel="noopener noreferrer"` is rendered
