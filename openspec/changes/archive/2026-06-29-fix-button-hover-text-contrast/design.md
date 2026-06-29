## Context

O token `--accent-foreground` é `#ffffff` em ambos os temas (light e dark). As variantes `ghost` e `outline` do Button usam `hover:text-accent-foreground` com `hover:bg-[--ds-color-bg-hovered]` (fundo a 6% de opacidade do foreground). No tema claro, isso produz texto branco sobre fundo quase transparente — ilegível.

Os componentes Pagination e DateInput têm hover com `hover:bg-accent` (fundo azul sólido) + `hover:text-accent-foreground` (texto branco), que funciona normalmente. O bug é específico dos casos onde o fundo de hover é transparente/tênue.

## Goals / Non-Goals

**Goals:**
- Criar token `--ds-color-text-hovered` com valor contextual que funcione em ambos os temas
- Corrigir o contraste do hover nas variantes `ghost` e `outline` do Button
- Manter consistência com a convenção de nomenclatura existente (`--ds-color-bg-hovered` → `--ds-color-text-hovered`)

**Non-Goals:**
- Não alterar o comportamento de Pagination, DateInput ou outros componentes
- Não modificar o token `--accent-foreground` existente
- Não adicionar pressed state (apenas hovered, seguindo o escopo do bug)

## Decisions

| Decisão | Opção escolhida | Alternativa descartada |
|---------|----------------|------------------------|
| **Valor do token** | `var(--accent)` — azul `#2979ff` em ambos os temas | `color-mix(in srgb, var(--foreground) 80%, var(--accent))` — mais complexo, sem ganho real |
| **Nome do token** | `--ds-color-text-hovered` — segue exatamente o padrão de `--ds-color-bg-hovered` | `--ds-color-text-accent-hovered` — redundante, o token semântico já existe |
| **Pressed simétrico** | Não criar `--ds-color-text-pressed` agora | Poderia ser adicionado futuramente se houver pressed state em botões ghost/outline |
| **Escopo da troca** | Apenas ghost e outline em `buttonVariants.ts` | Pagination e DateInput mantêm `hover:text-accent-foreground` porque o fundo azul sólido dá contraste adequado |

## Risks / Trade-offs

- **Regressão visual em dark theme**: Baixo — `#2979ff` sobre fundo escuro mantém contraste WCAG AA+ (ratio ~5.5:1 contra `#060d18`)
- **Consistência dos hovers**: Ghost/outline vão usar azul no hover; Pagination/DateInput já usam azul como fundo + branco como texto. São abordagens diferentes mas intencionais — cada uma funciona no seu contexto
- **Futura mudança de `--accent`**: Se o accent color mudar, o hover dos botões ghost/outline acompanha automaticamente
