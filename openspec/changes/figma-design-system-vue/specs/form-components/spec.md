## ADDED Requirements

### Requirement: Text input components

The design system SHALL provide `DsInput` and `DsTextarea` with props for `modelValue`, `placeholder`, `disabled`, `readonly`, `error`, and `size`.

#### Scenario: Two-way binding on input

- **WHEN** a user types into `<DsInput v-model="value" />`
- **THEN** the bound `value` ref updates on each input event

#### Scenario: Error state styling

- **WHEN** `<DsInput error message="Required" />` is rendered
- **THEN** the input shows error border styling and displays "Required"

### Requirement: Selection components

The design system SHALL provide `DsSelect`, `DsCheckbox`, `DsRadio`, and `DsSwitch` with accessible keyboard interaction and `v-model` support.

#### Scenario: Checkbox toggles value

- **WHEN** a user clicks an unchecked `<DsCheckbox v-model="checked" />`
- **THEN** `checked` becomes `true` and the checkbox shows checked state

#### Scenario: Radio group enforces single selection

- **WHEN** two `<DsRadio>` elements share the same `name` and one is selected
- **THEN** only the selected radio reflects the bound `modelValue`

### Requirement: Form field wrapper

The design system SHALL provide `DsLabel` and `DsFormField` to associate labels, helper text, and error messages with form controls.

#### Scenario: Label associates with control

- **WHEN** `<DsFormField label="Email"><DsInput id="email" /></DsFormField>` is rendered
- **THEN** clicking the label focuses the input with `id="email"`
