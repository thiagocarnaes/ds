# Requirements Document

## Introduction

Este spec cobre um conjunto de melhorias e correções de UI no playground do design system Vue 3. As mudanças abrangem: exposição da prop `isDismissible` no demo `FlagGroup`, adição de uma tab de Iconografia em Foundations, inclusão do showcase "AI Chat" no catálogo de componentes, correção do ícone em `FormFieldDemo`, remoção de referências residuais a "Appearance" em favor de "Variant", correção do seletor de idioma, atualização do ícone do GitHub no header, e limpeza de badges/botões obsoletos no header e hero.

## Glossary

- **Playground**: Aplicação Vue 3 localizada em `packages/design-system/playground/` que demonstra interativamente os componentes do design system.
- **FlagGroup**: Componente Vue (`src/components/feedback/FlagGroup.vue`) que gerencia uma fila de notificações `Flag`, exibindo até 3 simultaneamente no canto superior direito.
- **FlagGroupDemo**: Componente de demo interativo (`playground/demos/FlagGroupDemo.vue`) exibido no drawer de playground para o componente `FlagGroup`.
- **Flag**: Componente Vue de notificação individual que aceita a prop `isDismissible` para exibir um botão de fechar.
- **isDismissible**: Prop booleana do componente `Flag` que, quando verdadeira, exibe um botão de fechar (×) na notificação.
- **FoundationsPage**: View Vue (`playground/views/FoundationsPage.vue`) que exibe tokens de design em abas (Colors, Gradients, Typography, etc.).
- **IconsCard**: Componente de card (`playground/cards/IconsCard.vue`) que exibe o showcase de ícones Lucide com busca e controles de tamanho/cor.
- **ComponentsCatalogPage**: View Vue (`playground/views/ComponentsCatalogPage.vue`) que exibe o catálogo completo de componentes com API, usage e playground.
- **ChatPreviewCard**: Componente de card (`playground/cards/ChatPreviewCard.vue`) que exibe o showcase de "AI Chat".
- **FormFieldDemo**: Demo do componente `FormField` (`playground/demos/FormFieldDemo.vue`) que permite toggle "With Icon / Plain".
- **PlaygroundLocaleSelect**: Componente Vue (`playground/components/PlaygroundLocaleSelect.vue`) que permite trocar o idioma do playground via dropdown `Select`.
- **usePlaygroundLocale**: Composable (`playground/composables/usePlaygroundLocale.ts`) que gerencia o locale ativo via provide/inject e `localStorage`.
- **App_Vue**: Arquivo raiz da aplicação playground (`playground/App.vue`) que contém o header, a navegação e o layout principal.
- **PlaygroundHero**: Componente Vue (`playground/components/PlaygroundHero.vue`) que exibe o banner principal com logo, headline, subtítulo e botões CTA.
- **Variant**: Nome canônico da prop de variação visual dos componentes (substituiu "Appearance" após a migração `appearance-to-variant-migration`).
- **Appearance**: Nome legado da prop de variação visual — deve ser removido de textos e descrições visíveis ao usuário no playground.
- **i18n**: Sistema de internacionalização próprio do playground com arquivos `en.ts` e `pt-BR.ts` e composable `usePlaygroundLocale`.

## Requirements

---

### Requirement 1: FlagGroupDemo — suporte interativo a `isDismissible`

**User Story:** Como desenvolvedor consultando o playground, quero ver e interagir com a prop `isDismissible` no demo do `FlagGroup`, para que eu compreenda como habilitar o fechamento manual de notificações dentro do grupo.

#### Acceptance Criteria

1. WHEN o demo `FlagGroupDemo` é renderizado, THE FlagGroupDemo SHALL exibir um controle de toggle que alterna o valor da prop `isDismissible` para todos os `Flag` filhos.
2. WHEN `isDismissible` está ativado no FlagGroupDemo, THE FlagGroupDemo SHALL passar `isDismissible` como `true` para cada componente `Flag` renderizado dentro do `FlagGroup`.
3. WHEN `isDismissible` está ativado e o usuário clica no botão de fechar (×) de um `Flag`, THE FlagGroupDemo SHALL remover aquele `Flag` da fila visível e avançar o próximo Flag da fila (se houver).
4. WHEN `isDismissible` está desativado, THE FlagGroupDemo SHALL renderizar os `Flag` sem o botão de fechar (×).
5. THE FlagGroupDemo SHALL atualizar o snippet de código exibido no `UsageBlock` para refletir o estado atual do controle `isDismissible`.
6. WHEN o `FlagGroupDemo` é exibido, THE FlagGroupDemo SHALL incluir pelo menos dois `Flag` de variantes distintas (ex.: `success` e `warning`) para demonstrar o comportamento de fila.

---

### Requirement 2: FoundationsPage — tab de Iconografia

**User Story:** Como desenvolvedor consultando as Foundations, quero ter acesso ao showcase de ícones Lucide diretamente na FoundationsPage, para que eu possa explorar a iconografia junto dos demais tokens de design.

#### Acceptance Criteria

1. WHEN a FoundationsPage é renderizada, THE FoundationsPage SHALL incluir uma tab chamada "Iconography" na barra de navegação de abas.
2. WHEN a tab "Iconography" é selecionada, THE FoundationsPage SHALL exibir o conteúdo do showcase de ícones (equivalente ao `IconsCard`) com campo de busca, controles de tamanho e cor.
3. WHEN a tab "Iconography" está ativa, THE FoundationsPage SHALL exibir todos os ícones disponíveis em `iconography` do design system com seus nomes.
4. THE FoundationsPage SHALL posicionar a tab "Iconography" após as tabs existentes na ordem da barra de navegação.
5. WHEN o usuário clica em um ícone no showcase de Iconography, THE FoundationsPage SHALL copiar o snippet de uso do ícone (ex.: `<IconName />`) para a área de transferência.

---

### Requirement 3: ComponentsCatalogPage — showcase "AI Chat"

**User Story:** Como desenvolvedor navegando pelo catálogo de componentes, quero encontrar o showcase "AI Chat" listado no `ComponentsCatalogPage`, para que eu possa acessar sua demonstração a partir do catálogo.

#### Acceptance Criteria

1. WHEN o `ComponentsCatalogPage` é renderizado, THE ComponentsCatalogPage SHALL exibir uma seção "Showcases" separada dos grupos de componentes regulares da biblioteca.
2. WHEN a seção "Showcases" é exibida, THE ComponentsCatalogPage SHALL listar o item "AI Chat" nessa seção.
3. WHEN o item "AI Chat" é selecionado no catálogo, THE ComponentsCatalogPage SHALL exibir a descrição do showcase no painel de detalhes.
4. WHEN o item "AI Chat" é selecionado, THE ComponentsCatalogPage SHALL exibir o componente `ChatPreviewCard` como prévia do showcase no painel de detalhes.
5. THE ComponentsCatalogPage SHALL indicar visualmente que "AI Chat" é um showcase (não um componente exportado da biblioteca), de forma consistente com a descrição já presente no `drawer.descriptions`.

---

### Requirement 4: FormFieldDemo — correção do ícone à esquerda do Input

**User Story:** Como desenvolvedor usando o playground do `FormField`, quero que o ícone `<Mail>` apareça corretamente à esquerda do campo de entrada quando o modo "With Icon" está ativo, para que eu possa visualizar e copiar o padrão correto de uso com ícone.

#### Acceptance Criteria

1. WHEN o toggle "With Icon" está ativo no FormFieldDemo, THE FormFieldDemo SHALL renderizar o ícone `Mail` visível à esquerda dentro do campo `Input`.
2. WHEN o ícone Mail está visível, THE FormFieldDemo SHALL aplicar `padding-left` suficiente ao `Input` (ex.: classe `pl-9`) para que o texto digitado não sobreponha o ícone.
3. WHEN o toggle "Plain" está ativo, THE FormFieldDemo SHALL renderizar o campo `Input` sem ícone à esquerda e sem `padding-left` adicional.
4. WHEN o ícone Mail está visível, THE FormFieldDemo SHALL posicionar o ícone de forma absolutamente posicionada dentro de um container `relative`, centrado verticalmente.
5. IF o ícone Mail não é renderizado visível com `withIcon = true`, THEN THE FormFieldDemo SHALL ser corrigido para que o ícone apareça sobre o input sem ser ocultado por z-index ou overflow do container pai.

---

### Requirement 5: Remoção de referências residuais a "Appearance" por "Variant"

**User Story:** Como desenvolvedor lendo as descrições e textos do playground, quero ver apenas a terminologia canônica "Variant" nos textos visíveis ao usuário, para que a documentação seja consistente com a migração já realizada nos componentes.

#### Acceptance Criteria

1. THE Playground SHALL não exibir ao usuário nenhuma descrição de componente, texto de interface ou label de controle que use "Appearance" como nome de prop canônica (textos como "Bold appearance" no controle do `LozengeDemo` são funcionais e podem permanecer, pois descrevem o modo visual, não o nome da prop).
2. WHEN o arquivo `playground/i18n/en.ts` é inspecionado, THE en_i18n SHALL não conter nenhuma chave de tradução cujo valor de string visível ao usuário descreva `appearance` como nome de prop atual de `Button`, `Flag` ou `SectionMessage`.
3. WHEN o arquivo `playground/i18n/pt-BR.ts` é inspecionado, THE ptBR_i18n SHALL não conter nenhuma chave de tradução cujo valor de string visível ao usuário descreva `appearance` como nome de prop atual de `Button`, `Flag` ou `SectionMessage`.
4. WHEN o arquivo `playground/i18n/componentCatalogDescriptions.ts` é inspecionado, THE ComponentCatalogDescriptions SHALL não conter nenhuma descrição de `Button`, `Flag` ou `SectionMessage` que referencie `appearance` como nome de prop canônica.
5. THE Playground SHALL preservar sem alteração os type aliases `LozengeAppearance`, `TooltipAppearance` e `PopoverAppearance` exportados pelos componentes, pois são nomes de tipo TypeScript e não textos visíveis ao usuário.

---

### Requirement 6: PlaygroundLocaleSelect — correção da troca de idioma

**User Story:** Como usuário do playground, quero que o seletor de idioma no header troque efetivamente o idioma da interface, para que eu possa navegar o playground em inglês ou português do Brasil.

#### Acceptance Criteria

1. WHEN o usuário seleciona "Português (Brasil)" no `PlaygroundLocaleSelect`, THE Playground SHALL atualizar todos os textos da interface para o locale `pt-BR` sem recarregar a página.
2. WHEN o usuário seleciona "English" no `PlaygroundLocaleSelect`, THE Playground SHALL atualizar todos os textos da interface para o locale `en` sem recarregar a página.
3. WHEN o locale é alterado, THE usePlaygroundLocale SHALL persistir o valor selecionado em `localStorage` com a chave `ds-playground-locale`.
4. WHEN o playground é recarregado, THE Playground SHALL inicializar o locale com o valor salvo em `localStorage`, ou `en` caso nenhum valor esteja salvo.
5. WHEN `PlaygroundLocaleSelect` altera o valor via `v-model`, THE PlaygroundLocaleSelect SHALL chamar `setLocale` do composable `usePlaygroundLocale` com o novo valor de locale.
6. IF o composable `usePlaygroundLocale` não está provido na árvore de componentes acima do `PlaygroundLocaleSelect`, THEN THE PlaygroundLocaleSelect SHALL lançar um erro descritivo de "must be used within providePlaygroundLocale".

---

### Requirement 7: Header — substituir ícone `ArrowUpRight` pelo ícone `Github`

**User Story:** Como usuário do playground, quero que o link para o repositório GitHub no header use o ícone reconhecível do GitHub, para que o destino do link seja visualmente identificável.

#### Acceptance Criteria

1. WHEN o header do App_Vue é renderizado, THE App_Vue SHALL exibir o ícone `Github` de `lucide-vue-next` (com `:size="16"`) no link para o repositório GitHub.
2. THE App_Vue SHALL não importar nem utilizar o ícone `ArrowUpRight` para o link do GitHub.
3. WHEN o ícone `Github` é renderizado no link, THE App_Vue SHALL manter os atributos `href`, `target="_blank"` e `rel="noopener noreferrer"` do elemento âncora inalterados.

---

### Requirement 8: Header — remover badge "stable"

**User Story:** Como usuário do playground, quero que o header não exiba o badge "stable", para que a interface fique mais limpa e sem informações redundantes.

#### Acceptance Criteria

1. WHEN o header do App_Vue é renderizado, THE App_Vue SHALL não exibir nenhum elemento com o texto retornado por `t('app.stable')`.
2. THE App_Vue SHALL remover completamente o elemento `<span>` que renderiza `{{ t('app.stable') }}` do bloco `pg-header-actions`.

---

### Requirement 9: Header e Hero — remover elementos de versão

**User Story:** Como usuário do playground, quero que a versão do design system não apareça no header nem no subtítulo do hero, para que a interface seja mais limpa.

#### Acceptance Criteria

1. WHEN o header do App_Vue é renderizado, THE App_Vue SHALL não exibir o segundo `<span>` dentro de `pg-header-brand` que renderiza `{{ t('app.versionBadge', { version: designSystemVersionBadge }) }}`.
2. THE App_Vue SHALL preservar o primeiro `<span>` com o título `{{ t('app.title') }}` em `pg-header-brand`.
3. WHEN o `PlaygroundHero` é renderizado, THE PlaygroundHero SHALL não exibir o `<span>` com `{{ t('hero.versionLine', { version: designSystemVersionBadge }) }}` acima do logo.
4. THE PlaygroundHero SHALL preservar o componente `GlowDot` e o elemento `<div class="mb-6 flex items-center gap-2">` sem o span de versão, ou remover o `<div>` completo se o único conteúdo for o span de versão.

---

### Requirement 10: Hero — remover bloco de botões CTA

**User Story:** Como usuário do playground, quero que os botões "Browse Components", "Install & Docs" e "Playground" não apareçam abaixo do subtítulo do hero, para que o hero seja mais direto e sem chamadas de ação redundantes.

#### Acceptance Criteria

1. WHEN o `PlaygroundHero` é renderizado, THE PlaygroundHero SHALL não exibir o bloco `<div class="mt-6 flex flex-wrap items-center gap-3">` que contém os três botões CTA.
2. THE PlaygroundHero SHALL preservar o logo, o `<h1>` com título e o `<p>` de subtítulo inalterados.
3. THE PlaygroundHero SHALL preservar a barra de estatísticas (`StatPill` e versão) que aparece abaixo do bloco de conteúdo.
4. THE App_Vue SHALL remover (ou manter inertes) os handlers dos eventos `@browse`, `@docs` e `@playground` emitidos pelo `PlaygroundHero`, pois os botões que os emitem serão removidos.
