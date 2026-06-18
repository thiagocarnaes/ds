# @tcarnaes/design-system

Biblioteca de componentes **Vue 3** com design tokens, Tailwind CSS 4 e suporte a **light/dark mode**.

- **npm:** [`@tcarnaes/design-system`](https://www.npmjs.com/package/@tcarnaes/design-system)
- **Repositório:** [github.com/thiagocarnaes/ds](https://github.com/thiagocarnaes/ds)
- **Playground:** [thiagocarnaes.github.io/ds](https://thiagocarnaes.github.io/ds/)

## Requisitos

- **Vue** `^3.5.0` (peer dependency)
- **Node.js** 18+

## Instalação

```bash
npm install @tcarnaes/design-system vue
```

## Configuração rápida

### 1. Importe os estilos

No entry point da aplicação (ex.: `main.ts`):

```ts
import { createApp } from 'vue'
import App from './App.vue'
import '@tcarnaes/design-system/styles.css'

createApp(App).mount('#app')
```

### 2. Use os componentes

```vue
<script setup lang="ts">
import { Button, Input, FormField } from '@tcarnaes/design-system'
</script>

<template>
  <FormField :label="'Email'">
    <Input v-model="email" :placeholder="'you@company.com'" />
  </FormField>

  <Button :variant="'primary'">Salvar</Button>
</template>
```

### 3. Dark mode (opcional)

Adicione a classe `dark` no `<html>` para usar os tokens escuros:

```html
<html lang="pt-BR" class="dark">
```

Ou alterne em runtime:

```ts
document.documentElement.classList.toggle('dark', isDark)
```

## Playground

O playground local (`npm run dev`) inclui:

- **Home** — cards interativos por categoria (forms, layout, feedback, foundations)
- **Library** — catálogo dos **58 componentes** com descrição, snippet de uso e botão *Abrir playground* quando houver demo
- **Docs** — instalação, toasts, DataTable, dark mode
- **32 demos no drawer** — Button, IconButton, Link, Input, Textarea, Label, DateInput, FormField, DataTable, Layout, Dialog, etc.; controles atualizam o snippet **Usage** em tempo real
- **Showcase** — demos compostos (ex.: AI Chat), não exportados como componente da lib
- **i18n** — inglês e português (pt-BR)

Subcomponentes da Library (ex.: `TabPanel`, `AppLayout`, `PageSizeSelect`) abrem o demo do componente pai via mapeamento interno.

## Formulários

### Input com ícone (composição)

`Input` e `FormField` **não** têm prop `icon`. Ícones entram no slot do `FormField` com um wrapper `relative`:

```vue
<script setup lang="ts">
import { Mail } from 'lucide-vue-next'
import { FormField, Input } from '@tcarnaes/design-system'
</script>

<template>
  <FormField :label="'Email'" :required="true">
    <template #default="{ id }">
      <div class="relative">
        <Mail
          :size="14"
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input :id="id" v-model="email" :type="'email'" class="pl-9" />
      </div>
    </template>
  </FormField>
</template>
```

### Switch vs Toggle

| Componente | Uso |
|------------|-----|
| **`Switch`** | Controle pill on/off (`role="switch"`), tamanho `sm` / `md` |
| **`Toggle`** | Linha de preferência: label + `Switch` (setting row com borda) |

`Input`, `Textarea`, `DateInput` e `Badge` aceitam `:size` (`sm` / `md` / `lg` em inputs; `Badge` só `sm` | `md`).

### DateInput

Campo de data com calendário e formato por locale (ex.: `dd/mm/aaaa` em pt-BR):

```vue
<DateInput v-model="date" :locale="'pt-BR'" />
```

## Card

Um único componente `Card` com slots — não há `CardHeader` / `CardContent` / `CardFooter` separados:

```vue
<Card :variant="'outlined'">
  <template #header>
    <h3 class="font-semibold">Título</h3>
  </template>

  Conteúdo principal.

  <template #footer>
    <Button :variant="'primary'">Salvar</Button>
  </template>
</Card>
```

Variantes: `elevated` | `outlined` | `flat`.

## DataTable

Tabela completa com busca global, **multi-sort** (Ctrl+click / ⌘+click), filtros por coluna, paginação e seletor de linhas por página.

### Colunas

```ts
import type { DataTableColumn } from '@tcarnaes/design-system'

const columns: DataTableColumn[] = [
  { key: 'name', label: 'Nome', sortable: true, filter: 'text' },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    filter: 'enum',
    filterOptions: [
      { label: 'Ativo', value: 'active' },
      { label: 'Inativo', value: 'inactive' },
    ],
  },
  { key: 'createdAt', label: 'Criado em', sortable: true, filter: 'date' },
]
```

Tipos de filtro: `'text'` | `'date'` (de/até) | `'enum'` (multi-select). O ícone de filtro no header abre um popover por coluna.

### Uso client-side

```vue
<script setup lang="ts">
import { DataTable, Lozenge } from '@tcarnaes/design-system'
import type { DataTableColumnFilters, DataTableSortEntry } from '@tcarnaes/design-system'
import { ref } from 'vue'

const columns = [/* ... */]
const rows = ref([/* ... */])
const page = ref(1)
const pageSize = ref(10)
const sortStack = ref<DataTableSortEntry[]>([])
const columnFilters = ref<DataTableColumnFilters>({})
</script>

<template>
  <DataTable
    v-model:sort-stack="sortStack"
    v-model:column-filters="columnFilters"
    v-model:page-size="pageSize"
    v-model:current-page="page"
    :columns="columns"
    :rows="rows"
    :row-key="'id'"
  >
    <template #cell-status="{ value }">
      <Lozenge :variant="'success'">{{ value }}</Lozenge>
    </template>
  </DataTable>
</template>
```

- **Clique** no header: ordena uma coluna (`asc` → `desc` → limpa)
- **Ctrl+click** (⌘+click no Mac): adiciona coluna ao multi-sort (sem limite)
- **Filtro:** botão ao lado do sort em colunas com `filter` definido

### Uso server-side

```vue
<DataTable
  v-model:search="search"
  v-model:current-page="page"
  v-model:page-size="pageSize"
  v-model:sort-stack="sortStack"
  v-model:column-filters="columnFilters"
  :columns="columns"
  :rows="rows"
  :total="total"
  :loading="loading"
  :server-side="true"
  :row-key="'id'"
  @request="loadFromApi"
/>
```

O evento `@request` envia `DataTableRequestParams` (`page`, `pageSize`, `search`, `sortStack`, `columnFilters`).

## Toasts

Monte o `ToastHost` uma vez no layout raiz e dispare toasts pelo composable:

```vue
<script setup lang="ts">
import { ToastHost, useToast } from '@tcarnaes/design-system'

const toast = useToast()

function onSave() {
  toast.success('Alterações salvas.')
}
</script>

<template>
  <ToastHost />
  <Button :variant="'primary'" @click="onSave">Salvar</Button>
</template>
```

Posições disponíveis: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`.

```ts
toast.error('Falha ao salvar.', {
  position: 'bottom-center',
  dismissible: true,
})
```

Variantes: `success` | `error` | `info` | `warning` — fundo semântico opaco com borda na mesma cor.

## Overlay

### Popover e Tooltip

Ambos usam `:variant` (não `appearance`):

| Variant | Visual |
|---------|--------|
| `outline` | Fundo sólido (`bg-popover`) com borda neutra — **padrão** |
| `primary` | Fundo sólido neutro, sem borda |
| `ghost` | Fundo translúcido com `backdrop-blur` |
| `danger` | Tinta destructive translúcida, texto claro |

```vue
<script setup lang="ts">
import { Button, Popover, Tooltip } from '@tcarnaes/design-system'
</script>

<template>
  <Popover :variant="'outline'">
    <template #trigger>
      <Button :variant="'outline'">Abrir</Button>
    </template>
    <template #content>
      <p class="mb-2 text-sm font-medium">Ações rápidas</p>
      <p class="text-xs opacity-80">Conteúdo ancorado ao trigger.</p>
    </template>
  </Popover>

  <Tooltip :content="'Dica útil'" :variant="'ghost'" :placement="'top'">
    <Button :variant="'outline'">Hover</Button>
  </Tooltip>
</template>
```

### Drawer

Painel deslizante com `:placement="'left' | 'right' | 'top' | 'bottom'"` e `:close-on-overlay="false"` opcional.

## Exemplos por categoria

### Formulários

```vue
<script setup lang="ts">
import {
  Checkbox,
  DateInput,
  FormField,
  Input,
  Select,
  Switch,
  Toggle,
} from '@tcarnaes/design-system'
import { ref } from 'vue'

const name = ref('')
const date = ref('')
const role = ref('')
const terms = ref(false)
const notifications = ref(true)
</script>

<template>
  <FormField :label="'Nome'" :required="true">
    <Input v-model="name" />
  </FormField>

  <FormField :label="'Data'">
    <DateInput v-model="date" :locale="'pt-BR'" />
  </FormField>

  <FormField :label="'Função'">
    <Select
      v-model="role"
      :placeholder="'Selecione...'"
      :options="[
        { label: 'Designer', value: 'design' },
        { label: 'Engineer', value: 'eng' },
      ]"
    />
  </FormField>

  <Checkbox v-model="terms">Aceito os termos</Checkbox>
  <Toggle v-model="notifications">Notificações</Toggle>
  <Switch v-model="notifications" :size="'sm'" />
</template>
```

### Feedback

```vue
<script setup lang="ts">
import { Alert, Badge, Progress, Skeleton, Spinner } from '@tcarnaes/design-system'
</script>

<template>
  <Alert :variant="'success'">Deploy concluído.</Alert>
  <Alert :variant="'error'" :dismissible="true">Falha na build.</Alert>
  <Badge :value="12" :variant="'primary'" :size="'md'" />
  <Lozenge :variant="'success'">Ativo</Lozenge>
  <Progress :value="72" />
  <Skeleton class="h-8 w-full" />
  <Spinner :aria-label="'Carregando'" />
  <!-- Sem glow: <Spinner :glow="false" :aria-label="'Carregando'" /> -->
</template>
```

### Layout

`AppLayout` organiza as regiões da página (grid + painel lateral), mas **não estiliza** header, menu, conteúdo, panel ou footer. Use `#menu-items` (e opcionalmente `#settings-menu` / `#menu-toggle`) — o shell do menu, toggle e grupo de settings no rodapé já vêm montados — veja o demo **Layout** no playground.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { AppLayout, Button, SidebarMenuItem } from '@tcarnaes/design-system'

const menuCollapsed = ref(false)
const panelOpen = ref(false)
const menuWidth = ref('12rem')
const menuCollapsedWidth = ref('3rem')
const menuLabel = ref('Navigation')
const activeId = ref('dashboard')
const openKeys = ref<string[]>([])
const settingsMenu = ref(true)
const settingsMenuLabel = ref('Settings')
const pageTitle = ref('Dashboard')
</script>

<template>
  <AppLayout
    v-model:menu-collapsed="menuCollapsed"
    v-model:panel-open="panelOpen"
    v-model:active-menu-id="activeId"
    v-model:open-menu-keys="openKeys"
    class="min-h-svh"
    :menu-width="menuWidth"
    :menu-collapsed-width="menuCollapsedWidth"
    :menu-label="menuLabel"
    :settings-menu="settingsMenu"
    :settings-menu-label="settingsMenuLabel"
  >
    <template #header>
      <div class="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <h1 class="text-sm font-semibold text-foreground">My App</h1>
      </div>
    </template>

    <template #menu-items>
      <SidebarMenuItem :id="'dashboard'" :label="'Dashboard'" />
    </template>

    <template #settings-menu>
      <SidebarMenuItem :id="'settings.profile'" :label="'Profile'" />
    </template>

    <div class="flex flex-col gap-4 p-6">
      <p class="text-sm text-muted-foreground">{{ pageTitle }}</p>
      <Button :variant="'outline'" :size="'sm'" @click="panelOpen = true">View details</Button>
    </div>

    <template #panel="{ closePanel }">
      <div class="flex flex-col gap-4 border-l border-border p-6">
        <button type="button" class="self-end text-xs text-muted-foreground hover:text-foreground" @click="closePanel()">
          Close
        </button>
      </div>
    </template>

    <template #footer>
      <div class="border-t border-border bg-card px-4 py-2 text-xs text-muted-foreground">
        Footer
      </div>
    </template>
  </AppLayout>
</template>
```

**Settings no rodapé:** `:settings-menu="true"` fixa um grupo com ícone de engrenagem no final do menu; os itens vão em `#settings-menu`. Props: `settings-menu-label`, `settings-menu-id`.

**IDs do menu lateral**

- Itens de topo **fora** de um grupo não devem compartilhar o prefixo do grupo (evite `todos.all` ao lado do grupo `todos` — prefira `all` ou ids dentro do grupo, ex. `todos.active`).
- Com `v-model:active-menu-id` vazio, o primeiro `SidebarMenuItem` registrado é selecionado automaticamente.
- Flyouts perto do rodapé abrem para cima (`flyout-placement="up"` no settings do `AppLayout`; `SidebarMenuGroup` aceita `'auto' | 'down' | 'up'`).

O slot **default** (conteúdo) ocupa 100% da altura disponível — use `class="min-h-svh"` no `AppLayout` (ou `height: 100%` em `html`, `body` e `#app`). Header, panel e footer continuam compostos por você com classes Tailwind.

### Ícones no Button

Variantes: `default` | `primary` | `secondary` | `outline` | `ghost` | `destructive` | `link` · tamanhos: `default` | `sm` | `md` | `lg` | `icon`.

`appearance` ainda funciona em runtime como alias legado (`danger` → `destructive`, `primary` → `primary`, etc.), mas prefira `:variant`.

```vue
<script setup lang="ts">
import { Button } from '@tcarnaes/design-system'
</script>

<template>
  <Button :variant="'primary'" :size="'md'" :icon="'zap'">Action</Button>
</template>
```

Mais de 300 ícones disponíveis via `iconography`, `buttonIcons` e `iconographySelectOptions`.

## Componentes exportados

| Categoria | Componentes |
|-----------|-------------|
| **Actions** | `Button`, `IconButton`, `Link` |
| **Forms** | `Input`, `DateInput`, `Textarea`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Toggle`, `Select`, `Label`, `FormField` |
| **Feedback** | `Alert`, `Badge`, `Spinner`, `Progress`, `Skeleton`, `Toast`, `ToastHost` |
| **Navigation** | `Tabs`, `TabList`, `Tab`, `TabPanel`, `Breadcrumb`, `BreadcrumbItem`, `Pagination`, `SidebarMenu*` |
| **Data display** | `Card`, `Divider`, `Avatar`, `AvatarGroup`, `Lozenge`, `Table*`, `DataTable`, `DataTableColumnFilter*`, `PageSizeSelect`, `List`, `ListItem`, `EmptyState` |
| **Overlay** | `Modal`, `Dialog`, `Tooltip`, `Popover`, `Drawer` |
| **Layout** | `Container`, `Stack`, `Grid`, `AppLayout` |
| **Utils** | `cn`, `useToast`, `buttonVariants`, `iconography` |

`Pagination` inclui botões de primeira/última página (`«` `»`).

## TypeScript

Tipos incluídos no pacote — não é necessário `@types` separado.

```ts
import type {
  ButtonIconName,
  DataTableColumn,
  DataTableColumnFilters,
  DataTableRequestParams,
  DataTableSortEntry,
  SelectOption,
  SortDirection,
  ToastPosition,
} from '@tcarnaes/design-system'
```

## Desenvolvimento local

```bash
npm install
npm run dev
```

Playground em [http://localhost:5173](http://localhost:5173).

```bash
npm run build:lib        # biblioteca → dist/
npm run build:playground # playground estático (GitHub Pages)
npm run test             # Vitest
```

## Licença

MIT
