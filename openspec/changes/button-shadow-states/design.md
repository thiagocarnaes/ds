## Context

The button system uses `class-variance-authority` (CVA) with 9 variants and 6 sizes. Currently only `primary` and `destructive` variants have shadow effects — colored glow shadows via `--primary-shadow` / `--destructive-shadow`. No variant has a pressed (`active:`) style. The `theme.css` already defines `--shadow-sm` and `--shadow-md` with dark mode overrides, which can be reused.

## Goals / Non-Goals

**Goals:**
- All button variants render with a neutral `shadow-sm` on idle and `hover:shadow-md` on hover.
- All button variants respond to pressed state with `translateY`, `scale`, and `inset shadow`.
- The playground drawer shows a side-by-side state matrix (default, hover, pressed) for each variant.
- Dark theme shadows work correctly out of the box.

**Non-Goals:**
- No changes to button sizing, padding, border radius, or color semantics.
- No changes to the library's public API (props, emits, slots).
- No changes to IconButton or ButtonGroup (they inherit from Button).

## Decisions

1. **Neutral shadows over colored glow** — All variants use `shadow-sm` / `shadow-md` from Tailwind's theme scale instead of variant-specific colored glow. These already have dark mode overrides in `theme.css`. Rationale: simpler, consistent, and the color background already differentiates variants.

2. **Pressed state: translate + scale + inset shadow** — `active:translate-y-px` moves the button down 1px, `active:scale-[0.98]` shrinks it 2%, and `active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)]` adds an inner shadow to simulate depth. The `transition-all` class on the button ensures smooth animation.

3. **`--shadow-inner` token in theme.css** — Defined once in `@theme inline` and overridden in `.dark` so `shadow-inner` works as a Tailwind utility. Light: inset shadow with low opacity black. Dark: inset shadow with higher opacity black (compensating for darker background).

4. **State matrix in DrawerPlayground** — Uses forced CSS classes rather than pseudo-class simulation. Each state (default, hover, pressed) renders a `<Button>` with explicit class overrides matching what the pseudo-classes would apply. Placed alongside the interactive preview, not replacing it.

5. **Remove `ds-glow-primary`** — This animation class on primary buttons conflicts with the new neutral shadow approach. Removing it from `ButtonCard.vue` and `DrawerPlayground.vue`. The `shadow-sm`/`shadow-md` provide sufficient visual feedback.

## Risks / Trade-offs

- **[Subtlety]** Neutral shadows on `ghost` and `link` variants may look unusual since these are meant to be text-weight buttons. Mitigation: use `shadow-xs` for `ghost`/`link`/`subtle` instead of `shadow-sm`, or accept the trade-off since shadows are minimal.
- **[Tailwind v4]** `shadow-inner` is not a built-in utility in Tailwind v4 — it must be defined via `--shadow-inner` in `@theme`. Mitigation: confirmed, the token will be added to `theme.css`.
- **[Accessibility]** Pressed state via `scale` may trigger vestibular issues in some users. Mitigation: the `prefers-reduced-motion: reduce` media query can disable the scale transform if needed, but the translate and inset shadow remain.
