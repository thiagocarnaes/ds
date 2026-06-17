# ds

Monorepo do design system Vue 3 [`@tcarnaes/design-system`](https://www.npmjs.com/package/@tcarnaes/design-system).

- **Repositório:** [github.com/thiagocarnaes/ds](https://github.com/thiagocarnaes/ds)
- **Playground (GitHub Pages):** [thiagocarnaes.github.io/ds](https://thiagocarnaes.github.io/ds/)
- **Pacote npm:** [`@tcarnaes/design-system`](https://www.npmjs.com/package/@tcarnaes/design-system) · v0.2.3

## O que tem aqui

- **58 componentes Vue 3** exportados (forms, feedback, layout, overlay, data display, etc.)
- **Playground** com demos interativos, catálogo **Library**, documentação de instalação, snippets **Usage** ao vivo e i18n **EN / pt-BR**
- **28 playgrounds** no drawer + seção **Showcase** (ex.: AI Chat — caso de uso composto, fora do catálogo da lib)
- Design tokens, Tailwind CSS 4, light/dark mode, Vitest

Documentação de uso, API e exemplos: [`packages/design-system/README.md`](./packages/design-system/README.md).

## Estrutura

```
packages/design-system/   Biblioteca + playground + testes
```

## Scripts (raiz)

```bash
npm install
npm run dev      # playground local → http://localhost:5173
npm run build    # lib + playground
npm run test     # Vitest
```

## Desenvolvimento

```bash
cd packages/design-system
npm run dev              # playground
npm run build:lib        # apenas a biblioteca (dist/)
npm run build:playground # apenas o playground (GitHub Pages)
```

## Licença

MIT
