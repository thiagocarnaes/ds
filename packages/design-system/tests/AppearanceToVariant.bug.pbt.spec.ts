/**
 * Bug Condition Exploration — Property 1: appearance exposta em vez de variant
 *
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
 *
 * ESTE TESTE DEVE FALHAR no código não corrigido.
 * A falha é o resultado esperado — ela confirma que o bug existe.
 *
 * Quando a correção for implementada (task 3), este mesmo teste DEVE PASSAR.
 *
 * Bug Condition:
 *   - SectionMessage: 'variant' NOT IN componentPropDefinitions(SectionMessage)
 *     AND 'appearance' IN componentPropDefinitions(SectionMessage)
 *   - Flag: 'variant' NOT IN componentPropDefinitions(Flag)
 *     AND 'appearance' IN componentPropDefinitions(Flag)
 *   - Button: 'appearance' IN componentPropDefinitions(Button)
 *     AND resolvedVariant gives precedence to props.appearance OVER props.variant
 *
 * Expected Behavior (após correção):
 *   - SectionMessage com variant="error" → aria-live="assertive" e background usa --ds-color-red-500
 *   - Flag com variant="warning" → borderLeftColor é var(--ds-color-amber-500)
 *   - Button com variant="ghost" ignorando appearance → classes de ghost aplicadas
 */
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import * as fc from 'fast-check'
import SectionMessage, { type SectionMessageProps } from '@/components/feedback/SectionMessage.vue'
import Flag, { type FlagProps } from '@/components/feedback/Flag.vue'
import Button, { type ButtonProps } from '@/components/button/Button.vue'

// ─── Arbitraries ─────────────────────────────────────────────────────────────

/**
 * All valid variant values for SectionMessage after migration.
 * In the unfixed code, these must be passed as `variant` prop and should be
 * respected — but they are silently ignored because `variant` doesn't exist.
 */
const sectionMessageVariants = fc.constantFrom(
  'information',
  'warning',
  'error',
  'success',
  'discovery',
  'change',
) as fc.Arbitrary<SectionMessageProps['variant']>

/**
 * All valid variant values for Flag after migration.
 */
const flagVariants = fc.constantFrom(
  'normal',
  'warning',
  'error',
  'success',
  'discovery',
) as fc.Arbitrary<FlagProps['variant']>

// ─── Bug Condition 1: SectionMessage ignora variant ──────────────────────────

describe('Bug Condition — SectionMessage: variant ignorada, appearance controla visual', () => {
  /**
   * **Validates: Requirements 1.1, 2.1**
   *
   * isBugCondition: 'variant' NOT IN componentPropDefinitions(SectionMessage)
   *
   * No código não corrigido, SectionMessage não possui a prop `variant`.
   * Ao passar variant="error", o componente renderiza com appearance='information' (default),
   * produzindo background cyan em vez de red e aria-live="polite" em vez de "assertive".
   *
   * FALHA esperada: aria-live é "polite" (usa appearance default) em vez de "assertive"
   */
  it('SectionMessage com variant="error" deve ter aria-live="assertive" (FALHA no código não corrigido)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant('error' as const),
        async (variantValue) => {
          // Monta com `variant` — no código não corrigido, esta prop é ignorada
          const wrapper = mount(SectionMessage, {
            props: { variant: variantValue } as Record<string, unknown>,
          })
          await nextTick()

          const el = wrapper.element as HTMLElement
          const ariaLive = el.getAttribute('aria-live')

          // Comportamento esperado: "assertive" para error
          // Comportamento bugado: "polite" porque props.appearance === 'information' (default)
          expect(
            ariaLive,
            `SectionMessage variant="${variantValue}": esperado aria-live="assertive", recebeu "${ariaLive}". ` +
            `Bug confirmado: a prop variant é ignorada e appearance padrão 'information' é usada.`,
          ).toBe('assertive')

          wrapper.unmount()
        },
      ),
      { numRuns: 1, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 1.1, 2.1**
   *
   * Para qualquer variant não-default passada como `variant`, o background
   * deve usar o token de cor correspondente (não o token de 'information').
   *
   * Nota: happy-dom não consegue avaliar color-mix() CSS functions, então
   * element.style.backgroundColor fica vazio. Verificamos via variantConfig.bg
   * no setupState do componente, que contém a string do token CSS.
   */
  it('SectionMessage com variant="error" deve ter background usando --ds-color-red-500 (FALHA no código não corrigido)', async () => {
    const wrapper = mount(SectionMessage, {
      props: { variant: 'error' } as Record<string, unknown>,
    })
    await nextTick()

    // happy-dom não avalia color-mix(), então verificamos via setupState interno
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setupState = (wrapper.vm as any).$.setupState
    const bgValue: string = setupState.variantConfig?.bg ?? ''

    // Comportamento esperado: contém --ds-color-red-500 no token de bg
    // Comportamento bugado: contém --ds-color-cyan-500 porque appearance='information' é o default
    expect(
      bgValue,
      `SectionMessage variant="error": esperado variantConfig.bg com --ds-color-red-500, recebeu "${bgValue}". ` +
      `Bug confirmado: variant é ignorada, appearance padrão 'information' produz background cyan.`,
    ).toContain('red-500')

    wrapper.unmount()
  })

  /**
   * **Validates: Requirements 1.1, 2.1**
   *
   * Propriedade abrangente: para QUALQUER variant válida passada via prop `variant`,
   * o aria-live deve corresponder ao comportamento esperado para essa variant.
   *
   * FALHA esperada para variant="error": aria-live="polite" em vez de "assertive"
   * (todos os outros passam pois o default 'information' tem aria-live="polite")
   */
  it('Para qualquer variant passada, SectionMessage deve aplicar aria-live correspondente (FALHA para error)', async () => {
    await fc.assert(
      fc.asyncProperty(
        sectionMessageVariants,
        async (variantValue) => {
          const wrapper = mount(SectionMessage, {
            props: { variant: variantValue } as Record<string, unknown>,
          })
          await nextTick()

          const el = wrapper.element as HTMLElement
          const ariaLive = el.getAttribute('aria-live')
          const expectedAriaLive = variantValue === 'error' ? 'assertive' : 'polite'

          expect(
            ariaLive,
            `SectionMessage variant="${variantValue}": esperado aria-live="${expectedAriaLive}", recebeu "${ariaLive}". ` +
            `Bug: a prop variant não existe em SectionMessage, então appearance default 'information' é sempre usado.`,
          ).toBe(expectedAriaLive)

          wrapper.unmount()
        },
      ),
      { numRuns: 6, seed: 42 },
    )
  })
})

// ─── Bug Condition 2: Flag ignora variant ─────────────────────────────────────

describe('Bug Condition — Flag: variant ignorada, appearance controla visual', () => {
  /**
   * **Validates: Requirements 1.2, 2.2**
   *
   * isBugCondition: 'variant' NOT IN componentPropDefinitions(Flag)
   *
   * No código não corrigido, Flag não possui a prop `variant`.
   * Ao passar variant="warning", o componente renderiza com appearance='normal' (default),
   * produzindo borderLeftColor cyan em vez de amber.
   *
   * FALHA esperada: borderLeftColor é cyan (normal default) em vez de amber (warning)
   */
  it('Flag com variant="warning" deve ter borderLeftColor=var(--ds-color-amber-500) (FALHA no código não corrigido)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant('warning' as const),
        async (variantValue) => {
          const wrapper = mount(Flag, {
            props: { title: 't', variant: variantValue } as Record<string, unknown>,
          })
          await nextTick()

          const el = wrapper.element as HTMLElement
          const borderLeftColor = el.style.borderLeftColor

          // Comportamento esperado: var(--ds-color-amber-500) para warning
          // Comportamento bugado: var(--ds-color-cyan-500) porque appearance='normal' é o default
          expect(
            borderLeftColor,
            `Flag variant="${variantValue}": esperado borderLeftColor="var(--ds-color-amber-500)", recebeu "${borderLeftColor}". ` +
            `Bug confirmado: variant é ignorada, appearance padrão 'normal' produz borda cyan.`,
          ).toBe('var(--ds-color-amber-500)')

          wrapper.unmount()
        },
      ),
      { numRuns: 1, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 1.2, 2.2**
   *
   * Para qualquer variant passada, a borderLeftColor deve corresponder ao token correto.
   *
   * No código não corrigido: TODAS as variants produzem cyan (normal default).
   *
   * FALHA esperada para warning, error, success, discovery (qualquer non-default)
   */
  it('Para qualquer variant passada, Flag deve aplicar borderLeftColor correspondente (FALHA para non-default variants)', async () => {
    const expectedBorderColors: Record<string, string> = {
      normal:    'var(--ds-color-cyan-500)',
      warning:   'var(--ds-color-amber-500)',
      error:     'var(--ds-color-red-500)',
      success:   'var(--ds-color-teal-400)',
      discovery: 'var(--ds-color-purple-400)',
    }

    await fc.assert(
      fc.asyncProperty(
        flagVariants,
        async (variantValue) => {
          const wrapper = mount(Flag, {
            props: { title: 't', variant: variantValue } as Record<string, unknown>,
          })
          await nextTick()

          const el = wrapper.element as HTMLElement
          const borderLeftColor = el.style.borderLeftColor
          const expectedColor = expectedBorderColors[variantValue as string]

          expect(
            borderLeftColor,
            `Flag variant="${variantValue}": esperado borderLeftColor="${expectedColor}", recebeu "${borderLeftColor}". ` +
            `Bug: variant não existe em Flag, appearance default 'normal' sempre produz cyan.`,
          ).toBe(expectedColor)

          wrapper.unmount()
        },
      ),
      { numRuns: 5, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 1.2, 2.2**
   *
   * Flag com variant="error" deve ter aria-live="assertive".
   *
   * FALHA esperada: aria-live="polite" (appearance default 'normal' é usado)
   */
  it('Flag com variant="error" deve ter aria-live="assertive" (FALHA no código não corrigido)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant('error' as const),
        async (variantValue) => {
          const wrapper = mount(Flag, {
            props: { title: 't', variant: variantValue } as Record<string, unknown>,
          })
          await nextTick()

          const el = wrapper.element as HTMLElement
          const ariaLive = el.getAttribute('aria-live')

          expect(
            ariaLive,
            `Flag variant="${variantValue}": esperado aria-live="assertive", recebeu "${ariaLive}". ` +
            `Bug: variant ignorada, appearance default 'normal' produz aria-live="polite".`,
          ).toBe('assertive')

          wrapper.unmount()
        },
      ),
      { numRuns: 1, seed: 42 },
    )
  })
})

// ─── Bug Condition 3: Button — appearance tem precedência sobre variant ───────

describe('Bug Condition — Button: appearance tem precedência sobre variant em resolvedVariant', () => {
  /**
   * **Validates: Requirements 1.3, 1.4, 2.3**
   *
   * isBugCondition: 'appearance' IN componentPropDefinitions(Button)
   *   AND resolvedVariant gives precedence to props.appearance OVER props.variant
   *
   * No código não corrigido, resolvedVariant retorna props.appearance quando ambos são passados.
   * Ao passar appearance="primary" + variant="ghost", o componente aplica classes de 'primary'
   * em vez de 'ghost'.
   *
   * FALHA esperada: classes de 'primary' aplicadas em vez das classes de 'ghost'
   */
  it('Button com variant="ghost" deve ter classes de ghost, não de primary (FALHA no código não corrigido)', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Combinações onde appearance conflita com variant
        fc.record({
          appearance: fc.constantFrom('primary', 'outline', 'secondary', 'warning', 'discovery') as fc.Arbitrary<string>,
          variant: fc.constantFrom('ghost', 'link', 'subtle') as fc.Arbitrary<ButtonProps['variant']>,
        }),
        async ({ appearance, variant }) => {
          const wrapper = mount(Button, {
            // Cast required: `appearance` intentionally passed to test the old bug condition.
            // After migration, ButtonProps no longer accepts `appearance`.
            props: { appearance, variant } as Record<string, unknown>,
          })
          await nextTick()

          const el = wrapper.element as HTMLElement
          const classes = el.className

          // Classes esperadas para 'ghost': hover:bg-[--ds-color-bg-hovered] hover:text-accent-foreground
          // Classes esperadas para 'link': text-primary underline-offset-4 hover:underline
          // Classes esperadas para 'subtle': hover:bg-[--ds-color-bg-hovered] text-foreground
          // No código bugado: classes de `appearance` (primary/outline/secondary/etc.) são aplicadas

          // O comportamento esperado: variant controla o estilo, appearance é ignorado
          // Verificar que NÃO estão aplicando as classes do appearance
          const appearanceClassMarkers: Record<string, string> = {
            primary:   'bg-primary',
            outline:   'border border-border bg-background',
            secondary: 'bg-secondary',
            warning:   'bg-warning',
            discovery: 'bg-\\[--ds-color-purple-400\\]',
          }

          // Verificar que as classes de variant estão aplicadas (não as de appearance)
          const variantClassMarkers: Record<string, string> = {
            ghost:  'hover:bg-[--ds-color-bg-hovered] hover:text-accent-foreground',
            link:   'underline-offset-4',
            subtle: 'hover:bg-[--ds-color-bg-hovered]',
          }

          const expectedVariantClass = variantClassMarkers[variant as string]

          expect(
            classes,
            `Button appearance="${appearance}" variant="${variant}": esperado classes de "${variant}" (contendo "${expectedVariantClass}"), ` +
            `mas recebeu classes="${classes}". ` +
            `Bug: resolvedVariant retorna props.appearance="${appearance}" ignorando props.variant="${variant}".`,
          ).toContain(expectedVariantClass)

          wrapper.unmount()
        },
      ),
      { numRuns: 15, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 1.3, 2.3**
   *
   * Caso concreto do spec: appearance="primary" + variant="ghost"
   * Deve aplicar classes de ghost. No código bugado aplica classes de primary.
   *
   * FALHA esperada: classes de 'primary' (bg-primary) são aplicadas em vez das de 'ghost'
   */
  it('Concreto: Button appearance="primary" variant="ghost" → classes de ghost (FALHA no código não corrigido)', async () => {
    const wrapper = mount(Button, {
      // Cast required: `appearance` intentionally passed to test the old bug condition.
      // After migration, ButtonProps no longer accepts `appearance`.
      props: {
        appearance: 'primary',
        variant: 'ghost',
      } as Record<string, unknown>,
    })
    await nextTick()

    const el = wrapper.element as HTMLElement
    const classes = el.className

    // ghost classes: hover:bg-[--ds-color-bg-hovered] hover:text-accent-foreground (NÃO tem bg-primary)
    expect(
      classes,
      `Button appearance="primary" variant="ghost": esperado classes de ghost (hover:bg-[--ds-color-bg-hovered]), ` +
      `recebeu "${classes}". Bug: appearance="primary" tem precedência e aplica bg-primary.`,
    ).toContain('hover:bg-[--ds-color-bg-hovered]')

    expect(
      classes,
      `Button appearance="primary" variant="ghost": NÃO deve conter bg-primary (primary classes), ` +
      `recebeu "${classes}". Bug: resolvedVariant usa appearance ao invés de variant.`,
    ).not.toContain('bg-primary')

    wrapper.unmount()
  })

  /**
   * **Validates: Requirements 1.4, 2.3**
   *
   * Verificar que a prop `appearance` não deveria existir em ButtonProps após a correção.
   * No código não corrigido, `appearance` existe e está documentada na interface.
   *
   * Esta verificação documenta a isBugCondition estrutural:
   * 'appearance' IN componentPropDefinitions(Button)
   */
  it('Button NÃO deve expor "appearance" como prop (FALHA no código não corrigido — appearance existe)', async () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'ghost',
      },
    })
    await nextTick()

    // No código não corrigido, `appearance` é aceita silenciosamente como prop válida.
    // Após a correção, Vue deve tratar `appearance` como attrs desconhecido (não prop registrada).
    // Aqui verificamos via comportamento: passar appearance="primary" NÃO deve afetar o estilo
    // (se a prop não existe, ela é ignorada como attr e variant="ghost" prevalece).

    const wrapperWithAppearance = mount(Button, {
      // Cast required: `appearance` intentionally passed to test the old bug condition.
      // After migration, ButtonProps no longer accepts `appearance`.
      props: {
        appearance: 'primary',
        variant: 'ghost',
      } as Record<string, unknown>,
    })
    await nextTick()

    const classesWithout = wrapper.element.className
    const classesWith = wrapperWithAppearance.element.className

    // Se appearance afeta o resultado, as classes serão diferentes → bug está presente
    // Se appearance não afeta (prop não existe) → as classes seriam iguais
    expect(
      classesWith,
      `Button com appearance="primary" + variant="ghost" gerou classes diferentes de Button com variant="ghost" apenas. ` +
      `classesWith="${classesWith}", classesWithout="${classesWithout}". ` +
      `Bug: a prop 'appearance' existe e tem precedência sobre 'variant' em resolvedVariant.`,
    ).toBe(classesWithout)

    wrapper.unmount()
    wrapperWithAppearance.unmount()
  })
})
