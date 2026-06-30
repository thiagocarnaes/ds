## ADDED Requirements

### Requirement: Drawer resizable panel

The Drawer SHALL accept a `resizable` prop (boolean, default `false`) that enables width-based drag-to-resize on left/right placements via a visible drag handle.

#### Scenario: Drag handle appears when resizable=true

- **WHEN** `<Drawer resizable placement="left">` or `<Drawer resizable placement="right">` is open
- **THEN** a visible drag handle appears on the trailing edge of the panel

#### Scenario: Panel width changes on drag

- **WHEN** the user drags the resize handle on a resizable drawer
- **THEN** the panel width changes accordingly, constrained between `280px` and `90vw`

#### Scenario: Resizable has no visible effect on top/bottom placement

- **WHEN** `<Drawer resizable placement="top">` or `<Drawer resizable placement="bottom">` is open
- **THEN** no drag handle appears and the panel dimensions are unchanged
