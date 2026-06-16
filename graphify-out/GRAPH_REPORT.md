# Graph Report - design_system_ci  (2026-06-16)

## Corpus Check
- 101 files · ~20,848 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 332 nodes · 332 edges · 43 communities (38 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 14 edges
2. `Decisions` - 7 edges
3. `scripts` - 6 edges
4. `ADDED Requirements` - 6 edges
5. `ADDED Requirements` - 6 edges
6. `ADDED Requirements` - 5 edges
7. `ADDED Requirements` - 5 edges
8. `ADDED Requirements` - 5 edges
9. `scripts` - 4 edges
10. `exports` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (43 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.10
Nodes (8): ButtonVariants, state, ToastItem, ToastVariant, useToast(), cn(), linkHref, rel

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (23): dependencies, class-variance-authority, clsx, tailwind-merge, @vueuse/core, exports, ./styles.css, files (+15 more)

### Community 2 - "Community 2"
Cohesion: 0.14
Nodes (7): showPagination, totalPages, visiblePages, isSelected, panelId, tabId, tabId

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (16): compilerOptions, baseUrl, esModuleInterop, isolatedModules, jsx, lib, module, moduleResolution (+8 more)

### Community 4 - "Community 4"
Cohesion: 0.17
Nodes (4): group, groupName, isChecked, isDisabled

### Community 6 - "Community 6"
Cohesion: 0.15
Nodes (12): 1. Estrutura de pastas, 2. Estilização: Tailwind utility-first com variantes via `cva`, 3. Componentes headless onde necessário, 4. Inventário de componentes (espelho Figma Make), 5. Testes e qualidade, 6. Naming e API, Context, Decisions (+4 more)

### Community 7 - "Community 7"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: Avatar component, Requirement: Card component, Requirement: Divider component, Requirement: List and empty state, Requirement: Table component, Scenario: Card renders header and body, Scenario: Empty state shows illustration slot (+3 more)

### Community 8 - "Community 8"
Cohesion: 0.17
Nodes (12): devDependencies, happy-dom, tailwindcss, @tailwindcss/vite, typescript, vite, vite-plugin-dts, @vitejs/plugin-vue (+4 more)

### Community 9 - "Community 9"
Cohesion: 0.17
Nodes (11): ADDED Requirements, Requirement: Alert component, Requirement: Badge component, Requirement: Loading indicators, Requirement: Progress component, Requirement: Toast notifications, Scenario: Badge renders label, Scenario: Determinate progress bar (+3 more)

### Community 10 - "Community 10"
Cohesion: 0.18
Nodes (10): 10. Integration and Finalization, 1. Project Scaffold, 2. Design Tokens, 3. Action Components, 4. Form Components, 5. Feedback Components, 6. Navigation Components, 7. Data Display Components (+2 more)

### Community 12 - "Community 12"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 13 - "Community 13"
Cohesion: 0.18
Nodes (10): ADDED Requirements, Requirement: Drawer component, Requirement: Modal and Dialog components, Requirement: Popover component, Requirement: Tooltip component, Scenario: Drawer slides from right, Scenario: Escape closes modal, Scenario: Modal opens and closes (+2 more)

### Community 14 - "Community 14"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: Button component, Requirement: IconButton component, Requirement: Link component, Scenario: Accessible icon button, Scenario: Disabled button ignores clicks, Scenario: External link opens in new tab, Scenario: Loading button shows spinner (+1 more)

### Community 15 - "Community 15"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 16 - "Community 16"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: CSS custom properties layer, Requirement: Dark mode readiness, Requirement: Tailwind theme extension, Requirement: Typography scale, Scenario: Dark mode toggles surface color, Scenario: Heading styles match Figma scale, Scenario: Semantic color variables exist (+1 more)

### Community 17 - "Community 17"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: Form field wrapper, Requirement: Selection components, Requirement: Text input components, Scenario: Checkbox toggles value, Scenario: Error state styling, Scenario: Label associates with control, Scenario: Radio group enforces single selection (+1 more)

### Community 18 - "Community 18"
Cohesion: 0.20
Nodes (9): ADDED Requirements, Requirement: Development playground, Requirement: Monorepo package structure, Requirement: Public API barrel export, Requirement: Test infrastructure, Scenario: Consumer imports from package, Scenario: Dev server starts, Scenario: Package builds successfully (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.25
Nodes (7): Capabilities, Impact, Modified Capabilities, New Capabilities, Não-Objetivos, What Changes, Why

### Community 20 - "Community 20"
Cohesion: 0.25
Nodes (7): ADDED Requirements, Requirement: Container component, Requirement: Grid component, Requirement: Stack component, Scenario: Container constrains width, Scenario: Responsive grid columns, Scenario: Vertical stack with gap

### Community 21 - "Community 21"
Cohesion: 0.25
Nodes (7): ADDED Requirements, Requirement: Breadcrumb component, Requirement: Pagination component, Requirement: Tabs component, Scenario: Current page is not a link, Scenario: Page change emits event, Scenario: Tab selection updates panel

### Community 22 - "Community 22"
Cohesion: 0.25
Nodes (7): name, private, scripts, build, dev, test, workspaces

### Community 23 - "Community 23"
Cohesion: 0.29
Nodes (6): compilerOptions, declaration, emitDeclarationOnly, outDir, extends, include

### Community 24 - "Community 24"
Cohesion: 0.50
Nodes (3): [0.1.0] - 2026-06-16, Added, Changelog

## Knowledge Gaps
- **160 isolated node(s):** `name`, `private`, `workspaces`, `build`, `test` (+155 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 8` to `Community 1`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `name`, `private`, `workspaces` to the rest of the system?**
  _160 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.09852216748768473 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.14035087719298245 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._