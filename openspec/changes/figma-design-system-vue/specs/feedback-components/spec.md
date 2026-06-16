## ADDED Requirements

### Requirement: Alert component

The design system SHALL provide `DsAlert` with variants `info`, `success`, `warning`, and `error`, optional title, dismissible behavior, and slot content.

#### Scenario: Success alert displays

- **WHEN** `<DsAlert variant="success" title="Done">Task saved</DsAlert>` is rendered
- **THEN** the alert shows success styling, title "Done", and body "Task saved"

### Requirement: Badge component

The design system SHALL provide `DsBadge` with variants matching semantic colors and sizes `sm` and `md`.

#### Scenario: Badge renders label

- **WHEN** `<DsBadge variant="warning">Pending</DsBadge>` is rendered
- **THEN** a compact label "Pending" with warning styling is displayed

### Requirement: Loading indicators

The design system SHALL provide `DsSpinner` and `DsSkeleton` for loading and placeholder states.

#### Scenario: Spinner has accessible status

- **WHEN** `<DsSpinner aria-label="Loading" />` is rendered
- **THEN** an element with `role="status"` and accessible name "Loading" is present

### Requirement: Progress component

The design system SHALL provide `DsProgress` accepting `value` (0–100) and optional `indeterminate` mode.

#### Scenario: Determinate progress bar

- **WHEN** `<DsProgress :value="60" />` is rendered
- **THEN** the progress indicator visually reflects 60% completion

### Requirement: Toast notifications

The design system SHALL provide `DsToast` and a `useToast` composable to show transient notifications.

#### Scenario: Toast auto-dismisses

- **WHEN** `useToast().success('Saved')` is called with default duration
- **THEN** a success toast appears and is removed after the configured timeout
