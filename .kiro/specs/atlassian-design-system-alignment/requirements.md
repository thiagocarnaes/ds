# Requirements Document

## Introduction

Esta feature tem como objetivo alinhar o design system atual (Vue 3 + TypeScript + Tailwind CSS) às boas práticas e padrões do Atlassian Design System (ADS), mantendo a identidade visual própria do projeto (paleta navy/cyan, modo dark-first) e sem migrar para React.

O escopo abrange dez frentes: (1) expansão e padronização semântica do sistema de tokens, (2) adição de novos componentes ausentes, (3) aprimoramento de componentes existentes com gaps em relação ao ADS, (4) melhoria de acessibilidade, (5) criação de primitivas tipográficas, (6) expansão do sistema de espaçamento, (7) sistema de gradientes, (8) escala de border-radius e sombras, (9) tokens de motion, z-index e bordas, e (10) documentação visual das foundations no playground.

---

## Glossary

- **Design_System**: O pacote `packages/design-system` com todos os componentes, tokens e estilos.
- **Token_Layer**: Arquivo `tokens.css` + `tokens.json` que define variáveis CSS custom properties.
- **Theme_Layer**: Arquivo `theme.css` que define tokens semânticos para os temas light e dark.
- **ADS**: Atlassian Design System — referência de padrões e boas práticas adotados como guia.
- **Componente**: Arquivo `.vue` individual que implementa um elemento de interface.
- **Variant**: Propriedade de um componente que altera sua aparência visual (ex.: `appearance`, `variant`).
- **Token_Semantico**: Variável CSS cujo nome descreve o papel funcional (ex.: `--color-text-subtle`) em vez da cor literal.
- **Elevation**: Camada visual que indica a profundidade do elemento na interface (sunken, default, raised, overlay).
- **Focus_Ring**: Anel visual de foco exibido durante navegação por teclado.
- **ARIA**: Conjunto de atributos HTML para acessibilidade (ex.: `aria-busy`, `aria-invalid`, `aria-describedby`).
- **ButtonGroup**: Contêiner que agrupa dois ou mais `Button` com espaçamento e borda coerentes.
- **SectionMessage**: Mensagem contextual inline de maior riqueza estrutural que o `Alert` atual.
- **Flag**: Notificação pós-ação com suporte a dismiss, análoga ao `Toast`, porém com estrutura de ações.
- **Tag**: Elemento de classificação/categorização, removível opcionalmente.
- **Heading**: Primitiva tipográfica que renderiza `h1`–`h6` com estilos predefinidos.
- **Text**: Primitiva tipográfica inline que aplica tamanho, peso e cor a trechos de texto.
- **ProgressTracker**: Indicador de progresso de múltiplas etapas.
- **Popup**: Overlay flutuante genérico, base para `Popover`, `DropdownMenu` e similares.
- **Gradient_Token**: Variável CSS que contém uma expressão `linear-gradient()` ou `radial-gradient()` completa, reutilizável em `background` ou `background-image`.
- **Motion_Token**: Variável CSS que define duração (`--ds-motion-duration-*`) ou função de easing (`--ds-motion-easing-*`) para uso em `transition` e `animation`.
- **Shadow_Scale**: Conjunto de tokens de `box-shadow` organizados em níveis de elevação, com variantes semânticas (`card`, `dropdown`, `modal`, `tooltip`).
- **Z_Layer**: Nível de sobreposição na interface definido por tokens `--ds-z-*`, garantindo hierarquia consistente entre componentes sobrepostos.
- **Surface_State**: Token de cor de fundo que representa um estado interativo da surface (`hovered`, `pressed`, `selected`), separado dos estados de texto e borda.

---

## Requirements

---

### Requisito 1 — Expansão do Sistema de Tokens Semânticos

**User Story:** Como desenvolvedor que consome o design system, quero tokens CSS com nomenclatura semântica rica, para que eu possa construir interfaces consistentes sem depender de valores hardcoded.

#### Critérios de Aceitação

1. THE Design_System SHALL expor tokens de cor semântica para as categorias `background`, `text`, `border` e `icon`, cada um com os papéis: `default`, `subtle`, `brand`, `brand.bold`, `disabled`, `inverse`.
2. THE Design_System SHALL expor tokens de estado interativo separados: `hovered`, `pressed`, `focused`, `disabled`, `selected` — aplicados às categorias `background`, `text` e `border`.
3. THE Design_System SHALL expor tokens de elevation com quatro níveis: `sunken` (−1), `default` (0), `raised` (+1) e `overlay` (+2), mapeados para valores de `box-shadow` e `background` correspondentes.
4. THE Design_System SHALL expor tokens de opacidade: `opacity.disabled` (40%) e `opacity.loading` (70%), utilizados por componentes em estado desabilitado e carregando.
5. THE Token_Layer SHALL manter os tokens de paleta existentes (`--ds-color-navy-*`, `--ds-color-cyan-*`, etc.) como camada primitiva, sem quebrá-los.
6. THE Theme_Layer SHALL mapear cada novo token semântico para os valores corretos nos temas light e dark, preservando a paleta navy/cyan/teal atual.
7. WHEN um token semântico é referenciado em qualquer componente, THE Design_System SHALL resolver o valor correto de acordo com o tema ativo (`.dark` class).
8. THE Token_Layer SHALL expor a escala de espaçamento expandida de `space.025` (2 px) a `space.1000` (80 px), com incrementos definidos em múltiplos de 4 px.

---

### Requisito 2 — Expansão de Variantes do Componente Button

**User Story:** Como desenvolvedor, quero que o `Button` suporte variantes `warning` e `discovery`, a prop `isSelected`, a prop `shouldFitContainer` e um componente `ButtonGroup`, para que eu possa expressar toda a gama semântica de ações prevista no ADS.

#### Critérios de Aceitação

1. WHEN a prop `appearance` do `Button` recebe o valor `warning`, THE Button SHALL ser renderizado com a cor `--warning` como cor de fundo e texto de alto contraste.
2. WHEN a prop `appearance` do `Button` recebe o valor `discovery`, THE Button SHALL ser renderizado com a cor `--ds-color-purple-400` como cor de fundo e texto de alto contraste.
3. WHEN a prop `isSelected` é `true`, THE Button SHALL exibir estilo visual de seleção ativo (fundo destacado, sem outline adicional).
4. WHEN a prop `shouldFitContainer` é `true`, THE Button SHALL ocupar 100% da largura do seu contêiner.
5. THE Design_System SHALL expor um componente `ButtonGroup` que aceita dois ou mais `Button` como filhos.
6. WHEN dois ou mais `Button` são filhos do `ButtonGroup`, THE ButtonGroup SHALL aplicar espaçamento uniforme de `space.100` (8 px) entre eles.
7. IF a prop `disabled` é `true` e uma prop `tooltip` é fornecida ao `Button`, THEN THE Button SHALL renderizar um `Tooltip` sobre o elemento para exibir a mensagem, mantendo o estado desabilitado acessível.

---

### Requisito 3 — Aprimoramento do Componente Avatar

**User Story:** Como desenvolvedor, quero que o `Avatar` suporte formas distintas, indicadores de presença e indicadores de status, para que eu possa representar usuários, agentes e projetos com precisão visual.

#### Critérios de Aceitação

1. WHEN a prop `shape` do `Avatar` é `circle`, THE Avatar SHALL ser renderizado com `border-radius: 50%`.
2. WHEN a prop `shape` do `Avatar` é `square`, THE Avatar SHALL ser renderizado com `border-radius: var(--ds-radius-md)`.
3. WHEN a prop `presence` do `Avatar` recebe os valores `online`, `busy`, `offline` ou `focus`, THE Avatar SHALL exibir um indicador colorido de 10 px no canto inferior direito.
4. WHEN a prop `status` do `Avatar` recebe os valores `approved`, `declined` ou `locked`, THE Avatar SHALL exibir um ícone de status de 14 px sobreposto ao canto inferior direito.
5. THE Avatar SHALL manter suporte ao `AvatarGroup` existente para todas as combinações de `shape` e `size`.
6. IF a prop `src` é fornecida e a imagem falha ao carregar, THEN THE Avatar SHALL exibir as iniciais geradas a partir da prop `name`.
7. THE Avatar SHALL expor um atributo `aria-label` calculado a partir de `name` quando nenhum texto alternativo externo é fornecido.

---

### Requisito 4 — Expansão de Appearances do Badge

**User Story:** Como desenvolvedor, quero que o `Badge` suporte o conjunto completo de appearances previsto pelo ADS, para que eu possa indicar estados semânticos distintos (adicionado, removido, descoberta, etc.) de forma padronizada.

#### Critérios de Aceitação

1. THE Badge SHALL aceitar os valores de `appearance`: `default`, `primary`, `added`, `removed`, `modified`, `inprogress`, `moved`, `new`, `discovery`, `important`, `success`, `warning`, `danger`, `information`.
2. WHEN a prop `appearance` é `added`, THE Badge SHALL exibir cores baseadas no token de sucesso (`--success`).
3. WHEN a prop `appearance` é `removed`, THE Badge SHALL exibir cores baseadas no token destrutivo (`--destructive`).
4. WHEN a prop `appearance` é `discovery`, THE Badge SHALL exibir cores baseadas no token `--ds-color-purple-400`.
5. WHEN a prop `appearance` é `moved` ou `modified`, THE Badge SHALL exibir cores baseadas no token `--warning`.
6. WHEN a prop `value` excede 99, THE Badge SHALL exibir o texto `99+` em vez do número completo.
7. THE Badge SHALL manter o estilo de glow existente (box-shadow luminoso) para todas as appearances.

---

### Requisito 5 — Padronização de Appearances do Lozenge

**User Story:** Como desenvolvedor, quero que o `Lozenge` adote nomenclatura de appearances alinhada ao ADS, para que o vocabulário de estados seja consistente com outros sistemas.

#### Critérios de Aceitação

1. THE Lozenge SHALL aceitar os valores de `appearance`: `default`, `success`, `moved`, `inprogress`, `new`, `removed`, `warning`.
2. THE Lozenge SHALL manter retrocompatibilidade com `progress` (mapeado para `inprogress`) e `danger` (mapeado para `removed`) por meio de aliases com aviso de deprecação.
3. WHEN a prop `isBold` ou `bold` é `true`, THE Lozenge SHALL aplicar opacidade de fundo de 20% e efeito glow no token de cor correspondente.
4. THE Lozenge SHALL manter o estilo de texto `uppercase` com `letter-spacing` ampliado conforme implementação atual.

---

### Requisito 6 — Reestruturação do Componente Modal

**User Story:** Como desenvolvedor, quero que o `Modal` exponha subcomponentes `ModalHeader`, `ModalBody`, `ModalFooter` e `ModalTitle`, para que eu possa compor layouts de modal estruturados e acessíveis.

#### Critérios de Aceitação

1. THE Design_System SHALL expor os subcomponentes `ModalHeader`, `ModalBody`, `ModalFooter` e `ModalTitle` para composição interna do `Modal`.
2. WHEN o `ModalHeader` é utilizado, THE ModalHeader SHALL renderizar um elemento com `role="heading"` e o texto do título via `ModalTitle`.
3. WHEN o `ModalBody` é utilizado, THE ModalBody SHALL aplicar `overflow-y: auto` e padding padrão de `space.300` (24 px).
4. WHEN o `ModalFooter` é utilizado, THE ModalFooter SHALL alinhar as ações com `flex-end` por padrão.
5. THE Modal SHALL aceitar prop `width` com valores predefinidos: `small` (400 px), `medium` (600 px), `large` (800 px) e `xlarge` (968 px).
6. THE Modal SHALL manter os comportamentos existentes: fechar com `Escape`, fechar ao clicar no overlay (quando `closeOnOverlay` é `true`) e foco automático no painel.
7. THE Modal SHALL expor atributo `aria-labelledby` apontando para o `id` do `ModalTitle` quando presente.
8. WHEN o `Modal` está aberto, THE Modal SHALL impedir scroll do `body` subjacente.

---

### Requisito 7 — Aprimoramento do Componente Input / TextField

**User Story:** Como desenvolvedor, quero que o `Input` suporte slots de elementos antes/depois e tamanho compacto, para que eu possa construir campos de busca, moedas e filtros com elementos visuais integrados.

#### Critérios de Aceitação

1. THE Input SHALL aceitar um slot `elemBefore` para renderizar um ícone ou elemento à esquerda do campo, dentro da borda.
2. THE Input SHALL aceitar um slot `elemAfter` para renderizar um ícone, botão ou elemento à direita do campo, dentro da borda.
3. WHEN o slot `elemBefore` está preenchido, THE Input SHALL aplicar `padding-left` ajustado para evitar sobreposição de texto.
4. WHEN o slot `elemAfter` está preenchido, THE Input SHALL aplicar `padding-right` ajustado para evitar sobreposição de texto.
5. THE Input SHALL aceitar prop `size` com os valores `default` (36 px de altura) e `compact` (28 px de altura).
6. THE Input SHALL manter o comportamento de `aria-invalid` e `aria-describedby` para erros de validação já implementados.

---

### Requisito 8 — Aprimoramento do Componente Tabs

**User Story:** Como desenvolvedor, quero que as `Tabs` suportem callback de mudança, controle de desmontagem de painéis e prop de id explícita, para que eu possa integrá-las com lógica de negócio de forma previsível.

#### Critérios de Aceitação

1. THE Tabs SHALL emitir um evento `change` com o valor da aba ativada sempre que a aba ativa for alterada.
2. THE Tabs SHALL aceitar prop `shouldUnmountTabPanelOnChange` do tipo booleano.
3. WHEN `shouldUnmountTabPanelOnChange` é `true`, THE Tabs SHALL desmontar o conteúdo de painéis inativos do DOM.
4. WHEN `shouldUnmountTabPanelOnChange` é `false` ou omitido, THE Tabs SHALL manter todos os painéis montados e ocultá-los via `display: none`.
5. THE Tab SHALL aceitar prop `id` explícita para uso em testes e ancoragem via URL.
6. THE Tabs SHALL manter suporte ao modelo `v-model` existente para a aba ativa.

---

### Requisito 9 — Aprimoramento do Componente Tooltip

**User Story:** Como desenvolvedor, quero que o `Tooltip` suporte delay de exibição, exibição de atalhos de teclado e posicionamentos adicionais, para que eu possa apresentar dicas contextuais mais ricas.

#### Critérios de Aceitação

1. THE Tooltip SHALL aceitar prop `delay` em milissegundos (padrão: 300 ms) que define o tempo antes de exibir o tooltip após o hover.
2. WHEN a prop `delay` é fornecida, THE Tooltip SHALL aguardar o tempo especificado antes de exibir o conteúdo.
3. THE Tooltip SHALL aceitar prop `shortcut` do tipo `string` que exibe um atalho de teclado formatado ao lado do conteúdo do tooltip.
4. THE Tooltip SHALL aceitar o valor `top-start` e `top-end` além dos placements existentes (`top`, `bottom`, `left`, `right`).
5. WHEN o elemento gatilho perde o foco ou o mouse sai antes do delay expirar, THE Tooltip SHALL cancelar a exibição pendente.
6. THE Tooltip SHALL manter o atributo `role="tooltip"` e a associação via `aria-describedby` no elemento gatilho.

---

### Requisito 10 — Novo Componente SectionMessage

**User Story:** Como desenvolvedor, quero um componente `SectionMessage` para mensagens contextuais inline mais estruturadas que o `Alert` atual, para que eu possa apresentar conteúdos informativos com título, corpo e ações.

#### Critérios de Aceitação

1. THE Design_System SHALL expor um componente `SectionMessage`.
2. THE SectionMessage SHALL aceitar prop `appearance` com os valores: `information`, `warning`, `error`, `success`, `discovery`, `change`.
3. THE SectionMessage SHALL aceitar prop `title` do tipo string para o título da mensagem.
4. THE SectionMessage SHALL expor slot padrão para o corpo da mensagem e slot `actions` para botões de ação.
5. WHEN a prop `appearance` é definida, THE SectionMessage SHALL exibir um ícone correspondente à semântica do estado (informação, aviso, erro, sucesso, etc.).
6. THE SectionMessage SHALL aplicar `role="region"` com `aria-label` derivado da prop `title` quando presente.
7. THE Alert SHALL ser mantido como componente legado sem remoção, porém documentado como substituído pelo `SectionMessage`.

---

### Requisito 11 — Novo Componente Flag / FlagGroup

**User Story:** Como desenvolvedor, quero componentes `Flag` e `FlagGroup` para notificações pós-ação com suporte a ações inline e dismiss, para que eu possa complementar o `Toast` com um padrão mais rico de feedback.

#### Critérios de Aceitação

1. THE Design_System SHALL expor os componentes `Flag` e `FlagGroup`.
2. THE Flag SHALL aceitar as props: `title` (obrigatório), `description`, `appearance` (`normal`, `warning`, `error`, `success`, `discovery`), `actions` (array de `{ label, onClick }`), `isDismissible`.
3. WHEN `isDismissible` é `true`, THE Flag SHALL exibir um botão de fechar com `aria-label="Fechar notificação"`.
4. WHEN o botão de fechar é acionado, THE Flag SHALL emitir o evento `dismiss` e remover-se da interface.
5. THE FlagGroup SHALL aceitar um slot padrão para múltiplos `Flag` e posicioná-los empilhados no canto superior direito da viewport, com `z-index` acima dos modais.
6. THE FlagGroup SHALL limitar a exibição a no máximo 3 `Flag` simultâneos; flags excedentes aguardam na fila.
7. THE Flag SHALL aplicar `role="alert"` com `aria-live="assertive"` para aparências `error` e `aria-live="polite"` para demais aparências.

---

### Requisito 12 — Novo Componente Tag / TagGroup

**User Story:** Como desenvolvedor, quero componentes `Tag` e `TagGroup` para classificação e categorização de itens, para que eu possa exibir e gerenciar coleções de etiquetas de forma interativa.

#### Critérios de Aceitação

1. THE Design_System SHALL expor os componentes `Tag` e `TagGroup`.
2. THE Tag SHALL aceitar as props: `text` (obrigatório), `isRemovable`, `color` (valor de appearance: `default`, `blue`, `teal`, `red`, `orange`, `purple`), `href`, `isLink`.
3. WHEN `isRemovable` é `true`, THE Tag SHALL exibir um botão de remover com ícone "×" e `aria-label="Remover [text]"`.
4. WHEN o botão de remover é acionado, THE Tag SHALL emitir o evento `remove` com o valor de `text`.
5. WHEN `isLink` é `true` e `href` é fornecido, THE Tag SHALL renderizar como elemento `<a>` com o href correspondente.
6. THE TagGroup SHALL aceitar um array de objetos `tags` e renderizar um `Tag` para cada item com espaçamento de `space.050` (4 px).
7. THE Tag SHALL aplicar `role="listitem"` quando filho de um `TagGroup` e o `TagGroup` SHALL aplicar `role="list"`.

---

### Requisito 13 — Novo Componente Heading

**User Story:** Como desenvolvedor, quero uma primitiva tipográfica `Heading` que renderize o nível correto de heading HTML com estilos consistentes, para que eu possa construir hierarquias de conteúdo sem definir estilos tipográficos manualmente.

#### Critérios de Aceitação

1. THE Design_System SHALL expor um componente `Heading`.
2. THE Heading SHALL aceitar prop `level` com os valores `1`, `2`, `3`, `4`, `5` e `6`, e renderizar o elemento HTML correspondente (`h1`–`h6`).
3. THE Heading SHALL aceitar prop `size` com os valores `xxlarge` (32 px), `xlarge` (24 px), `large` (20 px), `medium` (16 px), `small` (14 px), `xsmall` (12 px), permitindo dissociar nível semântico de tamanho visual.
4. THE Heading SHALL aceitar prop `color` com os valores: `default`, `subtle`, `disabled`, `inverse`, mapeados para os tokens semânticos correspondentes.
5. WHEN a prop `level` é omitida, THE Heading SHALL renderizar como `h2` por padrão.
6. THE Heading SHALL aceitar prop `id` para uso em âncoras e `aria-labelledby`.

---

### Requisito 14 — Novo Componente Text

**User Story:** Como desenvolvedor, quero uma primitiva tipográfica `Text` para aplicar estilos de corpo de texto de forma declarativa, para que eu possa compor conteúdos sem escrever classes Tailwind repetitivas.

#### Critérios de Aceitação

1. THE Design_System SHALL expor um componente `Text`.
2. THE Text SHALL aceitar prop `size` com os valores: `large` (16 px), `medium` (14 px, padrão), `small` (12 px), `xsmall` (11 px).
3. THE Text SHALL aceitar prop `weight` com os valores: `regular` (400), `medium` (500), `semibold` (600), `bold` (700).
4. THE Text SHALL aceitar prop `color` com os valores: `default`, `subtle`, `disabled`, `inverse`, `success`, `warning`, `danger`, mapeados para tokens semânticos.
5. THE Text SHALL aceitar prop `as` para sobrescrever o elemento HTML renderizado (padrão: `span`).
6. WHEN a prop `as` é `"p"`, THE Text SHALL renderizar como elemento de bloco com `display: block`.

---

### Requisito 15 — Novo Componente ProgressTracker

**User Story:** Como desenvolvedor, quero um componente `ProgressTracker` para representar progresso de múltiplas etapas sequenciais, para que eu possa guiar usuários por fluxos multi-step de forma visual.

#### Critérios de Aceitação

1. THE Design_System SHALL expor um componente `ProgressTracker`.
2. THE ProgressTracker SHALL aceitar prop `steps` como array de objetos `{ label, percentageComplete }`, onde `percentageComplete` é um número entre 0 e 100.
3. THE ProgressTracker SHALL aceitar prop `currentIndex` indicando o passo ativo.
4. WHEN `percentageComplete` de um passo é 100, THE ProgressTracker SHALL exibir o passo com estado visual `completed`.
5. WHEN `currentIndex` aponta para um passo, THE ProgressTracker SHALL exibir o passo com estado visual `current`.
6. THE ProgressTracker SHALL aplicar os atributos ARIA adequados: `role="list"` no contêiner e `aria-current="step"` no passo ativo.
7. THE ProgressTracker SHALL emitir evento `stepClick` com o índice do passo quando um passo completado é clicado.

---

### Requisito 16 — Aprimoramento de Acessibilidade Transversal

**User Story:** Como usuário de tecnologia assistiva, quero que todos os componentes interativos do design system sigam as diretrizes WCAG 2.1 nível AA, para que eu possa navegar e operar a interface com leitores de tela e teclado.

#### Critérios de Aceitação

1. THE Design_System SHALL aplicar `focus-visible` em todos os elementos interativos, utilizando o token `--ring` como cor do Focus_Ring.
2. THE Design_System SHALL garantir que todos os Focus_Ring tenham contraste mínimo de 3:1 contra o fundo adjacente (WCAG 2.1 — Critério 1.4.11).
3. WHEN um componente está em estado `loading`, THE Design_System SHALL aplicar `aria-busy="true"` no elemento raiz do componente.
4. WHEN um componente de formulário está em estado de erro, THE Design_System SHALL aplicar `aria-invalid="true"` e `aria-describedby` apontando para a mensagem de erro associada.
5. THE Design_System SHALL garantir que todos os botões de ícone (`IconButton`) possuam `aria-label` descritivo obrigatório.
6. THE Spinner SHALL expor `role="status"` com texto de `aria-label` configurável (padrão: "Carregando…").
7. THE Design_System SHALL garantir que elementos desabilitados (`disabled`) não recebam foco via teclado, exceto quando um `Tooltip` precisa ser acionado.
8. IF um componente exibe conteúdo dinâmico (Toast, Flag, Alert), THEN THE Design_System SHALL aplicar `aria-live` com o valor de polidez adequado ao nível de urgência da mensagem.

---

### Requisito 17 — Conformidade Tipográfica com Escala Definida

**User Story:** Como designer e desenvolvedor, quero que o design system exponha uma escala tipográfica explícita e consistente nos tokens, para que todos os textos da interface sigam a mesma progressão de tamanhos.

#### Critérios de Aceitação

1. THE Token_Layer SHALL definir a escala tipográfica com os seguintes tamanhos em `rem`: 0.6875 (11 px), 0.75 (12 px), 0.875 (14 px), 1 (16 px), 1.25 (20 px), 1.5 (24 px), 2 (32 px).
2. THE Token_Layer SHALL definir tokens de `line-height` correspondentes: 1 (16 px), 1.25 (20 px), 1.4286 (20 px para 14 px), 1.5 (24 px), 1.6 (32 px).
3. THE Token_Layer SHALL definir tokens de `font-weight`: `regular` (400), `medium` (500), `semibold` (600), `bold` (700).
4. THE Theme_Layer SHALL preservar a família tipográfica atual: `DM Sans` para texto geral e `DM Mono` para código.
5. WHEN o componente `Heading` é renderizado com `level` entre 1 e 6, THE Heading SHALL utilizar exclusivamente os tokens tipográficos definidos no `Token_Layer`.

---

### Requisito 18 — Expansão do Sistema de Espaçamento

**User Story:** Como desenvolvedor, quero uma escala de espaçamento bem definida e granular nos tokens, para que eu possa aplicar margens, paddings e gaps de forma consistente em toda a interface.

#### Critérios de Aceitação

1. THE Token_Layer SHALL expor a escala de espaçamento completa com as etapas: `space.025` (2 px), `space.050` (4 px), `space.075` (6 px), `space.100` (8 px), `space.150` (12 px), `space.200` (16 px), `space.250` (20 px), `space.300` (24 px), `space.400` (32 px), `space.500` (40 px), `space.600` (48 px), `space.800` (64 px), `space.1000` (80 px).
2. THE Token_Layer SHALL manter os aliases de espaçamento legados (`--ds-spacing-1` a `--ds-spacing-8`) mapeados para os novos tokens, sem quebrar consumidores existentes.
3. THE Design_System SHALL utilizar os novos tokens de espaçamento nas classes utilitárias Tailwind, configurando-os via `@theme` no `theme.css`.
4. THE Design_System SHALL documentar a escala de espaçamento no Storybook com um exemplo visual de cada valor.

---

### Requisito 19 — Estrutura de Round-Trip para Tokens

**User Story:** Como engenheiro de design system, quero que os tokens definidos em `tokens.json` possam ser transformados e revertidos de forma consistente, para que qualquer pipeline de build produza saídas determinísticas.

#### Critérios de Aceitação

1. THE Token_Layer SHALL garantir que todo token definido em `tokens.json` com referência (ex.: `{global.color.cyan.500}`) seja resolvível para um valor CSS literal sem ambiguidades.
2. WHEN o arquivo `tokens.json` é processado pelo pipeline de build, THE Design_System SHALL produzir um `tokens.css` cujas variáveis CSS correspondem exatamente a todos os valores de `tokens.json`.
3. FOR ALL tokens do tipo `color` em `tokens.json`, THE Design_System SHALL garantir que o valor CSS gerado em hexadecimal ou `rgba` seja equivalente ao valor original após round-trip (parse → gerar CSS → ler CSS).
4. IF um token referencia outro token que não existe em `tokens.json`, THEN THE Design_System SHALL emitir um erro de build descritivo com o nome do token não resolvido.

---

### Requisito 20 — Sistema de Gradientes

**User Story:** Como desenvolvedor, quero tokens de gradiente como foundation do design system, para que eu possa aplicar gradientes de marca e utilitários de forma consistente nos temas light e dark.

#### Critérios de Aceitação

1. THE Token_Layer SHALL expor tokens de gradiente de marca com as direções `horizontal`, `vertical` e `diagonal`, mapeando a transição navy→cyan da paleta do projeto.
2. THE Token_Layer SHALL expor um token `--ds-gradient-hero` para uso em banners e headers de destaque, com transição de alta saturação entre as cores primárias da marca.
3. THE Token_Layer SHALL expor um token `--ds-gradient-card` para fundo sutil de cards, com transição de baixa opacidade adequada para superfícies elevadas.
4. THE Token_Layer SHALL expor um token `--ds-gradient-overlay` (scrim) para sobreposição em imagens, com transição de `rgba(0,0,0,0)` para `rgba(0,0,0,0.6)`.
5. THE Token_Layer SHALL expor um token `--ds-gradient-fade` para truncamento de conteúdo, com transição de cor sólida para `transparent` na direção inline-end.
6. WHEN o tema dark está ativo, THE Theme_Layer SHALL redefinir os tokens de gradiente com valores ajustados para o tema escuro, mantendo contraste e legibilidade.
7. FOR ALL tokens de gradiente, THE Design_System SHALL garantir que os valores sejam expressões CSS `linear-gradient(...)` ou `radial-gradient(...)` válidas e utilizáveis diretamente em `background` ou `background-image`.

---

### Requisito 21 — Escala de Border Radius

**User Story:** Como desenvolvedor, quero tokens de border-radius como foundation do design system, para que eu possa aplicar arredondamentos consistentes em todos os componentes sem valores hardcoded.

#### Critérios de Aceitação

1. THE Token_Layer SHALL expor a escala primitiva de border-radius: `--ds-radius-none` (0), `--ds-radius-xs` (2px), `--ds-radius-sm` (4px), `--ds-radius-md` (6px), `--ds-radius-lg` (8px), `--ds-radius-xl` (12px), `--ds-radius-2xl` (16px), `--ds-radius-3xl` (24px), `--ds-radius-full` (9999px).
2. THE Token_Layer SHALL expor tokens semânticos de border-radius sobre a escala primitiva: `--ds-radius-button`, `--ds-radius-card`, `--ds-radius-input`, `--ds-radius-badge`, `--ds-radius-tag`.
3. THE Token_Layer SHALL mapear `--ds-radius-button` para `--ds-radius-md`, `--ds-radius-card` para `--ds-radius-lg`, `--ds-radius-input` para `--ds-radius-md`, `--ds-radius-badge` para `--ds-radius-full`, `--ds-radius-tag` para `--ds-radius-sm`.
4. THE Token_Layer SHALL preservar o token `--ds-radius-md` existente com o valor `6px`, garantindo que o componente `Avatar` com `shape="square"` não seja afetado.
5. FOR ALL componentes que utilizam `border-radius`, THE Design_System SHALL referenciar exclusivamente tokens da escala semântica ou primitiva, sem valores literais hardcoded.

---

### Requisito 22 — Sistema de Motion e Animação

**User Story:** Como desenvolvedor, quero tokens de duração e easing para transições consistentes, para que todos os componentes animados sigam o mesmo ritmo visual e respeitem a preferência de redução de movimento do usuário.

#### Critérios de Aceitação

1. THE Token_Layer SHALL expor tokens de duração de animação: `--ds-motion-duration-instant` (0ms), `--ds-motion-duration-fast` (100ms), `--ds-motion-duration-normal` (200ms), `--ds-motion-duration-slow` (350ms), `--ds-motion-duration-slower` (500ms).
2. THE Token_Layer SHALL expor tokens de easing: `--ds-motion-easing-in`, `--ds-motion-easing-out`, `--ds-motion-easing-in-out`, `--ds-motion-easing-spring` (cubic-bezier elástico, ex.: `cubic-bezier(0.34, 1.56, 0.64, 1)`), `--ds-motion-easing-linear`.
3. WHEN a media query `prefers-reduced-motion: reduce` está ativa, THE Design_System SHALL aplicar `--ds-motion-duration-instant` em substituição a todos os outros tokens de duração.
4. FOR ALL componentes que utilizam `transition` ou `animation`, THE Design_System SHALL referenciar os tokens `--ds-motion-duration-*` e `--ds-motion-easing-*` em vez de valores literais.
5. THE Theme_Layer SHALL declarar o override de motion-reduction em um bloco `@media (prefers-reduced-motion: reduce)` dedicado, sobrescrevendo os tokens de duração para `0ms`.

---

### Requisito 23 — Escala de Sombras

**User Story:** Como desenvolvedor, quero uma shadow scale completa como foundation do design system, para que eu possa aplicar elevação visual consistente em todos os componentes e superfícies.

#### Critérios de Aceitação

1. THE Token_Layer SHALL expor a escala primitiva de sombras: `--ds-shadow-none`, `--ds-shadow-xs`, `--ds-shadow-sm`, `--ds-shadow-md`, `--ds-shadow-lg`, `--ds-shadow-xl`, `--ds-shadow-2xl`.
2. THE Token_Layer SHALL expor tokens semânticos de sombra sobre a escala primitiva: `--ds-shadow-card`, `--ds-shadow-dropdown`, `--ds-shadow-modal`, `--ds-shadow-tooltip`.
3. THE Token_Layer SHALL mapear `--ds-shadow-card` para `--ds-shadow-sm`, `--ds-shadow-dropdown` para `--ds-shadow-md`, `--ds-shadow-modal` para `--ds-shadow-xl`, `--ds-shadow-tooltip` para `--ds-shadow-md`.
4. WHEN o tema dark está ativo, THE Theme_Layer SHALL redefinar os tokens de sombra com opacidades ajustadas para o tema escuro, preservando a percepção de elevação.
5. FOR ALL componentes que utilizam `box-shadow` para elevação, THE Design_System SHALL referenciar exclusivamente os tokens semânticos de sombra em vez de valores literais.

---

### Requisito 24 — Tokens de Estado Interativo de Surface

**User Story:** Como desenvolvedor, quero tokens específicos para estados hover, pressed e selected em surfaces interativas, para que eu possa construir elementos interativos com feedback visual consistente em todos os temas.

#### Critérios de Aceitação

1. THE Token_Layer SHALL expor tokens de estado interativo de surface: `--ds-color-bg-hovered`, `--ds-color-bg-pressed`, `--ds-color-bg-selected`, `--ds-color-bg-selected-hovered`.
2. THE Token_Layer SHALL expor variantes contextuais dos tokens de estado para os contextos: `brand`, `danger`, `warning`, `success` — resultando nos tokens `--ds-color-bg-brand-hovered`, `--ds-color-bg-brand-pressed`, `--ds-color-bg-danger-hovered`, `--ds-color-bg-warning-hovered`, `--ds-color-bg-success-hovered`.
3. WHEN o tema dark está ativo, THE Theme_Layer SHALL redefinir todos os tokens de estado interativo com valores adequados ao fundo escuro, garantindo que os estados hover e pressed sejam perceptíveis.
4. FOR ALL elementos interativos que exibem feedback visual em hover ou pressed, THE Design_System SHALL utilizar os tokens `--ds-color-bg-hovered` e `--ds-color-bg-pressed` em vez de opacidades ou valores hardcoded.
5. WHEN um elemento está no estado `selected`, THE Design_System SHALL aplicar `--ds-color-bg-selected` como cor de fundo, e `--ds-color-bg-selected-hovered` quando o elemento selecionado é hovereado.

---

### Requisito 25 — Tokens de Cor para Ícones

**User Story:** Como desenvolvedor, quero tokens semânticos de cor específicos para ícones, separados dos tokens de texto, para que eu possa colorir ícones de forma independente e consistente com a semântica visual da interface.

#### Critérios de Aceitação

1. THE Token_Layer SHALL expor tokens de cor para ícones: `--ds-color-icon-default`, `--ds-color-icon-subtle`, `--ds-color-icon-inverse`, `--ds-color-icon-brand`, `--ds-color-icon-disabled`.
2. THE Token_Layer SHALL expor tokens semânticos de cor para ícones de estado: `--ds-color-icon-danger`, `--ds-color-icon-warning`, `--ds-color-icon-success`, `--ds-color-icon-discovery`.
3. THE Theme_Layer SHALL mapear `--ds-color-icon-default` para um valor de cinza escuro no tema light e cinza claro no tema dark, distinto dos tokens de texto para permitir diferenciação óptica.
4. WHEN o tema dark está ativo, THE Theme_Layer SHALL redefinir todos os tokens `--ds-color-icon-*` com valores otimizados para o fundo escuro.
5. FOR ALL componentes que renderizam ícones SVG com cor semântica, THE Design_System SHALL referenciar os tokens `--ds-color-icon-*` correspondentes ao estado do componente.

---

### Requisito 26 — Sistema de Z-Index

**User Story:** Como desenvolvedor, quero uma escala de z-index como tokens para camadas da interface, para que a sobreposição de elementos siga uma hierarquia previsível e sem conflitos.

#### Critérios de Aceitação

1. THE Token_Layer SHALL expor a escala de z-index: `--ds-z-base` (0), `--ds-z-card` (1), `--ds-z-navigation` (100), `--ds-z-dropdown` (200), `--ds-z-sticky` (300), `--ds-z-overlay` (400), `--ds-z-modal` (500), `--ds-z-notification` (600), `--ds-z-tooltip` (700).
2. FOR ALL componentes que utilizam `z-index`, THE Design_System SHALL referenciar exclusivamente os tokens `--ds-z-*` em vez de valores literais.
3. THE Design_System SHALL garantir que a hierarquia de z-index seja respeitada: `Tooltip` sempre acima de `Modal`, `Modal` acima de `Overlay`, `Notification` (Flag/Toast) entre `Modal` e `Tooltip`.
4. IF dois componentes do mesmo nível de z-index precisam se sobrepor, THEN THE Design_System SHALL utilizar `isolation: isolate` no contexto pai para criar um contexto de empilhamento local sem alterar os tokens globais.

---

### Requisito 27 — Tokens de Linha e Borda

**User Story:** Como desenvolvedor, quero tokens para espessuras e estilos de borda, para que eu possa aplicar bordas consistentes em todos os componentes sem valores hardcoded.

#### Critérios de Aceitação

1. THE Token_Layer SHALL expor tokens de espessura de borda: `--ds-border-width-none` (0), `--ds-border-width-default` (1px), `--ds-border-width-bold` (2px), `--ds-border-width-thick` (3px).
2. THE Token_Layer SHALL expor tokens de estilo de borda: `--ds-border-style-solid`, `--ds-border-style-dashed`, `--ds-border-style-dotted`, com os valores CSS correspondentes (`solid`, `dashed`, `dotted`).
3. FOR ALL componentes que utilizam `border-width` com valores literais, THE Design_System SHALL referenciar os tokens `--ds-border-width-*` correspondentes.
4. WHEN o tema dark está ativo, THE Theme_Layer SHALL ajustar os tokens `--ds-color-border-*` existentes (Requisito 1) em conjunto com os novos tokens de espessura para garantir bordas visíveis sem alterar os valores de width.

---

### Requisito 28 — Documentação Visual das Foundations no Playground

**User Story:** Como desenvolvedor ou designer que consome o design system, quero que a aba Foundations do playground exiba previews visuais de cada foundation, para que eu possa inspecionar e validar os tokens sem precisar ler código.

#### Critérios de Aceitação

1. THE Design_System SHALL expor uma seção "Color Tokens" na aba Foundations do playground, exibindo swatches visuais de todos os tokens de cor primitivos e semânticos agrupados por categoria.
2. THE Design_System SHALL expor uma seção "Gradients" na aba Foundations, exibindo um swatch retangular para cada token de gradiente com o nome do token sobreposto.
3. THE Design_System SHALL expor uma seção "Typography Scale" na aba Foundations, exibindo um exemplo de texto "The quick brown fox" renderizado em cada tamanho e peso da escala tipográfica.
4. THE Design_System SHALL expor uma seção "Spacing Scale" na aba Foundations, exibindo uma régua visual com blocos de cor preenchidos no tamanho de cada valor da escala de espaçamento, com label do token e valor em px ao lado.
5. THE Design_System SHALL expor uma seção "Border Radius" na aba Foundations, exibindo um card ou bloco quadrado renderizado com cada valor de raio da escala primitiva.
6. THE Design_System SHALL expor uma seção "Shadow Scale" na aba Foundations, exibindo um card branco sobre fundo neutro com cada sombra da escala aplicada, identificado pelo nome do token.
7. THE Design_System SHALL expor uma seção "Motion" na aba Foundations, exibindo uma demo interativa com um elemento que se move utilizando cada combinação de duração e easing disponível nos tokens.
8. THE Design_System SHALL expor uma seção "Z-Index" na aba Foundations, exibindo um diagrama de camadas empilhadas que ilustra a hierarquia dos tokens `--ds-z-*`.
9. THE Design_System SHALL expor uma seção "Border Widths" na aba Foundations, exibindo uma linha renderizada com cada espessura da escala `--ds-border-width-*` e label correspondente.
10. WHEN o tema dark é ativado no playground, THE Design_System SHALL atualizar todas as seções de Foundations para refletir os valores dos tokens no tema escuro em tempo real.
