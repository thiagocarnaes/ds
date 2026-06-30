## ADDED Requirements

### Requirement: Drawer backdrop visibility control

The Drawer SHALL accept a `backdrop` prop (boolean, default `true`) that controls whether the semi-transparent overlay is rendered behind the panel.

#### Scenario: Backdrop is hidden when backdrop=false

- **WHEN** `<Drawer backdrop={false}>` is open
- **THEN** the drawer panel is visible without the semi-transparent overlay behind it

#### Scenario: Backdrop is visible by default

- **WHEN** `<Drawer>` is open without specifying backdrop
- **THEN** the semi-transparent overlay is rendered behind the panel (current behavior preserved)

#### Scenario: Escape still closes drawer without backdrop

- **WHEN** a drawer with `backdrop={false}` is open and the user presses Escape
- **THEN** the drawer closes
