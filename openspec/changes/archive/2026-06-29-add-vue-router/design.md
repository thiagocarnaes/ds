## Context

O playground do design system (`packages/design-system/playground/`) usa um sistema de navegação baseado em estado local (`activePage` ref em `App.vue`) para alternar entre as páginas Home, Foundations, Components Catalog e Docs. Não há `vue-router` instalado. A URL nunca muda, impossibilitando links diretos, histórico do navegador e uso dos botões "voltar"/"avançar".

O pacote `@tcarnaes/design-system` já exporta um componente `Link` que aceita prop `to` e renderiza `<router-link>` quando detecta `vue-router` no contexto, então a base para integração futura existe.

## Goals / Non-Goals

**Goals:**
- Adicionar `vue-router` como dependência de desenvolvimento do playground
- Criar 4 rotas principais: Home (`/`), Foundations (`/foundations`), Catalog (`/catalog`), Docs (`/docs`)
- Substituir `activePage`/`activeCat`/`setCategory` por navegação baseada em router
- Header nav e `PlaygroundCategoryNav` passam a usar `<router-link>`
- `ComponentsCatalogPage` mantém seleção de componente via hash (`/catalog#ComponentName`), agora refletida na URL
- Navegação funcionando com botões "voltar"/"avançar" do navegador
- Testes do playground atualizados para usar `RouterView` stub

**Non-Goals:**
- Adicionar `vue-router` como dependência de produção do pacote `@tcarnaes/design-system`
- Modificar API do `Link` ou qualquer componente de navegação da biblioteca
- Lazy-loading ou code-splitting de rotas
- Navegação aninhada ou guardas de rota
- SSR ou pre-rendering

## Decisions

### 1. `vue-router` como devDependency do playground, não do pacote

`vue-router` é adicionado apenas ao `devDependencies` do `@tcarnaes/design-system` (ou diretamente no `playground/`). O pacote não expõe roteamento como dependência de consumo — componentes como `Link` já detectam router via `$router` opcional.

**Alternativa considerada:** adicionar como peerDependency do pacote. **Rejeitada:** o pacote não requer router para funcionar; a detecção já é opcional.

### 2. Rotas planas, sem aninhamento

Todas as 4 páginas são rotas irmãs sob `<router-view>` no `App.vue`. A página Home (`/`) é a rota padrão (`redirect` ou `path: '/'`). Não há layout compartilhado via nested routes porque cada página já é autossuficiente.

**Alternativa considerada:** nested routes com layout wrapper. **Rejeitada:** complexidade desnecessária para apenas 4 rotas.

### 3. Hash para seleção de componente no Catalog

`/catalog#ComponentName` usa `$route.hash` para ler e definir o componente ativo, substituindo o `window.location.hash` gerenciado manualmente. O `onMounted` observa `$route.hash` para sincronizar.

**Alternativa considerada:** query param (`?component=ComponentName`). **Rejeitada:** hash é semanticamente correto para âncoras na mesma página; mantém compatibilidade com o comportamento atual.

### 4. `createWebHistory` para URLs limpas

Usar `createWebHistory()` em vez de `createWebHashHistory()` para URLs sem `#/`. O Vite dev server já suporta history fallback nativamente com `appType: 'spa'` (configuração padrão).

**Alternativa considerada:** `createWebHashHistory`. **Rejeitada:** URLs com `#` são menos elegantes; o deploy atual para GH Pages pode precisar de configuração adicional (já existente no workflow).

### 5. Manter `PlaygroundCategoryNav` funcional

O componente `PlaygroundCategoryNav` (mobile) atualmente emite eventos `select` capturados no `App.vue`. Será atualizado para receber uma função de navegação via prop ou usar `useRouter()` internamente.

## Route Map

| Path | Name | Component | Current State |
|------|------|-----------|---------------|
| `/` | `home` | App.vue renderiza hero + bento grid | `activePage === 'home'` |
| `/foundations` | `foundations` | `FoundationsPage` | `activePage === 'foundations'` |
| `/catalog` | `catalog` | `ComponentsCatalogPage` | `activePage === 'catalog'` |
| `/docs` | `docs` | `DocumentationPage` | `activePage === 'docs'` |

## Risks / Trade-offs

- **[Risk]** Navegação state-based existente usa `setCategory()` que altera `activePage` e `activeCat`. A migração exige substituir todos os pontos de chamada — risco de algum fluxo não ser mapeado. → **Mitigação:** grep completo de `activePage`, `activeCat`, `setCategory`, `handleNavigate`; garantir que todos sejam substituídos por `router.push` ou `<router-link>`.
- **[Trade-off]** Remover `activeCat` do estado global significa que o filtro de categorias na Home (`all`, `foundations`, `catalog`, `docs`) será movido para a navegação pura por rota — a Home só exibe o grid completo quando está em `/`.
- **[Risk]** Testes existentes que dependem de `activePage` quebram após a migração. → **Mitigação:** usar `RouterView` stub ou montar com router real nos testes; priorizar ajuste dos testes afetados.
