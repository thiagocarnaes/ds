# Design Document

## Overview

Este documento descreve a arquitetura técnica para alinhar o design system Vue 3 existente com as boas práticas do Atlassian Design System (ADS). A identidade visual (paleta navy/cyan, dark-first) e a stack (Vue 3 + TypeScript + Tailwind CSS + CVA) são mantidas integralmente.

O trabalho é organizado em três camadas: (1) tokens/estilos, (2) componentes existentes aprimorados, (3) componentes novos.

---

## Architecture

### Stack mantida

- **Vue 3** com `<script setup lang="ts">` e Composition API
- **TypeScript** estrito — todas as props tipadas
- **Tailwind CSS v4** com `@theme inline` para bridge de custom properties
- **class-variance-authority (CVA)** para variantes de componentes
- **CSS Custom Properties** como token layer (não Tailwind utilities diretamente)

### Estrutura de arquivos resultante

```
packages/design-system/src/
├── styles/
│   ├── tokens.css          ← expansão: tokens semânticos + spacing + tipografia
│   ├── theme.css           ← expansão: mapeamento light/dark dos novos tokens
│   └── index.css
├── components/
│   ├── button/
│   │   ├── Button.vue              (atualizado)
│   │   ├── ButtonGroup.vue         (novo)
│   │   ├── IconButton.vue
│   │   └── buttonVariants.ts       (atualizado)
│   ├── data-display/
│   │   ├── Avatar.vue              (atualizado)
│   │   ├── AvatarGroup.vue
│   │   ├── Lozenge.vue             (atualizado)
│   │   ├── Tag.vue                 (novo)
│   │   ├── TagGroup.vue            (novo)
│   │   └── ...
│   ├── feedback/
│   │   ├── Alert.vue               (mantido — legado)
│   │   ├── Badge.vue               (atualizado)
│   │   ├── badgeVariants.ts        (atualizado)
│   │   ├── Flag.vue                (novo)
│   │   ├── FlagGroup.vue           (novo)
│   │   ├── SectionMessage.vue      (novo)
│   │   └── ...
│   ├── navigation/
│   │   ├── Tab.vue                 (atualizado)
│   │   ├── TabPanel.vue            (atualizado)
│   │   ├── Tabs.vue                (atualizado)
│   │   └── ...
│   ├── overlay/
│   │   ├── Modal.vue               (atualizado)
│   │   ├── ModalHeader.vue         (novo)
│   │   ├── ModalBody.vue           (novo)
│   │   ├── ModalFooter.vue         (novo)
│   │   ├── ModalTitle.vue          (novo)
│   │   └── Tooltip.vue             (atualizado)
│   ├── form/
│   │   └── Input.vue               (atualizado)
│   └── typography/                 (novo diretório)
│       ├── Heading.vue             (novo)
│       ├── Text.vue                (novo)
│       └── index.ts                (novo)
└── index.ts                        (atualizado — exports novos)
```

---

## Component Design Details

### 1. Token Layer (tokens.css + theme.css)

#### 1a. Novos tokens semânticos em `tokens.css`

Adicionar após os tokens de paleta existentes, **sem remover** nenhum token atual:

```css
:root {
  /* ── Tokens semânticos de cor ── */
  --ds-color-text-default:        var(--foreground);
  --ds-color-text-subtle:         var(--muted-foreground);
  --ds-color-text-disabled:       color-mix(in srgb, var(--foreground) 40%, transparent);
  --ds-color-text-inverse:        var(--primary-foreground);
  --ds-color-text-brand:          var(--primary);
  --ds-color-text-brand-bold:     var(--primary);
  --ds-color-text-danger:         var(--destructive);
  --ds-color-text-warning:        var(--warning);
  --ds-color-text-success:        var(--success);
  --ds-color-text-discovery:      var(--ds-color-purple-400);

  --ds-color-bg-default:          var(--background);
  --ds-color-bg-subtle:           var(--muted);
  --ds-color-bg-brand:            color-mix(in srgb, var(--primary) 10%, transparent);
  --ds-color-bg-brand-bold:       var(--primary);
  --ds-color-bg-disabled:         color-mix(in srgb, var(--background) 60%, transparent);
  --ds-color-bg-input:            var(--input-background);
  --ds-color-bg-danger:           color-mix(in srgb, var(--destructive) 10%, transparent);
  --ds-color-bg-warning:          color-mix(in srgb, var(--warning) 10%, transparent);
  --ds-color-bg-success:          color-mix(in srgb, var(--success) 10%, transparent);
  --ds-color-bg-discovery:        color-mix(in srgb, var(--ds-color-purple-400) 10%, transparent);

  --ds-color-border-default:      var(--border);
  --ds-color-border-brand:        var(--primary);
  --ds-color-border-focused:      var(--ring);
  --ds-color-border-danger:       var(--destructive);
  --ds-color-border-success:      var(--success);
  --ds-color-border-warning:      var(--warning);
  --ds-color-border-disabled:     color-mix(in srgb, var(--border) 50%, transparent);

  /* ── Elevation ── */
  --ds-elevation-surface:         var(--background);
  --ds-elevation-surface-sunken:  var(--muted);
  --ds-elevation-surface-raised:  var(--card);
  --ds-elevation-surface-overlay: var(--popover);
  --ds-shadow-raised:             var(--shadow-md);
  --ds-shadow-overlay:            var(--shadow-lg);

  /* ── Opacity ── */
  --ds-opacity-disabled: 0.4;
  --ds-opacity-loading:  0.7;

  /* ── Spacing (ADS scale) ── */
  --ds-space-025:  2px;
  --ds-space-050:  4px;
  --ds-space-075:  6px;
  --ds-space-100:  8px;
  --ds-space-150:  12px;
  --ds-space-200:  16px;
  --ds-space-250:  20px;
  --ds-space-300:  24px;
  --ds-space-400:  32px;
  --ds-space-500:  40px;
  --ds-space-600:  48px;
  --ds-space-800:  64px;
  --ds-space-1000: 80px;

  /* Legacy spacing aliases (retrocompatibilidade) */
  --ds-spacing-1: var(--ds-space-050);
  --ds-spacing-2: var(--ds-space-100);
  --ds-spacing-3: var(--ds-space-150);
  --ds-spacing-4: var(--ds-space-200);
  --ds-spacing-6: var(--ds-space-300);
  --ds-spacing-8: var(--ds-space-400);

  /* ── Typography scale ── */
  --ds-font-size-xsmall:  0.6875rem; /* 11px */
  --ds-font-size-small:   0.75rem;   /* 12px */
  --ds-font-size-medium:  0.875rem;  /* 14px */
  --ds-font-size-base:    1rem;      /* 16px */
  --ds-font-size-large:   1.25rem;   /* 20px */
  --ds-font-size-xlarge:  1.5rem;    /* 24px */
  --ds-font-size-xxlarge: 2rem;      /* 32px */

  --ds-line-height-xsmall:  1rem;
  --ds-line-height-small:   1.25rem;
  --ds-line-height-medium:  1.25rem;
  --ds-line-height-base:    1.5rem;
  --ds-line-height-large:   1.6rem;

  --ds-font-weight-regular:  400;
  --ds-font-weight-medium:   500;
  --ds-font-weight-semibold: 600;
  --ds-font-weight-bold:     700;
}
```

#### 1b. Extensão do `theme.css` — bridge para Tailwind

No bloco `@theme inline`, adicionar as novas custom properties:

```css
/* spacing */
--spacing-025: var(--ds-space-025);
--spacing-050: var(--ds-space-050);
--spacing-075: var(--ds-space-075);
--spacing-100: var(--ds-space-100);
--spacing-150: var(--ds-space-150);
--spacing-200: var(--ds-space-200);
--spacing-250: var(--ds-space-250);
--spacing-300: var(--ds-space-300);
--spacing-400: var(--ds-space-400);
--spacing-500: var(--ds-space-500);
--spacing-600: var(--ds-space-600);
--spacing-800: var(--ds-space-800);
--spacing-1000: var(--ds-space-1000);
/* semantic colors */
--color-text-subtle:    var(--ds-color-text-subtle);
--color-text-disabled:  var(--ds-color-text-disabled);
--color-text-inverse:   var(--ds-color-text-inverse);
--color-text-brand:     var(--ds-color-text-brand);
--color-text-danger:    var(--ds-color-text-danger);
--color-text-warning:   var(--ds-color-text-warning);
--color-text-success:   var(--ds-color-text-success);
--color-text-discovery: var(--ds-color-text-discovery);
--color-bg-brand-bold:  var(--ds-color-bg-brand-bold);
--color-bg-danger:      var(--ds-color-bg-danger);
--color-bg-warning:     var(--ds-color-bg-warning);
--color-bg-success:     var(--ds-color-bg-success);
--color-bg-discovery:   var(--ds-color-bg-discovery);
--color-border-focused: var(--ds-color-border-focused);
/* elevation */
--color-surface-raised:  var(--ds-elevation-surface-raised);
--color-surface-overlay: var(--ds-elevation-surface-overlay);
--color-surface-sunken:  var(--ds-elevation-surface-sunken);
```

---

### 2. Button — Novas variantes e ButtonGroup

#### 2a. `buttonVariants.ts` — adicionar `warning`, `discovery`, `isSelected`

```ts
// Novas entradas no objeto `variant`:
warning:   'bg-warning text-white hover:bg-warning/90',
discovery: 'bg-[--ds-color-purple-400] text-white hover:bg-[--ds-color-purple-400]/90',
subtle:    'hover:bg-accent/10 text-foreground',
```

Novas entradas no objeto `size`:
```ts
compact: 'h-7 px-3 text-xs',
```

#### 2b. `Button.vue` — novas props

```ts
interface ButtonProps {
  // ... props existentes ...
  appearance?: '...' | 'warning' | 'discovery' | 'subtle'
  isSelected?: boolean
  shouldFitContainer?: boolean
  tooltip?: string   // exibe Tooltip se disabled=true
}
```

- `shouldFitContainer` → adiciona `w-full` às classes
- `isSelected` → adiciona `ring-2 ring-ring` às classes
- `tooltip + disabled` → envolve o button em `<Tooltip :content="tooltip">`

#### 2c. `ButtonGroup.vue` — novo componente

```html
<div class="inline-flex items-center gap-[--ds-space-100]">
  <slot />
</div>
```

Props: `label?: string` (aria-label do grupo).

---

### 3. Avatar — shape, presence, status

#### `Avatar.vue` — novas props e template

```ts
type AvatarShape = 'circle' | 'square'
type AvatarPresence = 'online' | 'busy' | 'offline' | 'focus'
type AvatarStatus = 'approved' | 'declined' | 'locked'

interface AvatarProps {
  // ... existentes ...
  shape?: AvatarShape      // default: 'circle'
  presence?: AvatarPresence
  status?: AvatarStatus
}
```

- **shape**: `circle` → `rounded-full` (já é o padrão), `square` → `rounded-[--ds-radius-md]`
- **presence**: indicador `size-[10px]` posicionado `absolute bottom-0 right-0 rounded-full border-2 border-card`
  - `online` → bg `#00E5B0`, `busy` → bg `#FF3D57`, `offline` → bg `#4D6A87`, `focus` → bg `#FF8B00`
- **status**: ícone SVG `size-[14px]` posicionado `absolute bottom-0 right-0`
  - `approved` → ✓ verde, `declined` → ✗ vermelho, `locked` → 🔒 cinza
- Fallback de imagem: `@error` → oculta img e mostra initials
- `aria-label` = `name` quando não há texto externo

---

### 4. Badge — novas appearances

#### `badgeVariants.ts` — expandir

Adicionar ao tipo `BadgeAppearance`:
```
'modified' | 'inprogress' | 'moved' | 'new' | 'discovery' | 'important' | 'success' | 'warning' | 'danger' | 'information'
```

Estilos para cada nova appearance (seguindo padrão `{ color, glow, bg }`):
| appearance | color | bg/glow base |
|---|---|---|
| `modified` | `#FF8B00` | amber |
| `inprogress` | `#00D4FF` | cyan |
| `moved` | `#FF8B00` | amber |
| `new` | `#A78BFA` | purple |
| `discovery` | `#A78BFA` | purple |
| `success` | `#00E5B0` | teal |
| `warning` | `#FF8B00` | amber |
| `danger` | `#FF3D57` | red |
| `information` | `#00D4FF` | cyan |

---

### 5. Lozenge — alinhamento de nomenclatura

#### `Lozenge.vue` — novos tipos e aliases

```ts
export type LozengeAppearance =
  | 'default' | 'success' | 'warning' | 'new'
  | 'inprogress' | 'moved' | 'removed'
  // aliases deprecated:
  | 'progress'  // → inprogress
  | 'danger'    // → removed
```

Mapeamento de aliases no `computed`:
```ts
const aliasMap: Record<string, LozengeAppearance> = {
  progress: 'inprogress',
  danger: 'removed',
}
const resolved = aliasMap[raw] ?? raw
```

Novos estilos para `inprogress` (cyan), `moved` (amber), `removed` (red).

---

### 6. Modal — subcomponentes

#### Novos arquivos

**`ModalTitle.vue`**
```html
<component :is="as" :id="id" class="text-lg font-semibold text-card-foreground">
  <slot />
</component>
```
Props: `id?: string`, `as?: string` (default `'h2'`).

**`ModalHeader.vue`**
```html
<div class="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
  <slot />
  <button v-if="hasCloseButton" @click="emit('close')" aria-label="Fechar" .../>
</div>
```
Props: `hasCloseButton?: boolean`.

**`ModalBody.vue`**
```html
<div class="overflow-y-auto px-6 py-[--ds-space-300]">
  <slot />
</div>
```

**`ModalFooter.vue`**
```html
<div class="flex items-center justify-end gap-[--ds-space-100] px-6 pb-6 pt-4 border-t border-border">
  <slot />
</div>
```

#### `Modal.vue` — atualização

Novas props:
```ts
width?: 'small' | 'medium' | 'large' | 'xlarge'
titleId?: string
```

Mapeamento de width:
```ts
const widthMap = { small: 'max-w-[400px]', medium: 'max-w-[600px]', large: 'max-w-[800px]', xlarge: 'max-w-[968px]' }
```

- Adicionar `aria-labelledby` apontando para `titleId` quando fornecido
- `watch(open)` → ao abrir: `document.body.style.overflow = 'hidden'`; ao fechar: restaurar

---

### 7. Input — elemBefore / elemAfter / compact

#### `Input.vue` — refatorar template

Envolver o `<input>` em um container `<div class="relative flex items-center">`:

```html
<div class="relative flex w-full items-center">
  <span v-if="$slots.elemBefore" class="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
    <slot name="elemBefore" />
  </span>
  <input
    :class="[classes, hasBefore && 'pl-9', hasAfter && 'pr-9']"
    ...
  />
  <span v-if="$slots.elemAfter" class="absolute right-3 flex items-center pointer-events-none text-muted-foreground">
    <slot name="elemAfter" />
  </span>
</div>
```

Prop `size` → `compact` mapeia para `h-7` no CVA (novo value em `formInputVariants.ts`).

---

### 8. Tabs — change event, shouldUnmount, id

#### `Tabs.vue` — adições

```ts
const props = defineProps<{
  shouldUnmountTabPanelOnChange?: boolean
  class?: string
}>()

const emit = defineEmits<{ change: [value: string] }>()

// No setActiveTab:
function setActiveTab(value: string): void {
  activeTab.value = value
  emit('change', value)
}
```

Prover `shouldUnmountTabPanelOnChange` via provide para `TabPanel`.

#### `TabPanel.vue` — suporte a `v-if` vs `v-show`

```ts
const shouldUnmount = inject(TABS_UNMOUNT_KEY, false)
```

Template:
```html
<div v-if="shouldUnmount ? isActive : true" v-show="!shouldUnmount || isActive" ...>
```

---

### 9. Tooltip — delay, shortcut, placements extras

#### `Tooltip.vue` — adições

```ts
props: {
  delay?: number        // default 300
  shortcut?: string
  placement: '...' | 'top-start' | 'top-end'  // ampliar union type
}
```

- `delay`: usar `setTimeout` / `clearTimeout` no `show()` e `hide()`
- `shortcut`: renderizar `<kbd class="ml-2 rounded border px-1 text-[10px]">{{ shortcut }}</kbd>` dentro do tooltip
- `top-start` / `top-end`: adicionar cálculo de posição no `computePosition`

---

### 10. SectionMessage — novo componente

```ts
type SectionMessageAppearance = 'information' | 'warning' | 'error' | 'success' | 'discovery' | 'change'
```

**Estrutura do template:**
```html
<div role="region" :aria-label="title" :class="containerClasses">
  <span class="shrink-0 mt-0.5"><!-- SVG icon baseado em appearance --></span>
  <div class="flex-1 space-y-1">
    <p v-if="title" class="font-semibold text-foreground">{{ title }}</p>
    <div class="text-sm text-muted-foreground"><slot /></div>
    <div v-if="$slots.actions" class="mt-3 flex gap-2"><slot name="actions" /></div>
  </div>
</div>
```

Paleta de cores por appearance (bg/border/icon-color):
| appearance | bg | border | icon |
|---|---|---|---|
| `information` | cyan/10% | cyan/30% | cyan |
| `warning` | amber/10% | amber/30% | amber |
| `error` | red/10% | red/30% | red |
| `success` | teal/10% | teal/30% | teal |
| `discovery` | purple/10% | purple/30% | purple |
| `change` | blue/10% | blue/30% | blue |

---

### 11. Flag / FlagGroup — novos componentes

#### `Flag.vue`

```ts
interface FlagAction { label: string; onClick: () => void }
interface FlagProps {
  title: string
  description?: string
  appearance?: 'normal' | 'warning' | 'error' | 'success' | 'discovery'
  actions?: FlagAction[]
  isDismissible?: boolean
}
```

- `role="alert"` + `aria-live="assertive"` para `error`, `aria-live="polite"` para demais
- Botão fechar com `aria-label="Fechar notificação"`
- Emite evento `dismiss`
- Estilo: card com borda esquerda colorida (4px) por appearance, `bg-card`, `shadow-lg`

#### `FlagGroup.vue`

- `Teleport to="body"` → container `fixed top-4 right-4 z-[300] flex flex-col gap-2`
- Aceita até 3 flags visíveis via slot + controle interno de fila
- Exportar composable `useFlagGroup()` para adicionar flags programaticamente (opcional)

---

### 12. Tag / TagGroup — novos componentes

#### `Tag.vue`

```ts
type TagColor = 'default' | 'blue' | 'teal' | 'red' | 'orange' | 'purple'
interface TagProps {
  text: string
  isRemovable?: boolean
  color?: TagColor
  href?: string
  isLink?: boolean
}
```

- Renderiza como `<a>` se `isLink && href`, senão `<span>`
- Botão remover: `<button aria-label="Remover ${text}" @click="emit('remove', text)">`
- Paleta de cores mapeada para tokens existentes

#### `TagGroup.vue`

```ts
interface TagGroupProps {
  tags?: Array<{ text: string; color?: TagColor; isRemovable?: boolean }>
  label?: string
}
```

```html
<div role="list" :aria-label="label" class="flex flex-wrap gap-[--ds-space-050]">
  <Tag v-for="tag in tags" role="listitem" v-bind="tag" @remove="emit('remove', $event)" />
  <slot />
</div>
```

---

### 13. Heading — nova primitiva tipográfica

#### `Heading.vue`

```ts
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6
type HeadingSize = 'xxlarge' | 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall'
type HeadingColor = 'default' | 'subtle' | 'disabled' | 'inverse'

interface HeadingProps {
  level?: HeadingLevel   // default 2
  size?: HeadingSize     // default derivado do level
  color?: HeadingColor   // default 'default'
  id?: string
  class?: string
}
```

Mapeamento `level → size` padrão: `1→xxlarge`, `2→xlarge`, `3→large`, `4→medium`, `5→small`, `6→xsmall`

Mapeamento `size → font-size token`:
```ts
const sizeMap = {
  xxlarge: 'var(--ds-font-size-xxlarge)', // 32px
  xlarge:  'var(--ds-font-size-xlarge)',  // 24px
  large:   'var(--ds-font-size-large)',   // 20px
  medium:  'var(--ds-font-size-base)',    // 16px
  small:   'var(--ds-font-size-medium)',  // 14px
  xsmall:  'var(--ds-font-size-small)',   // 12px
}
```

```html
<component :is="`h${level}`" :id="id" :style="headingStyle" :class="colorClass">
  <slot />
</component>
```

---

### 14. Text — nova primitiva tipográfica

#### `Text.vue`

```ts
type TextSize = 'large' | 'medium' | 'small' | 'xsmall'
type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold'
type TextColor = 'default' | 'subtle' | 'disabled' | 'inverse' | 'success' | 'warning' | 'danger'

interface TextProps {
  size?: TextSize    // default 'medium'
  weight?: TextWeight // default 'regular'
  color?: TextColor  // default 'default'
  as?: string        // default 'span'
  class?: string
}
```

Mapeamento `size → font-size token`:
```ts
const sizeMap = {
  large:  'var(--ds-font-size-base)',    // 16px
  medium: 'var(--ds-font-size-medium)',  // 14px
  small:  'var(--ds-font-size-small)',   // 12px
  xsmall: 'var(--ds-font-size-xsmall)', // 11px
}
```

Mapeamento `color → CSS token`:
```ts
const colorMap = {
  default:   'var(--ds-color-text-default)',
  subtle:    'var(--ds-color-text-subtle)',
  disabled:  'var(--ds-color-text-disabled)',
  inverse:   'var(--ds-color-text-inverse)',
  success:   'var(--ds-color-text-success)',
  warning:   'var(--ds-color-text-warning)',
  danger:    'var(--ds-color-text-danger)',
}
```

---

### 15. ProgressTracker — novo componente

```ts
interface ProgressStep {
  label: string
  percentageComplete: number  // 0–100
}

interface ProgressTrackerProps {
  steps: ProgressStep[]
  currentIndex: number
  label?: string
}
```

**Template:**
```html
<ol role="list" :aria-label="label" class="flex items-center gap-0">
  <li v-for="(step, i) in steps" :key="i"
    role="listitem"
    :aria-current="i === currentIndex ? 'step' : undefined"
    :class="stepClasses(i)"
    @click="onStepClick(i)"
  >
    <span class="step-indicator"><!-- circle: completed/current/future --></span>
    <span class="step-label text-xs mt-1">{{ step.label }}</span>
    <span v-if="i < steps.length - 1" class="step-connector" />
  </li>
</ol>
```

Estados visuais:
- `completed` (percentageComplete === 100): círculo sólido com ✓, cor `--success`
- `current` (i === currentIndex): círculo com anel, cor `--primary`
- `future`: círculo vazio, cor `--muted-foreground`

---

### 16. Acessibilidade transversal

Mudanças aplicadas em todos os componentes relevantes:

| Componente | Mudança |
|---|---|
| `Button` | `aria-busy` já existe; garantir `aria-disabled` quando `tooltip+disabled` |
| `IconButton` | `aria-label` obrigatório via TypeScript (`Required<>`) |
| `Spinner` | Adicionar `role="status"` e `aria-label` configurável |
| `Input` | `aria-invalid` e `aria-describedby` já implementados (manter) |
| `Alert` / `SectionMessage` | `aria-live` correto por severity |
| `Toast` | Verificar `aria-live="polite"` no ToastHost |
| `Flag` | `aria-live` por appearance conforme descrito acima |
| `Modal` | `aria-labelledby` ligado ao `ModalTitle` |
| `Tooltip` | `role="tooltip"` e `aria-describedby` já existem |

Todos os elementos interativos devem usar `focus-visible:ring-[3px] focus-visible:ring-ring/50` (padrão já estabelecido no projeto).

---

### 17. Exports em `index.ts`

Adicionar ao `index.ts` principal:

```ts
// Typography
export { default as Heading } from './components/typography/Heading.vue'
export { default as Text } from './components/typography/Text.vue'

// Button Group
export { default as ButtonGroup } from './components/button/ButtonGroup.vue'

// Modal sub-components
export { default as ModalHeader } from './components/overlay/ModalHeader.vue'
export { default as ModalBody } from './components/overlay/ModalBody.vue'
export { default as ModalFooter } from './components/overlay/ModalFooter.vue'
export { default as ModalTitle } from './components/overlay/ModalTitle.vue'

// New feedback
export { default as SectionMessage } from './components/feedback/SectionMessage.vue'
export { default as Flag } from './components/feedback/Flag.vue'
export { default as FlagGroup } from './components/feedback/FlagGroup.vue'

// New data-display
export { default as Tag } from './components/data-display/Tag.vue'
export { default as TagGroup } from './components/data-display/TagGroup.vue'
export { default as ProgressTracker } from './components/data-display/ProgressTracker.vue'

// Types
export type { TagColor } from './components/data-display/Tag.vue'
export type { LozengeAppearance } from './components/data-display/Lozenge.vue'
export type { BadgeAppearance } from './components/feedback/badgeVariants'
```

---

### 18. Gradientes (Requisito 20)

#### Tokens de gradiente em `tokens.css`

Adicionar bloco de gradientes após os tokens de cor semântica existentes:

```css
/* ── Gradientes de Marca ── */
--ds-gradient-brand-horizontal: linear-gradient(to right, var(--ds-color-navy-800), var(--ds-color-cyan-500));
--ds-gradient-brand-vertical:   linear-gradient(to bottom, var(--ds-color-navy-800), var(--ds-color-cyan-500));
--ds-gradient-brand-diagonal:   linear-gradient(135deg, var(--ds-color-navy-800), var(--ds-color-cyan-500));

/* Gradiente Hero (para banners e headers) */
--ds-gradient-hero: linear-gradient(135deg, var(--ds-color-navy-900) 0%, var(--ds-color-navy-700) 40%, var(--ds-color-cyan-600) 100%);

/* Gradiente Sutil para Cards */
--ds-gradient-card: linear-gradient(180deg, color-mix(in srgb, var(--ds-color-cyan-500) 5%, transparent) 0%, transparent 100%);

/* Gradiente Overlay/Scrim para imagens */
--ds-gradient-overlay: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%);

/* Gradiente Fade (truncamento de conteúdo) */
--ds-gradient-fade-end:    linear-gradient(to right, transparent, var(--background));
--ds-gradient-fade-bottom: linear-gradient(to bottom, transparent, var(--background));
```

#### Override no tema dark (`theme.css`)

Os gradientes `hero` e `card` já são dark-first por natureza (cores da paleta navy/cyan). Os tokens de fade precisam apontar para o background correto do tema dark:

```css
.dark {
  --ds-gradient-fade-end:    linear-gradient(to right, transparent, var(--background));
  --ds-gradient-fade-bottom: linear-gradient(to bottom, transparent, var(--background));
}
```

Como `--background` é mapeado para o valor dark dentro do seletor `.dark`, essa redeclaração garante que o valor computado de `var(--background)` no contexto dark seja utilizado corretamente.

---

### 19. Border Radius (Requisito 21)

#### Escala primitiva e tokens semânticos em `tokens.css`

```css
/* ── Border Radius — Escala Primitiva ── */
--ds-radius-none: 0px;
--ds-radius-xs:   2px;
--ds-radius-sm:   4px;
--ds-radius-md:   6px;   /* ← existente, preservado */
--ds-radius-lg:   8px;
--ds-radius-xl:   12px;
--ds-radius-2xl:  16px;
--ds-radius-3xl:  24px;
--ds-radius-full: 9999px;

/* ── Border Radius — Tokens Semânticos ── */
--ds-radius-button: var(--ds-radius-md);
--ds-radius-card:   var(--ds-radius-lg);
--ds-radius-input:  var(--ds-radius-md);
--ds-radius-badge:  var(--ds-radius-full);
--ds-radius-tag:    var(--ds-radius-sm);
```

#### Bridge no `@theme inline` de `theme.css`

```css
--radius-none: var(--ds-radius-none);
--radius-xs:   var(--ds-radius-xs);
--radius-sm:   var(--ds-radius-sm);
--radius-md:   var(--ds-radius-md);
--radius-lg:   var(--ds-radius-lg);
--radius-xl:   var(--ds-radius-xl);
--radius-2xl:  var(--ds-radius-2xl);
--radius-3xl:  var(--ds-radius-3xl);
--radius-full: var(--ds-radius-full);
```

**Nota de compatibilidade**: O token `--ds-radius-md` já existe com valor `6px`. A escala primitiva o preserva integralmente, evitando regressões no `Avatar` com `shape="square"` e outros componentes que já o referenciam.

---

### 20. Motion e Animação (Requisito 22)

#### Tokens de motion em `tokens.css`

```css
/* ── Motion — Duração ── */
--ds-motion-duration-instant: 0ms;
--ds-motion-duration-fast:    100ms;
--ds-motion-duration-normal:  200ms;
--ds-motion-duration-slow:    350ms;
--ds-motion-duration-slower:  500ms;

/* ── Motion — Easing ── */
--ds-motion-easing-linear:   linear;
--ds-motion-easing-in:       cubic-bezier(0.4, 0, 1, 1);
--ds-motion-easing-out:      cubic-bezier(0, 0, 0.2, 1);
--ds-motion-easing-in-out:   cubic-bezier(0.4, 0, 0.2, 1);
--ds-motion-easing-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);
```

#### Override `prefers-reduced-motion` em `theme.css`

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --ds-motion-duration-fast:   0ms;
    --ds-motion-duration-normal: 0ms;
    --ds-motion-duration-slow:   0ms;
    --ds-motion-duration-slower: 0ms;
  }
}
```

#### Padrão recomendado para componentes

Todos os componentes com `transition-*` devem referenciar esses tokens em vez de valores literais:

```css
/* Padrão recomendado */
transition: color var(--ds-motion-duration-normal) var(--ds-motion-easing-out),
            background-color var(--ds-motion-duration-normal) var(--ds-motion-easing-out);
```

---

### 21. Shadow Scale (Requisito 23)

#### Escala primitiva e tokens semânticos em `tokens.css`

Substituir/expandir os shadows existentes (mantendo os aliases legados para não quebrar consumidores):

```css
/* ── Shadows — Escala Primitiva ── */
--ds-shadow-none: none;
--ds-shadow-xs:   0 1px 2px 0 rgba(0, 0, 0, 0.05);
--ds-shadow-sm:   0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10);
--ds-shadow-md:   0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -2px rgba(0, 0, 0, 0.10);
--ds-shadow-lg:   0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10);
--ds-shadow-xl:   0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10);
--ds-shadow-2xl:  0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* ── Shadows — Tokens Semânticos ── */
--ds-shadow-card:     var(--ds-shadow-sm);
--ds-shadow-dropdown: var(--ds-shadow-md);
--ds-shadow-modal:    var(--ds-shadow-xl);
--ds-shadow-tooltip:  var(--ds-shadow-md);
```

#### Override no tema dark

Redefinir no seletor `.dark` com opacidades maiores para compensar o fundo escuro:

```css
.dark {
  --ds-shadow-xs:  0 1px 2px 0 rgba(0, 0, 0, 0.30);
  --ds-shadow-sm:  0 1px 3px 0 rgba(0, 0, 0, 0.40), 0 1px 2px -1px rgba(0, 0, 0, 0.40);
  --ds-shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.40), 0 2px 4px -2px rgba(0, 0, 0, 0.40);
  --ds-shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.40), 0 4px 6px -4px rgba(0, 0, 0, 0.40);
  --ds-shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.40), 0 8px 10px -6px rgba(0, 0, 0, 0.40);
  --ds-shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.60);
}
```

Os tokens semânticos (`--ds-shadow-card`, etc.) herdam automaticamente os valores dark via cascade, sem necessidade de redeclaração.

---

### 22. Tokens de Estado Interativo de Surface (Requisito 24)

#### Tokens em `tokens.css`

Adicionar após os tokens `--ds-color-bg-*` existentes:

```css
/* ── Surface — Estados Interativos ── */
--ds-color-bg-hovered:          color-mix(in srgb, var(--foreground) 6%, transparent);
--ds-color-bg-pressed:          color-mix(in srgb, var(--foreground) 10%, transparent);
--ds-color-bg-selected:         color-mix(in srgb, var(--primary) 12%, transparent);
--ds-color-bg-selected-hovered: color-mix(in srgb, var(--primary) 18%, transparent);

/* Variantes contextuais */
--ds-color-bg-brand-hovered:    color-mix(in srgb, var(--primary) 15%, transparent);
--ds-color-bg-brand-pressed:    color-mix(in srgb, var(--primary) 25%, transparent);
--ds-color-bg-danger-hovered:   color-mix(in srgb, var(--destructive) 10%, transparent);
--ds-color-bg-warning-hovered:  color-mix(in srgb, var(--warning) 10%, transparent);
--ds-color-bg-success-hovered:  color-mix(in srgb, var(--success) 10%, transparent);
```

**Nota de tema dark**: Como a base `--foreground` já é uma cor clara no tema dark, `color-mix` com `foreground` produz hover claro sobre fundo escuro — comportamento correto sem necessidade de override adicional na maioria dos casos. Apenas os tokens contextuais que referenciam `--primary`, `--destructive`, etc. precisam ser validados visualmente no dark.

---

### 23. Tokens de Cor para Ícones (Requisito 25)

#### Tokens em `tokens.css`

```css
/* ── Icon Colors ── */
--ds-color-icon-default:    var(--foreground);
--ds-color-icon-subtle:     var(--muted-foreground);
--ds-color-icon-inverse:    var(--primary-foreground);
--ds-color-icon-brand:      var(--primary);
--ds-color-icon-disabled:   color-mix(in srgb, var(--foreground) 35%, transparent);

--ds-color-icon-danger:     var(--destructive);
--ds-color-icon-warning:    var(--warning);
--ds-color-icon-success:    var(--success);
--ds-color-icon-discovery:  var(--ds-color-purple-400);
```

#### Bridge no `@theme inline` de `theme.css`

```css
--color-icon-default:   var(--ds-color-icon-default);
--color-icon-subtle:    var(--ds-color-icon-subtle);
--color-icon-brand:     var(--ds-color-icon-brand);
--color-icon-disabled:  var(--ds-color-icon-disabled);
--color-icon-danger:    var(--ds-color-icon-danger);
--color-icon-warning:   var(--ds-color-icon-warning);
--color-icon-success:   var(--ds-color-icon-success);
--color-icon-discovery: var(--ds-color-icon-discovery);
```

**Uso nos componentes**: Todos os elementos `<svg>` ou wrappers de ícone com cor semântica devem utilizar `color: var(--ds-color-icon-*)` ou equivalente via `fill`/`stroke` referenciando `currentColor`.

---

### 24. Z-Index Scale (Requisito 26)

#### Tokens em `tokens.css`

```css
/* ── Z-Index Scale ── */
--ds-z-base:         0;
--ds-z-card:         1;
--ds-z-navigation:   100;
--ds-z-dropdown:     200;
--ds-z-sticky:       300;
--ds-z-overlay:      400;
--ds-z-modal:        500;
--ds-z-notification: 600;
--ds-z-tooltip:      700;
```

#### Mapeamento de componentes existentes

| Componente | Classe atual | Deve usar |
|---|---|---|
| `Modal` overlay | `z-[50]` | `z-[--ds-z-overlay]` |
| `Modal` dialog | `z-[51]` | `z-[--ds-z-modal]` |
| `FlagGroup` | `z-[300]` | `z-[--ds-z-notification]` |
| `Tooltip` | qualquer `z-[*]` | `z-[--ds-z-tooltip]` |
| `Dropdown/Select` | qualquer `z-[*]` | `z-[--ds-z-dropdown]` |

**Hierarquia garantida**: `--ds-z-tooltip` (700) > `--ds-z-notification` (600) > `--ds-z-modal` (500) > `--ds-z-overlay` (400).

Para situações de sobreposição dentro de um mesmo nível, usar `isolation: isolate` no contêiner pai para criar um contexto de empilhamento local sem alterar os tokens globais.

---

### 25. Border Widths e Styles (Requisito 27)

#### Tokens em `tokens.css`

```css
/* ── Border Widths ── */
--ds-border-width-none:    0px;
--ds-border-width-default: 1px;
--ds-border-width-bold:    2px;
--ds-border-width-thick:   3px;

/* ── Border Styles ── */
--ds-border-style-solid:  solid;
--ds-border-style-dashed: dashed;
--ds-border-style-dotted: dotted;
```

#### Bridge no `@theme inline` de `theme.css`

```css
--border-width-default: var(--ds-border-width-default);
--border-width-bold:    var(--ds-border-width-bold);
--border-width-thick:   var(--ds-border-width-thick);
```

**Nota**: Os tokens `--ds-color-border-*` do Requisito 1 continuam responsáveis pela cor da borda. O Requisito 27 complementa com espessura e estilo. Nenhum override de espessura é necessário no tema dark — apenas os tokens de cor de borda (`--ds-color-border-*`) são ajustados para garantir visibilidade no fundo escuro.

---

### 26. Playground — Aba Foundations (Requisito 28)

#### Estrutura de arquivos sugerida

```
packages/design-system/src/stories/foundations/
├── ColorTokens.stories.ts
├── Gradients.stories.ts
├── Typography.stories.ts
├── Spacing.stories.ts
├── BorderRadius.stories.ts
├── Shadows.stories.ts
├── Motion.stories.ts
├── ZIndex.stories.ts
└── BorderWidths.stories.ts
```

#### Componentes utilitários de documentação

Componentes Vue puros, sem dependências externas, para uso exclusivo nas stories/playground:

| Componente | Uso |
|---|---|
| `<ColorSwatch token="--ds-color-cyan-500" label="Cyan 500" />` | Quadrado colorido + hex resolvido + nome do token |
| `<GradientSwatch token="--ds-gradient-hero" label="Hero" />` | Retângulo 100% × 64px com o gradiente aplicado |
| `<ShadowCard token="--ds-shadow-modal" label="modal" />` | Card branco sobre fundo muted mostrando a sombra |
| `<RadiusPreview token="--ds-radius-xl" label="xl / 12px" />` | Quadrado 64×64 com o border-radius aplicado |
| `<MotionDemo duration="--ds-motion-duration-normal" easing="--ds-motion-easing-spring" />` | Botão que anima ao clicar usando os tokens fornecidos |

#### Implementação dos componentes utilitários

Para exibir o valor computado de qualquer token em tempo real:

```ts
// Utilitário compartilhado
function resolveToken(token: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim()
}
```

O switch de tema dark/light no playground atualiza automaticamente todos os valores exibidos, pois os componentes leem `getComputedStyle` que reflete o estado atual da classe `.dark` no `<html>`.

#### Seções da aba Foundations

| Seção | Story file | Conteúdo |
|---|---|---|
| Color Tokens | `ColorTokens.stories.ts` | Swatches agrupados: primitivos, semânticos, ícones, estado interativo |
| Gradients | `Gradients.stories.ts` | Swatches retangulares de todos os tokens `--ds-gradient-*` |
| Typography Scale | `Typography.stories.ts` | Texto "The quick brown fox" em cada tamanho e peso |
| Spacing Scale | `Spacing.stories.ts` | Régua visual com blocos coloridos + label + valor px |
| Border Radius | `BorderRadius.stories.ts` | Quadrados 64×64 com cada raio da escala primitiva |
| Shadow Scale | `Shadows.stories.ts` | Cards brancos sobre fundo neutro, um por token de sombra |
| Motion | `Motion.stories.ts` | Demo interativa com cada duração × easing |
| Z-Index | `ZIndex.stories.ts` | Diagrama de camadas empilhadas ilustrando a hierarquia |
| Border Widths | `BorderWidths.stories.ts` | Linhas renderizadas com cada espessura + label |

---

## Correctness Properties

As seguintes propriedades de correção serão verificadas por property-based tests (Vitest):

1. **Token resolution**: Para todo token semântico `--ds-color-*`, o valor resolvido no tema dark deve ser diferente do tema light (garantindo que o mapeamento dark funciona).

2. **Badge value cap**: `∀ value ∈ ℤ, value > 99 → displayText === '99+'`

3. **Lozenge alias**: `render(appearance='progress') ≡ render(appearance='inprogress')` — mesmas classes/estilos.

4. **Button width**: `shouldFitContainer=true → elemento.offsetWidth === pai.offsetWidth`

5. **Modal scroll lock**: `open=true → document.body.style.overflow === 'hidden'`; `open=false → overflow restaurado`

6. **Flag queue**: `FlagGroup com N>3 flags → apenas 3 renderizados por vez`

7. **ProgressTracker aria-current**: `∀ i, i === currentIndex → li[i][aria-current] === 'step'`; `i ≠ currentIndex → li[i][aria-current] === undefined`

8. **Tag remove event**: `isRemovable=true, click no botão → evento 'remove' emitido com text correto`

9. **Avatar fallback**: `src com erro de carregamento → initials visíveis, img oculta`

10. **Heading level**: `∀ level ∈ {1..6} → elemento HTML renderizado é h{level}`

11. **Gradient tokens dark**: `∀ gradiente em --ds-gradient-fade-*, tema dark ativo → valor CSS computado diferente do tema light` (pois `var(--background)` resolve para o background escuro)

12. **Border-radius token map**: `render(Avatar, shape='square') → border-radius === getComputedStyle('--ds-radius-md')` (6px)

13. **Motion reduced**: `prefers-reduced-motion: reduce ativo → --ds-motion-duration-normal === '0ms'`

14. **Shadow scale semântica**: `getComputedStyle('--ds-shadow-modal') === getComputedStyle('--ds-shadow-xl')`

15. **Z-index ordering**: `--ds-z-tooltip (700) > --ds-z-notification (600) > --ds-z-modal (500) > --ds-z-overlay (400)`

16. **Icon token presence**: `∀ componente com ícone SVG de cor semântica → cor aplicada via --ds-color-icon-* (não hardcoded)`
