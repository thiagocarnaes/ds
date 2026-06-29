## ADDED Requirements

### Requirement: Button idle shadow

All button variants SHALL display a subtle neutral box-shadow by default (idle state) that is visible in both light and dark themes.

#### Scenario: Primary variant has idle shadow
- **WHEN** a Button with `variant="primary"` is rendered
- **THEN** the button SHALL have a `box-shadow` matching `--shadow-sm` value

#### Scenario: Secondary variant has idle shadow
- **WHEN** a Button with `variant="secondary"` is rendered
- **THEN** the button SHALL have a `box-shadow` matching `--shadow-sm` value

#### Scenario: Outline variant has idle shadow
- **WHEN** a Button with `variant="outline"` is rendered
- **THEN** the button SHALL have a `box-shadow` matching `--shadow-sm` value

#### Scenario: Ghost variant has idle shadow
- **WHEN** a Button with `variant="ghost"` is rendered
- **THEN** the button SHALL have a `box-shadow` matching `--shadow-sm` value

#### Scenario: Destructive variant has idle shadow
- **WHEN** a Button with `variant="destructive"` is rendered
- **THEN** the button SHALL have a `box-shadow` matching `--shadow-sm` value

#### Scenario: Warning variant has idle shadow
- **WHEN** a Button with `variant="warning"` is rendered
- **THEN** the button SHALL have a `box-shadow` matching `--shadow-sm` value

#### Scenario: Discovery variant has idle shadow
- **WHEN** a Button with `variant="discovery"` is rendered
- **THEN** the button SHALL have a `box-shadow` matching `--shadow-sm` value

#### Scenario: Subtle variant has idle shadow
- **WHEN** a Button with `variant="subtle"` is rendered
- **THEN** the button SHALL have a `box-shadow` matching `--shadow-sm` value

#### Scenario: Link variant has idle shadow
- **WHEN** a Button with `variant="link"` is rendered
- **THEN** the button SHALL have a `box-shadow` matching `--shadow-sm` value

#### Scenario: Idle shadow works in dark theme
- **WHEN** a Button is rendered inside a `.dark` container
- **THEN** the idle shadow SHALL use the dark theme `--shadow-sm` value

### Requirement: Button hover shadow

All button variants SHALL display an increased neutral box-shadow on hover to indicate interactivity.

#### Scenario: Hover shadow is larger than idle
- **WHEN** a Button is hovered
- **THEN** the button SHALL have a `box-shadow` matching `--shadow-md` value

#### Scenario: Hover shadow works in dark theme
- **WHEN** a Button inside a `.dark` container is hovered
- **THEN** the hover shadow SHALL use the dark theme `--shadow-md` value

### Requirement: Button pressed state

All button variants SHALL display a pressed-state visual feedback when actively clicked (the `:active` pseudo-class), combining translateY, scale transform, and inset shadow.

#### Scenario: Pressed state translates down
- **WHEN** a Button is pressed (`:active`)
- **THEN** the button SHALL move `1px` downward (`translateY(1px)`)

#### Scenario: Pressed state scales down
- **WHEN** a Button is pressed (`:active`)
- **THEN** the button SHALL scale to `98%` (`scale(0.98)`)

#### Scenario: Pressed state shows inset shadow
- **WHEN** a Button is pressed (`:active`)
- **THEN** the button SHALL display an inset shadow matching `--shadow-inner`

#### Scenario: Pressed state transitions smoothly
- **WHEN** a Button is pressed and released
- **THEN** the transition between pressed and idle states SHALL be animated via the existing `transition-all` class

### Requirement: Playground state showcase

The Button drawer playground SHALL display a visual matrix showing each variant's three states (default, hover, pressed) side by side.

#### Scenario: State matrix shows all variants
- **WHEN** the Button drawer playground is open
- **THEN** a "Button States" section SHALL display rows for each variant (`primary`, `secondary`, `outline`, `ghost`, `destructive`, `link`, `warning`, `discovery`, `subtle`)
- **AND** each row SHALL have three columns: Default, Hover, Pressed

#### Scenario: State matrix is alongside interactive preview
- **WHEN** the Button drawer playground is open
- **THEN** the state matrix SHALL be positioned beside (not below) the interactive preview button

### Requirement: Remove ds-glow-primary

The `ds-glow-primary` CSS class SHALL be removed from the playground to avoid conflict with the new neutral shadow approach.

#### Scenario: ButtonCard does not use ds-glow-primary
- **WHEN** `ButtonCard.vue` renders a primary variant Button
- **THEN** the button SHALL NOT have the `ds-glow-primary` CSS class

#### Scenario: DrawerPlayground does not use ds-glow-primary
- **WHEN** `DrawerPlayground.vue` renders a primary variant Button
- **THEN** the button SHALL NOT have the `ds-glow-primary` CSS class
