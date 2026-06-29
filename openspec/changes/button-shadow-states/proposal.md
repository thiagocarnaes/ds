## Why

Buttons currently lack visual feedback for hover and pressed states across most variants — only `primary` and `destructive` have glow shadows, and no variant has an `active:` (pressed) style. This makes the design system feel flat and unresponsive. Adding consistent neutral shadows and pressed-state feedback to all variants improves perceived interactivity and polish, with full dark theme support.

## What Changes

- **All button variants** (`primary`, `secondary`, `outline`, `ghost`, `destructive`, `link`, `warning`, `discovery`, `subtle`) gain a neutral `shadow-sm` on idle and `hover:shadow-md` on hover.
- **All button variants** gain a pressed state via `active:translate-y-px`, `active:scale-[0.98]`, and `active:shadow-inner`.
- **Playground Drawer** (`DrawerPlayground.vue`) gets a new "Button States" matrix showing default / hover / pressed side by side for each variant, alongside the existing interactive preview.
- **`ds-glow-primary`** animation class removed from `ButtonCard.vue` and `DrawerPlayground.vue` — glow was only applied to primary variant and conflicts with the new neutral shadow approach.
- **`--shadow-inner`** token added to `theme.css` (light + dark mode).

## Capabilities

### New Capabilities
- `button-states`: Visual feedback states (idle shadow, hover shadow, pressed transform/shadow) for all button variants, plus a playground showcase.

### Modified Capabilities
- _(none — no existing spec files at `openspec/specs/`)_

## Impact

- `packages/design-system/src/components/button/buttonVariants.ts` — CVA class strings updated for all 9 variants.
- `packages/design-system/src/styles/theme.css` — new `--shadow-inner` token in `@theme inline` and `.dark`.
- `packages/design-system/playground/components/DrawerPlayground.vue` — new state showcase section.
- `packages/design-system/playground/cards/ButtonCard.vue` — remove `ds-glow-primary`.
- `packages/design-system/tests/DsButton.spec.ts` — verify shadow classes and pressed state.
- **No new dependencies** — Tailwind shadow utilities `shadow-sm`, `shadow-md`, `translate-y-px`, `scale-[0.98]` already available.
