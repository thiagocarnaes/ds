## ADDED Requirements

### Requirement: System provides a text-hovered design token
The system SHALL expose a token `--ds-color-text-hovered` (and `--color-text-hovered` for Tailwind) that defines the text color for interactive elements in hover state. The token SHALL resolve to `var(--accent)` in both light and dark themes.

#### Scenario: Token is defined in tokens.css
- **WHEN** inspecting `tokens.css`
- **THEN** a CSS custom property `--ds-color-text-hovered` SHALL exist
- **AND** its value SHALL be `var(--accent)`

#### Scenario: Token is mapped in theme.css
- **WHEN** inspecting `theme.css` under the `@theme inline` block
- **THEN** `--color-text-hovered` SHALL be mapped to `var(--ds-color-text-hovered)`

### Requirement: Ghost button uses text-hovered on hover
The ghost variant SHALL display text in `--ds-color-text-hovered` when hovered, not in `--accent-foreground`.

#### Scenario: Ghost button default state is unchanged
- **WHEN** rendering a ghost button without hover
- **THEN** the button SHALL NOT have a default text color class
- **AND** the button SHALL NOT have a default background

#### Scenario: Ghost button uses text-hovered on hover
- **WHEN** hovering over a ghost button
- **THEN** the text color SHALL be `var(--accent)` (via `text-text-hovered`)
- **AND** the background SHALL be `--ds-color-bg-hovered`

### Requirement: Outline button uses text-hovered on hover
The outline variant SHALL display text in `--ds-color-text-hovered` when hovered, not in `--accent-foreground`.

#### Scenario: Outline button uses text-hovered on hover
- **WHEN** hovering over an outline button
- **THEN** the text color SHALL be `var(--accent)` (via `text-text-hovered`)
- **AND** the background SHALL be `--ds-color-bg-hovered`

### Requirement: Other components retain existing hover behavior
Components using `hover:bg-accent hover:text-accent-foreground` (Pagination, DateInput) SHALL NOT be affected by this change.

#### Scenario: Pagination hover unchanged
- **WHEN** hovering over a pagination item
- **THEN** the background SHALL be `--accent`
- **AND** the text color SHALL be `--accent-foreground`

#### Scenario: DateInput navigation hover unchanged
- **WHEN** hovering over a date navigation button
- **THEN** the background SHALL be `--accent`
- **AND** the text color SHALL be `--accent-foreground`
