# ds

Monorepo do design system Vue 3 [`@tcarnaes/design-system`](https://www.npmjs.com/package/@tcarnaes/design-system).

- **Repositório:** [github.com/thiagocarnaes/ds](https://github.com/thiagocarnaes/ds)
- **Playground (GitHub Pages):** [thiagocarnaes.github.io/ds](https://thiagocarnaes.github.io/ds/)
- **Pacote npm:** [`@tcarnaes/design-system`](https://www.npmjs.com/package/@tcarnaes/design-system)

## Estrutura

```
packages/design-system/   Biblioteca + playground + testes
```

Documentação de uso, API e exemplos: [`packages/design-system/README.md`](./packages/design-system/README.md).

## Scripts (raiz)

```bash
npm install
npm run dev      # playground local
npm run build    # lib + playground
npm run test     # Vitest
```

## Desenvolvimento

```bash
cd packages/design-system
npm run dev              # http://localhost:5173
npm run build:lib        # apenas a biblioteca (dist/)
npm run build:playground # apenas o playground (GitHub Pages)
```

## Licença

MIT
