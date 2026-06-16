## Why

O repositório precisa de uma biblioteca de componentes Vue 3 alinhada visualmente ao design system definido no Figma Make ([Criar design system](https://www.figma.com/make/mKLQl7ztUfChQ0jDJtxDMw/Criar-design-system)), para que o app TodoList e futuros consumidores reutilizem UI consistente, acessível e testável sem recriar estilos manualmente.

## What Changes

- Scaffold do monorepo/pacote com **Vite**, **Vue 3**, **TypeScript** e **Tailwind CSS**
- Mapeamento de **design tokens** (cores, tipografia, espaçamento, radius, sombras) do Figma para tema Tailwind
- Implementação de todos os componentes do design system em Vue 3 (Composition API + `<script setup>`)
- Exportação tipada via barrel (`index.ts`) e documentação mínima de uso por componente
- Suite de testes unitários (Vitest + Vue Test Utils) e Storybook ou playground Vite para validação visual
- Integração inicial com o app TodoList como consumidor de referência

## Capabilities

### New Capabilities

- `project-scaffold`: Estrutura Vite + Vue 3 + Tailwind + Vitest para o pacote de design system
- `design-tokens`: Tokens de cor, tipografia, espaçamento, bordas e sombras espelhando o Figma
- `action-components`: Button, IconButton, Link
- `form-components`: Input, Textarea, Select, Checkbox, Radio, Switch, Label, FormField
- `feedback-components`: Alert, Badge, Spinner, Progress, Skeleton, Toast
- `navigation-components`: Tabs, Breadcrumb, Pagination
- `data-display-components`: Card, Avatar, Table, List, EmptyState, Divider
- `overlay-components`: Modal, Dialog, Tooltip, Popover, Drawer
- `layout-components`: Container, Stack, Grid

### Modified Capabilities

_(nenhuma — não existem specs em `openspec/specs/` ainda)_

## Não-Objetivos

- Reimplementar o app TodoList completo nesta change (apenas consumo de referência)
- Suporte a React, Angular ou outros frameworks
- Publicação no npm registry ou CI/CD de release
- Paridade pixel-perfect sem revisão visual contra o Figma durante a implementação
- Componentes não presentes no arquivo Figma Make (escopo fechado ao inventário do design system)

## Impact

- Nova pasta `packages/design-system/` (ou estrutura equivalente) com código-fonte, testes e build
- Novas dependências: `vue`, `tailwindcss`, `@vitejs/plugin-vue`, `vitest`, `@vue/test-utils`
- Configuração Tailwind estendida com tokens do Figma
- App TodoList passará a importar componentes do pacote interno
- CHANGELOG na raiz atualizado a cada entrega incremental
