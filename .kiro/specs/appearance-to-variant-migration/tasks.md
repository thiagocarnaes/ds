# Implementation Plan

## Overview

Migração da prop `appearance` → `variant` nos três componentes afetados (`SectionMessage.vue`, `Flag.vue`, `Button.vue`), seguindo o workflow bugfix com metodologia de bug condition. As tasks seguem a ordem: exploração (confirmar o bug) → preservação (capturar baseline) → implementação → checkpoint.

## Tasks

- [x] 1. Escrever teste de exploração da bug condition
  - **Property 1: Bug Condition** - appearance exposta em vez de variant nos três componentes
  - **CRITICAL**: Este teste DEVE FALHAR no código não corrigido — a falha confirma que o bug existe
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: O teste codifica o comportamento esperado — ele validará a correção quando passar após a implementação
  - **GOAL**: Produzir counterexamples que demonstrem o bug concretamente
  - **Scoped PBT Approach**: Escopo às instâncias concretas dos três componentes afetados para garantir reprodutibilidade
  - Criar `packages/design-system/tests/AppearanceToVariant.bug.pbt.spec.ts`
  - **SectionMessage — isBugCondition**: `'variant' NOT IN componentPropDefinitions(SectionMessage) AND 'appearance' IN componentPropDefinitions(SectionMessage)` → montar `<SectionMessage variant="error" />` e verificar que o `aria-live` é `"assertive"` e o background usa `--ds-color-red-500` — **falhará** no código não corrigido pois `variant` não existe e o default `'information'` (cyan) é usado
  - **Flag — isBugCondition**: `'variant' NOT IN componentPropDefinitions(Flag) AND 'appearance' IN componentPropDefinitions(Flag)` → montar `<Flag variant="warning" title="t" />` e verificar que o `borderLeftColor` é `var(--ds-color-amber-500)` — **falhará** no código não corrigido pois `variant` é ignorada e `normal` (cyan) é usado
  - **Button — isBugCondition**: `'appearance' IN componentPropDefinitions(Button) AND resolvedVariant gives precedence to props.appearance OVER props.variant` → montar `<Button appearance="primary" variant="ghost" />` e verificar que a classe resultante corresponde a `ghost`, não `primary` — **falhará** no código não corrigido pois `appearance` tem precedência em `resolvedVariant`
  - Usar `fc.constantFrom` para iterar sobre os valores válidos de variant de cada componente
  - Executar no código não corrigido e documentar os counterexamples encontrados
  - **EXPECTED OUTCOME**: Testes FALHAM (isto é correto — prova que o bug existe)
  - Marcar a task como completa quando os testes estiverem escritos, executados e a falha documentada
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Escrever testes de preservação por property-based testing (ANTES de implementar a correção)
  - **Property 2: Preservation** - comportamentos não relacionados à variante devem permanecer idênticos
  - **IMPORTANT**: Seguir metodologia observation-first — observar no código não corrigido, depois escrever o teste
  - Criar `packages/design-system/tests/AppearanceToVariant.preservation.pbt.spec.ts`
  - **Observar no código não corrigido (¬C(X)):**
    - `Flag` com `isDismissible=true` e `appearance='normal'` (default) → botão de fechar existe, evento `dismiss` é emitido
    - `Flag` com `isDismissible=false` → botão de fechar ausente
    - `SectionMessage` com slot padrão preenchido e `appearance='information'` (default) → conteúdo do slot renderiza no local correto
    - `SectionMessage` com slot `actions` preenchido → slot `actions` renderiza abaixo do conteúdo
    - `Button` com `isSelected=true` → classes `ring-2 ring-ring` presentes
    - `Button` com `loading=true` → `aria-busy="true"` e spinner renderizado
    - `Button` com `disabled=true` → não emite `click`
    - `Button` com `shouldFitContainer=true` → classe `w-full` presente
    - `Flag` com `aria-live` para `appearance='error'` → `"assertive"`; demais appearances → `"polite"`
    - `SectionMessage` com `aria-live` para `appearance='error'` → `"assertive"`; demais appearances → `"polite"`
  - **Escrever propriedades PBT:**
    - `fc.boolean()` para `isDismissible`: para todo valor boolean, o botão de fechar aparece ↔ `isDismissible === true`
    - `fc.constantFrom(...SectionMessageAppearance values)` (usando `appearance` pois ainda não corrigido): para qualquer variant, `variantConfig` retorna objeto com `bg`, `border` e `icon` não-vazios
    - `fc.record({ isSelected: fc.boolean(), loading: fc.boolean(), shouldFitContainer: fc.boolean() })`: combinações de props booleanas do Button produzem classes CSS consistentes com cada prop individualmente
    - `fc.constantFrom('error', 'normal', 'warning', 'success', 'discovery')` para `Flag`: `aria-live` é `"assertive"` ↔ variant é `'error'`
    - `fc.constantFrom('error', 'information', 'warning', 'success', 'discovery', 'change')` para `SectionMessage`: `aria-live` é `"assertive"` ↔ variant é `'error'`
  - Executar no código não corrigido
  - **EXPECTED OUTCOME**: Testes PASSAM no código não corrigido (confirma baseline de comportamento a preservar)
  - Marcar a task como completa quando os testes estiverem escritos, executados e passando no código não corrigido
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 3. Migração appearance → variant nos três componentes

  - [x] 3.1 Migrar `SectionMessage.vue`
    - Renomear tipo exportado: `SectionMessageAppearance` → `SectionMessageVariant`
    - Renomear prop na interface: `appearance?: SectionMessageAppearance` → `variant?: SectionMessageVariant`
    - Atualizar `withDefaults`: `appearance: 'information'` → `variant: 'information'`
    - Renomear computed interno: `appearanceConfig` → `variantConfig`; substituir `props.appearance` → `props.variant` e `Record<SectionMessageAppearance, ...>` → `Record<SectionMessageVariant, ...>`
    - Atualizar `ariaLive` computed: `props.appearance === 'error'` → `props.variant === 'error'`
    - Atualizar template: substituir todas as ocorrências de `appearance ===` nos `v-if`/`v-else-if` por `variant ===`
    - Atualizar JSDoc: referências a "appearance" → "variant"
    - _Bug_Condition: `'variant' NOT IN componentPropDefinitions(SectionMessage) AND 'appearance' IN componentPropDefinitions(SectionMessage)`_
    - _Expected_Behavior: `variant` é a única prop de controle visual; para cada valor válido de `SectionMessageVariant`, `variantConfig` retorna `{ bg, border, icon }` usando os tokens corretos_
    - _Preservation: estilos visuais (tokens CSS), `aria-live` por severidade, slots padrão e `actions`, prop `title`, prop `class` permanecem idênticos_
    - _Requirements: 2.1, 2.5, 3.1, 3.4, 3.7_

  - [x] 3.2 Migrar `Flag.vue`
    - Renomear tipo exportado: `FlagAppearance` → `FlagVariant`
    - Renomear prop na interface: `appearance?: FlagAppearance` → `variant?: FlagVariant`
    - Atualizar `withDefaults`: `appearance: 'normal'` → `variant: 'normal'`
    - Renomear computed interno: `appearanceBorderColor` → `variantBorderColor`; substituir `props.appearance` → `props.variant` e `Record<FlagAppearance, string>` → `Record<FlagVariant, string>`
    - Atualizar `ariaLive` computed: `props.appearance === 'error'` → `props.variant === 'error'`
    - Atualizar template: referência a `appearanceBorderColor` no `v-for` de actions → `variantBorderColor`; atualizar referência no `containerStyle` computed
    - Atualizar JSDoc: comentários que mencionam "appearance" → "variant"
    - _Bug_Condition: `'variant' NOT IN componentPropDefinitions(Flag) AND 'appearance' IN componentPropDefinitions(Flag)`_
    - _Expected_Behavior: `variant` é a única prop de controle visual; `variantBorderColor` retorna o token de cor correto para cada `FlagVariant`_
    - _Preservation: cores de borda esquerda por variant, `aria-live` por severidade, `isDismissible`/`dismiss`, integração com `FlagGroup`, prop `actions`, prop `title`, prop `class` permanecem idênticos_
    - _Requirements: 2.2, 2.5, 3.2, 3.3, 3.6, 3.8_

  - [x] 3.3 Migrar `Button.vue`
    - Remover completamente a prop `appearance` do `ButtonProps` (interface e bloco `withDefaults`)
    - Simplificar `resolvedVariant` computed: remover toda a lógica de `props.appearance`; retornar simplesmente `props.variant`
    - Remover JSDoc da prop `appearance` do `ButtonProps`
    - _Bug_Condition: `'appearance' IN componentPropDefinitions(Button) AND resolvedVariant gives precedence to props.appearance OVER props.variant`_
    - _Expected_Behavior: `resolvedVariant` retorna `props.variant` diretamente; TypeScript deve rejeitar código que passe `appearance` ao `Button`_
    - _Preservation: props `isSelected`, `shouldFitContainer`, `loading`, `disabled`, `icon`, `tooltip`, `size`, `type`, slot padrão, evento `click` permanecem com comportamento idêntico_
    - _Requirements: 2.3, 2.4, 2.6, 3.5_

  - [x] 3.4 Atualizar testes existentes que referenciam `appearance`
    - Atualizar `packages/design-system/tests/Button.spec.ts`: substituir props `appearance='warning'` → `variant='warning'` e `appearance='discovery'` → `variant='discovery'` nos testes existentes
    - Verificar se outros arquivos de teste referenciam `appearance` em `SectionMessage`, `Flag` ou `Button` e atualizar conforme necessário
    - _Requirements: 3.9_

  - [x] 3.5 Verificar que o teste de exploração da bug condition agora passa
    - **Property 1: Expected Behavior** - variant aplicada corretamente nos três componentes
    - **IMPORTANT**: Re-executar o MESMO teste da task 1 — NÃO escrever um novo teste
    - O teste da task 1 codifica o comportamento esperado (expectedBehavior)
    - Quando este teste passar, confirma que o comportamento esperado está satisfeito:
      - `SectionMessage` com `variant="error"` → `aria-live="assertive"` e background red
      - `Flag` com `variant="warning"` → `borderLeftColor: var(--ds-color-amber-500)`
      - `Button` com `variant="ghost"` ignorando qualquer lógica de `appearance` → classes de `ghost`
    - **EXPECTED OUTCOME**: Testes PASSAM (confirma que o bug foi corrigido)
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.6 Verificar que os testes de preservação ainda passam
    - **Property 2: Preservation** - comportamentos não relacionados à variante permanecem idênticos
    - **IMPORTANT**: Re-executar os MESMOS testes da task 2 — NÃO escrever novos testes
    - Atualizar as referências de `appearance` para `variant` nos testes de preservação onde necessário (os testes observacionais já usam o default e não passam a prop diretamente — verificar se algum precisa de ajuste)
    - **EXPECTED OUTCOME**: Testes PASSAM (confirma que não há regressões)
    - Confirmar que todos os testes de preservação continuam passando após a correção

- [x] 4. Checkpoint — garantir que todos os testes passam
  - Executar a suíte completa: `cd packages/design-system && npx vitest --run`
  - Verificar que os testes de exploração (Property 1) passam no código corrigido
  - Verificar que os testes de preservação (Property 2) passam no código corrigido
  - Verificar que `Button.spec.ts` atualizado passa sem erros
  - Verificar que `FlagGroup.pbt.spec.ts` existente continua passando (integração com `Flag`)
  - Verificar que `feedback.spec.ts` existente continua passando
  - Se algum teste falhar, identificar a causa raiz antes de fazer ajustes
  - Perguntar ao usuário se surgirem dúvidas sobre comportamentos não cobertos pelos requisitos

## Task Dependency Graph

```json
{
  "waves": [
    { "wave": 1, "tasks": ["1", "2"] },
    { "wave": 2, "tasks": ["3.1", "3.2", "3.3"] },
    { "wave": 3, "tasks": ["3.4"] },
    { "wave": 4, "tasks": ["3.5", "3.6"] },
    { "wave": 5, "tasks": ["4"] }
  ]
}
```

Tasks 1 e 2 são independentes entre si e devem ser executadas antes de qualquer implementação.
Tasks 3.1, 3.2 e 3.3 podem ser executadas em paralelo pois os componentes são independentes.
Task 3.4 depende de 3.1, 3.2 e 3.3.
Tasks 3.5 e 3.6 dependem de todas as sub-tasks de 3.
Task 4 depende de 3.5 e 3.6.

## Notes

- Os testes da task 1 devem ser escritos em `packages/design-system/tests/AppearanceToVariant.bug.pbt.spec.ts`
- Os testes da task 2 devem ser escritos em `packages/design-system/tests/AppearanceToVariant.preservation.pbt.spec.ts`
- Usar `fast-check` (`fc`) para todos os testes property-based — já disponível no projeto (ver `FlagGroup.pbt.spec.ts`, `Badge.pbt.spec.ts`)
- O framework de testes é Vitest com ambiente `happy-dom`; montar componentes com `@vue/test-utils`
- Os testes da task 2 usam `appearance` como nome de prop no código não corrigido; após a migração (task 3) atualizar as referências para `variant` se necessário
- `Button.spec.ts` existente contém testes que usam `appearance='warning'` e `appearance='discovery'` — esses devem ser atualizados na task 3.4
- Referência de padrão de testes PBT: `FlagGroup.pbt.spec.ts`, `Badge.pbt.spec.ts`, `Lozenge.pbt.spec.ts`
- Comando para executar testes: `cd packages/design-system && npx vitest --run`
