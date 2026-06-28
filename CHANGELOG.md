# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.5.1] - 2026-06-28

### Added

- **Playground locale switcher** — language selector in the header now works correctly; switching between English and Português (Brasil) updates all UI text reactively without a page reload.
- **`FoundationsPage` Iconography tab** — new tab with searchable icon grid, size selector, color picker, and click-to-copy `<ComponentName />` snippet.
- **`FoundationsPage` translations** — all tab labels, section headings, and hint texts are now fully translated via the i18n system (en / pt-BR).
- **`ComponentsCatalogPage` Showcases section** — sidebar nav group and mobile `<optgroup>` listing showcase demos (e.g. AI Chat) separately from library components; selecting a showcase renders `ChatPreviewCard` without API/Usage tables.
- **`FlagGroupDemo` `isDismissible` toggle** — live Switch control and reactive code snippet that conditionally includes `:is-dismissible="true"` on each `<Flag>`.
- **`foundationsPage` i18n keys** — `badge`, `title`, `subtitle`, `tabs.*`, and `sections.*` added to both `en.ts` and `pt-BR.ts`.
- **`HomeChangelogSection`** — reads real entries from `changelogData.ts`; date formatted according to active locale.

### Changed

- **`Select` / `Drawer` / `Modal` / `Tooltip` / `Popover` / `FlagGroup` / `ToastHost` / `DataTableColumnFilterMenu` / `DateInput`** — replaced `z-[--ds-z-*]` Tailwind arbitrary values with `z-[var(--ds-z-*)]`; Tailwind v4 was generating invalid `z-index: --ds-z-dropdown` (no `var()`) causing dropdowns and overlays to render behind the sticky header.
- **`FoundationsPage` header** — aligned with `ComponentsCatalogPage` and `DocumentationPage` style: `Layers` icon, `md:p-8` padding, `max-w-2xl` subtitle, `mb-4` badge row spacing.
- **`FoundationsPage` color tokens grid** — switched from `flex flex-wrap` to CSS grid (`minmax(180px, 1fr)`) so token names and resolved values are always fully visible without truncation.
- **`FoundationsPage` motion grid** — switched from `flex flex-wrap gap-8` to CSS grid (`minmax(160px, 1fr)`); all five easing buttons stay on one consistent row.
- **`ColorSwatch`** — width fills grid cell; token name and resolved value use `break-all` so long values like `color-mix(in srgb, ...)` wrap naturally instead of overflowing.
- **`ShadowCard`** — width fills grid cell; token name uses `break-all`; preview card scales to cell width.
- **`MotionDemo`** — changed from `inline-flex items-center` to `flex items-start`; button has `self-start`; label text left-aligned.
- **`HomeQuickStartSection` copy button** — replaced custom `.copy-btn` styles with `pg-usage-copy` class to match `UsageBlock` appearance on `DocumentationPage`.
- **`HomeChangelogSection`** — `changelogData.ts` rewritten with real versions from `CHANGELOG.md` (`0.2.7`, `0.2.6`, `0.1.8`, `0.1.0`) replacing placeholder i18n keys with inline `desc` strings.
- **`App.vue`** — GitHub link uses `<Github>` icon instead of `<ArrowUpRight>`; removed stable badge and version span from header.
- **`PlaygroundHero`** — removed version line and CTA buttons block; hero shows only logo, title, subtitle, and stat pills.
- **i18n** — removed residual `":appearance"` prop references in `en.ts`, `pt-BR.ts`, and `componentCatalogDescriptions.ts` for `Button`, `Flag`, and `SectionMessage`; replaced with `"variant"`.
- **`FormFieldDemo`** — `z-10` added to `<Mail>` icon to ensure visibility when `withIcon=true`; `inputPaddingClass` verified to return `pl-9`.

### Fixed

- **Dropdown/overlay z-index** — `z-[var(--ds-z-dropdown)]` (200) now resolves correctly in browser, fixing `PlaygroundLocaleSelect`, column filter menus, tooltips, and modals being hidden behind the sticky header (`z-40`).
- **`PlaygroundLocaleSelect`** — locale change now updates all translated text reactively; root cause was the invalid z-index preventing interaction with the dropdown panel.

## [0.2.7] - 2026-06-16

### Changed

- **`AppLayout` settings footer** — pin an explicit `SidebarMenuGroup` or lone `SidebarMenuItem` whose `id` matches `settingsMenuId` (default `settings`); removed `settingsMenuLabel` and automatic grouping by id prefix (`settings.*`).
- **Playground Layout demo** — settings use `SidebarMenuGroup id="settings"` with flyout children, or a single `SidebarMenuItem id="settings"` when toggled off.

## [0.2.6] - 2026-06-16

### Added

- **`AppLayout` composed menu** — single `#menu` slot with built-in chevron toggle; items matching `settingsMenuId.*` pin to the settings footer when `:settings-menu="true"`.
- **`AppLayout` settings footer** — `:settings-menu="true"` pins a gear-icon `SidebarMenuGroup` at the bottom of the sidebar (`settings-menu-label`, `settings-menu-id`).
- **`AppLayout` menu models** — `v-model:active-menu-id` and `v-model:open-menu-keys` for composed sidebar state.
- **`SidebarMenuGroup.flyoutPlacement`** — `'auto' | 'down' | 'up'`; settings group in `AppLayout` opens upward by default.

### Changed

- **`AppLayout`** — single `#menu` slot replaces `#menu-items` / `#settings-menu`; built-in collapse toggle; settings items identified by id prefix (`settings.*` by default).
- **`SidebarMenu`** — selects the first registered item when `activeId` is empty; top-level items no longer activate sibling groups that share an id prefix (e.g. `todos.all` vs group `todos`).
- **Playground Layout demo** — composed menu, settings toggle, default active item `dashboard`.
- **Package README** — `AppLayout` examples and sidebar id conventions aligned with the playground catalog.

### Fixed

- **`SidebarMenuGroup`** — icon/chevron active styles no longer treat all groups as selected on first paint.
- **`AppLayout`** — content region height, footer visibility, and settings submenu flyout direction near the viewport bottom.

## [0.1.8] - 2026-06-16

### Added

- **`DateInput`** — date field with calendar popover and locale-aware display (e.g. `dd/mm/aaaa` in pt-BR).
- **Playground Library** — catalog of 58 exported components with descriptions, usage snippets, and *Open playground* when a demo exists.
- **28 interactive drawer demos**, including `Input`, `DateInput`, `Switch`, `RadioGroup`, `FormField`, `Dialog`, `Drawer`, `Tooltip`, `Popover`, `Progress`, `Skeleton`, and `Layout Primitives` (Container, Stack, Grid).
- **Showcase section** — composite demos (e.g. AI Chat) separated from library component playgrounds.
- **Playground aliases** — subcomponents (e.g. `AppLayout`, `TabPanel`, `PageSizeSelect`) open the parent demo.
- **Playground i18n** — English and pt-BR for UI, DataTable labels, and component catalog descriptions.
- **Button shadow tokens** — `--primary-shadow`, `--destructive-shadow`, and hover variants for primary and danger appearances.
- **`playground/demos/`** registry for modular drawer demos.

### Changed

- **`DataTable`** — only one column filter open at a time; i18n labels; `locale` prop for date cell formatting; responsive pagination footer.
- **`Pagination`** — improved mobile/tablet layout.
- **Playground navigation** — hover states on category tabs (`.pg-nav-btn`).
- **Playground hero** — dynamic version from `package.json`; Playground button scrolls to the current category’s demo grid.
- **`FormField` playground** — example with leading/trailing icons via composition pattern.
- **README** (root and package) — updated for 58 components, playground structure, DateInput, Card slots, Switch vs Toggle.

### Fixed

- Column filter popovers using native `type="date"` replaced by `DateInput` for consistent pt-BR UX.
- Primary button hover feedback (symmetric glow shadow; playground `ds-glow-primary` no longer overrides hover).

## [0.1.0] - 2026-06-16

### Added

- Initial Vue 3 design system package [`@tcarnaes/design-system`](https://www.npmjs.com/package/@tcarnaes/design-system), ported from [Dsci](https://github.com/thiagocarnaes/Dsci) / Figma [Criar design system](https://www.figma.com/design/mKLQl7ztUfChQ0jDJtxDMw/Criar-design-system).
- Design tokens (navy/cyan palette), Tailwind CSS 4 theme, and Vite playground.
- Core UI components with Vitest unit tests.
- GitHub Actions workflow for playground deploy to GitHub Pages.
