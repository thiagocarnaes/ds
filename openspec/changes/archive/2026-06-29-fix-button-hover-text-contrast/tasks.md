## 1. Design Tokens

- [x] 1.1 Add `--ds-color-text-hovered: var(--accent)` in `tokens.css` alongside other text tokens
- [x] 1.2 Add `--color-text-hovered: var(--ds-color-text-hovered)` in `theme.css` under the semantic colors section

## 2. Button Variants

- [x] 2.1 Update `ghost` variant: replace `hover:text-accent-foreground` with `hover:text-text-hovered` in `buttonVariants.ts`
- [x] 2.2 Update `outline` variant: replace `hover:text-accent-foreground` with `hover:text-text-hovered` in `buttonVariants.ts`

## 3. Verification

- [x] 3.1 Run build to confirm no errors
- [x] 3.2 Run existing Button tests (`tests/Button.spec.ts`) to confirm no regressions
- [x] 3.3 Run `graphify .` to update architecture knowledge graph
