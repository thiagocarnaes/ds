## Context

The Drawer component (`Drawer.vue`) currently renders a fixed backdrop overlay (`bg-black/60`) unconditionally and has a fixed panel width (`w-80 max-w-[85vw]`). The component catalog (`entries.ts`) and interactive playground demo (`OverlayDrawerDemo.vue`) document only existing props (`placement`, `closeOnOverlay`, `class`). Two new capabilities — backdrop visibility control and panel resizing — need to be added to the component, documentation, and playground.

## Goals / Non-Goals

**Goals:**
- Add `backdrop` prop (boolean, default `true`) to conditionally render the overlay
- Add `resizable` prop (boolean, default `false`) to enable drag-to-resize on the drawer panel
- Update catalog docs with both new props
- Update playground demo with interactive controls for both props
- Update usage snippet to reflect new props

**Non-Goals:**
- No changes to other overlay components (Modal, Dialog, Popover, Tooltip)
- No style changes to existing Drawer behavior
- No resize handles for top/bottom placements (resize is width-only for left/right)
- No persistence of drawer width across sessions

## Decisions

1. **`backdrop` prop as simple boolean** — When `false`, the overlay `<div>` is not rendered at all. The drawer panel remains open but without the semi-transparent backdrop. This matches the pattern used by similar libraries (shadcn/vue, Headless UI). The `closeOnOverlay` prop becomes irrelevant when `backdrop` is `false` (no overlay to click), but is kept for when backdrop is enabled.

2. **`resizable` prop adds a drag handle** — When `true`, a thin vertical drag handle appears at the right edge (left placement) or left edge (right placement) of the panel. The user can drag to resize the panel width between `min-w-[280px]` and `max-w-[90vw]`. Implemented via `@vueuse/core`'s `useDraggable` or native pointer events for simplicity, avoiding new dependencies. For top/bottom placement, the prop is accepted but has no visual effect (resize is width-only).

3. **Catalog docs follow existing patterns** — New props are added using the existing `p()` helper in `entries.ts` with proper types, defaults, and descriptions. The `usageSnippets.ts` snippet is minimally updated to show both props only when non-default.

4. **Playground controls use Switch toggles** — Following the same pattern as `closeOnOverlay`, both `backdrop` and `resizable` get Switch controls in the demo panel. The code snippet auto-updates to reflect the current prop values.

5. **No external dependencies** — Resize is handled with native pointer events, keeping the dependency footprint unchanged.

## Risks / Trade-offs

- **[Resize with top/bottom placement]** The drag handle only makes sense for left/right. For top/bottom, `resizable` is accepted but does nothing. This is documented in the prop description to avoid confusion.
- **[Backdrop removal changes interaction model]** Without a backdrop, clicking outside the drawer won't close it. Users must use Escape or an explicit close button. This is the expected UX (same as modal with `closeOnOverlay={false}`).
- **[Accessibility]** The drag handle needs proper ARIA attributes (`role="separator"`, `aria-orientation="vertical"`, `aria-valuenow` for current width) to be keyboard accessible.
- **[Test coverage]** New props need unit tests in `tests/overlay-layout.spec.ts` for conditional rendering and resize behavior.
