## 1. Setup

- [x] 1.1 Install vue-router and configure router module

  **Definição de Pronto:** `vue-router` added to devDependencies in `packages/design-system/package.json`; `playground/router/index.ts` created with `createRouter` using `createWebHistory` and 4 routes (`/`, `/foundations`, `/catalog`, `/docs`).
  **Instruções de Teste:** Run `npm install` — no errors; `npm run dev` — playground loads without errors.
  **Notas:** Do NOT add vue-router as a dependency of the library — only devDependencies for the playground. Use `createWebHistory` for clean URLs.
  **Dependências:** Nenhuma.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 1.2 Register router in playground main.ts

  **Definição de Pronto:** `playground/main.ts` imports and calls `app.use(router)` before mounting.
  **Instruções de Teste:** Run `npm run dev` — playground loads; navigate to `/foundations` manually — FoundationsPage renders.
  **Notas:** Import router from `./router`.
  **Dependências:** 1.1.
  **Prioridade:** Alta.
  **Tempo Estimado:** 5 min.
  **Status:** A Fazer.

## 2. Refactor App.vue navigation state

- [x] 2.1 Replace state-based page rendering with `<router-view>`

  **Definição de Pronto:** `App.vue` removes `activePage`, `activeCat` refs and `setCategory`/`handleNavigate` functions; conditional `v-if` blocks (`page === 'foundations'` etc.) replaced by a single `<router-view>`. Header category filter buttons (`all`, `foundations`, `catalog`, `docs`) removed or adjusted since routing handles page switching.
  **Instruções de Teste:** `npm run dev` — all 4 pages accessible via direct URL navigation; homepage shows landing content.
  **Notas:** Keep home bento grid and hero section rendered directly in `App.vue` at route `/`. Remove `PlaygroundCategoryNav` event listeners from template.
  **Dependências:** 1.2.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 2.2 Update header nav buttons to use `<router-link>`

  **Definição de Pronto:** Header navigation buttons (Home, Foundations, Components, Docs) use `<router-link :to="...">` instead of `@click="setCategory(...)"`. Active route is highlighted using `$route.path` or `router-link-active` class.
  **Instruções de Teste:** Click each nav button — URL updates and correct page renders; active button has distinct visual style.
  **Notas:** Use `exact` prop on Home route link to avoid matching all paths.
  **Dependências:** 2.1.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 2.3 Update QuickNav cards to use `<router-link>`

  **Definição de Pronto:** `HomeQuickNavSection.vue` replaces `emit('navigate', page)` with `<router-link :to="page">` for Foundations, Catalog, and Docs cards.
  **Instruções de Teste:** Click each quick-nav card — browser navigates to correct route; back button returns to home.
  **Notas:** Remove `navigate` event from the component interface if no longer needed.
  **Dependências:** 2.1.
  **Prioridade:** Alta.
  **Tempo Estimado:** 5 min.
  **Status:** A Fazer.

- [x] 2.4 Update PlaygroundCategoryNav to use router

  **Definição de Pronto:** `PlaygroundCategoryNav.vue` uses `useRouter()` internally or receives a navigation callback; emits `select` are replaced by direct `router.push()`.
  **Instruções de Teste:** Open mobile viewport; tap each category — correct page renders.
  **Notas:** Remove `defineEmits(['select'])` if no other consumers.
  **Dependências:** 2.1.
  **Prioridade:** Média.
  **Tempo Estimado:** 5 min.
  **Status:** A Fazer.

## 3. Catalog hash-based routing

- [x] 3.1 Update ComponentsCatalogPage to use `$route.hash` for component selection

  **Definição de Pronto:** `ComponentsCatalogPage.vue` reads `$route.hash` on mount and watches it for changes; clicking a component in the sidebar sets `$router.replace({ hash: '#catalog-ComponentName' })`. Component selection works on page load from URL with hash.
  **Instruções de Teste:** Visit `/catalog#catalog-Button` — Button demo is displayed; click another component — hash updates in URL bar; browser back preserves history.
  **Notas:** Keep existing `selectedName` logic but drive it from `$route.hash` instead of `window.location.hash`. Use `watch` from vue-router.
  **Dependências:** 2.1.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

## 4. Test adjustments

- [x] 4.1 Update playground tests to use RouterView stub or real router

  **Definição de Pronto:** Existing tests that mount `App.vue` or page components are updated: either wrap with `RouterView` stub or mount with `createRouter` for `$route` and `$router` access.
  **Instruções de Teste:** Run `npm run test` — all tests pass.
  **Notas:** `vue-router` provides `RouterView` and `RouterLink` stubs for testing.
  **Dependências:** 3.1.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

- [x] 4.2 Run full test suite and fix regressions

  **Definição de Pronto:** `npm run test` passes with zero failures; `npm run build` succeeds.
  **Instruções de Teste:** Run `npm run test && npm run build` — exit code 0.
  **Notas:** Check for any component tests that indirectly depend on playground routing.
  **Dependências:** 4.1.
  **Prioridade:** Alta.
  **Tempo Estimado:** 10 min.
  **Status:** A Fazer.

## 5. Finalize

- [x] 5.1 Update CHANGELOG

  **Definição de Pronto:** `CHANGELOG.md` updated with entry describing the vue-router integration, date, version, and author.
  **Instruções de Teste:** Verify CHANGELOG format matches existing entries.
  **Notas:** Use Conventional Commits style for the entry.
  **Dependências:** 4.2.
  **Prioridade:** Média.
  **Tempo Estimado:** 5 min.
  **Status:** A Fazer.

- [x] 5.2 Run graphify update

  **Definição de Pronto:** `graphify update .` executes successfully.
  **Instruções de Teste:** Verify graphify-out/ directory is updated.
  **Notas:** Run from repo root.
  **Dependências:** 5.1.
  **Prioridade:** Média.
  **Tempo Estimado:** 5 min.
  **Status:** A Fazer.
