## 1. Component Implementation

- [x] 1.1 Add `backdrop` prop (boolean, default `true`) to `Drawer.vue` — conditionally render the overlay div
- [x] 1.2 Add `resizable` prop (boolean, default `false`) to `Drawer.vue` — render drag handle and implement pointer-event-based width resize for left/right placements
- [x] 1.3 Build and type-check the package after component changes

## 2. Documentation

- [x] 2.1 Add `backdrop` and `resizable` props to the Drawer entry in `playground/data/catalog/entries.ts` using the existing `p()` helper
- [x] 2.2 Update the Drawer usage snippet in `playground/data/catalog/usageSnippets.ts` to show new props when non-default

## 3. Playground Demo

- [x] 3.1 Add `backdrop` and `resizable` Switch controls to `playground/demos/OverlayDrawerDemo.vue`
- [x] 3.2 Wire the new controls into the live code snippet generator so the snippet reflects current prop values

## 4. Tests

- [x] 4.1 Write test: backdrop=false hides the overlay div
- [x] 4.2 Write test: backdrop=true (default) renders the overlay div
- [x] 4.3 Write test: resizable=true renders a drag handle on left/right placements
- [x] 4.4 Run test suite to verify no regressions

## 5. Final Validation

- [x] 5.1 Build the package and playground to confirm no type/build errors
- [x] 5.2 Run the full test suite
