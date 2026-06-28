# Implementation Plan: Design System UI Improvements

## Overview

Plano de implementação das 10 melhorias de UI no playground do design system Vue 3. As tasks são organizadas em waves de acordo com dependências: primeiro as mudanças cirúrgicas de template (independentes entre si), depois correções de demo e i18n, depois diagnóstico/bugfix, depois novas features, testes PBT e checkpoint final.

## Tasks

- [x] 1. App.vue — substituir ícone `ArrowUpRight` pelo ícone `Github` no link do GitHub
  - Em `playground/App.vue`, trocar a importação de `ArrowUpRight` para `Github` no import de `lucide-vue-next`
  - Substituir `<ArrowUpRight :size="14" />` por `<Github :size="16" />` no elemento `<a>` do GitHub
  - Manter inalterados `href`, `target="_blank"` e `rel="noopener noreferrer"` do elemento âncora
  - Remover `ArrowUpRight` da lista de importações (não deve ficar importado sem uso)
  - _Requirements: 7.1, 7.2, 7.3_

- [x] 2. App.vue — remover badge "stable" do header
  - Em `playground/App.vue`, remover o elemento `<span>` que renderiza `{{ t('app.stable') }}` do bloco `pg-header-actions`
  - Garantir que nenhum outro elemento com o texto de `t('app.stable')` permaneça no template
  - _Requirements: 8.1, 8.2_

- [x] 3. App.vue — remover span de versão do `pg-header-brand`
  - Em `playground/App.vue`, remover o segundo `<span>` dentro de `pg-header-brand` que renderiza `{{ t('app.versionBadge', { version: designSystemVersionBadge }) }}`
  - Preservar o primeiro `<span>` com `{{ t('app.title') }}` intacto
  - Verificar se `designSystemVersionBadge` ainda é usado em outros lugares de `App.vue`; se não, remover também o import dessa constante do `App.vue`
  - _Requirements: 9.1, 9.2_

- [x] 4. PlaygroundHero — remover div de versão e bloco de botões CTA
  - Em `playground/components/PlaygroundHero.vue`, remover o bloco `<div class="mb-6 flex items-center gap-2">` completo (contém `GlowDot` + span de versão `{{ t('hero.versionLine', ...) }}`)
  - Remover o bloco `<div class="mt-6 flex flex-wrap items-center gap-3">` que contém os três `<Button>` CTA (`browse`, `docs`, `playground`)
  - Remover os `defineEmits` de `browse`, `docs` e `playground` (ou o `emit` completo) de `PlaygroundHero.vue`, pois os botões que os disparam serão removidos
  - Em `playground/App.vue`, remover os event handlers `@browse="openCatalog"`, `@docs="openDocs"` e `@playground="scrollToPlayground"` do binding `<PlaygroundHero>`
  - Preservar o logo (`<img>`), o `<h1>` com título e o `<p>` de subtítulo inalterados
  - Preservar a barra de estatísticas com os `<StatPill>` e o StatPill de versão
  - _Requirements: 9.3, 9.4, 10.1, 10.2, 10.3, 10.4_

- [x] 5. FlagGroupDemo — adicionar toggle `isDismissible` e snippet computed
  - Em `playground/demos/FlagGroupDemo.vue`, adicionar `import { computed, ref } from 'vue'`
  - Adicionar `import { Switch } from '@/index'`
  - Adicionar `const isDismissible = ref(false)`
  - Converter `code` de `const string` para `computed(() => string)` que inclui condicionalmente `:is-dismissible="true"` em cada `<Flag>` quando `isDismissible.value === true`
  - No template, adicionar um `<label>` com `<Switch v-model="isDismissible" size="sm" />` e texto "isDismissible" acima do bloco de preview
  - Passar `:is-dismissible="isDismissible"` para cada `<Flag>` dentro do `<FlagGroup>` no template
  - Garantir que o demo inclua pelo menos dois `<Flag>` de variantes distintas (ex.: `success` e `warning`)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 6. FormFieldDemo — garantir visibilidade do ícone `Mail` à esquerda do Input
  - Em `playground/demos/FormFieldDemo.vue`, inspecionar por que o ícone `Mail` pode estar oculto quando `withIcon=true`
  - Adicionar `class="z-10"` ao elemento `<Mail>` para garantir sobreposição sobre o `<Input>` (que pode ter `position: relative` e criar novo stacking context)
  - Verificar que o container `<div class="relative">` envolve tanto o `<Mail>` quanto o `<Input>` corretamente
  - Confirmar que `inputPaddingClass` retorna `'pl-9'` (ou `'pl-9 pr-9'`) quando `withIcon=true` e que `:class="inputPaddingClass"` está aplicado ao `<Input>`
  - Verificar o mesmo no snippet de código gerado pelo `computed code` — o template copiado deve incluir a classe de padding correta
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 7. i18n — remover referências residuais a "Appearance" como nome de prop
  - Inspecionar `playground/i18n/en.ts`: buscar strings que usem "appearance" como nome de prop canônica para `Button`, `Flag` ou `SectionMessage` (padrões: `":appearance"`, `"appearance prop"`, `"use appearance"`) e substituir por "variant"
  - Inspecionar `playground/i18n/pt-BR.ts`: aplicar as mesmas substituições
  - Inspecionar `playground/i18n/componentCatalogDescriptions.ts`: verificar e corrigir descrições de `Button`, `Flag` e `SectionMessage`
  - **Preservar sem alteração**: `labelsPlayground.boldAppearance`, textos como "Bold appearance" (descrevem modo visual, não nome de prop), e type aliases `LozengeAppearance`, `TooltipAppearance`, `PopoverAppearance`
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 8. Diagnóstico e correção do `usePlaygroundLocale` / `PlaygroundLocaleSelect`
  - Inspecionar `playground/components/PlaygroundLocaleSelect.vue` e verificar como `v-model="localeValue"` é gerenciado pelo componente `Select` de `@/index`
  - Verificar se o componente `Select` emite `update:modelValue` com o valor `string` (campo `value` da opção) ou com o objeto completo `{ value, label }` — o comportamento atual pode estar quebrando a reatividade
  - Se `Select` emite o objeto completo, corrigir o setter do computed `localeValue` para extrair `.value`: `set: (v) => setLocale((typeof v === 'object' ? v.value : v) as PlaygroundLocale)`
  - Alternativamente, usar binding explícito com `@update:model-value="(v) => setLocale(v as PlaygroundLocale)"` se o computed writable não for suficiente
  - Verificar em `playground/composables/usePlaygroundLocale.ts` se `setLocale` muta corretamente `locale.value` e persiste no `localStorage` com chave `'ds-playground-locale'`
  - Testar manualmente (ou via unit test) que trocar locale via `PlaygroundLocaleSelect` atualiza todos os textos reativamente sem reload
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [x] 9. FoundationsPage — nova tab "Iconography" com showcase de ícones
  - Em `playground/views/FoundationsPage.vue`, adicionar `'iconography'` ao union type `TabId`
  - Adicionar `{ id: 'iconography', label: 'Iconography' }` ao final do array `tabs`
  - Importar `iconography` de `@/icons/iconography` (mesma source usada por `IconsCard.vue`)
  - Importar (ou implementar inline) `useCopy` ou usar `navigator.clipboard.writeText` diretamente
  - Adicionar `const searchQuery = ref('')`, `const iconSize = ref(24)`, `const iconColor = ref('')`
  - Adicionar `const iconSizes = [12, 16, 20, 24]` (ou equivalente do `IconsCard`)
  - Adicionar `const filteredIcons = computed(...)` filtrando por `searchQuery` nos campos `name` e `label`
  - Adicionar `const copiedKey = ref<string | null>(null)` para feedback visual de cópia
  - Implementar `async function copyIcon(label: string)` que chama `navigator.clipboard.writeText('<LabelSemEspaços />')` com `try/catch` e reseta `copiedKey` após 1500ms
  - Adicionar `<section v-else-if="activeTab === 'iconography'">` após a seção `borders` no template com: campo de busca, botões de tamanho, input de cor, grid de ícones clicáveis com feedback "✓ Copied"
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 10. ComponentsCatalogPage — seção "Showcases" com "AI Chat"
  - Em `playground/views/ComponentsCatalogPage.vue`, importar `showcaseDemoComponents` de `'../designSystemMeta'`
  - Importar `ChatPreviewCard` de `'../cards/ChatPreviewCard.vue'`
  - Adicionar `const isShowcase = computed(() => (showcaseDemoComponents as readonly string[]).includes(selectedName.value))`
  - Adicionar função `descriptionForShowcase(name: string)` que retorna `messages.value.drawer.descriptions[name] ?? name`
  - Na nav lateral, adicionar uma `<section class="pg-catalog-nav-group">` de "Showcases" após o loop `v-for="group in localizedGroups"`, listando cada item de `showcaseDemoComponents` como `<button class="pg-catalog-nav-item">`
  - No `<select>` mobile, adicionar um `<optgroup label="Showcases">` com as opções de showcase
  - No cabeçalho do painel de detalhes, adicionar `<span v-if="isShowcase" ...>Showcase</span>` ao lado do `<h3>{{ selectedName }}</h3>`
  - No corpo do painel de detalhes, usar lógica condicional: se `isShowcase`, renderizar `<ChatPreviewCard />` (sem `ComponentApiReference` nem `UsageBlock`); caso contrário, manter o conteúdo atual
  - Adicionar um computed `showcasePreviewComponent` que mapeia nome → componente Vue (ex.: `'AI Chat' → ChatPreviewCard`) com fallback `null` para showcases sem preview mapeado
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 11. Escrever testes de propriedade e unit para as 8 propriedades do design
  - [x] 11.1 Verificar/instalar `fast-check` como devDependency em `packages/design-system`
    - Confirmar se `fast-check` já está em `devDependencies` do `package.json`; se não, adicionar com `pnpm add -D fast-check`
    - Criar arquivo de testes em `packages/design-system/playground/__tests__/design-system-ui-improvements.spec.ts`
    - _Requirements: (infraestrutura de teste)_

  - [x] 11.2 Property 1 — Snippet do FlagGroupDemo reflete `isDismissible`
    - Usar `fc.boolean()` para testar que `code.value.includes(':is-dismissible="true"') === isDismissible.value` para qualquer valor booleano
    - Montar `FlagGroupDemo` com Vue Test Utils + fast-check
    - **Property 1: Snippet do FlagGroupDemo reflete estado de isDismissible**
    - **Validates: Requirements 1.5**

  - [x] 11.3 Property 2 — Todos os ícones renderizados na tab Iconography
    - Usar `fc.constantFrom(...iconography)` para verificar que cada item tem elemento correspondente no DOM quando `activeTab === 'iconography'`
    - **Property 2: Todos os ícones são renderizados na tab Iconography**
    - **Validates: Requirements 2.3**

  - [x] 11.4 Property 3 — Clicar em ícone copia snippet correto
    - Usar `fc.constantFrom(...iconography)`, mock de `navigator.clipboard.writeText`, verificar que argumento é `'<' + label.replace(/\s+/g, '') + ' />'`
    - **Property 3: Clicar em um ícone copia o snippet correto**
    - **Validates: Requirements 2.5**

  - [x] 11.5 Property 4 — `t()` retorna valor do locale ativo
    - Usar `fc.constantFrom('en', 'pt-BR')` combinado com `fc.constantFrom(...translationPaths)` para verificar que `t(path)` retorna o valor correto após `setLocale`
    - **Property 4: t() retorna o valor correspondente ao locale ativo**
    - **Validates: Requirements 6.1, 6.2**

  - [x] 11.6 Property 5 — `setLocale` persiste no localStorage
    - Usar `fc.constantFrom('en', 'pt-BR')` para verificar que `localStorage.getItem('ds-playground-locale') === locale` após cada `setLocale`
    - Mock de `localStorage` com `vi.stubGlobal`
    - **Property 5: setLocale persiste o locale no localStorage**
    - **Validates: Requirements 6.3**

  - [x] 11.7 Property 6 — Novo contexto inicializa com locale salvo
    - Usar `fc.constantFrom('en', 'pt-BR')` para verificar que setar `localStorage['ds-playground-locale']` antes de `providePlaygroundLocale()` resulta em `locale.value` igual ao valor salvo
    - **Property 6: Novo contexto de locale inicializa com o valor salvo**
    - **Validates: Requirements 6.4**

  - [x] 11.8 Property 7 — Descrições de Button, Flag e SectionMessage sem "appearance" como prop
    - Usar `fc.constantFrom('Button', 'Flag', 'SectionMessage')` para verificar que as strings em `en.ts`, `pt-BR.ts` e `componentCatalogDescriptions.ts` não contêm padrões como `":appearance"`, `"appearance prop"` ou `"use appearance"`
    - **Property 7: Descrições de Button, Flag e SectionMessage não contêm "appearance" como prop canônica**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**

  - [x] 11.9 Property 8 — Seleção de showcase renderiza preview correto
    - Usar `fc.constantFrom(...showcaseDemoComponents)` para verificar que selecionar cada showcase renderiza `ChatPreviewCard` e não renderiza `ComponentApiReference` nem `UsageBlock`
    - **Property 8: Seleção de showcase renderiza o componente de preview correto**
    - **Validates: Requirements 3.4**

  - [x] 11.10 Unit tests — mudanças de template (smoke checks)
    - Renderizar `App.vue` e verificar: ícone `Github` presente no link GitHub (não `ArrowUpRight`), ausência de `t('app.stable')` no DOM, ausência do span de `versionBadge` em `pg-header-brand`
    - Renderizar `PlaygroundHero` e verificar: ausência do div de `versionLine`, ausência do bloco `div.mt-6` com botões CTA, presença de `h1`, `p` de subtítulo e `StatPill`s
    - Renderizar `FormFieldDemo` com `withIcon=true` e verificar: `Mail` presente no DOM com `z-10`, container `relative`, `Input` com classe `pl-9`
    - Verificar que `usePlaygroundLocale()` fora de `providePlaygroundLocale()` lança erro descritivo
    - _Requirements: 4.1–4.5, 6.6, 7.1–7.3, 8.1–8.2, 9.1–9.4, 10.1–10.3_

- [x] 12. Checkpoint final — testes, TypeScript e build
  - Executar `pnpm --filter @tcarnaes/design-system test --run` (ou equivalente) para garantir que todos os testes passam sem erros
  - Executar `pnpm --filter @tcarnaes/design-system typecheck` (ou `vue-tsc --noEmit`) para verificar que não há erros TypeScript
  - Executar `pnpm --filter @tcarnaes/design-system build` para verificar que o build do playground compila sem erros
  - Garantir que nenhuma importação não-utilizada foi deixada nos arquivos modificados
  - Verificar visualmente no browser que os 10 requisitos estão atendidos (hero sem versão e sem botões, header com ícone GitHub, FlagGroupDemo com toggle isDismissible, etc.)
  - Perguntar ao usuário se há dúvidas ou ajustes antes de concluir

## Notes

- Tasks marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada task referencia os requisitos correspondentes para rastreabilidade
- As Tasks 1–4 são completamente independentes e podem ser executadas em paralelo (Wave 1)
- As Tasks 5–7 são independentes entre si mas podem ter dependência de contexto com Task 4 (Wave 2)
- A Task 8 requer diagnóstico prévio do comportamento do `Select` component antes de corrigir (Wave 3)
- As Tasks 9–10 são novas features com maior escopo e impacto (Wave 4)
- A Task 11 cobre as 8 propriedades identificadas no design document com fast-check
- Property tests (11.2–11.9) e unit tests (11.10) devem ser executados apenas após as implementações correspondentes estarem completas
- O checkpoint final (Task 12) fecha o ciclo com verificação de build e TypeScript

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1", "2", "3", "4"] },
    { "id": 1, "tasks": ["5", "6", "7"] },
    { "id": 2, "tasks": ["8"] },
    { "id": 3, "tasks": ["9", "10"] },
    { "id": 4, "tasks": ["11.1", "11.2", "11.3", "11.4", "11.5", "11.6", "11.7", "11.8", "11.9", "11.10"] },
    { "id": 5, "tasks": ["12"] }
  ]
}
```
