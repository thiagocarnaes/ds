# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
