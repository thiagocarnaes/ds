# Implementation Plan: Alinhamento ao Atlassian Design System

## Overview

Implementação incremental do alinhamento do design system Vue 3 + TypeScript + Tailwind CSS com as boas práticas do Atlassian Design System (ADS). O trabalho é dividido em oito frentes: expansão de tokens semânticos, aprimoramento de componentes existentes, criação de novos componentes, acessibilidade transversal, atualização dos exports, foundations completas (gradientes, border-radius, motion, shadows, surface states, icon tokens, z-index, border widths), migração de componentes para os novos tokens e documentação visual das foundations no playground.

## Tasks

- [x] 1. Expandir tokens CSS (tokens.css + theme.css)
  - [x] 1.1 Adicionar tokens semânticos de cor, elevation, opacidade e espaçamento em `tokens.css`
    - Inserir tokens `--ds-color-text-*`, `--ds-color-bg-*`, `--ds-color-border-*` conforme design
    - Inserir tokens `--ds-elevation-*` e `--ds-shadow-*` para os quatro níveis (sunken, default, raised, overlay)
    - Inserir `--ds-opacity-disabled: 0.4` e `--ds-opacity-loading: 0.7`
    - Inserir escala de espaçamento `--ds-space-025` a `--ds-space-1000` (múltiplos de 4 px)
    - Remap aliases legados `--ds-spacing-1` a `--ds-spacing-8` para os novos `--ds-space-*`
    - _Requisitos: 1.1, 1.2, 1.3, 1.4, 1.5, 18.1, 18.2_

  - [x] 1.2 Adicionar tokens tipográficos em `tokens.css`
    - Inserir `--ds-font-size-xsmall` (0.6875rem) a `--ds-font-size-xxlarge` (2rem)
    - Inserir `--ds-line-height-*` e `--ds-font-weight-*` conforme design
    - _Requisitos: 17.1, 17.2, 17.3_

  - [x] 1.3 Mapear novos tokens no bloco `@theme inline` em `theme.css`
    - Adicionar entradas `--spacing-025` a `--spacing-1000`
    - Adicionar entradas `--color-text-*`, `--color-bg-*`, `--color-border-*`, `--color-surface-*`
    - _Requisitos: 1.6, 1.7, 18.3_

- [x] 2. Aprimorar o componente Button
  - [x] 2.1 Adicionar variantes `warning`, `discovery` e `subtle` em `buttonVariants.ts`
    - Adicionar `warning: 'bg-warning text-white hover:bg-warning/90'`
    - Adicionar `discovery: 'bg-[--ds-color-purple-400] text-white hover:bg-[--ds-color-purple-400]/90'`
    - Adicionar tamanho `compact: 'h-7 px-3 text-xs'`
    - _Requisitos: 2.1, 2.2_

  - [x] 2.2 Adicionar props `isSelected`, `shouldFitContainer` e `tooltip` em `Button.vue`
    - `isSelected=true` → adiciona `ring-2 ring-ring` às classes
    - `shouldFitContainer=true` → adiciona `w-full`
    - `tooltip + disabled` → envolve o botão em `<Tooltip :content="tooltip">`
    - Mapear `appearance='warning'` e `appearance='discovery'` nas variantes resolvidas
    - _Requisitos: 2.3, 2.4, 2.7_

  - [x] 2.3 Escrever testes unitários para Button
    - Testar que `shouldFitContainer=true` resulta em largura 100% do container (Propriedade 4)
    - Testar que `isSelected=true` aplica classe de anel
    - Testar `appearance='warning'` e `appearance='discovery'`
    - _Requisitos: 2.1, 2.2, 2.3, 2.4_


  - [x] 2.4 Criar o componente `ButtonGroup.vue`
    - Container `<div class="inline-flex items-center gap-[--ds-space-100]">` com `<slot />`
    - Prop `label?: string` para `aria-label` do grupo
    - _Requisitos: 2.5, 2.6_

- [x] 3. Aprimorar o componente Avatar
  - [x] 3.1 Adicionar props `shape`, `presence` e `status` em `Avatar.vue`
    - `shape='circle'` → `rounded-full` (padrão); `shape='square'` → `rounded-[--ds-radius-md]`
    - `presence` → indicador `size-[10px]` com cores mapeadas por valor (online/busy/offline/focus)
    - `status` → ícone SVG `size-[14px]` no canto (approved/declined/locked)
    - _Requisitos: 3.1, 3.2, 3.3, 3.4_

  - [x] 3.2 Implementar fallback de imagem e `aria-label` em `Avatar.vue`
    - `@error` na `<img>` → oculta img e exibe initials
    - `aria-label` calculado a partir de `name` quando nenhum texto externo é fornecido
    - _Requisitos: 3.6, 3.7_

  - [x] 3.3 Escrever teste de propriedade para fallback de imagem do Avatar
    - **Propriedade 9: Avatar fallback**
    - **Valida: Requisito 3.6**
    - Para qualquer `src` com erro de carregamento, initials devem estar visíveis e `<img>` oculta

- [x] 4. Aprimorar o componente Badge
  - [x] 4.1 Expandir `BadgeAppearance` e estilos em `badgeVariants.ts`
    - Adicionar: `modified`, `inprogress`, `moved`, `new`, `discovery`, `success`, `warning`, `danger`, `information`
    - Mapear cores conforme tabela do design (cyan/amber/purple/teal/red)
    - _Requisitos: 4.1, 4.2, 4.3, 4.4, 4.5, 4.7_

  - [x] 4.2 Implementar exibição de `99+` em `Badge.vue`
    - Quando `value > 99`, exibir `'99+'` em vez do número completo
    - _Requisito: 4.6_

  - [x] 4.3 Escrever teste de propriedade para cap de valor do Badge
    - **Propriedade 2: Badge value cap**
    - **Valida: Requisito 4.6**
    - `∀ value ∈ ℤ, value > 99 → displayText === '99+'`

- [x] 5. Aprimorar o componente Lozenge6
  - [x] 5.1 Adicionar appearances `inprogress`, `moved`, `removed` e aliases deprecados em `Lozenge.vue`
    - Adicionar `aliasMap: { progress: 'inprogress', danger: 'removed' }` no computed
    - Adicionar estilos para `inprogress` (cyan), `moved` (amber), `removed` (red)
    - _Requisitos: 5.1, 5.2_

  - [x] 5.2 Escrever teste de propriedade para aliases do Lozenge
    - **Propriedade 3: Lozenge alias**
    - **Valida: Requisito 5.2**
    - `render(appearance='progress')` deve produzir mesmas classes/estilos que `render(appearance='inprogress')`


- [x] 6. Criar subcomponentes do Modal e atualizar `Modal.vue`
  - [x] 6.1 Criar `ModalTitle.vue`, `ModalHeader.vue`, `ModalBody.vue` e `ModalFooter.vue`
    - `ModalTitle`: `<component :is="as">` com `id` prop; padrão `as='h2'`
    - `ModalHeader`: container com botão de fechar opcional (`hasCloseButton`), emite `close`
    - `ModalBody`: `overflow-y-auto` + `padding: var(--ds-space-300)`
    - `ModalFooter`: `flex items-center justify-end gap-[--ds-space-100]` com borda superior
    - _Requisitos: 6.1, 6.2, 6.3, 6.4_

  - [x] 6.2 Atualizar `Modal.vue` com `width`, `titleId`, scroll-lock e `aria-labelledby`
    - Prop `width` mapeada para `max-w-[400px|600px|800px|968px]`
    - `watch(open)` → ao abrir: `document.body.style.overflow = 'hidden'`; ao fechar: restaurar
    - Prop `titleId` → `aria-labelledby` no `role="dialog"`
    - _Requisitos: 6.5, 6.6, 6.7, 6.8_

  - [x] 6.3 Escrever teste de propriedade para scroll-lock do Modal
    - **Propriedade 5: Modal scroll lock**
    - **Valida: Requisito 6.8**
    - `open=true → body.style.overflow === 'hidden'`; `open=false → overflow restaurado`

- [x] 7. Aprimorar o componente Input
  - [x] 7.1 Adicionar slots `elemBefore` / `elemAfter` e prop `size='compact'` em `Input.vue`
    - Envolver `<input>` em `<div class="relative flex w-full items-center">`
    - Slots com `<span class="absolute left-3/right-3">` + padding dinâmico (`pl-9` / `pr-9`)
    - Adicionar `compact: 'h-7'` em `formInputVariants.ts`
    - _Requisitos: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 8. Aprimorar o componente Tabs
  - [x] 8.1 Adicionar evento `change`, prop `shouldUnmountTabPanelOnChange` e `id` em `Tabs.vue` e `Tab.vue`
    - Emitir `change` com o valor da aba no `setActiveTab`
    - Prover `shouldUnmountTabPanelOnChange` via `provide` para `TabPanel`
    - Aceitar prop `id` explícita em `Tab.vue`
    - _Requisitos: 8.1, 8.2, 8.5, 8.6_

  - [x] 8.2 Implementar `v-if` vs `v-show` em `TabPanel.vue` baseado em `shouldUnmountTabPanelOnChange`
    - Injetar chave `TABS_UNMOUNT_KEY` no `TabPanel`
    - `v-if` quando `shouldUnmount=true`; `v-show` quando `false` ou omitido
    - _Requisitos: 8.3, 8.4_

- [x] 9. Checkpoint — Garantir que os aprimoramentos de componentes existentes estejam integrados
  - Garantir que todos os testes passem. Perguntar ao usuário se houver dúvidas.

- [x] 10. Aprimorar o componente Tooltip
  - [x] 10.1 Adicionar props `delay`, `shortcut` e placements `top-start`/`top-end` em `Tooltip.vue`
    - `delay`: `setTimeout`/`clearTimeout` no `show()` e `hide()` (padrão: 300 ms)
    - `shortcut`: `<kbd class="ml-2 rounded border px-1 text-[10px]">{{ shortcut }}</kbd>` dentro do tooltip
    - `top-start` / `top-end`: adicionar cálculo no `computePosition`
    - _Requisitos: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_


- [x] 11. Criar o componente SectionMessage
  - [x] 11.1 Criar `SectionMessage.vue` em `components/feedback/`
    - Props: `appearance` (information/warning/error/success/discovery/change), `title`
    - Template com `role="region"` e `aria-label` derivado de `title`
    - Ícone SVG por appearance; slot padrão para corpo; slot `actions` para botões
    - Paleta de cores: bg/border/icon-color por appearance conforme design
    - _Requisitos: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [x] 12. Criar os componentes Flag e FlagGroup
  - [x] 12.1 Criar `Flag.vue` em `components/feedback/`
    - Props: `title` (obrigatório), `description`, `appearance`, `actions`, `isDismissible`
    - `isDismissible=true` → botão fechar com `aria-label="Fechar notificação"`
    - Emite evento `dismiss` ao fechar
    - `role="alert"` + `aria-live="assertive"` para `error`; `aria-live="polite"` para demais
    - Estilo: card com borda esquerda de 4 px colorida por appearance
    - _Requisitos: 11.2, 11.3, 11.4, 11.7_

  - [x] 12.2 Criar `FlagGroup.vue` em `components/feedback/`
    - `Teleport to="body"` → `fixed top-4 right-4 z-[300] flex flex-col gap-2`
    - Controle interno de fila: máximo 3 flags visíveis simultâneas
    - _Requisitos: 11.1, 11.5, 11.6_

  - [x] 12.3 Escrever teste de propriedade para fila do FlagGroup
    - **Propriedade 6: Flag queue**
    - **Valida: Requisito 11.6**
    - `FlagGroup com N>3 flags → apenas 3 renderizados por vez`

- [x] 13. Criar os componentes Tag e TagGroup
  - [x] 13.1 Criar `Tag.vue` em `components/data-display/`
    - Props: `text` (obrigatório), `isRemovable`, `color`, `href`, `isLink`
    - Renderiza como `<a>` se `isLink && href`, caso contrário `<span>`
    - `isRemovable=true` → botão `<button aria-label="Remover ${text}">` emitindo `remove`
    - `role="listitem"` quando filho de `TagGroup`
    - _Requisitos: 12.2, 12.3, 12.4, 12.5, 12.7_

  - [x] 13.2 Escrever teste de propriedade para evento `remove` da Tag
    - **Propriedade 8: Tag remove event**
    - **Valida: Requisito 12.4**
    - `isRemovable=true, click no botão → evento 'remove' emitido com text correto`

  - [x] 13.3 Criar `TagGroup.vue` em `components/data-display/`
    - Prop `tags` (array) e `label`; `role="list"` no container
    - Espaçamento `gap-[--ds-space-050]`; emite `remove` propagado dos filhos
    - _Requisitos: 12.6, 12.7_


- [x] 14. Criar as primitivas tipográficas Heading e Text
  - [x] 14.1 Criar `components/typography/` com `index.ts`, `Heading.vue` e `Text.vue`
    - `Heading.vue`: prop `level` (1–6, padrão 2), `size` (xxlarge..xsmall), `color`, `id`
    - Mapeamento `level → size` padrão; mapeamento `size → --ds-font-size-*`
    - Renderiza `<component :is="\`h\${level}\`">`
    - _Requisitos: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 17.5_

  - [x] 14.2 Escrever teste de propriedade para nível HTML do Heading
    - **Propriedade 10: Heading level**
    - **Valida: Requisito 13.2**
    - `∀ level ∈ {1..6} → elemento HTML renderizado é h{level}`

  - [x] 14.3 Implementar `Text.vue`
    - Props: `size` (large/medium/small/xsmall), `weight`, `color`, `as` (padrão `span`)
    - Mapeamentos `size → --ds-font-size-*`, `color → --ds-color-text-*`
    - `as='p'` → `display: block`
    - _Requisitos: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_

- [x] 15. Criar o componente ProgressTracker
  - [x] 15.1 Criar `ProgressTracker.vue` em `components/data-display/`
    - Props: `steps` (array `{ label, percentageComplete }`), `currentIndex`, `label`
    - `<ol role="list">` com `<li role="listitem" :aria-current="i === currentIndex ? 'step' : undefined">`
    - Estados visuais: completed (✓ verde), current (anel primário), future (cinza)
    - Emite `stepClick` com índice ao clicar em passo completado
    - _Requisitos: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7_

  - [x] 15.2 Escrever teste de propriedade para `aria-current` do ProgressTracker
    - **Propriedade 7: ProgressTracker aria-current**
    - **Valida: Requisito 15.6**
    - `∀ i, i === currentIndex → li[i][aria-current] === 'step'`; `i ≠ currentIndex → undefined`

- [x] 16. Aplicar melhorias de acessibilidade transversal
  - [x] 16.1 Tornar `aria-label` obrigatório no `IconButton.vue` via TypeScript
    - Usar `Required<Pick<...>>` na interface de props para `aria-label`
    - _Requisito: 16.5_

  - [x] 16.2 Adicionar `role="status"` e prop `label` no `Spinner.vue`
    - `role="status"` + `aria-label` configurável (padrão: "Carregando…")
    - _Requisito: 16.6_

  - [x] 16.3 Verificar e ajustar `aria-live` no `ToastHost.vue` e componentes de feedback
    - Confirmar `aria-live="polite"` no ToastHost
    - Confirmar `aria-live` correto no Alert e SectionMessage por severidade
    - _Requisito: 16.8_

- [x] 17. Checkpoint — Garantir que todos os novos componentes estejam funcionais
  - Garantir que todos os testes passem. Perguntar ao usuário se houver dúvidas.


- [x] 18. Atualizar `index.ts` com todos os novos exports
  - [x] 18.1 Adicionar exports dos novos componentes e tipos em `src/index.ts`
    - Exportar `Heading`, `Text` de `./components/typography/`
    - Exportar `ButtonGroup` de `./components/button/`
    - Exportar `ModalHeader`, `ModalBody`, `ModalFooter`, `ModalTitle` de `./components/overlay/`
    - Exportar `SectionMessage`, `Flag`, `FlagGroup` de `./components/feedback/`
    - Exportar `Tag`, `TagGroup`, `ProgressTracker` de `./components/data-display/`
    - Exportar tipos: `TagColor`, `LozengeAppearance`, `BadgeAppearance`
    - _Requisitos: 1.1 (tokens), 6.1, 10.1, 11.1, 12.1, 13.1, 14.1, 15.1_

- [x] 19. Checkpoint final — Garantir que todos os testes passem
  - Garantir que todos os testes passem e que os novos exports estejam acessíveis. Perguntar ao usuário se houver dúvidas.

- [x] 20. Expandir tokens de foundations (gradientes, border-radius, motion, shadows, surface states, icon colors, z-index, border widths)
  - [x] 20.1 Adicionar tokens de gradiente em `tokens.css`
    - Inserir `--ds-gradient-brand-horizontal`, `--ds-gradient-brand-vertical`, `--ds-gradient-brand-diagonal` (navy→cyan)
    - Inserir `--ds-gradient-hero` para banners e headers
    - Inserir `--ds-gradient-card` para fundo sutil de cards
    - Inserir `--ds-gradient-overlay` (scrim para imagens, transparent→rgba(0,0,0,0.6))
    - Inserir `--ds-gradient-fade-end` e `--ds-gradient-fade-bottom` para truncamento de conteúdo
    - Adicionar override `.dark` em `theme.css` para os tokens `--ds-gradient-fade-*` apontarem para o background dark
    - _Requisitos: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7_

  - [x] 20.2 Adicionar escala de border-radius em `tokens.css` e bridge em `theme.css`
    - Inserir escala primitiva: `--ds-radius-none` (0) a `--ds-radius-full` (9999px), preservando `--ds-radius-md` existente
    - Inserir tokens semânticos: `--ds-radius-button`, `--ds-radius-card`, `--ds-radius-input`, `--ds-radius-badge`, `--ds-radius-tag`
    - Adicionar bridge `--radius-*` no bloco `@theme inline` de `theme.css`
    - _Requisitos: 21.1, 21.2, 21.3, 21.4, 21.5_

  - [x] 20.3 Adicionar tokens de motion em `tokens.css` e override de reduced-motion em `theme.css`
    - Inserir `--ds-motion-duration-instant` (0ms) a `--ds-motion-duration-slower` (500ms)
    - Inserir `--ds-motion-easing-linear`, `--ds-motion-easing-in`, `--ds-motion-easing-out`, `--ds-motion-easing-in-out`, `--ds-motion-easing-spring`
    - Adicionar bloco `@media (prefers-reduced-motion: reduce)` em `theme.css` zerando todas as durações
    - _Requisitos: 22.1, 22.2, 22.3, 22.4, 22.5_

  - [x] 20.4 Adicionar shadow scale completa em `tokens.css` com override dark
    - Inserir escala primitiva: `--ds-shadow-none`, `--ds-shadow-xs` a `--ds-shadow-2xl`
    - Inserir tokens semânticos: `--ds-shadow-card`, `--ds-shadow-dropdown`, `--ds-shadow-modal`, `--ds-shadow-tooltip`
    - Adicionar override `.dark` em `theme.css` com opacidades aumentadas (0.40) para as sombras primitivas
    - _Requisitos: 23.1, 23.2, 23.3, 23.4, 23.5_

  - [x] 20.5 Adicionar tokens de surface states e icon colors em `tokens.css`
    - Inserir `--ds-color-bg-hovered`, `--ds-color-bg-pressed`, `--ds-color-bg-selected`, `--ds-color-bg-selected-hovered`
    - Inserir variantes contextuais: `--ds-color-bg-brand-hovered`, `--ds-color-bg-brand-pressed`, `--ds-color-bg-danger-hovered`, `--ds-color-bg-warning-hovered`, `--ds-color-bg-success-hovered`
    - Inserir `--ds-color-icon-default`, `--ds-color-icon-subtle`, `--ds-color-icon-inverse`, `--ds-color-icon-brand`, `--ds-color-icon-disabled`
    - Inserir `--ds-color-icon-danger`, `--ds-color-icon-warning`, `--ds-color-icon-success`, `--ds-color-icon-discovery`
    - Adicionar bridge `--color-icon-*` no bloco `@theme inline` de `theme.css`
    - _Requisitos: 24.1, 24.2, 24.3, 24.4, 24.5, 25.1, 25.2, 25.3, 25.4, 25.5_

  - [x] 20.6 Adicionar tokens de z-index e border widths em `tokens.css`
    - Inserir escala z-index: `--ds-z-base` (0) a `--ds-z-tooltip` (700)
    - Inserir `--ds-border-width-none` (0) a `--ds-border-width-thick` (3px)
    - Inserir `--ds-border-style-solid`, `--ds-border-style-dashed`, `--ds-border-style-dotted`
    - Adicionar bridge `--border-width-*` no bloco `@theme inline` de `theme.css`
    - _Requisitos: 26.1, 26.2, 27.1, 27.2, 27.3, 27.4_

- [x] 21. Migrar componentes existentes para os novos tokens de foundations
  - [x] 21.1 Atualizar componentes para usar tokens de z-index
    - `Modal.vue`: substituir `z-[50]` → `z-[--ds-z-overlay]` e `z-[51]` → `z-[--ds-z-modal]`
    - `FlagGroup.vue`: substituir `z-[300]` → `z-[--ds-z-notification]`
    - `Tooltip.vue`: atualizar z-index para `z-[--ds-z-tooltip]`
    - Demais componentes com z-index literal (Dropdown, Select, etc.): mapear para o token correto
    - _Requisitos: 26.2, 26.3_

  - [x] 21.2 Atualizar componentes para usar tokens de shadow semântica
    - Substituir `shadow-lg`, `shadow-md` e valores literais de `box-shadow` por `--ds-shadow-card`, `--ds-shadow-dropdown`, `--ds-shadow-modal`, `--ds-shadow-tooltip` conforme contexto
    - `Flag.vue`: borda esquerda colorida usa `border-left-color` — verificar se alguma sombra literal deve ser migrada
    - _Requisito: 23.5_

  - [x] 21.3 Atualizar componentes para usar tokens de border-radius semântico
    - `Button.vue`: substituir `rounded-md` → `rounded-[--ds-radius-button]`
    - `Card`: substituir `rounded-lg` → `rounded-[--ds-radius-card]`
    - `Input.vue`: substituir valor literal → `rounded-[--ds-radius-input]`
    - `Badge.vue`: substituir `rounded-full` → `rounded-[--ds-radius-badge]`
    - `Tag.vue`: substituir valor literal → `rounded-[--ds-radius-tag]`
    - _Requisito: 21.5_

  - [x] 21.4 Atualizar componentes interativos para usar tokens de surface states
    - Substituir classes `hover:bg-accent/10`, `hover:bg-muted` e equivalentes por `hover:bg-[--ds-color-bg-hovered]` onde aplicável
    - Verificar `Button.vue`, `Tab.vue`, itens de lista interativos
    - _Requisitos: 24.4, 24.5_

- [x] 22. Criar componentes utilitários de documentação para o Playground
  - [x] 22.1 Criar componentes Vue de documentação em `src/stories/foundations/`
    - Criar `ColorSwatch.vue`: exibe quadrado colorido + valor hex resolvido + nome do token
    - Criar `GradientSwatch.vue`: retângulo 100% × 64px com gradiente aplicado + nome do token
    - Criar `ShadowCard.vue`: card branco sobre fundo muted com shadow + nome do token
    - Criar `RadiusPreview.vue`: quadrado 64×64 com border-radius aplicado + label
    - Criar `MotionDemo.vue`: botão que anima ao clicar usando tokens de duração e easing fornecidos
    - Usar `getComputedStyle(document.documentElement).getPropertyValue(token)` para exibir valores resolvidos em tempo real
    - _Requisito: 28.1 a 28.9_

  - [x] 22.2 Criar stories/pages de foundations no playground
    - Criar story/page `ColorTokens`: swatches de tokens primitivos e semânticos agrupados por categoria (text, bg, border, icon, surface states)
    - Criar story/page `Gradients`: swatches de todos os tokens `--ds-gradient-*`
    - Criar story/page `Typography`: texto "The quick brown fox" em cada tamanho e peso da escala
    - Criar story/page `Spacing`: régua visual com blocos coloridos + label + valor px para cada `--ds-space-*`
    - Criar story/page `BorderRadius`: quadrados com cada raio da escala primitiva
    - Criar story/page `Shadows`: cards com cada sombra da escala semântica e primitiva
    - Criar story/page `Motion`: demo interativa de cada combinação duração × easing
    - Criar story/page `ZIndex`: diagrama de camadas ilustrando a hierarquia `--ds-z-*`
    - Criar story/page `BorderWidths`: linhas com cada espessura + label do token
    - _Requisito: 28.1 a 28.9_

  - [x] 22.3 Garantir que as seções de Foundations respondem ao switch de tema dark/light em tempo real
    - Verificar que `getComputedStyle` é chamado dinamicamente (não no `onMounted` apenas) ou que os valores são lidos via CSS vars diretamente no template
    - _Requisito: 28.10_

- [x] 23. Escrever testes de properties para as foundations
  - [x] 23.1 Escrever teste de propriedade para motion reduced
    - **Propriedade 13: Motion reduced**
    - Verificar que `--ds-motion-duration-normal` resolve para `0ms` quando `prefers-reduced-motion: reduce` está ativo
    - Usar `matchMedia` mock do Vitest/happy-dom para simular a media query
    - _Requisito: 22.3_

  - [x] 23.2 Escrever teste de propriedade para shadow scale semântica
    - **Propriedade 14: Shadow scale semântica**
    - Verificar que `getComputedStyle('--ds-shadow-modal') === getComputedStyle('--ds-shadow-xl')`
    - Verificar que `getComputedStyle('--ds-shadow-card') === getComputedStyle('--ds-shadow-sm')`
    - _Requisito: 23.3_

  - [x] 23.3 Escrever teste de propriedade para z-index ordering
    - **Propriedade 15: Z-index ordering**
    - Verificar que `--ds-z-tooltip (700) > --ds-z-notification (600) > --ds-z-modal (500) > --ds-z-overlay (400)`
    - _Requisito: 26.3_

  - [x] 23.4 Escrever teste de propriedade para border-radius token map
    - **Propriedade 12: Border-radius token map**
    - Verificar que `Avatar` com `shape='square'` renderiza `border-radius` equivalente a `--ds-radius-md` (6px)
    - _Requisito: 21.4_

- [x] 24. Checkpoint foundations — Garantir que todos os novos tokens e testes passam
  - Executar suíte de testes completa e verificar que nenhum teste existente regrediu
  - Verificar que todos os novos tokens estão presentes e resolvíveis em `tokens.css`
  - Verificar que a aba Foundations do playground exibe todas as 9 seções corretamente
  - Perguntar ao usuário se houver dúvidas antes de finalizar

## Notes

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada tarefa referencia requisitos específicos para rastreabilidade
- Os checkpoints nas tarefas 9, 17 e 19 garantem validação incremental
- Os tokens existentes (`--ds-color-navy-*`, `--ds-spacing-*`) são preservados integralmente — nenhuma quebra de compatibilidade
- As propriedades de correção (Propriedades 2–10 do design) são cobertas pelas tarefas de testes opcionais
- O componente `Alert` permanece no codebase como legado sem remoção (Requisito 10.7)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "2.1", "4.1", "5.1"] },
    { "id": 2, "tasks": ["2.2", "3.1", "4.2", "6.1", "8.1", "10.1"] },
    { "id": 3, "tasks": ["2.3", "2.4", "3.2", "4.3", "5.2", "6.2", "7.1", "8.2"] },
    { "id": 4, "tasks": ["6.3", "11.1", "12.1", "13.1", "14.1", "15.1", "16.1", "16.2"] },
    { "id": 5, "tasks": ["12.2", "13.2", "14.2", "14.3", "15.2", "16.3"] },
    { "id": 6, "tasks": ["12.3", "13.3"] },
    { "id": 7, "tasks": ["18.1"] },
    { "id": 8, "tasks": ["20.1", "20.2", "20.3", "20.4", "20.5", "20.6"] },
    { "id": 9, "tasks": ["21.1", "21.2", "21.3", "21.4"] },
    { "id": 10, "tasks": ["22.1", "23.1", "23.2", "23.3", "23.4"] },
    { "id": 11, "tasks": ["22.2"] },
    { "id": 12, "tasks": ["22.3"] },
    { "id": 13, "tasks": ["24"] }
  ]
}
```
