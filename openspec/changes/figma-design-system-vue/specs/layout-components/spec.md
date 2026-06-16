## ADDED Requirements

### Requirement: Container component

The design system SHALL provide `DsContainer` with max-width breakpoints (`sm`, `md`, `lg`, `xl`, `full`) and horizontal padding matching Figma layout grids.

#### Scenario: Container constrains width

- **WHEN** `<DsContainer max-width="lg">` is rendered inside a wide viewport
- **THEN** content is centered and constrained to the `lg` max-width token

### Requirement: Stack component

The design system SHALL provide `DsStack` for vertical or horizontal flex layouts with configurable `gap`, `align`, and `justify` props.

#### Scenario: Vertical stack with gap

- **WHEN** `<DsStack direction="vertical" gap="4">` wraps three children
- **THEN** children are stacked vertically with spacing token `4` between them

### Requirement: Grid component

The design system SHALL provide `DsGrid` with responsive column counts via props or Tailwind-compatible column classes.

#### Scenario: Responsive grid columns

- **WHEN** `<DsGrid cols="1" md-cols="2" lg-cols="3">` wraps six items
- **THEN** items render in 1, 2, or 3 columns depending on viewport breakpoint
