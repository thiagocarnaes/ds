## Why

Os botões nas variantes `ghost` e `outline` exibem texto branco ao passar o mouse (`hover:text-accent-foreground`), que é ilegível no tema claro porque `--accent-foreground` é `#ffffff` em ambos os temas, e o fundo de hover (`--ds-color-bg-hovered`) é quase transparente (apenas 6% do foreground). O resultado é texto branco sobre fundo quase branco.

## What Changes

- Criar o token `--ds-color-text-hovered` em `tokens.css`, usando `var(--accent)` como valor
- Registrar o mapeamento `--color-text-hovered` no `theme.css`
- Substituir `hover:text-accent-foreground` por `hover:text-text-hovered` nos dois locais afetados em `buttonVariants.ts` (ghost e outline)
- Nenhuma mudança em Pagination, DateInput ou outros componentes — o bug não existe neles porque usam `hover:bg-accent` (fundo sólido) + `hover:text-accent-foreground` (branco), que tem contraste normal

## Capabilities

### New Capabilities
- `button-hover-contrast`: Token de cor contextual para hover de botões, resolvendo contraste no tema claro sem quebrar o tema escuro

### Modified Capabilities
Nenhuma — é uma correção localizada que não altera requisitos de capabilities existentes

## Impact

- 3 arquivos: `tokens.css`, `theme.css`, `buttonVariants.ts`
- Nenhum componente externo afetado
- Nenhuma quebra de API ou dependência
