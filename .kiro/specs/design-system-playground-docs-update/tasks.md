# Implementation Plan: design-system-playground-docs-update

## Overview

Adicionar `Flag`, `FlagGroup` e `SectionMessage` à documentação interativa do playground: entradas de catálogo, snippets de uso, demos Vue, registro, cobertura de props, metadados e descrições i18n. Atualizar a descrição da prop `variant` do `Button` para remover referências à API obsoleta `appearance`. Todas as mudanças seguem os padrões existentes do projeto.

## Tasks

- [x] 1. Atualizar `entries.ts` — adicionar entradas de catálogo e corrigir Button
  - [x] 1.1 Adicionar entrada `Flag` em `componentCatalogEntries`
    - Criar entrada com `usage: usageSnippets.Flag!` e as props: `title` (string, sem default), `description` (string, opcional), `variant` (`'normal' | 'warning' | 'error' | 'success' | 'discovery'`, default `'normal'`), `actions` (`FlagAction[]`, opcional), `isDismissible` (boolean, default `false`), `flagId` (string, opcional), `cls()`
    - Adicionar evento `dismiss` (sem payload)
    - _Requirements: 1.1, 1.2_

  - [x] 1.2 Adicionar entrada `FlagGroup` em `componentCatalogEntries`
    - Criar entrada com `usage: usageSnippets.FlagGroup!`, `props: []` (sem props públicas) e slot `default`
    - _Requirements: 2.1, 2.2_

  - [x] 1.3 Adicionar entrada `SectionMessage` em `componentCatalogEntries`
    - Criar entrada com `usage: usageSnippets.SectionMessage!` e as props: `variant` (`'information' | 'warning' | 'error' | 'success' | 'discovery' | 'change'`, default `'information'`, descrição incluindo comportamento `aria-live`), `title` (string, opcional), `cls()`
    - Adicionar slots `default` e `actions`
    - _Requirements: 3.1, 3.2, 3.5_

  - [x] 1.4 Atualizar prop `variant` do `Button` em `componentCatalogEntries`
    - Substituir a descrição atual da prop `variant` (que menciona `appearance`, `alias`, `deprecated`) pela descrição limpa: `'Visual style of the button.'`
    - Manter tipo `"'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'"` e default `'default'`
    - _Requirements: 9.1, 9.2, 9.3_

- [x] 2. Atualizar `usageSnippets.ts` — adicionar snippets de uso
  - [x] 2.1 Adicionar snippet `Flag` em `usageSnippets`
    - Usar helper `usage('Flag', ...)` com atributos `:variant`, `:title`, `:description`, `:is-dismissible`
    - _Requirements: 1.3_

  - [x] 2.2 Adicionar snippet `FlagGroup` em `usageSnippets`
    - Usar helper `usageMany(['Flag', 'FlagGroup'], ...)` com `<FlagGroup>` contendo dois `<Flag>` filhos (variantes `success` e `warning`)
    - _Requirements: 2.3_

  - [x] 2.3 Adicionar snippet `SectionMessage` em `usageSnippets`
    - Usar helper `usage('SectionMessage', ...)` com atributos `:variant`, `:title` e conteúdo no slot padrão
    - _Requirements: 3.3_

- [x] 3. Criar `FlagDemo.vue`
  - [x] 3.1 Implementar `playground/demos/FlagDemo.vue`
    - Imports: `computed`, `ref`, `UsageBlock`, `usePlaygroundLocale`, `playgroundSnippetAttr`, `propTemplateBinding`, `templateBooleanAttr`, `playgroundOptionStyle`, `Flag`, `Switch` de `@/index`, `FlagVariant` de `@/components/feedback/Flag.vue`
    - Estado: `variant = ref<FlagVariant>('normal')`, `isDismissible = ref(false)`, `flagKey = ref(0)`
    - Handler `onDismiss()`: incrementa `flagKey.value` para re-montar o Flag após dismiss
    - Computed `code`: constrói snippet com as linhas `<Flag`, `:variant=...`, `:title=...`, `:description=...`, `:is-dismissible` (condicional), `/>`
    - Template: div raiz com label "livePlayground", div `pg-playground-panel` contendo preview (`<Flag :key="flagKey" ...>`), seletor de variant (5 botões), e Switch para `isDismissible`; seguido de `<UsageBlock :code="code" />`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [x] 4. Criar `FlagGroupDemo.vue`
  - [x] 4.1 Implementar `playground/demos/FlagGroupDemo.vue`
    - Imports: `UsageBlock`, `usePlaygroundLocale`, `Flag`, `FlagGroup` de `@/index`
    - `code` como string estática com `<FlagGroup>` e dois `<Flag>` filhos (success e warning)
    - Template: div raiz com label "livePlayground", div `pg-playground-panel` com nota inline sobre Teleport e `<FlagGroup>` com os dois Flags filhos; seguido de `<UsageBlock :code="code" />`
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 5. Criar `SectionMessageDemo.vue`
  - [x] 5.1 Implementar `playground/demos/SectionMessageDemo.vue`
    - Imports: `computed`, `ref`, `UsageBlock`, `usePlaygroundLocale`, `playgroundSnippetAttr`, `propTemplateBinding`, `playgroundOptionStyle`, `SectionMessage` de `@/index`, `SectionMessageVariant` de `@/components/feedback/SectionMessage.vue`
    - Estado: `variant = ref<SectionMessageVariant>('information')`
    - `variantOptions`: `['information', 'warning', 'error', 'success', 'discovery', 'change']`
    - Computed `code`: snippet multi-linha com `:variant`, `:title` fixo e conteúdo do slot
    - Template: div raiz com label "livePlayground", div `pg-playground-panel` com preview (`<SectionMessage :variant="variant" title="..." />`), seletor de variant (6 botões); seguido de `<UsageBlock :code="code" />`
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 6. Registrar as novas demos e atualizar metadados
  - [x] 6.1 Atualizar `playground/demos/registry.ts`
    - Adicionar imports: `FlagDemo`, `FlagGroupDemo`, `SectionMessageDemo`
    - Adicionar ao objeto `playgroundDemoRegistry`: `Flag: FlagDemo`, `FlagGroup: FlagGroupDemo`, `SectionMessage: SectionMessageDemo`
    - _Requirements: 5.1, 6.1, 7.1_

  - [x] 6.2 Atualizar `playground/data/componentCatalog.ts`
    - No grupo `'Feedback'` do array `catalogGroups`, substituir `items: ['Alert', 'Badge', 'Spinner', 'Progress', 'Skeleton', 'Toast', 'ToastHost']` por `items: ['Alert', 'Badge', 'Flag', 'FlagGroup', 'Spinner', 'Progress', 'Skeleton', 'SectionMessage', 'Toast', 'ToastHost']`
    - _Requirements: 4.1, 4.2_

  - [x] 6.3 Atualizar `playground/designSystemMeta.ts`
    - Adicionar `'Flag'`, `'FlagGroup'`, `'SectionMessage'` ao array `playgroundDemoComponents`
    - Atualizar `designSystemLibraryComponentCount` de `59` para `62` (acréscimo de 3 componentes)
    - _Requirements: 5.1, 6.1, 7.1_

  - [x] 6.4 Atualizar `playground/data/playgroundPropCoverage.ts`
    - Em `playgroundDemoPrimaryComponent`: adicionar `Flag: 'Flag'`, `FlagGroup: 'FlagGroup'`, `SectionMessage: 'SectionMessage'`
    - Em `playgroundPropCoverage`: adicionar `Flag: ['variant', 'isDismissible']`, `FlagGroup: []`, `SectionMessage: ['variant']`
    - _Requirements: 10.1_

- [x] 7. Adicionar descrições i18n
  - [x] 7.1 Atualizar `playground/i18n/componentCatalogDescriptions.ts`
    - Em `componentCatalogDescriptionsEn`: adicionar `Flag`, `FlagGroup`, `SectionMessage` com strings em inglês não vazias que descrevam o papel de cada componente
    - Em `componentCatalogDescriptionsPtBR`: adicionar as mesmas 3 chaves com strings equivalentes em português do Brasil
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 8. Checkpoint — executar testes e verificar consistência
  - Executar `cd packages/design-system && npx vitest --run --reporter=verbose` e confirmar que `playgroundDemos.spec.ts` e `playgroundPropCoverage.spec.ts` passam para `Flag`, `FlagGroup`, `SectionMessage` e `Button`
  - Verificar que nenhum teste anteriormente passando regrediu
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

## Notes

- Tasks marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- As tasks 1–7 são independentes entre si em termos de arquivos (cada arquivo é editado por no máximo uma task), permitindo execução em paralelo por onda
- O design não usa pseudocódigo — a linguagem de implementação é TypeScript/Vue, conforme os padrões existentes do projeto
- `FlagGroup.props: []` é intencional: `MAX_VISIBLE = 3` é constante interna, não uma prop pública
- A prop `variant` da entrada `SectionMessage` deve incluir na descrição o comportamento `aria-live` (assertive para error, polite para demais)
- `designSystemLibraryComponentCount` deve ser verificado antes de atualizar — se já for 62 ou superior, não decrementar

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3", "1.4", "2.1", "2.2", "2.3"] },
    { "id": 1, "tasks": ["3.1", "4.1", "5.1"] },
    { "id": 2, "tasks": ["6.1", "6.2", "6.3", "6.4", "7.1"] }
  ]
}
```
