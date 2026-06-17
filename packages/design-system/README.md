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
  <FormField label="Email">
    <Input v-model="email" placeholder="you@company.com" />
  </FormField>

  <Button appearance="primary">Salvar</Button>
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
- **28 demos no drawer** — Button, Input, DateInput, FormField, DataTable, Layout, Dialog, etc.
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
  <FormField label="Email" required>
    <template #default="{ id }">
      <div class="relative">
        <Mail
          :size="14"
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input :id="id" v-model="email" type="email" class="pl-9" />
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

### DateInput

Campo de data com calendário e formato por locale (ex.: `dd/mm/aaaa` em pt-BR):

```vue
<DateInput v-model="date" locale="pt-BR" />
```

## Card

Um único componente `Card` com slots — não há `CardHeader` / `CardContent` / `CardFooter` separados:

```vue
<Card variant="outlined">
  <template #header>
    <h3 class="font-semibold">Título</h3>
  </template>

  Conteúdo principal.

  <template #footer>
    <Button appearance="primary">Salvar</Button>
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
    row-key="id"
  >
    <template #cell-status="{ value }">
      <Lozenge appearance="success">{{ value }}</Lozenge>
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
  server-side
  row-key="id"
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
  <Button appearance="primary" @click="onSave">Salvar</Button>
</template>
```

Posições disponíveis: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`.

```ts
toast.error('Falha ao salvar.', {
  position: 'bottom-center',
  dismissible: true,
})
```

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
  <FormField label="Nome" required>
    <Input v-model="name" />
  </FormField>

  <FormField label="Data">
    <DateInput v-model="date" locale="pt-BR" />
  </FormField>

  <FormField label="Função">
    <Select
      v-model="role"
      placeholder="Selecione..."
      :options="[
        { label: 'Designer', value: 'design' },
        { label: 'Engineer', value: 'eng' },
      ]"
    />
  </FormField>

  <Checkbox v-model="terms">Aceito os termos</Checkbox>
  <Toggle v-model="notifications">Notificações</Toggle>
  <Switch v-model="notifications" size="sm" />
</template>
```

### Feedback

```vue
<script setup lang="ts">
import { Alert, Badge, Progress, Skeleton, Spinner } from '@tcarnaes/design-system'
</script>

<template>
  <Alert variant="success">Deploy concluído.</Alert>
  <Alert variant="error" dismissible>Falha na build.</Alert>
  <Badge :value="12" appearance="primary" />
  <Progress :value="72" />
  <Skeleton class="h-8 w-full" />
  <Spinner aria-label="Carregando" />
  <!-- Sem glow: <Spinner :glow="false" aria-label="Carregando" /> -->
</template>
```

### Layout

```vue
<script setup lang="ts">
import { AppLayout, Container, Stack } from '@tcarnaes/design-system'
</script>

<template>
  <AppLayout>
    <template #header>Header</template>
    <template #menu>Menu</template>
    <template #default>
      <Container>
        <Stack :gap="4">
          <p>Conteúdo principal</p>
        </Stack>
      </Container>
    </template>
    <template #footer>Footer</template>
  </AppLayout>
</template>
```

### Ícones no Button

```vue
<script setup lang="ts">
import { Button } from '@tcarnaes/design-system'
</script>

<template>
  <Button appearance="primary" icon="zap">Action</Button>
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
