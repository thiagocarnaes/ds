## 1. Project Scaffold

- [x] 1.1 Initialize `packages/design-system` with Vite, Vue 3, TypeScript, and Tailwind CSS

  **Definição de Pronto:** `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, and `src/index.ts` exist; `npm install` succeeds.
  **Instruções de Teste:** Run `npm run build` in `packages/design-system` — exit code 0.
  **Notas:** Use Vite library mode with `@vitejs/plugin-vue`.
  **Dependências:** None.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 1.2 Configure Vitest and Vue Test Utils

  **Definição de Pronto:** `vitest.config.ts` exists; sample smoke test passes.
  **Instruções de Teste:** Run `npm run test` — all tests pass.
  **Notas:** Add `test` script to `package.json`.
  **Dependências:** 1.1.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 1.3 Create Vite playground for component preview

  **Definição de Pronto:** `playground/` app renders a home page listing component categories.
  **Instruções de Teste:** Run `npm run dev` — browser shows playground at localhost.
  **Notas:** Separate entry from library build.
  **Dependências:** 1.1.
  **Prioridade:** Média.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 1.4 Create root CHANGELOG and workspace configuration

  **Definição de Pronto:** `CHANGELOG.md` at repo root with initial entry; root `package.json` with workspaces if needed.
  **Instruções de Teste:** Verify CHANGELOG format (date, version, author, description).
  **Notas:** Update CHANGELOG after each task group completion.
  **Dependências:** 1.1.
  **Prioridade:** Média.
  **Tempo Estimado:** 5 min.
  **Status:** A Fazer.

## 2. Design Tokens

- [x] 2.1 Extract color tokens from Figma and map to Tailwind theme

  **Definição de Pronto:** `tailwind.config.ts` extends `colors` with semantic tokens (`primary`, `secondary`, `surface`, `muted`, `error`, etc.) matching Figma values.
  **Instruções de Teste:** Playground page renders color swatches; run `npm run build`.
  **Notas:** Inspect Figma Make file for exact hex values.
  **Dependências:** 1.1, 1.3.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 2.2 Define typography, spacing, radius, and shadow tokens

  **Definição de Pronto:** Tailwind theme includes `fontSize`, `fontFamily`, `spacing`, `borderRadius`, and `boxShadow` from Figma.
  **Instruções de Teste:** Playground typography page shows all text styles; run `npm run test`.
  **Notas:** Align with Figma text style names.
  **Dependências:** 2.1.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 2.3 Add CSS custom properties and dark mode support

  **Definição de Pronto:** `src/styles/tokens.css` defines `--ds-*` variables; `darkMode: 'class'` configured.
  **Instruções de Teste:** Toggle `dark` class in playground — colors switch; run `npm run build`.
  **Notas:** Import tokens CSS in library entry.
  **Dependências:** 2.1.
  **Prioridade:** Média.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

## 3. Action Components

- [x] 3.1 Implement `DsButton` (TDD)

  **Definição de Pronto:** Component with variants, sizes, disabled, loading; tests cover render, click, disabled, loading; exported from `index.ts`.
  **Instruções de Teste:** `npm run test -- DsButton`; verify in playground; `npm run build`.
  **Notas:** Use cva for variant classes; prefix `Ds`.
  **Dependências:** 2.1, 1.2.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 3.2 Implement `DsIconButton` (TDD)

  **Definição de Pronto:** Icon-only button with `aria-label`, variants, sizes; tests for a11y and click.
  **Instruções de Teste:** `npm run test -- DsIconButton`; playground preview; `npm run build`.
  **Notas:** Reuse button variant logic from 3.1.
  **Dependências:** 3.1.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 3.3 Implement `DsLink` (TDD)

  **Definição de Pronto:** Supports `href` and `to` props; external links get `target="_blank"`; tests pass.
  **Instruções de Teste:** `npm run test -- DsLink`; playground preview; `npm run build`.
  **Notas:** Use dynamic component (`a` vs `router-link`) when `to` is provided.
  **Dependências:** 2.1.
  **Prioridade:** Média.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

## 4. Form Components

- [x] 4.1 Implement `DsInput` and `DsTextarea` (TDD)

  **Definição de Pronto:** v-model, placeholder, disabled, error, size props; tests for binding and error state.
  **Instruções de Teste:** `npm run test -- DsInput DsTextarea`; playground form demo; `npm run build`.
  **Notas:** Match Figma input heights per size.
  **Dependências:** 2.1, 1.2.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 4.2 Implement `DsCheckbox` and `DsRadio` (TDD)

  **Definição de Pronto:** v-model, keyboard accessible, radio group via shared name; tests pass.
  **Instruções de Teste:** `npm run test -- DsCheckbox DsRadio`; playground; `npm run build`.
  **Notas:** Use native inputs styled with Tailwind for a11y.
  **Dependências:** 2.1.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 4.3 Implement `DsSwitch` and `DsSelect` (TDD)

  **Definição de Pronto:** Switch toggles boolean; Select binds options array; tests pass.
  **Instruções de Teste:** `npm run test -- DsSwitch DsSelect`; playground; `npm run build`.
  **Notas:** Start with styled native `<select>`; upgrade to custom if Figma requires.
  **Dependências:** 4.1.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 4.4 Implement `DsLabel` and `DsFormField` (TDD)

  **Definição de Pronto:** Label associates via `for`; FormField wraps control with label, helper, error; tests pass.
  **Instruções de Teste:** `npm run test -- DsFormField`; click label focuses input; `npm run build`.
  **Notas:** Default slot for control; props for label and messages.
  **Dependências:** 4.1.
  **Prioridade:** Média.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

## 5. Feedback Components

- [x] 5.1 Implement `DsAlert` and `DsBadge` (TDD)

  **Definição de Pronto:** Alert variants with dismiss; Badge variants and sizes; tests pass.
  **Instruções de Teste:** `npm run test -- DsAlert DsBadge`; playground; `npm run build`.
  **Notas:** Alert uses `role="alert"`.
  **Dependências:** 2.1.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 5.2 Implement `DsSpinner`, `DsProgress`, and `DsSkeleton` (TDD)

  **Definição de Pronto:** Spinner with aria-label; Progress 0–100 and indeterminate; Skeleton placeholder; tests pass.
  **Instruções de Teste:** `npm run test -- DsSpinner DsProgress DsSkeleton`; playground; `npm run build`.
  **Notas:** Progress uses `role="progressbar"`.
  **Dependências:** 2.1.
  **Prioridade:** Média.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 5.3 Implement `DsToast` and `useToast` composable (TDD)

  **Definição de Pronto:** Toast variants, auto-dismiss, composable API; tests for show/dismiss.
  **Instruções de Teste:** `npm run test -- useToast`; trigger toast in playground; `npm run build`.
  **Notas:** Teleport to body; stack multiple toasts.
  **Dependências:** 5.1.
  **Prioridade:** Média.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

## 6. Navigation Components

- [x] 6.1 Implement `DsTabs` family (TDD)

  **Definição de Pronto:** Tabs, TabList, Tab, TabPanel with v-model and keyboard nav; tests pass.
  **Instruções de Teste:** `npm run test -- DsTabs`; keyboard Arrow/Home/End in playground; `npm run build`.
  **Notas:** Follow WAI-ARIA tabs pattern.
  **Dependências:** 2.1.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 6.2 Implement `DsBreadcrumb` (TDD)

  **Definição de Pronto:** Breadcrumb + BreadcrumbItem with separator and current page; tests pass.
  **Instruções de Teste:** `npm run test -- DsBreadcrumb`; playground; `npm run build`.
  **Notas:** Last item uses `aria-current="page"`.
  **Dependências:** 3.3.
  **Prioridade:** Média.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 6.3 Implement `DsPagination` (TDD)

  **Definição de Pronto:** Props total, pageSize, currentPage; emits update; tests pass.
  **Instruções de Teste:** `npm run test -- DsPagination`; click pages in playground; `npm run build`.
  **Notas:** Hide pages when total fits one page.
  **Dependências:** 3.1.
  **Prioridade:** Média.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

## 7. Data Display Components

- [x] 7.1 Implement `DsCard` and `DsDivider` (TDD)

  **Definição de Pronto:** Card variants with header/footer slots; Divider horizontal/vertical; tests pass.
  **Instruções de Teste:** `npm run test -- DsCard DsDivider`; playground; `npm run build`.
  **Notas:** Match Figma card elevation tokens.
  **Dependências:** 2.1.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 7.2 Implement `DsAvatar` (TDD)

  **Definição de Pronto:** Image src, initials fallback, sizes sm/md/lg; tests pass.
  **Instruções de Teste:** `npm run test -- DsAvatar`; playground with image and initials; `npm run build`.
  **Notas:** Fallback on image error.
  **Dependências:** 2.1.
  **Prioridade:** Média.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 7.3 Implement `DsTable` family (TDD)

  **Definição de Pronto:** Table, Head, Body, Row, Cell with striped/hover options; tests pass.
  **Instruções de Teste:** `npm run test -- DsTable`; playground with sample data; `npm run build`.
  **Notas:** Semantic `<table>` markup.
  **Dependências:** 2.1.
  **Prioridade:** Média.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 7.4 Implement `DsList`, `DsListItem`, and `DsEmptyState` (TDD)

  **Definição de Pronto:** List structure and empty state with title, description, action slot; tests pass.
  **Instruções de Teste:** `npm run test -- DsEmptyState`; playground empty and populated states; `npm run build`.
  **Notas:** EmptyState useful for TodoList zero tasks.
  **Dependências:** 3.1.
  **Prioridade:** Média.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

## 8. Overlay Components

- [x] 8.1 Implement `DsModal` and `DsDialog` (TDD)

  **Definição de Pronto:** v-model:open, focus trap, Escape close, overlay click config; tests pass.
  **Instruções de Teste:** `npm run test -- DsModal`; keyboard and overlay in playground; `npm run build`.
  **Notas:** Use `@vueuse/core` useFocusTrap or equivalent.
  **Dependências:** 2.1, 3.1.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 8.2 Implement `DsTooltip` and `DsPopover` (TDD)

  **Definição de Pronto:** Tooltip on hover with placement; Popover click toggle; tests pass.
  **Instruções de Teste:** `npm run test -- DsTooltip DsPopover`; playground interactions; `npm run build`.
  **Notas:** Teleport overlay content.
  **Dependências:** 8.1.
  **Prioridade:** Média.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 8.3 Implement `DsDrawer` (TDD)

  **Definição de Pronto:** v-model:open, placement left/right/top/bottom; tests pass.
  **Instruções de Teste:** `npm run test -- DsDrawer`; open from each side in playground; `npm run build`.
  **Notas:** Reuse overlay logic from Modal.
  **Dependências:** 8.1.
  **Prioridade:** Média.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

## 9. Layout Components

- [x] 9.1 Implement `DsContainer`, `DsStack`, and `DsGrid` (TDD)

  **Definição de Pronto:** Container max-width breakpoints; Stack direction/gap; Grid responsive cols; tests pass.
  **Instruções de Teste:** `npm run test -- DsContainer DsStack DsGrid`; responsive demo in playground; `npm run build`.
  **Notas:** Align padding with Figma layout grid.
  **Dependências:** 2.2.
  **Prioridade:** Média.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

## 10. Integration and Finalization

- [x] 10.1 Complete barrel exports and TypeScript public API

  **Definição de Pronto:** All components exported from `src/index.ts` with types; no missing exports.
  **Instruções de Teste:** `npm run build`; import all exports in playground smoke page.
  **Notas:** Add JSDoc on public exports.
  **Dependências:** 3.x–9.x.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 10.2 Build playground showcase page per component

  **Definição de Pronto:** Playground routes or sections for every component with Figma parity checklist.
  **Instruções de Teste:** Manual visual review against Figma link; `npm run dev`.
  **Notas:** Document any intentional deviations in CHANGELOG.
  **Dependências:** 10.1.
  **Prioridade:** Média.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 10.3 Final validation, CHANGELOG update, and graphify

  **Definição de Pronto:** Full `npm run build && npm run test` pass; CHANGELOG updated; `graphify .` executed.
  **Instruções de Teste:** Run build, test, and graphify from repo root.
  **Notas:** Last task before archiving change.
  **Dependências:** 10.2.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.
