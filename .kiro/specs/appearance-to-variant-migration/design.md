# appearance-to-variant-migration Bugfix Design

## Overview

Três componentes adicionados no spec `atlassian-design-system-alignment` foram implementados com a prop `appearance` como ponto de entrada para controle visual, em vez de `variant`. Isso diverge do padrão estabelecido por todos os demais componentes do design system (`Alert`, `Toast`, `Spinner` etc.), que usam exclusivamente `variant`.

O bug se manifesta de duas formas distintas: em `SectionMessage` e `Flag`, a prop `variant` simplesmente não existe — consumidores que tentam passá-la são silenciosamente ignorados, e o componente renderiza sempre com o estilo padrão. Em `Button`, a prop `appearance` foi adicionada como alias e recebe precedência interna sobre `variant`, expondo uma API pública desnecessariamente inconsistente.

A correção é cirúrgica: renomear a prop e o tipo exportado de `appearance` → `variant` em `SectionMessage` e `Flag`, remover a prop `appearance` de `Button` e simplificar seu `resolvedVariant` computed. Nenhum estilo visual, nenhum comportamento funcional e nenhum teste deve regredir.

---

## Glossary

- **Bug_Condition (C)**: A condição que ativa o bug — a prop `appearance` existe publicamente em um componente que deveria expor apenas `variant`
- **Property (P)**: O comportamento correto quando `variant` é passado — o componente aplica o estilo visual correspondente, como já fazem `Alert` e `Toast`
- **Preservation**: Todos os comportamentos funcionais e visuais existentes que devem permanecer idênticos após a migração (estilos, `aria-live`, slots, eventos, outras props)
- **`appearance`**: Prop a ser removida de `SectionMessage`, `Flag` e `Button`
- **`variant`**: A única prop de controle visual após a migração; já é o padrão correto nos componentes de referência
- **`resolvedVariant`**: Computed em `Button.vue` que atualmente dá precedência a `appearance`; será simplificado para usar apenas `props.variant`
- **`appearanceConfig`**: Computed em `SectionMessage.vue` que consome `props.appearance`; será renomeado para `variantConfig` e atualizado para `props.variant`
- **`appearanceBorderColor`**: Computed em `Flag.vue` que consome `props.appearance`; será renomeado para `variantBorderColor` e atualizado para `props.variant`
- **`SectionMessageAppearance`**: Tipo exportado a ser renomeado para `SectionMessageVariant`
- **`FlagAppearance`**: Tipo exportado a ser renomeado para `FlagVariant`

---

## Bug Details

### Bug Condition

O bug se manifesta em três cenários distintos, todos compartilhando a mesma raiz: a API pública do componente expõe `appearance` em vez de `variant`.

**Formal Specification:**

```
FUNCTION isBugCondition(component, props)
  INPUT: component ∈ { SectionMessage, Flag, Button }
         props: objeto de props passado pelo consumidor

  OUTPUT: boolean

  IF component = SectionMessage THEN
    -- variant não existe na definição da prop, portanto é silenciosamente ignorada
    RETURN 'variant' NOT IN componentPropDefinitions(SectionMessage)
           AND 'appearance' IN componentPropDefinitions(SectionMessage)

  IF component = Flag THEN
    -- idem: variant ignorada, appearance controla o visual
    RETURN 'variant' NOT IN componentPropDefinitions(Flag)
           AND 'appearance' IN componentPropDefinitions(Flag)

  IF component = Button THEN
    -- variant existe mas appearance tem precedência interna
    RETURN 'appearance' IN componentPropDefinitions(Button)
           AND resolvedVariant gives precedence to props.appearance OVER props.variant

  RETURN false
END FUNCTION
```

### Exemplos Concretos

- **SectionMessage com variant='error'**: O consumidor passa `<SectionMessage variant="error" />`. A prop `variant` não está definida no componente, então Vue a descarta como attr desconhecido. O componente renderiza sempre com `appearance='information'` (padrão) — fundo cyan, ícone de informação — mesmo que o desenvolvedor esperasse fundo vermelho e ícone de erro.

- **Flag com variant='warning'**: `<Flag variant="warning" title="Atenção" />` nunca exibe a borda amber, sempre exibe a borda cyan de `normal`, pois `variant` não existe no componente.

- **Button com appearance='primary'**: `<Button appearance="primary" variant="ghost" />` resolve para `primary`, ignorando `variant='ghost'`. A prop `appearance` tem precedência no `resolvedVariant` computed, produzindo comportamento contraintuitivo para quem espera que `variant` seja o controlador.

- **Caso de borda — Button sem appearance**: `<Button variant="outline" />` funciona corretamente, pois `resolvedVariant` cai no `return props.variant` quando `appearance` está ausente. Porém a prop `appearance` ainda existe na interface pública, causando inconsistência de API.

---

## Expected Behavior

### Preservation Requirements

**Comportamentos que NÃO devem mudar:**

- Os estilos visuais por variante em `SectionMessage` (bg, border, icon color) devem permanecer idênticos — apenas o nome da prop muda, não os valores ou os tokens CSS
- Os estilos de borda esquerda colorida por variante em `Flag` devem permanecer idênticos
- O `aria-live="assertive"` para `variant='error'` em `Flag` e `SectionMessage` deve continuar funcionando
- O `aria-live="polite"` para todas as demais variantes deve continuar funcionando
- Todas as outras props de `Button` (`isSelected`, `shouldFitContainer`, `loading`, `disabled`, `icon`, `tooltip`, `size`, `type`) devem continuar funcionando sem alteração
- O slot padrão e o slot `actions` de `SectionMessage` devem continuar renderizando corretamente
- A prop `isDismissible` de `Flag` e o evento `dismiss` devem continuar funcionando
- A integração de `Flag` com `FlagGroup` (fila de visibilidade, máximo 3 simultâneas) deve continuar funcionando

**Escopo da preservação:**
Todas as entradas que NÃO envolvem a prop `appearance` — ou seja, todo comportamento funcional e visual que já existe corretamente — devem ser completamente inalteradas após a migração. Os únicos símbolos que mudam são: o nome da prop pública, o nome do tipo exportado e os nomes dos computeds internos.

---

## Hypothesized Root Cause

O bug não é um erro de lógica em tempo de execução — é um erro de design de API introduzido durante a implementação do spec `atlassian-design-system-alignment`:

1. **Nomenclatura incorreta na criação**: `SectionMessage` e `Flag` foram criados com `appearance` como nome de prop, seguindo um padrão legado ou uma referência incorreta, sem adotar o padrão `variant` já estabelecido pelos componentes existentes do projeto.

2. **Alias introduzido retroativamente em Button**: A prop `appearance` foi adicionada a `Button` como alias de compatibilidade ou mapeamento Figma após o componente já existir com `variant`. A lógica de `resolvedVariant` com precedência para `appearance` cria um comportamento surpreendente onde `appearance` sobrescreve `variant`.

3. **Ausência de validação de consistência de API**: Não havia verificação automática garantindo que todos os componentes de variante visual usassem o mesmo nome de prop, permitindo que a inconsistência passasse pelo code review.

4. **Tipos exportados também divergentes**: `SectionMessageAppearance` e `FlagAppearance` são nomes de tipos que vazam a nomenclatura incorreta para consumidores do pacote, tornando a correção necessária também nos tipos públicos.

---

## Correctness Properties

Property 1: Bug Condition — variant como único ponto de entrada de variante visual

_For any_ instância de `SectionMessage`, `Flag` ou `Button` onde a prop `variant` é passada com um valor válido, a versão corrigida dos componentes SHALL aplicar o estilo visual correspondente a esse valor, independentemente de qualquer outra prop — assim como `Alert` e `Toast` fazem hoje.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

Property 2: Bug Condition — appearance removida da API pública

_For any_ instância de `SectionMessage`, `Flag` ou `Button` após a migração, a prop `appearance` SHALL NOT existir na definição pública do componente. TypeScript SHALL emitir erro ao compilar código que tente passar `appearance` para qualquer um desses três componentes.

**Validates: Requirements 2.5, 2.6**

Property 3: Preservation — estilos visuais por variante inalterados

_For any_ combinação de componente e valor de `variant` válido (ex.: `SectionMessage` com `variant='error'`, `Flag` com `variant='warning'`), a versão corrigida SHALL produzir exatamente os mesmos tokens CSS, classes e estilos inline que a versão com `appearance` produzia para o valor equivalente.

**Validates: Requirements 3.1, 3.2**

Property 4: Preservation — aria-live por severidade inalterado

_For any_ instância de `Flag` ou `SectionMessage` com `variant='error'`, a versão corrigida SHALL continuar definindo `aria-live="assertive"`; para todos os demais valores de `variant`, SHALL continuar usando `aria-live="polite"`.

**Validates: Requirements 3.3, 3.4**

Property 5: Preservation — demais props e slots sem regressão

_For any_ combinação de outras props (`isSelected`, `loading`, `disabled`, `isDismissible`, `actions`, etc.) e qualquer valor de `variant`, a versão corrigida SHALL produzir o mesmo comportamento que a versão original produzia quando as mesmas props (exceto `appearance`) eram passadas.

**Validates: Requirements 3.5, 3.6, 3.7, 3.8**

---

## Fix Implementation

### Changes Required

#### `packages/design-system/src/components/feedback/SectionMessage.vue`

**Alterações:**

1. **Renomear tipo exportado**: `SectionMessageAppearance` → `SectionMessageVariant`
2. **Renomear prop**: `appearance?: SectionMessageAppearance` → `variant?: SectionMessageVariant`
3. **Atualizar default**: `appearance: 'information'` → `variant: 'information'`
4. **Renomear computed interno**: `appearanceConfig` → `variantConfig`; atualizar referência de `props.appearance` → `props.variant`
5. **Atualizar `ariaLive` computed**: `props.appearance === 'error'` → `props.variant === 'error'`
6. **Atualizar template**: substituir todas as ocorrências de `appearance ===` nos `v-if`/`v-else-if` por `variant ===`
7. **Atualizar JSDoc**: referências a "appearance" nos comentários → "variant"

#### `packages/design-system/src/components/feedback/Flag.vue`

**Alterações:**

1. **Renomear tipo exportado**: `FlagAppearance` → `FlagVariant`
2. **Renomear prop na interface**: `appearance?: FlagAppearance` → `variant?: FlagVariant`
3. **Atualizar default**: `appearance: 'normal'` → `variant: 'normal'`
4. **Renomear computed interno**: `appearanceBorderColor` → `variantBorderColor`; atualizar referência de `props.appearance` → `props.variant`; atualizar o tipo do `Record` de `FlagAppearance` → `FlagVariant`
5. **Atualizar `ariaLive` computed**: `props.appearance === 'error'` → `props.variant === 'error'`
6. **Atualizar template**: a referência a `appearanceBorderColor` no `v-for` de actions → `variantBorderColor`
7. **Atualizar JSDoc**: comentários que mencionam "appearance" → "variant"

#### `packages/design-system/src/components/button/Button.vue`

**Alterações:**

1. **Remover prop `appearance`** do `ButtonProps` completamente (interface e bloco `withDefaults`)
2. **Simplificar `resolvedVariant`** computed: remover toda a lógica de `props.appearance`; retornar simplesmente `props.variant`
3. **Atualizar JSDoc do `ButtonProps`**: remover a seção de documentação da prop `appearance`

---

## Testing Strategy

### Validation Approach

A estratégia segue duas fases: primeiro confirmar que o bug existe executando testes na versão não corrigida (exploratory), depois verificar que a correção funciona sem causar regressões (fix checking + preservation checking).

---

### Exploratory Bug Condition Checking

**Goal**: Demonstrar o bug ANTES de implementar a correção. Confirmar ou refutar a análise de causa raiz.

**Test Plan**: Escrever testes que instanciam `SectionMessage` e `Flag` com `variant` e assertam que o estilo visual correto é aplicado. Executar esses testes no código **não corrigido** para observar as falhas.

**Test Cases**:

1. **SectionMessage com variant='error'**: Montar `<SectionMessage variant="error" />` e verificar que o background é vermelho e o `aria-live` é `"assertive"` — **falhará** no código não corrigido, pois `variant` não existe e `appearance` padrão `'information'` será usada
2. **Flag com variant='warning'**: Montar `<Flag variant="warning" title="t" />` e verificar que a `borderLeftColor` é amber — **falhará** no código não corrigido
3. **Button com appearance sobrescrevendo variant**: Montar `<Button appearance="primary" variant="ghost" />` e verificar que a classe `ghost` é aplicada — **falhará** no código não corrigido, pois `appearance` tem precedência
4. **TypeScript — SectionMessage com variant**: Verificar que o tipo de `SectionMessageProps` inclui `variant` — **falhará** na compilação antes da correção

**Expected Counterexamples**:
- `SectionMessage` e `Flag` rendem com os estilos do valor padrão, ignorando `variant`
- `Button` aplica `appearance` em vez de `variant` quando ambos são passados

---

### Fix Checking

**Goal**: Verificar que, para todos os inputs onde a bug condition se aplica, a versão corrigida produz o comportamento esperado.

**Pseudocode:**
```
FOR ALL component ∈ { SectionMessage, Flag, Button }
  FOR ALL variantValue ∈ validVariants(component)
    result := render(component, { variant: variantValue })
    ASSERT expectedVisualStyle(result, variantValue)
    ASSERT 'appearance' NOT IN publicProps(component)
  END FOR
END FOR
```

---

### Preservation Checking

**Goal**: Verificar que, para todos os inputs onde a bug condition NÃO se aplica, o comportamento é idêntico ao original.

**Pseudocode:**
```
FOR ALL component ∈ { SectionMessage, Flag, Button }
  FOR ALL nonVariantProp ∈ otherProps(component)
    ASSERT render(component_original, { nonVariantProp }) 
           = render(component_fixed, { nonVariantProp })
  END FOR
END FOR
```

**Testing Approach**: Property-based testing é recomendado para preservation checking porque:
- Gera automaticamente muitas combinações de props além das variantes
- Detecta regressões em casos de borda que testes unitários manuais deixariam passar
- Provê garantia forte de que o comportamento fora da bug condition é inalterado

**Test Cases**:

1. **Button — outras props preservadas**: Verificar que `isSelected`, `loading`, `disabled`, `shouldFitContainer`, `icon`, `tooltip` continuam funcionando corretamente após remoção de `appearance`
2. **Flag — isDismissible e evento dismiss preservados**: Verificar que o botão de fechar aparece e o evento `dismiss` é emitido
3. **Flag — integração com FlagGroup preservada**: Verificar que o sistema de fila (máximo 3 flags) continua operando
4. **SectionMessage — slots preservados**: Verificar que conteúdo nos slots padrão e `actions` renderiza nos locais corretos
5. **aria-live preservado**: Verificar `assertive` para `error` e `polite` para demais variantes em ambos os componentes

---

### Unit Tests

- Testar cada variante de `SectionMessage` com `variant` e verificar bg/border/icon color corretos
- Testar cada variante de `Flag` com `variant` e verificar `borderLeftColor` correta
- Testar `ariaLive` computed de `Flag` e `SectionMessage` para todas as variantes
- Testar `Button` com cada valor de `variant` e verificar que a classe CSS correta é aplicada
- Testar `Button` sem `variant` explícito e verificar que o default `'default'` é usado
- Testar que `appearance` não é aceita como prop pelo TypeScript após a migração (compilação deve falhar)

### Property-Based Tests

- Gerar aleatoriamente valores de `variant` válidos para `SectionMessage` e verificar que `variantConfig` retorna sempre um objeto com `bg`, `border` e `icon` não-vazios
- Gerar aleatoriamente combinações de props de `Flag` (excluindo `variant`) e verificar que o comportamento de render é idêntico entre versão original e corrigida
- Gerar aleatoriamente props booleanas de `Button` (`isSelected`, `loading`, `disabled`) e verificar que as classes CSS resultantes são idênticas entre versão original e corrigida

### Integration Tests

- Renderizar `SectionMessage` com todos os 6 valores de `variant` e verificar snapshot visual
- Renderizar `Flag` dentro de `FlagGroup` com `variant='error'` e verificar que `aria-live="assertive"` é definido no contexto correto
- Renderizar `Button` com `variant='primary'` e `loading=true` e verificar spinner + estilo correto
- Verificar que consumidores existentes do design system que já usavam `variant` em `Alert` e `Toast` continuam funcionando (teste de não-regressão de integração)
