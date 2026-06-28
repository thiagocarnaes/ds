# Requirements Document

## Introduction

Este documento descreve os requisitos para a revitalização da página inicial do design system playground. O objetivo é transformar a home page atual — que exibe um hero simples com pillar cards e componentes renderizados — em uma **página editorial de boas-vindas** no estilo do Atlassian Design System: texto, propósito, links para as grandes áreas, sem renderizar componentes em cards.

Os cards de playground de componentes permanecem na seção "Library" (catálogo), onde cada componente já possui seu próprio playground interativo. A home é um ponto de entrada editorial que comunica o valor e a estrutura do design system.

A solução deve ser totalmente compatível com o sistema de i18n existente (`en.ts` / `pt-BR.ts` via `usePlaygroundLocale`) e respeitar os estilos, tokens de design e componentes da biblioteca já em uso.

## Glossary

- **Homepage**: A view exibida quando `activePage === 'home'` no `App.vue`. Corresponde à categoria `'all'` ou à navegação inicial.
- **Editorial_Home**: Nova visão da home como página de boas-vindas — sem cards de componentes renderizados, focada em texto, propósito e navegação para grandes áreas.
- **Hero_Section**: Área superior com título, missão do design system e CTAs primários.
- **Purpose_Section**: Seção descrevendo a missão e os valores que guiam o design system (substitui pillar cards).
- **Quick_Nav_Section**: Grade de links editoriais para as grandes áreas: Foundations, Components, Docs.
- **Principles_Section**: Seção com os princípios de design (acessibilidade, consistência, etc.).
- **Quick_Start_Section**: Snippet de instalação e link para documentação completa.
- **Stats_Bar**: Barra discreta de estatísticas (contagem de componentes, cobertura, versão).
- **Changelog_Section**: Novidades recentes estilo release notes.
- **i18n**: Sistema de internacionalização via `usePlaygroundLocale` com suporte a `en` e `pt-BR`.
- **StatPill**: Componente existente que exibe um número animado com label e cor.
- **GlowDot**: Componente existente que exibe um ponto luminoso pulsante.
- **designSystemMeta**: Módulo TypeScript que expõe versão, contagem de componentes e lista de demos.
- **fullLanding**: Prop booleana em `PlaygroundHero.vue` que controla visibilidade em mobile.
- **Design_Token**: Variável CSS (ex.: `--pg-text`, `--pg-accent`) do sistema de temas do playground.

## Requirements

### Requirement 1: Hero Section Editorial

**User Story:** Como designer ou desenvolvedor que acessa o playground pela primeira vez, quero ver uma hero section clara e editorial que comunique o propósito do design system, para que eu entenda imediatamente o que é e para quem é esta ferramenta.

#### Acceptance Criteria

1. THE `Homepage` SHALL exibir uma `Hero_Section` com título principal, subtítulo descrevendo a missão do design system, e no mínimo 2 CTAs primários.
2. THE `Hero_Section` SHALL incluir CTA "Explore Components" que navega para a seção Library/Components.
3. THE `Hero_Section` SHALL incluir CTA "Get Started" que navega para a seção Docs.
4. THE `Hero_Section` SHALL exibir o badge de versão atual do design system usando `designSystemVersionBadge`.
5. THE `Hero_Section` SHALL exibir o logo do design system.
6. THE `Hero_Section` SHALL renderizar todos os textos usando chaves `i18n` com traduções para `en` e `pt-BR`.
7. THE `Hero_Section` SHALL ser exibida em viewports a partir de 320px sem overflow horizontal.
8. THE `Hero_Section` SHALL NOT renderizar nenhum componente da biblioteca em cards interativos — apenas texto, ícones decorativos e CTAs.

---

### Requirement 2: Navegação para as Grandes Áreas (Quick Nav)

**User Story:** Como usuário do playground, quero ter cards editoriais de navegação para as grandes áreas do design system logo abaixo do hero, para que eu possa ir diretamente para Foundations, Components ou Docs sem usar a barra de navegação.

#### Acceptance Criteria

1. THE `Homepage` SHALL exibir uma `Quick_Nav_Section` com exatamente 3 cards editoriais: "Foundations", "Components" e "Docs".
2. THE `Quick_Nav_Section` SHALL exibir em cada card: um ícone Lucide, um título, uma descrição de até 100 caracteres e um dado quantitativo (ex.: número de tokens, número de componentes).
3. WHEN o usuário clica no card "Foundations", THE `Homepage` SHALL navegar para a seção Foundations (`'foundations'`).
4. WHEN o usuário clica no card "Components", THE `Homepage` SHALL navegar para a seção Library/Catalog (`'catalog'`).
5. WHEN o usuário clica no card "Docs", THE `Homepage` SHALL navegar para a seção Docs (`'docs'`).
6. THE `Quick_Nav_Section` SHALL usar layout responsivo: 1 coluna em viewport < 768px e 3 colunas em viewport ≥ 1024px.
7. WHEN o usuário passa o cursor sobre um card, THE `Quick_Nav_Section` SHALL aplicar estado de hover visível usando Design_Tokens existentes (mudança de `background`, `border` ou `opacity`).
8. THE `Quick_Nav_Section` SHALL renderizar todos os textos usando chaves `i18n` com traduções para `en` e `pt-BR`.
9. THE `Quick_Nav_Section` SHALL NOT renderizar nenhum componente da biblioteca — apenas conteúdo editorial estático.

---

### Requirement 3: Seção de Propósito / Missão

**User Story:** Como membro de equipe novo, quero ler sobre o propósito e a missão do design system na home page, para que eu entenda por que ele existe e como ele me ajuda.

#### Acceptance Criteria

1. THE `Homepage` SHALL exibir uma `Purpose_Section` com um parágrafo de missão e no mínimo 3 benefícios-chave do design system.
2. THE `Purpose_Section` SHALL apresentar cada benefício com um ícone Lucide, título curto (até 40 caracteres) e descrição (até 120 caracteres).
3. THE `Purpose_Section` SHALL renderizar todos os textos usando chaves `i18n` com traduções para `en` e `pt-BR`.
4. THE `Purpose_Section` SHALL usar layout responsivo: 1 coluna em viewport < 768px, 3 colunas em viewport ≥ 1024px.
5. THE `Purpose_Section` SHALL NOT renderizar nenhum componente da biblioteca.
6. WHILE `fullLanding` for `false`, THE `Homepage` SHALL ocultar a `Purpose_Section`.

---

### Requirement 4: Princípios do Design System

**User Story:** Como designer ou engenheiro, quero ver os princípios que guiam o design system na home page, para que eu possa alinhar meu trabalho com a visão da biblioteca.

#### Acceptance Criteria

1. THE `Homepage` SHALL exibir uma `Principles_Section` com exatamente 4 princípios, cada um com ícone Lucide, título e descrição de até 120 caracteres.
2. THE `Principles_Section` SHALL apresentar os princípios: "Accessibility First", "Visual Consistency", "Developer Productivity" e "Flexible Composition".
3. IF a estrutura de dados de princípios tiver menos de 4 entradas, THEN THE `Homepage` SHALL omitir completamente a `Principles_Section`.
4. THE `Principles_Section` SHALL usar layout responsivo: 1 coluna em viewport < 768px, 2 colunas em viewport < 1024px e 4 colunas em viewport ≥ 1024px.
5. THE `Principles_Section` SHALL renderizar todos os textos usando chaves `i18n` com traduções para `en` e `pt-BR`.
6. WHILE `fullLanding` for `false`, THE `Homepage` SHALL ocultar a `Principles_Section`.

---

### Requirement 5: Quick Start / Instalação

**User Story:** Como desenvolvedor novo, quero ver o comando de instalação e um snippet básico de uso diretamente na home page, para que eu possa começar sem ir para a documentação completa.

#### Acceptance Criteria

1. THE `Homepage` SHALL exibir uma `Quick_Start_Section` com o comando npm de instalação do pacote `@tcarnaes/design-system`.
2. THE `Quick_Start_Section` SHALL exibir um snippet de importação básica (ex.: `import { Button } from '@tcarnaes/design-system'`).
3. WHEN o usuário clica no botão de copiar e `navigator.clipboard` está disponível, THE `Homepage` SHALL copiar o comando para a área de transferência.
4. WHEN a cópia é bem-sucedida, THE `Homepage` SHALL exibir feedback visual por entre 1500ms e 2000ms.
5. IF `navigator.clipboard` não está disponível, THEN THE `Homepage` SHALL ocultar o botão de copiar sem erro.
6. THE `Quick_Start_Section` SHALL exibir um link "View full docs" que navega para a seção Docs.
7. THE `Quick_Start_Section` SHALL renderizar todos os textos usando chaves `i18n` com traduções para `en` e `pt-BR`.
8. THE `Quick_Start_Section` SHALL ser visível em todos os viewports (≥ 320px).

---

### Requirement 6: Barra de Estatísticas

**User Story:** Como avaliador técnico, quero ver estatísticas rápidas do design system na home page, para que eu tenha uma visão quantitativa da maturidade da biblioteca.

#### Acceptance Criteria

1. THE `Homepage` SHALL exibir uma `Stats_Bar` com exatamente 4 métricas: contagem de componentes (`designSystemLibraryComponentCount`), cobertura de testes (94%), contagem de demos interativos (`playgroundDemoComponentCount`) e versão atual.
2. THE `Stats_Bar` SHALL usar o componente `StatPill` existente para as métricas numéricas.
3. THE `Stats_Bar` SHALL exibir a versão como string estática (sem animação numérica).
4. WHEN o componente monta, THE `Stats_Bar` SHALL animar as métricas numéricas de 0 até o valor final em 600ms–2000ms, conforme comportamento do `StatPill`.
5. THE `Stats_Bar` SHALL renderizar labels usando chaves `i18n` com traduções para `en` e `pt-BR`.
6. WHILE `fullLanding` for `true`, THE `Stats_Bar` SHALL ser visível em todos os viewports.
7. WHILE `fullLanding` for `false`, THE `Stats_Bar` SHALL ser oculta em viewports < 1024px.

---

### Requirement 7: Changelog / Novidades Recentes

**User Story:** Como usuário recorrente, quero ver as novidades recentes do design system na home page, para que eu me mantenha atualizado sem consultar o repositório.

#### Acceptance Criteria

1. THE `Homepage` SHALL exibir uma `Changelog_Section` com entre 2 e 4 entradas, cada uma com versão, data e entre 1 e 3 mudanças classificadas.
2. THE `Changelog_Section` SHALL classificar cada mudança como "Added", "Changed" ou "Fixed", com cor visualmente distinta por tipo.
3. THE `Changelog_Section` SHALL ler dados de um arquivo estático `changelogData.ts` sem requisição de rede.
4. THE `Changelog_Section` SHALL renderizar título e rótulos de tipo usando chaves `i18n` com traduções para `en` e `pt-BR`.
5. WHILE `fullLanding` for `false`, THE `Homepage` SHALL ocultar a `Changelog_Section`.
6. THE `Changelog_Section` SHALL ser visível apenas em viewports ≥ 1024px.

---

### Requirement 8: Remoção dos Bento Cards da Home

**User Story:** Como usuário do playground, quero que a home seja uma página editorial limpa sem os cards de componentes renderizados, para que a navegação seja clara e o propósito da home seja evidente.

#### Acceptance Criteria

1. THE `Homepage` SHALL NOT exibir o bento grid de cards de componentes (ButtonCard, ColorCard, etc.) quando `activePage === 'home'`.
2. THE `App.vue` SHALL continuar exibindo o bento grid somente quando uma categoria específica estiver ativa (forms, labels, feedback, layout, foundations) e `activePage === 'home'`.
3. WHEN `activePage === 'home'` e `activeCat === 'all'`, THE `Homepage` SHALL exibir exclusivamente a `Editorial_Home` sem nenhum card de componente.
4. THE `PlaygroundHero` component SHALL ser substituído ou expandido para suportar o novo layout editorial sem quebrar o comportamento existente de outras páginas.
5. THE `App.vue` SHALL atualizar os handlers dos eventos `@browse`, `@docs` e `@playground` do `PlaygroundHero` para incluir o novo evento `@navigate` emitido pela `Quick_Nav_Section`.

---

### Requirement 9: i18n Completo

**User Story:** Como usuário que usa o playground em português, quero que todas as seções da nova home page estejam traduzidas, para que eu tenha a mesma qualidade de experiência em qualquer idioma.

#### Acceptance Criteria

1. THE `Homepage` SHALL renderizar 100% dos textos visíveis usando chaves `i18n` definidas em `en.ts` e `pt-BR.ts`.
2. WHEN o usuário alterna o locale, THE `Homepage` SHALL atualizar todos os textos reativamente sem recarregar a página.
3. THE novas chaves `i18n` SHALL ser adicionadas mantendo compatibilidade com o tipo `PlaygroundMessages` em `types.ts`.
4. IF uma chave `i18n` estiver ausente, THEN THE `Homepage` SHALL exibir a chave bruta como fallback sem lançar erro de runtime.

---

### Requirement 10: Responsividade e Acessibilidade

**User Story:** Como usuário em qualquer dispositivo ou com necessidades de acessibilidade, quero que a home editorial seja totalmente responsiva e acessível.

#### Acceptance Criteria

1. THE `Hero_Section`, `Quick_Start_Section` e `Stats_Bar` SHALL ser visíveis em viewports ≥ 320px sem overflow horizontal.
2. THE `Purpose_Section`, `Principles_Section` e `Changelog_Section` SHALL ser visíveis apenas quando `fullLanding` for `true` ou viewport ≥ 768px.
3. THE `Homepage` SHALL atribuir `aria-label` descritivo a todos os elementos interativos (botões, cards de navegação, links).
4. THE `Homepage` SHALL garantir navegação por teclado (Tab, Enter, Space) com indicador de foco visível em todos os elementos interativos.
5. WHERE ícones forem decorativos, THE `Homepage` SHALL marcá-los com `aria-hidden="true"`.
6. WHERE ícones forem o único conteúdo de um botão, THE `Homepage` SHALL fornecer `aria-label` descritivo.
