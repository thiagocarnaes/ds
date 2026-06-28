# Design Document: design-system-playground-docs-update

## Overview

Este documento cobre as mudanças técnicas necessárias para adicionar `Flag`, `FlagGroup` e `SectionMessage` à documentação interativa do playground após a migração `appearance → variant`. O escopo inclui: entradas de catálogo de API, snippets de uso, agrupamento no grupo "Feedback", demos Vue interativas, registro dessas demos, descrições i18n e limpeza da entrada de `Button`.

### Princípio geral

Nenhum novo padrão é introduzido. Todas as mudanças seguem os padrões existentes do projeto:

- Entradas de catálogo: helpers `p()`, `s()`, `e()`, `cls()` em `entries.ts`
- Snippets de uso: `usage()` / `usageMany()` em `usageSnippets.ts`
- Demos: componente Vue com `<script setup>`, `ref`, `computed`, `UsageBlock`, `Switch`, `playgroundOptionStyle`, `playgroundSnippetAttr`
- Registro: importar demo e adicionar ao objeto `playgroundDemoRegistry`
- I18n: adicionar chave em `componentCatalogDescriptionsEn` e `componentCatalogDescriptionsPtBR`

---

## Architecture

### Fluxo de dados do catálogo

```
entries.ts ──────────────────────┐
usageSnippets.ts ────────────────┤──► catalog/index.ts ──► getComponentCatalogEntry()
catalog/types.ts ────────────────┘                          └──► DrawerPlayground / DocPage

componentCatalog.ts (catalogGroups) ──► sidebar navigation

playgroundAliases.ts ──► resolvePlaygroundDemo()
demos/registry.ts ───────────────────► getPlaygroundDemoComponent()

designSystemMeta.ts (playgroundDemoComponents) ──► hasPlaygroundDemo()

i18n/componentCatalogDescriptions.ts ──► component descriptions per locale
playground/data/playgroundPropCoverage.ts ──► coverage maps for test suite
```

### Impacto em testes automatizados

O test suite possui dois testes principais relevantes:

1. **`playgroundPropCoverage.spec.ts`** — lê `playgroundDemoPrimaryComponent`, verifica que `playgroundPropCoverage[demo]` existe, e para demos em `playgroundStrictDemos` verifica que todas as props do catálogo estão cobertas. Para as novas demos (`Flag`, `FlagGroup`, `SectionMessage`), elas **não** precisam estar em `playgroundStrictDemos` — basta ter entradas em `playgroundDemoPrimaryComponent` e `playgroundPropCoverage`.

2. **`playgroundDemos.spec.ts`** — testa componentes específicos listados em `playgroundDemoRegistry` via `DrawerPlayground`. Para passar, as demos precisam montar sem erros e produzir um `.pg-playground-panel` no DOM.

---

## Components and Interfaces

### Novos arquivos a criar

| Arquivo | Propósito |
|---|---|
| `playground/demos/FlagDemo.vue` | Demo interativa para `Flag` |
| `playground/demos/FlagGroupDemo.vue` | Demo dedicada para `FlagGroup` (2+ Flags em fila) |
| `playground/demos/SectionMessageDemo.vue` | Demo interativa para `SectionMessage` |

### Arquivos a modificar

| Arquivo | Mudança |
|---|---|
| `playground/data/catalog/entries.ts` | Adicionar entradas `Flag`, `FlagGroup`, `SectionMessage`; atualizar `Button.variant` |
| `playground/data/catalog/usageSnippets.ts` | Adicionar snippets `Flag`, `FlagGroup`, `SectionMessage` |
| `playground/data/componentCatalog.ts` | Adicionar 3 itens ao grupo "Feedback" |
| `playground/demos/registry.ts` | Registrar `Flag`, `FlagGroup`, `SectionMessage` |
| `playground/data/playgroundPropCoverage.ts` | Adicionar entradas de coverage para `Flag`, `FlagGroup`, `SectionMessage` |
| `playground/designSystemMeta.ts` | Adicionar `'Flag'`, `'FlagGroup'`, `'SectionMessage'` a `playgroundDemoComponents` |
| `playground/i18n/componentCatalogDescriptions.ts` | Adicionar descrições en + pt-BR para os 3 componentes |

---

## Data Models

### Entrada de catálogo: `Flag`

```typescript
Flag: {
  usage: usageSnippets.Flag!,
  props: [
    p('title', 'string', undefined, 'Flag heading (required)'),
    p('description', 'string', undefined, 'Optional supporting text below the title'),
    p('variant', "'normal' | 'warning' | 'error' | 'success' | 'discovery'", 'normal', 'Color variant for the left border and icon'),
    p('actions', "FlagAction[]", undefined, 'Action buttons — each { label: string; onClick: () => void }'),
    p('isDismissible', 'boolean', 'false', 'Shows a close button that emits dismiss when clicked'),
    p('flagId', 'string', undefined, 'Unique id used by FlagGroup to manage the visible queue; auto-generated if omitted'),
    cls(),
  ],
  events: [e('dismiss', undefined, 'Fired when the dismiss button is clicked (only when isDismissible is true)')],
},
```

**Nota sobre `title`:** a prop `title` é `Required` no TypeScript (`string`, sem `?`). Deve ser representada no catálogo como `p('title', 'string', undefined, '...')` — sem default — sinalizando que é obrigatória.

### Entrada de catálogo: `FlagGroup`

```typescript
FlagGroup: {
  usage: usageSnippets.FlagGroup!,
  props: [],   // Nenhuma prop pública — MAX_VISIBLE=3 é constante interna
  slots: [s('default', undefined, 'Flag children managed in a visible queue (max 3 at a time via internal MAX_VISIBLE constant)')],
},
```

**Crítico para testes:** `props: []` garante que `playgroundPropCoverage.spec.ts` passe — não há props a verificar.

### Entrada de catálogo: `SectionMessage`

```typescript
SectionMessage: {
  usage: usageSnippets.SectionMessage!,
  props: [
    p('variant', "'information' | 'warning' | 'error' | 'success' | 'discovery' | 'change'", 'information', 'Color variant for the background, border, and icon'),
    p('title', 'string', undefined, 'Optional bold heading above the body slot'),
    cls(),
  ],
  slots: [
    s('default', undefined, 'Body content — rendered below the title'),
    s('actions', undefined, 'Action buttons shown below the body (optional)'),
  ],
  notes: ['Accessibility: aria-live="assertive" when variant is "error"; aria-live="polite" for all other variants'],
},
```

**Nota:** O campo `notes` é do tipo `string[]` na interface `ComponentCatalogEntry` (se existir) ou pode ser adicionado como comentário na descrição da prop. Se `ComponentCatalogEntry` não expõe um campo `notes`, o comportamento `aria-live` deve ser documentado na descrição da prop `variant`.

### Atualização: `Button.props[0]` (`variant`)

```typescript
// ANTES:
p('variant', "'default' | 'primary' | ...", 'default', 'Visual style / button variant. Prefer over deprecated runtime alias `appearance` (danger → destructive).'),

// DEPOIS:
p('variant', "'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'", 'default', 'Visual style of the button.'),
```

A nova descrição não contém `"appearance"`, `"alias"`, `"deprecated"` nem qualquer referência a props removidas.

### Snippets de uso

#### `Flag`

```typescript
Flag: usage(
  'Flag',
  `  <Flag
    ${playgroundSnippetAttr('variant', 'warning')}
    ${playgroundSnippetAttr('title', 'Deployment failed')}
    ${playgroundSnippetAttr('description', 'Push to main was rejected. Check the build logs.')}
    ${templateBooleanAttr('is-dismissible', true)}
  />`,
),
```

Implementação real usando `usageSnippets.ts` helper `usage()`:

```typescript
Flag: usage(
  'Flag',
  `  <Flag
    :variant="'warning'"
    :title="'Deployment failed'"
    :description="'Push to main was rejected. Check the build logs.'"
    :is-dismissible="true"
  />`,
),
```

#### `FlagGroup`

```typescript
FlagGroup: usageMany(
  ['Flag', 'FlagGroup'],
  `  <FlagGroup>
    <Flag
      :variant="'success'"
      :title="'Changes saved'"
      :description="'Your changes were saved successfully.'"
    />
    <Flag
      :variant="'warning'"
      :title="'Deploy queued'"
      :description="'Deployment is pending. Check status in a moment.'"
    />
  </FlagGroup>`,
),
```

#### `SectionMessage`

```typescript
SectionMessage: usage(
  'SectionMessage',
  `  <SectionMessage
    :variant="'information'"
    :title="'Important update'"
  >
    This feature will be deprecated in the next major release.
  </SectionMessage>`,
),
```

### Grupo "Feedback" em `componentCatalog.ts`

```typescript
{
  category: 'Feedback',
  items: ['Alert', 'Badge', 'Flag', 'FlagGroup', 'Spinner', 'Progress', 'Skeleton', 'SectionMessage', 'Toast', 'ToastHost'],
},
```

Exatamente 10 itens. Os 3 novos (`Flag`, `FlagGroup`, `SectionMessage`) são inseridos nas posições 2, 3 e 7 para manter agrupamento lógico (notificações toast, status, mensagens inline).

### `playgroundPropCoverage.ts` — novas entradas

```typescript
// Adicionado a playgroundDemoPrimaryComponent:
Flag: 'Flag',
FlagGroup: 'FlagGroup',
SectionMessage: 'SectionMessage',

// Adicionado a playgroundPropCoverage:
Flag: ['variant', 'isDismissible'],
FlagGroup: [],    // zero props — FlagGroup não tem props públicas
SectionMessage: ['variant'],
```

**Racionale:** `title` e `description` são exibidos na demo como texto fixo e não são controles interativos configuráveis pelo usuário; `flagId` é técnico (raramente usado pelo consumidor); `actions` é complexo e não faz parte dos controles da demo simplificada. A cobertura de props declara apenas o que os controles da demo efetivamente alternam.

### `designSystemMeta.ts` — atualização de `playgroundDemoComponents`

```typescript
export const playgroundDemoComponents = [
  // ... existing entries ...
  'Flag',
  'FlagGroup',
  'SectionMessage',
  // ... rest ...
] as const
```

---

## Demo Designs

### `FlagDemo.vue`

**Controles:**
- Variant selector (5 botões): `normal | warning | error | success | discovery`
- Switch: `isDismissible` (label: `is-dismissible`)
- Restore mechanism: `flagKey` ref incrementado no evento `@dismiss`

**Estado inicial:** `variant = 'normal'`, `isDismissible = false`

**Comportamento de restore:** quando `isDismissible = true` e o usuário fecha o Flag, o handler `onDismiss` incrementa `flagKey`. O Flag usa `:key="flagKey"` para se re-montar e aparecer novamente, sem necessidade de recarregar a página.

**Código gerado (exemplo):**
```
<Flag
  :variant="'warning'"
  :title="'Deployment alert'"
  :description="'Something needs your attention.'"
  :is-dismissible="true"
/>
```

**Estrutura do componente:**

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr, propTemplateBinding, templateBooleanAttr } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { Flag, Switch } from '@/index'
import type { FlagVariant } from '@/components/feedback/Flag.vue'

const { t } = usePlaygroundLocale()

const variantOptions: FlagVariant[] = ['normal', 'warning', 'error', 'success', 'discovery']

const variant = ref<FlagVariant>('normal')
const isDismissible = ref(false)
const flagKey = ref(0)

function onDismiss(): void {
  // increment key to re-mount Flag after dismiss (restore behavior)
  flagKey.value += 1
}

const code = computed(() => {
  const lines = [
    `<Flag`,
    `  ${playgroundSnippetAttr('variant', variant.value)}`,
    `  :title="'Deployment alert'"`,
    `  :description="'Something needs your attention.'"`,
  ]
  if (isDismissible.value) lines.push(`  ${templateBooleanAttr('is-dismissible', true)}`)
  lines.push('/>')
  return lines.join('\n')
})
</script>
```

### `FlagGroupDemo.vue`

**Sem controles interativos.** A demo exibe 2 Flags estáticos dentro de um FlagGroup para demonstrar o comportamento de fila (máximo 3 visíveis).

**Consideração de Teleport:** `FlagGroup` usa `<Teleport to="body">`. Para que os Flags sejam visíveis no DOM durante testes, o componente deve ser montado com `attachTo: document.body`. O `.pg-playground-panel` deve estar presente mesmo com Teleport, pois é o wrapper externo da demo.

**Estrutura do componente:**

```vue
<script setup lang="ts">
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { Flag, FlagGroup } from '@/index'
import { PACKAGE } from '../data/componentCatalogConstants'

const { t } = usePlaygroundLocale()

const code = `<FlagGroup>
  <Flag
    :variant="'success'"
    :title="'Changes saved'"
    :description="'Your changes were saved successfully.'"
  />
  <Flag
    :variant="'warning'"
    :title="'Deploy queued'"
    :description="'Deployment is pending. Check status in a moment.'"
  />
</FlagGroup>`
</script>

<template>
  <div>
    <p class="mb-4 font-mono text-[9px] uppercase tracking-wider text-[#4D6A87]">
      {{ t('drawer.livePlayground') }}
    </p>
    <div class="pg-playground-panel mb-6 space-y-5 rounded-xl p-4">
      <!-- Note: FlagGroup teleports to body; preview note is shown inline -->
      <div class="pg-playground-preview flex min-h-[80px] items-center justify-center rounded-xl py-4">
        <p class="text-xs text-[#4D6A87]">Flags are rendered via Teleport at top-right of the viewport.</p>
      </div>
      <FlagGroup>
        <Flag
          :variant="'success'"
          :title="'Changes saved'"
          :description="'Your changes were saved successfully.'"
        />
        <Flag
          :variant="'warning'"
          :title="'Deploy queued'"
          :description="'Deployment is pending. Check status in a moment.'"
        />
      </FlagGroup>
    </div>
    <UsageBlock :code="code" />
  </div>
</template>
```

**Nota sobre o teste de renderização:** como FlagGroup usa Teleport, os elementos Flag são renderizados em `document.body`, não dentro do componente. O teste do `playgroundDemos.spec.ts` verifica `.pg-playground-panel` no wrapper, o que funciona porque o panel está no componente demo. Para verificar os Flags, o teste precisaria checar `document.body`.

### `SectionMessageDemo.vue`

**Controles:**
- Variant selector (6 botões): `information | warning | error | success | discovery | change`

**Estado inicial:** `variant = 'information'`

**Código gerado (exemplo):**
```
<SectionMessage
  :variant="'information'"
  :title="'Important notice'"
>
  This is a contextual message to inform the user.
</SectionMessage>
```

**Estrutura do componente:**

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import UsageBlock from '../components/UsageBlock.vue'
import { usePlaygroundLocale } from '../composables/usePlaygroundLocale'
import { playgroundSnippetAttr, propTemplateBinding } from '../utils/propTemplateName'
import { playgroundOptionStyle } from './playgroundOptionStyle'
import { SectionMessage } from '@/index'
import type { SectionMessageVariant } from '@/components/feedback/SectionMessage.vue'

const { t } = usePlaygroundLocale()

const variantOptions: SectionMessageVariant[] = [
  'information', 'warning', 'error', 'success', 'discovery', 'change',
]

const variant = ref<SectionMessageVariant>('information')

const code = computed(
  () => `<SectionMessage
  ${playgroundSnippetAttr('variant', variant.value)}
  :title="'Important notice'"
>
  This is a contextual message to inform the user.
</SectionMessage>`,
)
</script>
```

### Registry (`registry.ts`) — novas entradas

```typescript
import FlagDemo from './FlagDemo.vue'
import FlagGroupDemo from './FlagGroupDemo.vue'
import SectionMessageDemo from './SectionMessageDemo.vue'

// No objeto playgroundDemoRegistry:
Flag: FlagDemo,
FlagGroup: FlagGroupDemo,
SectionMessage: SectionMessageDemo,
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Catalog entry completeness for Flag and SectionMessage

*For any* call to `getComponentCatalogEntry` for `'Flag'` or `'SectionMessage'`, the returned entry SHALL have a `props` array where each documented prop name (`title`, `description`, `variant`, `actions`, `isDismissible`, `flagId`, `class` for Flag; `variant`, `title`, `class` for SectionMessage) is present with the correct `type` string and `default` value as specified in Requirements 1.1 and 3.1.

**Validates: Requirements 1.1, 3.1**

### Property 2: Feedback group membership invariant

*For any* snapshot of `catalogGroups`, the group with `category === 'Feedback'` SHALL contain exactly the 10 items `['Alert', 'Badge', 'Flag', 'FlagGroup', 'Spinner', 'Progress', 'Skeleton', 'SectionMessage', 'Toast', 'ToastHost']` — no additions, no removals.

**Validates: Requirements 4.1**

### Property 3: I18n description coverage for new components

*For any* of the component names `['Flag', 'FlagGroup', 'SectionMessage']`, both `componentCatalogDescriptionsEn[name]` and `componentCatalogDescriptionsPtBR[name]` SHALL be non-empty strings.

**Validates: Requirements 8.1, 8.2**

### Property 4: Button variant description is clean of removed API references

*For any* retrieval of the `Button` catalog entry, the `description` field of the `variant` prop SHALL NOT contain the substrings `"appearance"`, `"alias"`, or `"deprecated"`, and SHALL contain each of the 7 accepted values: `'default'`, `'primary'`, `'secondary'`, `'outline'`, `'ghost'`, `'destructive'`, `'link'`.

**Validates: Requirements 9.1, 9.3**

### Property 5: FlagDemo code reflects current variant state

*For any* value `v` in `FlagVariant` (`'normal' | 'warning' | 'error' | 'success' | 'discovery'`), when the `variant` ref in `FlagDemo` is set to `v`, the computed `code` string SHALL contain the substring `v` as the variant attribute value.

**Validates: Requirements 5.5**

### Property 6: SectionMessageDemo code reflects current variant state

*For any* value `v` in `SectionMessageVariant` (`'information' | 'warning' | 'error' | 'success' | 'discovery' | 'change'`), when the `variant` ref in `SectionMessageDemo` is set to `v`, the computed `code` string SHALL contain the substring `v` as the variant attribute value.

**Validates: Requirements 6.4**

---

## Error Handling

### FlagGroup + Teleport em ambiente de testes

O `FlagGroup` usa `<Teleport to="body">`. Em testes com `@vue/test-utils`, o Teleport funciona apenas quando o componente é montado com `attachTo: document.body`. Os demos devem ser montados com essa opção ao testar renderização de Flags filhos.

O `.pg-playground-panel` é renderizado no componente demo (fora do Teleport), então os testes de `playgroundDemos.spec.ts` que verificam apenas `.pg-playground-panel` passarão normalmente.

### Flag com estado `isDismissible=true` após dismiss

O padrão `:key="flagKey"` + incremento no `@dismiss` é o mecanismo de restore. Isso força re-mount do Flag, tornando-o visível novamente. Não há necessidade de um `ref visible` adicional na demo — o incremento do `key` é suficiente.

### Entrada de catálogo `FlagGroup` com `props: []`

O teste `playgroundPropCoverage.spec.ts` itera sobre `entry?.props ?? []`. Com `props: []`, o loop não encontra nenhuma prop e nenhum gap é reportado. É essencial não adicionar `maxVisible` (que seria `MAX_VISIBLE` renomeado para prop pública) — isso quebraria a semântica do componente real.

### Tipo `notes` em `ComponentCatalogEntry`

Antes de adicionar o campo `notes` ao catálogo de `SectionMessage`, verificar se `ComponentCatalogEntry` em `catalog/types.ts` suporta esse campo. Se não suportar, o comportamento `aria-live` deve ser documentado como parte da descrição da prop `variant`:

```typescript
p('variant', "'information' | 'warning' | 'error' | 'success' | 'discovery' | 'change'", 'information',
  'Color variant. Sets aria-live="assertive" when "error", "polite" for all others.'),
```

---

## Testing Strategy

### Testes existentes que devem continuar passando

1. `playgroundPropCoverage.spec.ts` — `documents interactive coverage for every playground demo`
   - Requer: `playgroundDemoPrimaryComponent` tenha entradas para `Flag`, `FlagGroup`, `SectionMessage`
   - Requer: `playgroundPropCoverage` tenha entradas correspondentes

2. `playgroundPropCoverage.spec.ts` — `strict demos expose catalog props as playground controls`
   - Não afetado: `Flag`, `FlagGroup`, `SectionMessage` não são adicionados a `playgroundStrictDemos`

3. `playgroundPropCoverage.spec.ts` — `reports remaining playground coverage gaps for follow-up`
   - Continuará passando (permite gaps, apenas conta)

4. `playgroundDemos.spec.ts` — `registry resolves demos below Pagination in the index`
   - Não afetado diretamente (testa componentes já existentes)

### Novos testes implícitos (via testes existentes)

Ao adicionar entradas a `playgroundDemoPrimaryComponent` e `playgroundPropCoverage`, o teste "documents interactive coverage" automaticamente verificará `Flag`, `FlagGroup` e `SectionMessage`.

### Verificação manual recomendada

1. Iniciar o playground (`npm run dev` no pacote `design-system`)
2. Navegar para Feedback → Flag: verificar demo interativa, variant buttons, Switch isDismissible, restore após close
3. Navegar para Feedback → FlagGroup: verificar que Flags aparecem no canto superior direito via Teleport
4. Navegar para Feedback → SectionMessage: verificar demo com 6 variantes
5. Navegar para Actions → Button: verificar que a descrição de `variant` não menciona `appearance`

### Abordagem de property-based testing

Para as propriedades identificadas neste documento, a estratégia de implementação usa a biblioteca **Vitest** com iterações explícitas sobre o domínio finito (5 variantes de Flag, 6 de SectionMessage, 3 nomes de componentes para i18n). Como os domínios são conjuntos enumeráveis e pequenos, iterações explícitas são equivalentes a PBT para esses casos.

**Property 1** (catalog completeness) — teste unitário iterando sobre as props documentadas:
```typescript
it('Flag catalog entry has all documented props', () => {
  const entry = getComponentCatalogEntry('Flag')!
  const propNames = entry.props.map(p => p.name)
  expect(propNames).toContain('title')
  expect(propNames).toContain('variant')
  // ... etc
})
```

**Property 5** (FlagDemo code reflects variant) — teste parametrizado:
```typescript
const flagVariants = ['normal', 'warning', 'error', 'success', 'discovery']
it.each(flagVariants)('FlagDemo code contains variant %s', (v) => {
  // mount FlagDemo, set variant.value = v, check code.value contains v
})
```

**Property 6** (SectionMessageDemo code reflects variant) — mesma abordagem com 6 variantes.

**Property 3** (i18n coverage) — iteração sobre os 3 nomes:
```typescript
const newComponents = ['Flag', 'FlagGroup', 'SectionMessage']
it.each(newComponents)('has en description for %s', (name) => {
  expect(componentCatalogDescriptionsEn[name]).toBeTruthy()
})
```

---

## Summary of File Changes

| Arquivo | Tipo de mudança | Detalhes |
|---|---|---|
| `playground/data/catalog/entries.ts` | Modificar | Adicionar entradas `Flag`, `FlagGroup`, `SectionMessage`; limpar descrição de `Button.variant` |
| `playground/data/catalog/usageSnippets.ts` | Modificar | Adicionar snippets `Flag`, `FlagGroup`, `SectionMessage` |
| `playground/data/componentCatalog.ts` | Modificar | Adicionar 3 itens ao grupo `'Feedback'` |
| `playground/demos/FlagDemo.vue` | Criar | Demo interativa com variant selector, Switch isDismissible, restore |
| `playground/demos/FlagGroupDemo.vue` | Criar | Demo estática com 2 Flags em FlagGroup |
| `playground/demos/SectionMessageDemo.vue` | Criar | Demo interativa com variant selector (6 opções) |
| `playground/demos/registry.ts` | Modificar | Importar e registrar as 3 novas demos |
| `playground/data/playgroundPropCoverage.ts` | Modificar | Adicionar entradas em `playgroundDemoPrimaryComponent` e `playgroundPropCoverage` |
| `playground/designSystemMeta.ts` | Modificar | Adicionar `'Flag'`, `'FlagGroup'`, `'SectionMessage'` a `playgroundDemoComponents` |
| `playground/i18n/componentCatalogDescriptions.ts` | Modificar | Adicionar descrições en + pt-BR para os 3 componentes |
