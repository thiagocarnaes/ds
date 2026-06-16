## Context

O repositório está no estágio inicial (apenas OpenSpec). O design system de referência está no Figma Make [Criar design system](https://www.figma.com/make/mKLQl7ztUfChQ0jDJtxDMw/Criar-design-system). A meta é portar todos os componentes visuais desse arquivo para uma biblioteca Vue 3 com Tailwind CSS e build Vite, consumível pelo app TodoList.

Stack obrigatória: TypeScript, Vue 3 (Composition API + `<script setup>`), Tailwind CSS 3+, Vite 5+, Vitest.

## Goals / Non-Goals

**Goals:**

- Biblioteca `packages/design-system` com build ESM + tipos
- Tokens Figma → Tailwind theme + CSS variables semânticas
- ~30 componentes Vue cobrindo ações, formulários, feedback, navegação, dados, overlays e layout
- Acessibilidade básica (ARIA, foco, teclado) em componentes interativos
- TDD com Vitest; playground Vite para validação visual contra Figma
- Prefixo `Ds` nos componentes (ex.: `DsButton`) para evitar colisões

**Non-Goals:**

- Publicação npm ou pipeline de release
- Storybook (playground Vite é suficiente nesta fase)
- i18n ou temas customizáveis além de light/dark via tokens
- Animações complexas além das definidas no Figma

## Decisions

### 1. Estrutura de pastas

```
packages/design-system/
├── src/
│   ├── components/       # Um diretório por componente
│   ├── composables/      # useToast, useModal, etc.
│   ├── tokens/           # tailwind.preset.ts, css variables
│   ├── styles/           # index.css (Tailwind directives)
│   └── index.ts          # Barrel export
├── playground/           # App Vite para preview
├── vite.config.ts        # Library mode + playground
├── tailwind.config.ts
└── vitest.config.ts
```

**Alternativa considerada:** monorepo com `apps/todo` + `packages/ds`. **Escolhida:** começar só com `packages/design-system` + playground; app TodoList integrado depois para reduzir escopo inicial.

### 2. Estilização: Tailwind utility-first com variantes via `cva`

Cada componente usa classes Tailwind mapeadas aos tokens. Variantes (`primary`, `sm`, etc.) são definidas com `class-variance-authority` (cva) ou objeto de classes tipado — mantém paridade com Figma variants sem CSS scoped duplicado.

**Alternativa:** CSS Modules. **Rejeitada:** Tailwind já é requisito do usuário e acelera paridade com tokens.

### 3. Componentes headless onde necessário

Overlays (Modal, Popover, Tooltip) usam `@vueuse/core` (`useFocusTrap`, `onClickOutside`) ou implementação mínima própria para evitar dependências pesadas (Radix Vue).

### 4. Inventário de componentes (espelho Figma Make)

| Categoria | Componentes |
|-----------|-------------|
| Actions | Button, IconButton, Link |
| Forms | Input, Textarea, Select, Checkbox, Radio, Switch, Label, FormField |
| Feedback | Alert, Badge, Spinner, Progress, Skeleton, Toast |
| Navigation | Tabs, Breadcrumb, Pagination |
| Data display | Card, Avatar, Table, List, EmptyState, Divider |
| Overlay | Modal, Dialog, Tooltip, Popover, Drawer |
| Layout | Container, Stack, Grid |

Implementação segue ordem: scaffold → tokens → actions → forms → feedback → navigation → data → overlay → layout.

### 5. Testes e qualidade

- TDD: teste escrito antes de cada componente
- Cobertura mínima: render, props/variants, eventos, a11y básico
- `npm run build && npm run test` obrigatório antes de marcar tarefa concluída

### 6. Naming e API

- Props em `camelCase`; eventos `update:modelValue` / `update:open`
- Slots nomeados: `#header`, `#footer`, `#trigger`, `#default`
- JSDoc em props exportadas e composables públicos

## Risks / Trade-offs

| Risco | Mitigação |
|-------|-----------|
| Figma Make não acessível via API durante CI | Playground visual + checklist manual contra link Figma em cada PR |
| Divergência pixel-perfect | Tokens centralizados; ajustes finos em `tailwind.config.ts` |
| Escopo grande (~30 componentes) | Entrega incremental por categoria; CHANGELOG por bloco |
| Overlays complexos (focus trap) | `@vueuse/core` + testes de teclado |

## Migration Plan

1. Criar `packages/design-system` com Vite library mode
2. Configurar Tailwind preset exportável para consumidores
3. Implementar componentes por categoria (ver ordem acima)
4. Adicionar playground com página por componente
5. Integrar pacote no app TodoList via workspace/path alias
6. Executar `graphify .` ao concluir a change

Rollback: remover import do pacote no TodoList; biblioteca é aditiva.

## Open Questions

- Confirmar valores exatos de tokens (hex, spacing) exportando variables do Figma ou inspecionando o Make file na fase de implementação
- Definir se ícones virão de `@heroicons/vue`, SVG inline do Figma, ou slot-only
- Confirmar se Select será native `<select>` estilizado ou custom dropdown (custom exige mais a11y)
