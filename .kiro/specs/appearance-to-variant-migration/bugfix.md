# Bugfix Requirements Document

## Introduction

Durante o spec `atlassian-design-system-alignment`, três componentes foram adicionados usando `appearance` como prop principal de variante visual: `SectionMessage.vue`, `Flag.vue` e `Button.vue`. O padrão correto do design system usa exclusivamente `variant` como prop de variante visual — sem alias, sem `appearance`. Componentes pré-existentes como `Alert`, `Toast`, `Spinner` e outros usam apenas `variant`.

Os componentes afetados precisam ter a prop `appearance` removida inteiramente, substituída por `variant`, com todos os tipos, internals e templates atualizados de acordo.

## Componentes Afetados

- `packages/design-system/src/components/feedback/SectionMessage.vue`
- `packages/design-system/src/components/feedback/Flag.vue`
- `packages/design-system/src/components/button/Button.vue`

## Componentes de Referência (padrão correto)

- `Alert.vue` — usa apenas `variant`
- `Toast.vue` — usa apenas `variant`
- `Spinner.vue` — sem prop de variante (referência de simplicidade)

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN `SectionMessage` é instanciado com a prop `variant`, THEN o sistema ignora o valor pois a prop `variant` não existe no componente, renderizando sempre com o valor padrão `information`

1.2 WHEN `Flag` é instanciado com a prop `variant`, THEN o sistema ignora o valor pois a prop `variant` não existe no componente, renderizando sempre com o valor padrão `normal`

1.3 WHEN `Button` é instanciado usando apenas `variant` sem `appearance`, THEN o sistema funciona corretamente, mas o componente expõe `appearance` desnecessariamente como prop pública, criando inconsistência na API

1.4 WHEN um consumidor do design system examina a API de `SectionMessage` ou `Flag`, THEN encontra `appearance` em vez de `variant`, quebrando a consistência com todos os outros componentes do sistema

### Expected Behavior (Correct)

2.1 WHEN `SectionMessage` é instanciado com a prop `variant`, THEN o sistema SHALL aplicar o estilo visual correspondente ao valor fornecido (`information`, `warning`, `error`, `success`, `discovery`, `change`)

2.2 WHEN `Flag` é instanciado com a prop `variant`, THEN o sistema SHALL aplicar o estilo visual correspondente ao valor fornecido (`normal`, `warning`, `error`, `success`, `discovery`)

2.3 WHEN `Button` é instanciado com a prop `variant`, THEN o sistema SHALL aplicar o estilo visual correspondente sem depender de `appearance`

2.4 WHEN `SectionMessage`, `Flag` ou `Button` são instanciados sem passar `variant`, THEN o sistema SHALL usar o valor padrão da prop `variant` (`information`, `normal` e `default` respectivamente)

2.5 WHEN a prop `appearance` é removida de `SectionMessage` e `Flag`, THEN a prop `variant` SHALL ser o único ponto de entrada para controlar o estilo visual do componente

2.6 WHEN a prop `appearance` é removida de `Button`, THEN `variant` SHALL continuar sendo a única prop para controlar o estilo visual, com os mesmos valores suportados anteriormente (`primary`, `ghost`, `outline`, `destructive`, `default`, `secondary`, `link`, `warning`, `discovery`, `subtle`)

### Unchanged Behavior (Regression Prevention)

3.1 WHEN `SectionMessage` é instanciado com `variant` válido, THEN o sistema SHALL CONTINUE TO renderizar os estilos visuais corretos (bg, border, icon color) para cada variante — `information` (cyan), `warning` (amber), `error` (red), `success` (teal), `discovery` (purple), `change` (blue)

3.2 WHEN `Flag` é instanciado com `variant` válido, THEN o sistema SHALL CONTINUE TO renderizar a borda esquerda colorida correta para cada variante — `normal` (cyan), `warning` (amber), `error` (red), `success` (teal), `discovery` (purple)

3.3 WHEN `Flag` é instanciado com `variant='error'`, THEN o sistema SHALL CONTINUE TO definir `aria-live="assertive"`; para demais variantes SHALL usar `aria-live="polite"`

3.4 WHEN `SectionMessage` é instanciado com `variant='error'`, THEN o sistema SHALL CONTINUE TO definir `aria-live="assertive"`; para demais variantes SHALL usar `aria-live="polite"`

3.5 WHEN `Button` é instanciado com props como `isSelected`, `shouldFitContainer`, `loading`, `disabled`, `icon` e `tooltip`, THEN o sistema SHALL CONTINUE TO aplicar o comportamento existente dessas props sem regressão

3.6 WHEN `Flag` é instanciado com `isDismissible=true`, THEN o sistema SHALL CONTINUE TO exibir o botão de fechar e emitir o evento `dismiss` corretamente

3.7 WHEN `SectionMessage` recebe conteúdo no slot padrão ou no slot `actions`, THEN o sistema SHALL CONTINUE TO renderizar o conteúdo nos locais corretos

3.8 WHEN `Flag` é usado dentro de `FlagGroup`, THEN o sistema SHALL CONTINUE TO funcionar corretamente com a fila de visibilidade (máximo 3 flags simultâneas)

3.9 WHEN os testes existentes de `Flag`, `SectionMessage` e `Button` são executados após a migração, THEN todos os testes SHALL continuar passando (os testes devem ser atualizados para usar `variant` onde antes usavam `appearance`)
