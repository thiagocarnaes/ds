# Implementation Plan: Design System Homepage Revamp

## Overview

Transformar a home page do playground em uma página editorial de boas-vindas no estilo Atlassian Design System. A implementação segue o fluxo: extensão do sistema i18n → dados estáticos de changelog → novos componentes de seção → modificações no `PlaygroundHero` e `App.vue` → testes PBT e unitários.

---

## Tasks

- [x] 1. Estender tipos e chaves i18n para as novas seções da home
  - [x] 1.1 Adicionar novos namespaces à interface `PlaygroundMessages` em `playground/i18n/types.ts`
    - Adicionar namespaces: `homeHero`, `homeQuickNav`, `homePurpose`, `homePrinciples`, `homeQuickStart`, `homeStats`, `homeChangelog`
    - Cada namespace deve refletir exatamente a estrutura definida na seção "Extensão de PlaygroundMessages" do `design.md`
    - O campo `homeChangelog` deve incluir index signature `[key: string]: string` para chaves dinâmicas de versão
    - _Requirements: 1.6, 2.8, 3.3, 4.5, 5.7, 6.5, 7.4, 9.3_

  - [x] 1.2 Adicionar traduções em inglês em `playground/i18n/en.ts`
    - Implementar todos os namespaces (`homeHero`, `homeQuickNav`, `homePurpose`, `homePrinciples`, `homeQuickStart`, `homeStats`, `homeChangelog`) com textos em inglês
    - Incluir chaves de changelog por versão: `changelog.v0170.added1`, `changelog.v0170.changed1`, `changelog.v0160.added1`, `changelog.v0160.fixed1`, `changelog.v0150.added1`, `changelog.v0140.changed1`, `changelog.v0140.fixed1`
    - Garantir que o objeto satisfaz a interface atualizada `PlaygroundMessages` (sem erro de tipo)
    - _Requirements: 1.6, 2.8, 3.3, 4.5, 5.7, 6.5, 7.4, 9.1_

  - [x] 1.3 Adicionar traduções em português em `playground/i18n/pt-BR.ts`
    - Implementar os mesmos namespaces do passo 1.2 com textos em pt-BR
    - Todas as traduções devem ser strings distintas do inglês (não cópia)
    - _Requirements: 9.1, 9.2_

- [x] 2. Criar arquivo de dados estáticos do changelog
  - [x] 2.1 Criar `playground/data/changelogData.ts` com os tipos e dados de changelog
    - Exportar `ChangelogType = 'Added' | 'Changed' | 'Fixed'`
    - Exportar interfaces `ChangelogChange` e `ChangelogEntry` conforme definido no `design.md`
    - Exportar `changelogEntries: ChangelogEntry[]` com exatamente 4 entradas (v0.17.0, v0.16.0, v0.15.0, v0.14.0)
    - Cada entrada deve ter entre 1 e 3 `changes`, cada `change.type` pertencente ao conjunto válido
    - Usar chaves i18n para `descKey` (ex.: `'changelog.v0170.added1'`)
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 2.2 Escrever testes de propriedade para `changelogData.ts`
    - **Property 7: Tipos de Changelog Restritos ao Conjunto Válido**
    - **Validates: Requirements 7.2**
    - Arquivo: `tests/HomepageRevamp.P7.pbt.spec.ts`
    - Verificar que todo `change.type` em todo `changelogEntries` pertence a `{ 'Added', 'Changed', 'Fixed' }` para todas as permutações de dados geradas pelo fast-check
    - _Requirements: 7.2_

  - [x] 2.3 Escrever testes de propriedade para contagem de entradas do changelog
    - **Property 8: Contagem de Entradas de Changelog Dentro do Intervalo [2, 4]**
    - **Validates: Requirements 7.1**
    - Arquivo: `tests/HomepageRevamp.P8.pbt.spec.ts`
    - Usar fast-check para gerar arrays de `ChangelogEntry` com tamanhos variados e verificar que `slice(0, 4)` mantém a saída no intervalo `[min(n, 2), 4]`
    - _Requirements: 7.1_

- [x] 3. Criar `HomeQuickNavSection.vue`
  - [x] 3.1 Implementar o componente `playground/components/HomeQuickNavSection.vue`
    - Emitir evento `navigate` com payload `'foundations' | 'catalog' | 'docs'`
    - Dados internos dos 3 cards usando ícones Lucide, chaves i18n e `designSystemLibraryComponentCount` para o stat de components
    - Layout responsivo: 1 coluna em `< 768px`, 3 colunas em `≥ 1024px` via Tailwind
    - Estado de hover visível usando design tokens existentes (`--pg-hover-bg`, `--pg-border` ou equivalente)
    - Ícones decorativos com `aria-hidden="true"`; cards clicáveis com `aria-label` descritivo
    - Suporte a navegação por teclado (Enter/Space dispara `navigate`)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 10.3, 10.4, 10.5_

  - [x] 3.2 Escrever testes de propriedade para campos obrigatórios dos cards
    - **Property 3: Cards de Navegação Sempre Contêm Campos Obrigatórios**
    - **Validates: Requirements 2.2**
    - Arquivo: `tests/HomepageRevamp.P3.pbt.spec.ts`
    - Para cada locale (`'en'`, `'pt-BR'`), montar `HomeQuickNavSection` e verificar que cada um dos 3 cards renderiza: ícone (elemento SVG), título não-vazio, descrição não-vazio e stat quantitativo não-vazio
    - _Requirements: 2.2_

  - [x] 3.3 Escrever testes unitários para eventos de navegação do `HomeQuickNavSection`
    - Verificar que clicar no card "Foundations" emite `navigate` com `'foundations'`
    - Verificar que clicar no card "Components" emite `navigate` com `'catalog'`
    - Verificar que clicar no card "Docs" emite `navigate` com `'docs'`
    - _Requirements: 2.3, 2.4, 2.5_

- [x] 4. Criar `HomePurposeSection.vue`
  - [x] 4.1 Implementar o componente `playground/components/HomePurposeSection.vue`
    - Sem props; dados de 3 benefícios definidos internamente via chaves i18n
    - Cada benefício: ícone Lucide (`aria-hidden="true"`), título (≤ 40 chars) e descrição (≤ 120 chars)
    - Parágrafo de missão acima dos benefícios, usando chave `homePurpose.mission`
    - Layout responsivo: 1 coluna em `< 768px`, 3 colunas em `≥ 1024px`
    - Sem componentes da biblioteca renderizados no template
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 4.2 Escrever testes de propriedade para campos obrigatórios dos benefícios
    - **Property 4: Benefícios Sempre Contêm Campos Obrigatórios**
    - **Validates: Requirements 3.2**
    - Arquivo: `tests/HomepageRevamp.P4.pbt.spec.ts`
    - Para cada locale (`'en'`, `'pt-BR'`), montar `HomePurposeSection` e verificar que cada benefício possui ícone presente, título não-vazio com `length ≤ 40` e descrição não-vazia com `length ≤ 120`
    - _Requirements: 3.2_

- [x] 5. Criar `HomePrinciplesSection.vue`
  - [x] 5.1 Implementar o componente `playground/components/HomePrinciplesSection.vue`
    - Sem props; array interno de 4 princípios: "Accessibility First", "Visual Consistency", "Developer Productivity", "Flexible Composition"
    - `computed shouldRender = principles.length >= 4`; template usa `v-if="shouldRender"` na raiz
    - Cada princípio: ícone Lucide (`aria-hidden="true"`), título e descrição (≤ 120 chars) via i18n
    - Layout responsivo: 1 col `< 768px`, 2 cols `< 1024px`, 4 cols `≥ 1024px`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 5.2 Escrever testes de propriedade para guard de renderização dos princípios
    - **Property 6: Principles_Section Omitida com Menos de 4 Princípios**
    - **Validates: Requirements 4.3**
    - Arquivo: `tests/HomepageRevamp.P6.pbt.spec.ts`
    - Usar fast-check para gerar arrays de 0 a 3 princípios e verificar que o componente não renderiza conteúdo visível; gerar arrays de 4+ e verificar que renderiza
    - _Requirements: 4.3_

- [x] 6. Criar `HomeQuickStartSection.vue`
  - [x] 6.1 Implementar o componente `playground/components/HomeQuickStartSection.vue`
    - Emitir evento `docs: []`
    - Estado interno: `copied = ref(false)`, `canCopy = ref(typeof navigator !== 'undefined' && !!navigator.clipboard)`
    - Exibir comando npm (`npm install @tcarnaes/design-system`) e snippet de importação básica
    - Botão de copiar com `v-if="canCopy"`, ao clicar: `navigator.clipboard.writeText(cmd)` → `copied = true` → `setTimeout(() => copied = false, 1500)`
    - Feedback visual de cópia usando chave `homeQuickStart.copiedLabel` com duração de 1500ms
    - Link "View full docs" que emite `docs` ao clicar, com `aria-label` descritivo
    - Visível em todos os viewports (≥ 320px)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

  - [x] 6.2 Escrever testes unitários para comportamento de clipboard do `HomeQuickStartSection`
    - Testar cópia bem-sucedida: mock de `navigator.clipboard.writeText`, verificar que `copied` vira `true` após clique e retorna a `false` após 1500ms (usar fake timers do Vitest)
    - Testar ambiente sem clipboard: `canCopy = false`, verificar que botão de copiar está ausente no DOM sem lançar erro
    - _Requirements: 5.3, 5.4, 5.5_

- [x] 7. Criar `HomeChangelogSection.vue`
  - [x] 7.1 Implementar o componente `playground/components/HomeChangelogSection.vue`
    - Importar `changelogEntries` de `../data/changelogData`
    - `computed entries = changelogEntries.slice(0, 4)`
    - Filtrar entradas cujo array `changes` está vazio
    - Exibir versão e data de cada entrada; cada `change` renderizado com badge colorido por tipo: "Added" (verde), "Changed" (azul/ciano), "Fixed" (amarelo/laranja)
    - Labels de tipo via i18n (`homeChangelog.typeAdded`, `homeChangelog.typeChanged`, `homeChangelog.typeFixed`)
    - Título da seção via `homeChangelog.sectionTitle`
    - Visível apenas em viewports `≥ 1024px` via classe Tailwind (`hidden lg:block` ou equivalente)
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 7.2 Escrever testes unitários para `HomeChangelogSection`
    - Verificar que com 4 entradas no changelog apenas 4 são renderizadas
    - Verificar que entradas com `changes` vazio não aparecem
    - Verificar que badge de tipo "Added" tem cor diferente de "Fixed"
    - _Requirements: 7.1, 7.2_

- [x] 8. Checkpoint — Verificar componentes independentes
  - Garantir que todos os 5 novos componentes compilam sem erros TypeScript (`tsc --noEmit`)
  - Garantir que testes das tasks 2–7 passam
  - Perguntar ao usuário se há ajustes antes de prosseguir com as modificações em arquivos existentes

- [x] 9. Modificar `PlaygroundHero.vue` para o novo layout editorial
  - [x] 9.1 Remover os pillar cards e atualizar a Stats_Bar para 4 StatPills
    - Remover o array `pillars` e o `v-for` dos pillar cards do template
    - Remover as chaves de pillar (`pillarComponentsTitle`, `pillarPlaygroundsBody`, etc.) do uso no template (as chaves i18n podem permanecer para não quebrar o tipo)
    - Substituir os 2 `StatPill` existentes por 4 `StatPill`: componentes, cobertura, demos (`playgroundDemoComponentCount`) e versão (string estática sem animação)
    - Para a versão: usar `StatPill` ou elemento inline com `designSystemVersionBadge` como string estática (`:target` não se aplica — usar slot/text ou prop customizada)
    - Manter a prop `fullLanding?: boolean` e os eventos `browse`, `docs`, `playground` sem alteração
    - A Stats_Bar com os 4 pills deve seguir a lógica: `v-show="fullLanding"` para mobile e `hidden lg:flex` quando `!fullLanding`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.1, 6.2, 6.3, 6.4, 6.6, 6.7_

  - [x] 9.2 Escrever testes unitários para `PlaygroundHero` modificado
    - Verificar que pillar cards não estão mais presentes no DOM
    - Verificar que 4 StatPills são renderizados quando `fullLanding=true`
    - Verificar que badge de versão está presente
    - Verificar que CTA "browseComponents" emite evento `browse` e "installDocs" emite `docs`
    - _Requirements: 1.2, 1.3, 1.4, 6.1, 6.2_

- [x] 10. Modificar `App.vue` para separar Editorial Home do Bento Grid
  - [x] 10.1 Adicionar imports e handler `handleNavigate` no `script setup` de `App.vue`
    - Importar os 5 novos componentes: `HomeQuickNavSection`, `HomePurposeSection`, `HomePrinciplesSection`, `HomeQuickStartSection`, `HomeChangelogSection`
    - Adicionar função `handleNavigate(category: 'foundations' | 'catalog' | 'docs'): void` que chama `setCategory(category)`
    - _Requirements: 8.5_

  - [x] 10.2 Atualizar o template de `App.vue` para separar Editorial Home do Bento Grid
    - Substituir o bloco `<TransitionGroup v-else ...>` por duas condicionais:
      - `<template v-if="isFullLanding">` → renderiza os 5 novos componentes com bindings corretos (`@navigate="handleNavigate"`, `@docs="openDocs"`)
      - `<TransitionGroup v-else-if="activePage === 'home' && !isFullLanding" ...>` → bento grid existente, sem alteração de lógica interna
    - O `PlaygroundHero` já existente recebe o novo evento `@navigate` indiretamente via seções filhas (não necessita mudança de binding no Hero em si)
    - As seções `HomePurposeSection`, `HomePrinciplesSection`, `HomeChangelogSection` dentro do `v-if="isFullLanding"` usam `v-show` baseado em `isFullLanding` conforme o design
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 10.3 Escrever testes de propriedade para renderização condicional home vs bento grid
    - **Property 9: Home All Não Renderiza Bento Grid**
    - **Validates: Requirements 8.1, 8.3**
    - Arquivo: `tests/HomepageRevamp.P9.pbt.spec.ts`
    - Montar `App.vue` com `activePage='home'` e `activeCat='all'`; verificar ausência de `.ds-bento-grid` no DOM
    - _Requirements: 8.1, 8.3_

  - [x] 10.4 Escrever testes de propriedade para bento grid com categorias específicas
    - **Property 10: Home com Categoria Específica Renderiza Bento Grid**
    - **Validates: Requirements 8.2**
    - Arquivo: `tests/HomepageRevamp.P10.pbt.spec.ts`
    - Usar fast-check `fc.constantFrom('forms', 'labels', 'feedback', 'layout', 'foundations')` e verificar presença de `.ds-bento-grid` ao setar cada categoria
    - _Requirements: 8.2_

- [x] 11. Escrever testes de propriedade para i18n e reatividade de locale
  - [x] 11.1 Escrever testes PBT para textos i18n traduzidos em qualquer locale
    - **Property 1: Textos i18n são Traduzidos para Qualquer Locale**
    - **Validates: Requirements 1.6, 2.8, 3.3, 4.5, 5.7, 6.5, 7.4, 9.1**
    - Arquivo: `tests/HomepageRevamp.P1.pbt.spec.ts`
    - Para cada locale (`'en'`, `'pt-BR'`) e cada novo componente de seção, montar o componente e verificar que todos os textos visíveis são strings não-vazias e não iguais ao padrão `namespace.key`
    - Usar fast-check com `fc.constantFrom('en', 'pt-BR' as const)`
    - _Requirements: 1.6, 2.8, 3.3, 4.5, 5.7, 6.5, 7.4, 9.1_

  - [x] 11.2 Escrever testes PBT para reatividade de locale (textos distintos por idioma)
    - **Property 2: Reatividade de Locale**
    - **Validates: Requirements 9.2**
    - Arquivo: `tests/HomepageRevamp.P2.pbt.spec.ts`
    - Montar componentes com locale `'en'` e `'pt-BR'` separadamente; verificar que ao menos um texto visível difere entre os dois locales para cada seção
    - _Requirements: 9.2_

- [x] 12. Escrever testes de propriedade para visibilidade de seções condicionais
  - [x] 12.1 Escrever testes PBT para seções ocultas quando `fullLanding=false`
    - **Property 5: Seções Condicionais Ocultas quando fullLanding=false**
    - **Validates: Requirements 3.6, 4.6, 7.5**
    - Arquivo: `tests/HomepageRevamp.P5.pbt.spec.ts`
    - Montar `App.vue` com `isFullLanding=false` (simulando categoria específica ativa) e verificar que `HomePurposeSection`, `HomePrinciplesSection` e `HomeChangelogSection` não são visíveis (ausentes ou com `display: none`)
    - _Requirements: 3.6, 4.6, 7.5_

- [x] 13. Checkpoint Final — Garantir todos os testes passam
  - Executar `vitest run` no workspace; todos os testes das tasks 2–12 devem passar sem erros
  - Executar `tsc --noEmit` para confirmar compatibilidade de tipos no `types.ts` atualizado
  - Verificar que `npm run build` (playground) compila sem avisos de TypeScript
  - Perguntar ao usuário se há ajustes finais antes de encerrar

---

## Notes

- Tarefas marcadas com `*` são opcionais e podem ser puladas para uma entrega MVP mais rápida
- Cada arquivo de teste PBT segue a convenção do projeto: nome `*.pbt.spec.ts`, usa `vitest` + `fast-check`, `numRuns: 100`, `seed` fixo para reprodutibilidade
- Os testes PBT ficam em `packages/design-system/tests/` seguindo a convenção existente (ex.: `Badge.pbt.spec.ts`)
- Todos os componentes novos seguem a convenção de nenhum import de componentes da biblioteca em seus templates — apenas Lucide icons, `StatPill` e `GlowDot` existentes são permitidos
- O `v-show` é preferido ao `v-if` para seções condicionais por `fullLanding` para evitar remontagem, conforme decisão técnica do `design.md`
- A interface `PlaygroundMessages` deve ser estendida e não substituída — compatibilidade total com as chaves existentes
- Os tokens CSS existentes (`--pg-text`, `--pg-accent`, `--pg-border`, etc.) devem ser usados; nenhum novo token deve ser introduzido

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "3.1", "4.1", "5.1", "6.1", "7.1"] },
    { "id": 3, "tasks": ["3.2", "3.3", "4.2", "5.2", "6.2", "7.2", "9.1"] },
    { "id": 4, "tasks": ["9.2", "10.1"] },
    { "id": 5, "tasks": ["10.2"] },
    { "id": 6, "tasks": ["10.3", "10.4", "11.1", "11.2", "12.1"] }
  ]
}
```
