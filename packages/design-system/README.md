# @tcarnaes/design-system

Biblioteca de componentes **Vue 3** com design tokens, Tailwind CSS 4 e suporte a **light/dark mode**.

Inspirada no [Dsci](https://github.com/thiagocarnaes/Dsci) e no design system do Figma.

## Requisitos

- **Vue** `^3.5.0`
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
  FormField,
  Input,
  Select,
  Switch,
  Toggle,
} from '@tcarnaes/design-system'
import { ref } from 'vue'

const name = ref('')
const role = ref('')
const terms = ref(false)
const notifications = ref(true)
</script>

<template>
  <FormField label="Nome" required>
    <Input v-model="name" />
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
import { Alert, Badge, Progress, Spinner } from '@tcarnaes/design-system'
</script>

<template>
  <Alert variant="success">Deploy concluído.</Alert>
  <Alert variant="error" dismissible>Falha na build.</Alert>
  <Badge :value="12" appearance="primary" />
  <Progress :value="72" />
  <Spinner aria-label="Carregando" />
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
        <Stack gap="md">
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
| **Forms** | `Input`, `Textarea`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Toggle`, `Select`, `Label`, `FormField` |
| **Feedback** | `Alert`, `Badge`, `Spinner`, `Progress`, `Skeleton`, `Toast`, `ToastHost` |
| **Navigation** | `Tabs`, `TabList`, `Tab`, `TabPanel`, `Breadcrumb`, `BreadcrumbItem`, `Pagination`, `SidebarMenu*` |
| **Data display** | `Card`, `Divider`, `Avatar`, `AvatarGroup`, `Lozenge`, `Table*`, `List`, `ListItem`, `EmptyState` |
| **Overlay** | `Modal`, `Dialog`, `Tooltip`, `Popover`, `Drawer` |
| **Layout** | `Container`, `Stack`, `Grid`, `AppLayout` |
| **Utils** | `cn`, `useToast`, `buttonVariants`, `iconography` |

## TypeScript

Tipos incluídos em `@tcarnaes/design-system` — não é necessário `@types` separado.

```ts
import type { ButtonIconName, SelectOption, ToastPosition } from '@tcarnaes/design-system'
```

## Desenvolvimento local

```bash
npm install
npm run dev
```

Playground em `http://localhost:5173`.

Build da biblioteca:

```bash
npm run build:lib
```

## Licença

MIT
