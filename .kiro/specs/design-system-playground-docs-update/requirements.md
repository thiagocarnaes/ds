# Requirements Document

## Introduction

Após a migração `appearance` → `variant` nos componentes `Flag`, `FlagGroup` e `SectionMessage`, e a remoção da prop `appearance` do `Button`, as páginas de documentação do playground e o catálogo de componentes precisam ser atualizados para refletir essas mudanças.

Este spec cobre: adição de `Flag`, `FlagGroup` e `SectionMessage` ao catálogo de componentes do playground (entradas de API, snippets de uso, grupos de catálogo, demos interativas e descrições i18n), atualização da entrada de `Button` para remover referências à prop `appearance` obsoleta, e garantia de que todos os testes automatizados do playground continuem passando após as mudanças.

## Glossary

- **Playground**: A aplicação Vue localizada em `packages/design-system/playground/` que documenta os componentes do design system de forma interativa.
- **Catalog**: O conjunto de entradas de metadados dos componentes definido em `playground/data/catalog/`, incluindo props, slots, eventos, modelos e snippets de uso.
- **CatalogGroup**: Agrupamento de componentes por categoria (ex.: "Feedback") definido em `componentCatalog.ts`.
- **Demo**: Componente Vue interativo localizado em `playground/demos/` que permite ao usuário manipular props de um componente em tempo real.
- **Registry**: Arquivo `playground/demos/registry.ts` que mapeia nomes de componentes para seus respectivos componentes Demo.
- **PlaygroundAlias**: Mapeamento em `playgroundAliases.ts` que redireciona um nome de catálogo para um Demo existente.
- **Flag**: Componente de notificação toast com borda lateral colorida por variante (`normal | warning | error | success | discovery`).
- **FlagGroup**: Container que gerencia a fila de `Flag`s, exibindo no máximo 3 simultaneamente. Não expõe props públicas — o limite de 3 é uma constante interna (`MAX_VISIBLE = 3`).
- **SectionMessage**: Componente de mensagem inline com ícone e fundo colorido por variante (`information | warning | error | success | discovery | change`).
- **FlagAction**: Objeto com shape `{ label: string; onClick: () => void }` aceito no array `actions` do `Flag`.
- **FlagVariant**: Tipo `'normal' | 'warning' | 'error' | 'success' | 'discovery'` aceito pela prop `variant` do `Flag`.
- **SectionMessageVariant**: Tipo `'information' | 'warning' | 'error' | 'success' | 'discovery' | 'change'` aceito pela prop `variant` do `SectionMessage`.
- **UsageSnippet**: Código de exemplo pronto para copiar, exibido na aba "Usage" do catálogo para cada componente. Um snippet é considerado válido quando compila sem erros de sintaxe TypeScript/Vue.
- **playgroundPropCoverage**: Teste automatizado que verifica se todas as props documentadas no catálogo correspondem às props reais do componente.
- **playgroundDemos**: Teste automatizado que verifica se todos os componentes com demo registrada conseguem ser renderizados sem erros.

## Requirements

### Requirement 1: Adicionar Flag ao catálogo de componentes

**User Story:** Como desenvolvedor consumidor do design system, quero encontrar `Flag` no catálogo do playground com documentação completa de API, para que eu possa entender como usar o componente corretamente.

#### Acceptance Criteria

1. THE Catalog SHALL conter uma entrada para `Flag` com as seguintes props documentadas com nome, tipo e default corretos: `title` (string, sem default — prop required), `description` (string, opcional), `variant` (`'normal' | 'warning' | 'error' | 'success' | 'discovery'`, default `'normal'`), `actions` (`FlagAction[]` onde `FlagAction = { label: string; onClick: () => void }`, opcional), `isDismissible` (boolean, default `false`), `flagId` (string, opcional), `class` (string, opcional).
2. IF `isDismissible` é `true` e o usuário clica no botão de fechar, THEN THE Catalog SHALL documentar na entrada de `Flag` o evento `dismiss` (sem payload), disparado nessa condição.
3. THE Catalog SHALL conter na entrada de `Flag` um UsageSnippet que importe `Flag` de `'@atlantico/design-system'`, demonstre uso com `variant`, `title`, `description` e `isDismissible`, e compile sem erros de sintaxe TypeScript/Vue.
4. WHEN a entrada de `Flag` é consultada no Catalog, THE Catalog SHALL retornar os metadados de API sem lançar exceções em tempo de execução.

### Requirement 2: Adicionar FlagGroup ao catálogo de componentes

**User Story:** Como desenvolvedor consumidor do design system, quero encontrar `FlagGroup` no catálogo do playground com documentação completa de API, para que eu possa entender como compor múltiplas notificações gerenciadas por fila.

#### Acceptance Criteria

1. THE Catalog SHALL conter uma entrada para `FlagGroup` sem props documentadas — `FlagGroup` não expõe props públicas (`MAX_VISIBLE = 3` é uma constante interna, não uma prop Vue).
2. THE Catalog SHALL conter na entrada de `FlagGroup` o slot `default` descrito como container para componentes `Flag` filhos.
3. THE Catalog SHALL conter na entrada de `FlagGroup` um UsageSnippet que importe `Flag` e `FlagGroup` de `'@atlantico/design-system'`, demonstre `FlagGroup` com dois ou mais `Flag`s filhos, e compile sem erros de sintaxe TypeScript/Vue.
4. WHEN a entrada de `FlagGroup` é consultada no Catalog, THE Catalog SHALL retornar os metadados de API sem lançar exceções em tempo de execução.

### Requirement 3: Adicionar SectionMessage ao catálogo de componentes

**User Story:** Como desenvolvedor consumidor do design system, quero encontrar `SectionMessage` no catálogo do playground com documentação completa de API, para que eu possa entender como usar o componente de mensagem inline.

#### Acceptance Criteria

1. THE Catalog SHALL conter uma entrada para `SectionMessage` com as seguintes props documentadas: `variant` (`'information' | 'warning' | 'error' | 'success' | 'discovery' | 'change'`, default `'information'`), `title` (string, opcional), `class` (string, opcional).
2. THE Catalog SHALL conter na entrada de `SectionMessage` os slots `default` (conteúdo do corpo — opcional) e `actions` (botões de ação — opcional).
3. THE Catalog SHALL conter na entrada de `SectionMessage` um UsageSnippet que importe `SectionMessage` de `'@atlantico/design-system'`, demonstre uso com `variant`, `title` e conteúdo no slot padrão, e compile sem erros de sintaxe TypeScript/Vue.
4. WHEN a entrada de `SectionMessage` é consultada no Catalog, THE Catalog SHALL retornar os metadados de API sem lançar exceções em tempo de execução.
5. THE Catalog SHALL documentar na entrada de `SectionMessage` o comportamento de acessibilidade: `aria-live="assertive"` quando `variant === 'error'`, e `aria-live="polite"` para todos os demais valores de `SectionMessageVariant`.

### Requirement 4: Incluir Flag, FlagGroup e SectionMessage no grupo Feedback do catálogo

**User Story:** Como desenvolvedor usando o playground, quero ver `Flag`, `FlagGroup` e `SectionMessage` listados na categoria "Feedback" do catálogo, junto com `Alert`, `Badge`, `Toast` e outros componentes de feedback, para que eu possa descobrí-los de forma intuitiva.

#### Acceptance Criteria

1. THE CatalogGroup "Feedback" SHALL conter exatamente os seguintes itens no array `items`: `Alert`, `Badge`, `Flag`, `FlagGroup`, `Spinner`, `Progress`, `Skeleton`, `SectionMessage`, `Toast`, `ToastHost` — totalizando 10 itens sem remoção de nenhum dos existentes.
2. WHEN o playground é carregado e o usuário navega até a seção "Feedback", THE Catalog SHALL exibir os 10 itens listados no critério 1 na navegação lateral.
3. WHEN um usuário clica em `Flag`, `FlagGroup` ou `SectionMessage` na navegação "Feedback", THE Playground SHALL exibir o painel de detalhes do componente correspondente sem erros de navegação.

### Requirement 5: Criar demo interativa para Flag

**User Story:** Como desenvolvedor explorando o playground, quero uma demo interativa do `Flag` que me permita alternar entre variantes e opções, para que eu possa visualizar o comportamento do componente antes de usá-lo.

#### Acceptance Criteria

1. THE Demo `FlagDemo.vue` SHALL existir em `playground/demos/` e ser registrada no Registry com a chave `'Flag'`.
2. WHEN a demo de `Flag` é renderizada, THE Demo SHALL exibir um componente `Flag` com estado inicial `variant='normal'`, `isDismissible=false`, `title` e `description` com valores padrão não vazios, todos controlados interativamente pelos controles da demo — sendo permitido ao usuário limpar `title` e `description` através dos controles, podendo resultar em render com texto vazio.
3. THE Demo de `Flag` SHALL oferecer controles que permitam selecionar individualmente cada um dos 5 valores de `FlagVariant`: `'normal'`, `'warning'`, `'error'`, `'success'`, `'discovery'`.
4. THE Demo de `Flag` SHALL oferecer um controle do tipo `Switch` para alternar `isDismissible` entre `true` e `false`.
5. WHEN o usuário altera qualquer controle da demo de `Flag`, THE Demo SHALL atualizar o `UsageBlock` exibindo o snippet de código correspondente ao estado atual dos controles.
6. IF `isDismissible` é `true` e o usuário clica no botão de fechar do `Flag`, THEN THE Demo SHALL restaurar o `Flag` ao estado visível sem necessidade de recarregar a página.

### Requirement 6: Criar demo interativa para SectionMessage

**User Story:** Como desenvolvedor explorando o playground, quero uma demo interativa do `SectionMessage` que me permita alternar variantes e conteúdo, para que eu possa visualizar as variantes disponíveis antes de usar o componente.

#### Acceptance Criteria

1. THE Demo `SectionMessageDemo.vue` SHALL existir em `playground/demos/` e ser registrada no Registry com a chave `'SectionMessage'`.
2. WHEN a demo de `SectionMessage` é renderizada, THE Demo SHALL exibir um componente `SectionMessage` com estado inicial `variant='information'` e `title` com valor padrão não vazio, ambos controlados interativamente.
3. THE Demo de `SectionMessage` SHALL oferecer controles que permitam selecionar individualmente cada um dos 6 valores de `SectionMessageVariant`: `'information'`, `'warning'`, `'error'`, `'success'`, `'discovery'`, `'change'`.
4. WHEN o usuário altera qualquer controle da demo de `SectionMessage`, THE Demo SHALL atualizar o `UsageBlock` exibindo o snippet de código correspondente ao estado atual dos controles.

### Requirement 7: Registrar demo de FlagGroup via alias ou componente dedicado

**User Story:** Como desenvolvedor explorando o playground, quero acessar uma demo de `FlagGroup` que demonstre o comportamento de fila de notificações, para que eu possa entender como o componente gerencia múltiplas `Flag`s.

#### Acceptance Criteria

1. THE Registry SHALL associar o nome `'FlagGroup'` a um Demo que renderize pelo menos 2 componentes `Flag` dentro de um `FlagGroup` — seja via componente `FlagGroupDemo.vue` dedicado ou via alias para `FlagDemo` onde a demo já exercita `FlagGroup`.
2. WHEN um usuário acessa a entrada de `FlagGroup` no catálogo, THE Playground SHALL renderizar a demo associada sem lançar exceções JavaScript nem produzir avisos Vue durante mount/render.
3. WHEN a demo de `FlagGroup` é renderizada, THE Demo SHALL exibir pelo menos 2 `Flag`s visíveis no output DOM (considerando o comportamento de Teleport para `body`), provando que o comportamento de fila está operacional.

### Requirement 8: Adicionar descrições i18n para Flag, FlagGroup e SectionMessage

**User Story:** Como desenvolvedor usando o playground em inglês ou português, quero ver descrições contextuais dos componentes `Flag`, `FlagGroup` e `SectionMessage` na língua correta, para que eu entenda o propósito de cada componente de forma clara.

#### Acceptance Criteria

1. THE Catalog SHALL conter entradas em `componentCatalogDescriptionsEn` para as chaves `'Flag'`, `'FlagGroup'` e `'SectionMessage'`, cada uma com uma string não vazia que descreva o papel do componente em inglês.
2. THE Catalog SHALL conter entradas em `componentCatalogDescriptionsPtBR` para as mesmas 3 chaves (`'Flag'`, `'FlagGroup'`, `'SectionMessage'`), cada uma com uma string não vazia em português do Brasil que transmita o mesmo propósito descrito na entrada em inglês equivalente.
3. WHEN o locale do playground é `'pt-BR'`, THE Catalog SHALL retornar as strings de `componentCatalogDescriptionsPtBR` para `Flag`, `FlagGroup` e `SectionMessage`.
4. WHEN o locale do playground é `'en'`, THE Catalog SHALL retornar as strings de `componentCatalogDescriptionsEn` para `Flag`, `FlagGroup` e `SectionMessage`.

### Requirement 9: Atualizar entrada de Button para remover referência à prop `appearance` obsoleta

**User Story:** Como desenvolvedor usando o playground para aprender sobre o `Button`, quero que a documentação da prop `variant` não faça referência à prop `appearance` que foi removida, para que eu não tente usar uma API que não existe mais.

#### Acceptance Criteria

1. THE Catalog SHALL conter na prop `variant` do `Button` uma descrição que não contenha as strings `"appearance"`, `"alias"`, `"deprecated"` nem qualquer outra referência a props removidas, e que enumere os valores atualmente aceitos: `'default'`, `'primary'`, `'secondary'`, `'outline'`, `'ghost'`, `'destructive'`, `'link'`.
2. THE Catalog SHALL manter todas as demais informações da entrada de `Button` (tipo, default, outras props, slots e eventos) idênticas ao estado anterior à aplicação deste spec.
3. WHEN a entrada de `Button` é consultada no Catalog, THE Catalog SHALL retornar uma descrição da prop `variant` que liste exclusivamente os 7 valores aceitos na versão atual, sem mencionar `appearance` nem nenhuma prop removida.

### Requirement 10: Garantir que os testes automatizados do playground continuem passando

**User Story:** Como mantenedor do design system, quero que os testes `playgroundDemos.spec.ts` e `playgroundPropCoverage.spec.ts` passem após todas as mudanças, para que eu tenha confiança de que a documentação está consistente com a implementação real dos componentes.

#### Acceptance Criteria

1. WHEN os testes de `playgroundPropCoverage` são executados, THE Test_Suite SHALL passar para `Flag` (verificando as 7 props documentadas), para `SectionMessage` (verificando as 3 props documentadas), e para `FlagGroup` com zero props declaradas no catálogo — nenhuma prop `maxVisible` deve constar no catálogo, pois `MAX_VISIBLE` é constante interna não exposta.
2. WHEN os testes de `playgroundDemos` são executados, THE Test_Suite SHALL passar para `Flag`, `FlagGroup` e `SectionMessage`, verificando que as demos renderizam sem lançar exceções nem produzir falhas de asserção.
3. WHEN os testes de `playgroundPropCoverage` são executados para `Button`, THE Test_Suite SHALL passar sem nenhuma falha — incluindo a ausência da prop `appearance` que foi removida.
4. THE Test_Suite SHALL não regredir em nenhum componente existente — ou seja, todos os casos de teste que estavam passando antes da aplicação deste spec devem continuar passando após; caso algum teste existente precise ser atualizado para alinhar-se com os novos requisitos de prop coverage, a atualização deve preservar a intenção original do teste.
