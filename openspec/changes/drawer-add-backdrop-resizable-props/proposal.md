## Why

The Drawer component always renders a semi-transparent backdrop and has a fixed width, offering no flexibility to hide the overlay or resize the panel. Users need control over backdrop visibility (e.g., for embedded drawer-like panels) and the ability to resize the drawer width. These options exist in other component libraries but are absent from both the component implementation and the documentation/playground.

## What Changes

- Add `backdrop` prop (boolean, default `true`) to the Drawer component to conditionally hide the overlay
- Add `resizable` prop (boolean, default `false`) to enable drag-to-resize on the drawer panel
- Update component catalog documentation (`entries.ts`) to include the new props
- Update playground demo (`OverlayDrawerDemo.vue`) with interactive controls for both props

## Capabilities

### New Capabilities
- `drawer-backdrop`: Control overlay visibility on the Drawer component
- `drawer-resizable`: Enable drag-to-resize on the Drawer panel

### Modified Capabilities
- *(none — existing overlay-components spec covers basic drawer behavior; new props extend it without changing existing requirements)*

## Impact

- `packages/design-system/src/components/overlay/Drawer.vue` — add `backdrop` and `resizable` props
- `packages/design-system/playground/data/catalog/entries.ts` — add props to API docs
- `packages/design-system/playground/data/catalog/usageSnippets.ts` — update snippet if needed
- `packages/design-system/playground/demos/OverlayDrawerDemo.vue` — add interactive controls
- `openspec/changes/drawer-add-backdrop-resizable-props/specs/drawer-backdrop/spec.md` — new spec
- `openspec/changes/drawer-add-backdrop-resizable-props/specs/drawer-resizable/spec.md` — new spec
