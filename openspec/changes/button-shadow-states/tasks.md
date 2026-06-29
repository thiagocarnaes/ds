## 1. Shadow tokens and buttonVariants

- [ ] 1.1 Add `--shadow-inner` to theme.css (light + dark) and `@theme inline`

  **Definição de Pronto:** `theme.css` has `--shadow-inner` defined in `:root` (light) and `.dark` (dark), plus `--shadow-inner: var(--shadow-inner)` or equivalent in `@theme inline` so Tailwind generates the `shadow-inner` utility.
  **Instruções de Teste:** `npm run build` succeeds; inspect the button in devtools — `shadow-inner` class applies the expected inset shadow in both light and dark modes.
  **Notas:** Use light `inset 0 1px 3px rgba(11,21,38,0.1)` and dark `inset 0 1px 3px rgba(0,0,0,0.4)` — adjust opacity after visual review.
  **Dependências:** Nenhuma.
  **Prioridade:** Alta.
  **Tempo Estimado:** 5 min.
  **Status:** A Fazer.

- [ ] 1.2 Update all 9 button variant strings in buttonVariants.ts with shadow + pressed state classes

  **Definição de Pronto:** Each variant in `buttonVariants.ts` includes `shadow-sm` on idle, `hover:shadow-md` on hover, and `active:translate-y-px active:scale-[0.98] active:shadow-inner` on press. The old colored-glow shadows (`shadow-primary`, `shadow-primary-hover`, `shadow-destructive`, `shadow-destructive-hover`) are removed.
  **Instruções de Teste:** `npm run test` passes; open playground — all variants show subtle shadow, hover increases shadow, click shows pressed effect. Check dark mode too.
  **Notas:** The `transition-all` class is already on the base CVA string — no need to add it. Test each variant visually.
  **Dependências:** 1.1.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

## 2. Playground updates

- [ ] 2.1 Remove `ds-glow-primary` from ButtonCard.vue

  **Definição de Pronto:** `ButtonCard.vue` no longer passes `:class="variant === 'primary' ? 'ds-glow-primary' : undefined"` to `<Button>`.
  **Instruções de Teste:** Open playground home — primary button has no glow animation, only the new `shadow-sm` / `shadow-md`.
  **Notas:** The `ds-glow-pulse` keyframes in `playground.css` can remain (they may be used elsewhere) but can be cleaned up if found unused.
  **Dependências:** 1.2.
  **Prioridade:** Média.
  **Tempo Estimado:** 5 min.
  **Status:** A Fazer.

- [ ] 2.2 Remove `ds-glow-primary` from DrawerPlayground.vue

  **Definição de Pronto:** `DrawerPlayground.vue` no longer passes the `ds-glow-primary` class to the primary Button in the interactive preview.
  **Instruções de Teste:** Open Button drawer playground — preview button shows neutral shadow, not glow.
  **Dependências:** 1.2.
  **Prioridade:** Média.
  **Tempo Estimado:** 5 min.
  **Status:** A Fazer.

- [ ] 2.3 Add "Button States" matrix to DrawerPlayground.vue

  **Definição de Pronto:** The Button drawer playground renders a state matrix beside the interactive preview, showing 9 rows (one per variant) × 3 columns (Default, Hover, Pressed). Hover/pressed states use forced CSS classes to simulate the pseudo-class styles (e.g., `shadow-md` for hover, `shadow-md translate-y-px scale-[0.98] shadow-inner` for pressed). Each button shows its variant name or a short label.
  **Instruções de Teste:** Open Button drawer playground — state matrix is visible, each cell shows the correct visual state. Compare hover column to actual hover behavior.
  **Notas:** Use a responsive layout. On mobile (< 768px) the matrix may stack. Use existing playground locale keys or inline labels.
  **Dependências:** 1.2, 2.2.
  **Prioridade:** Alta.
  **Tempo Estimado:** 15 min.
  **Status:** A Fazer.

## 3. Tests

- [ ] 3.1 Verify button shadow and pressed state in DsButton.spec.ts

  **Definição de Pronto:** `DsButton.spec.ts` includes assertions that a rendered Button has `shadow-sm` in its computed classes, and that `shadow-md`, `translate-y-px`, `scale-[0.98]`, and `shadow-inner` appear when hover/active classes are manually applied.
  **Instruções de Teste:** `npx vitest run tests/DsButton.spec.ts` passes.
  **Notas:** Use `wrapper.classes()` or `wrapper.attributes('class')` to check class presence. No need to test every variant — one representative test per state is sufficient.
  **Dependências:** 1.2.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [ ] 3.2 Update ButtonCard snapshot or visual test if applicable

  **Definição de Pronto:** If the ButtonCard has a snapshot test, it's updated to reflect the removed `ds-glow-primary`. Otherwise, skip.
  **Instruções de Teste:** `npx vitest run tests/ButtonCard.spec.ts` (if exists) passes.
  **Dependências:** 2.1.
  **Prioridade:** Baixa.
  **Tempo Estimado:** 5 min.
  **Status:** A Fazer.

## 4. Finalize

- [ ] 4.1 Run full test suite and fix regressions

  **Definição de Pronto:** `npx vitest run` passes with zero failures across all test files.
  **Instruções de Teste:** Run `npx vitest run`.
  **Dependências:** 3.1, 3.2.
  **Prioridade:** Alta.
  **Tempo Estimado:** 5 min.
  **Status:** A Fazer.

- [ ] 4.2 Update CHANGELOG

  **Definição de Pronto:** Entry added to `CHANGELOG.md` describing the button shadow and pressed state changes.
  **Instruções de Teste:** Verify CHANGELOG format matches existing entries.
  **Dependências:** 4.1.
  **Prioridade:** Média.
  **Tempo Estimado:** 5 min.
  **Status:** A Fazer.

- [ ] 4.3 Run graphify update

  **Definição de Pronto:** `graphify update .` executes successfully.
  **Instruções de Teste:** Verify graphify-out/ directory is updated.
  **Dependências:** 4.2.
  **Prioridade:** Média.
  **Tempo Estimado:** 5 min.
  **Status:** A Fazer.
