## Why

O playground do design system usa estado local (`activePage`) para navegação entre páginas, sem refletir a página atual na URL. Isso impede compartilhamento de links diretos, quebra o histórico do navegador e dificulta a navegação com botões "voltar"/"avançar".

## What Changes

- Adicionar `vue-router` como dependência do playground
- Substituir o sistema de navegação baseado em estado (`activePage`/`activeCat`/`setCategory`) por rotas Vue Router
- Criar rotas nomeadas para: Home (`/`), Foundations (`/foundations`), Component Catalog (`/catalog`), Docs (`/docs`)
- Atualizar header nav, quick-nav cards e `PlaygroundCategoryNav` para usar `<router-link>` ou `router.push()`
- Migrar `ComponentsCatalogPage` para usar hash + query params via rota (`/catalog#ComponentName`)
- Manter compatibilidade com o estado atual: links que antes eram state-based passam a ser route-based

## Capabilities

### New Capabilities
- `playground-routing`: Adicionar roteamento Vue Router ao playground do design system, substituindo a navegação state-based por URLs navegáveis

### Modified Capabilities

*(nenhuma — esta change atua apenas no playground, não nos componentes do design system)*

## Não-Objetivos

- Adicionar vue-router como dependência do pacote `@tcarnaes/design-system` (apenas no playground)
- Modificar a API pública dos componentes de navegação (`SidebarMenu`, `Tabs`, `Breadcrumb`, etc.)
- Refatorar ou reestilizar páginas existentes — apenas torná-las acessíveis por rota
- Implementar lazy-loading ou code-splitting de rotas
- Adicionar guardas de rota ou navegação aninhada

## Impact

- `vue-router` adicionado ao `devDependencies` do pacote `@tcarnaes/design-system` (usado apenas no playground)
- `packages/design-system/playground/main.ts`: instalar o router e passar para o `app.use()`
- `packages/design-system/playground/App.vue`: remover `activePage`, `activeCat`, `setCategory`; usar `<router-view>` no lugar do sistema de renderização condicional
- `packages/design-system/playground/components/PlaygroundHeader.vue` (ou inline no App.vue): trocar `@click` por `<router-link>`
- `packages/design-system/playground/components/PlaygroundCategoryNav.vue`: emitir navegação via router
- `packages/design-system/playground/views/*.vue`: podem precisar de ajustes mínimos para receber parâmetros de rota
- `packages/design-system/vite.playground.config.ts`: configurar history fallback para SPA routing (se necessário para dev server)
