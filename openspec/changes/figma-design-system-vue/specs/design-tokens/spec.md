## ADDED Requirements

### Requirement: Tailwind theme extension

The design system SHALL extend Tailwind CSS with tokens mapped from the Figma Make file (colors, font families, font sizes, spacing, border radius, box shadows).

#### Scenario: Token classes resolve

- **WHEN** a component uses classes such as `bg-primary`, `text-muted`, or `rounded-md`
- **THEN** Tailwind generates CSS matching the Figma token values defined in `tailwind.config.ts`

### Requirement: CSS custom properties layer

The design system SHALL expose semantic tokens as CSS custom properties on `:root` for runtime theming.

#### Scenario: Semantic color variables exist

- **WHEN** the design system stylesheet is loaded
- **THEN** CSS variables `--ds-color-primary`, `--ds-color-surface`, and `--ds-color-text` are defined

### Requirement: Typography scale

The design system SHALL define heading and body typography scales consistent with the Figma text styles (e.g., `text-sm`, `text-base`, `text-lg`, `font-medium`, `font-semibold`).

#### Scenario: Heading styles match Figma scale

- **WHEN** a component applies `text-lg font-semibold`
- **THEN** the rendered font size and weight match the Figma heading style equivalent

### Requirement: Dark mode readiness

Token definitions SHALL support a `dark` variant via Tailwind `darkMode: 'class'` strategy.

#### Scenario: Dark mode toggles surface color

- **WHEN** the `dark` class is applied to `<html>`
- **THEN** surface and text token classes render dark-theme values
