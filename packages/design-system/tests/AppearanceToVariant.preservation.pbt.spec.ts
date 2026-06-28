/**
 * Preservation Tests — Property 2: comportamentos não relacionados à variante
 *
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8**
 *
 * ESTES TESTES DEVEM PASSAR no código corrigido.
 * Eles verificam que comportamentos pré-existentes não regrediram após a migração.
 *
 * Metodologia observation-first:
 *   - Observar comportamento no código não corrigido (¬C(X))
 *   - Escrever propriedades PBT que capturam esses comportamentos
 *   - Confirmar que passam ANTES de implementar a correção
 *
 * Após a migração (task 3.6):
 *   - Re-executar estes mesmos testes (atualizados para usar `variant` em vez de `appearance`)
 *   - Confirmar que CONTINUAM passando (sem regressões)
 *
 * Preservation scope (comportamentos que NÃO devem mudar):
 *   - isDismissible/dismiss em Flag
 *   - variantConfig (bg, border, icon) retorna objetos completos em SectionMessage
 *   - Combinações de props booleanas do Button produzem classes consistentes
 *   - aria-live por severidade em Flag e SectionMessage
 */
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import * as fc from 'fast-check'
import SectionMessage from '@/components/feedback/SectionMessage.vue'
import Flag from '@/components/feedback/Flag.vue'
import Button from '@/components/button/Button.vue'

// ─── Arbitraries ─────────────────────────────────────────────────────────────

/** Todos os valores válidos de variant para SectionMessage (código corrigido). */
const sectionMessageVariants = fc.constantFrom(
  'information',
  'warning',
  'error',
  'success',
  'discovery',
  'change',
) as fc.Arbitrary<'information' | 'warning' | 'error' | 'success' | 'discovery' | 'change'>

/** Todos os valores válidos de variant para Flag (código corrigido). */
const flagVariants = fc.constantFrom(
  'error',
  'normal',
  'warning',
  'success',
  'discovery',
) as fc.Arbitrary<'error' | 'normal' | 'warning' | 'success' | 'discovery'>

// ─── Preservation 1: Flag — isDismissible ────────────────────────────────────

describe('Preservation — Flag: isDismissible controla presença do botão de fechar', () => {
  /**
   * **Validates: Requirements 3.6**
   *
   * Para todo valor boolean de `isDismissible`, o botão de fechar
   * aparece ↔ isDismissible === true.
   * Usa variant='normal' (default) para isolar a prop isDismissible.
   */
  it('para todo boolean isDismissible: botão de fechar existe ↔ isDismissible === true', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.boolean(),
        async (isDismissible) => {
          const wrapper = mount(Flag, {
            props: {
              title: 'Test flag',
              variant: 'normal',
              isDismissible,
            },
          })
          await nextTick()

          const dismissBtn = wrapper.find('button[aria-label="Fechar notificação"]')

          if (isDismissible) {
            expect(
              dismissBtn.exists(),
              `isDismissible=true: botão de fechar deve existir mas não foi encontrado`,
            ).toBe(true)
          } else {
            expect(
              dismissBtn.exists(),
              `isDismissible=false: botão de fechar NÃO deve existir mas foi encontrado`,
            ).toBe(false)
          }

          wrapper.unmount()
        },
      ),
      { numRuns: 20, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 3.6**
   *
   * Concreto: Flag com isDismissible=true emite o evento `dismiss` ao clicar.
   */
  it('Flag com isDismissible=true: clique no botão de fechar emite evento dismiss', async () => {
    const wrapper = mount(Flag, {
      props: {
        title: 'Dismissible flag',
        variant: 'normal',
        isDismissible: true,
      },
    })
    await nextTick()

    const dismissBtn = wrapper.find('button[aria-label="Fechar notificação"]')
    expect(dismissBtn.exists()).toBe(true)

    await dismissBtn.trigger('click')

    expect(
      wrapper.emitted('dismiss'),
      'Evento dismiss deve ser emitido ao clicar no botão de fechar',
    ).toBeTruthy()

    wrapper.unmount()
  })

  /**
   * **Validates: Requirements 3.6**
   *
   * Concreto: Flag com isDismissible=false — botão de fechar ausente.
   */
  it('Flag com isDismissible=false: botão de fechar ausente', async () => {
    const wrapper = mount(Flag, {
      props: {
        title: 'Non-dismissible flag',
        variant: 'normal',
        isDismissible: false,
      },
    })
    await nextTick()

    const dismissBtn = wrapper.find('button[aria-label="Fechar notificação"]')
    expect(dismissBtn.exists()).toBe(false)

    wrapper.unmount()
  })
})

// ─── Preservation 2: SectionMessage — variantConfig retorna objeto completo ──

describe('Preservation — SectionMessage: variantConfig retorna bg, border e icon não-vazios', () => {
  /**
   * **Validates: Requirements 3.1**
   *
   * Para qualquer variant válido (usando prop `variant` após a migração),
   * variantConfig deve retornar um objeto com `bg`, `border`
   * e `icon` não-vazios.
   *
   * Nota: happy-dom não parseia color-mix() em inline styles, portanto verificamos o valor
   * do computed diretamente via vm.$.setupState — isso é mais robusto e testa exatamente
   * o que importa: que o config retorna valores não-vazios para todos os variants.
   */
  it('para qualquer variant: variantConfig retorna objeto com bg, border e icon não-vazios', async () => {
    await fc.assert(
      fc.asyncProperty(
        sectionMessageVariants,
        async (variant) => {
          const wrapper = mount(SectionMessage, {
            props: { variant },
          })
          await nextTick()

          // Acessar o computed interno via setupState para verificar que retorna valores completos
          const vm = wrapper.vm as any
          const config = vm.$.setupState.variantConfig as { bg: string; border: string; icon: string } | undefined

          expect(
            config,
            `SectionMessage variant="${variant}": variantConfig não deve ser undefined`,
          ).toBeDefined()

          expect(
            config!.bg.length > 0,
            `SectionMessage variant="${variant}": config.bg não deve ser vazio, recebeu "${config!.bg}"`,
          ).toBe(true)

          expect(
            config!.border.length > 0,
            `SectionMessage variant="${variant}": config.border não deve ser vazio, recebeu "${config!.border}"`,
          ).toBe(true)

          expect(
            config!.icon.length > 0,
            `SectionMessage variant="${variant}": config.icon não deve ser vazio, recebeu "${config!.icon}"`,
          ).toBe(true)

          wrapper.unmount()
        },
      ),
      { numRuns: 6, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 3.1**
   *
   * Para qualquer variant válido, o ícone deve ser renderizado com color não-vazio.
   */
  it('para qualquer variant: SectionMessage renderiza ícone com color não-vazio', async () => {
    await fc.assert(
      fc.asyncProperty(
        sectionMessageVariants,
        async (variant) => {
          const wrapper = mount(SectionMessage, {
            props: { variant },
          })
          await nextTick()

          // O ícone tem :style="{ color: iconColor }" — verificar que o span do ícone tem color
          const iconSpan = wrapper.find('span[aria-hidden="true"]')
          expect(
            iconSpan.exists(),
            `SectionMessage variant="${variant}": span do ícone deve existir`,
          ).toBe(true)

          const iconEl = iconSpan.element as HTMLElement
          const iconColor = iconEl.style.color

          expect(
            iconColor.length > 0,
            `SectionMessage variant="${variant}": color do ícone não deve ser vazio, recebeu "${iconColor}"`,
          ).toBe(true)

          wrapper.unmount()
        },
      ),
      { numRuns: 6, seed: 84 },
    )
  })

  /**
   * **Validates: Requirements 3.1**
   *
   * Concreto: slots padrão e actions renderizam no local correto.
   */
  it('SectionMessage com slot padrão e slot actions: renderiza conteúdo nos locais corretos', async () => {
    const wrapper = mount(SectionMessage, {
      props: { variant: 'information' },
      slots: {
        default: '<p class="body-content">Conteúdo do slot padrão</p>',
        actions: '<button class="action-btn">Ação</button>',
      },
    })
    await nextTick()

    // Slot padrão deve estar presente
    const bodyContent = wrapper.find('.body-content')
    expect(
      bodyContent.exists(),
      'Slot padrão deve renderizar o conteúdo',
    ).toBe(true)
    expect(bodyContent.text()).toBe('Conteúdo do slot padrão')

    // Slot actions deve estar presente abaixo do conteúdo
    const actionBtn = wrapper.find('.action-btn')
    expect(
      actionBtn.exists(),
      'Slot actions deve renderizar',
    ).toBe(true)

    // O container das actions deve estar após o conteúdo principal (mt-3 flex gap-2)
    const actionsContainer = wrapper.find('.mt-3.flex.gap-2')
    expect(
      actionsContainer.exists(),
      'Container do slot actions deve existir com classes mt-3 flex gap-2',
    ).toBe(true)

    wrapper.unmount()
  })
})

// ─── Preservation 3: Button — props booleanas produzem classes consistentes ──

describe('Preservation — Button: combinações de props booleanas produzem classes CSS consistentes', () => {
  /**
   * **Validates: Requirements 3.5**
   *
   * fc.record({ isSelected, loading, shouldFitContainer }): para qualquer combinação
   * de props booleanas do Button, as classes CSS são consistentes com cada prop individualmente:
   *   - isSelected=true → contém 'ring-2' e 'ring-ring'
   *   - shouldFitContainer=true → contém 'w-full'
   *   - loading=true → aria-busy="true" e spinner renderizado
   *
   * Usando variant='default' para isolar as props booleanas.
   */
  it('para qualquer combinação de props booleanas: classes são consistentes com cada prop', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          isSelected: fc.boolean(),
          loading: fc.boolean(),
          shouldFitContainer: fc.boolean(),
        }),
        async ({ isSelected, loading, shouldFitContainer }) => {
          const wrapper = mount(Button, {
            props: {
              variant: 'default',
              isSelected,
              loading,
              shouldFitContainer,
            },
          })
          await nextTick()

          const el = wrapper.element as HTMLElement
          const classes = el.className

          // isSelected=true → ring-2 e ring-ring presentes
          if (isSelected) {
            expect(
              classes,
              `isSelected=true: esperado "ring-2" nas classes, recebeu "${classes}"`,
            ).toContain('ring-2')
            expect(
              classes,
              `isSelected=true: esperado "ring-ring" nas classes, recebeu "${classes}"`,
            ).toContain('ring-ring')
          } else {
            expect(
              classes,
              `isSelected=false: "ring-2" NÃO deve estar nas classes, recebeu "${classes}"`,
            ).not.toContain('ring-2')
          }

          // shouldFitContainer=true → w-full presente
          if (shouldFitContainer) {
            expect(
              classes,
              `shouldFitContainer=true: esperado "w-full" nas classes, recebeu "${classes}"`,
            ).toContain('w-full')
          } else {
            expect(
              classes,
              `shouldFitContainer=false: "w-full" NÃO deve estar nas classes, recebeu "${classes}"`,
            ).not.toContain('w-full')
          }

          // loading=true → aria-busy="true" presente
          if (loading) {
            const ariaBusy = el.getAttribute('aria-busy')
            expect(
              ariaBusy,
              `loading=true: esperado aria-busy="true", recebeu "${ariaBusy}"`,
            ).toBe('true')

            // Spinner deve estar renderizado
            const spinner = wrapper.find('.animate-spin')
            expect(
              spinner.exists(),
              `loading=true: spinner deve estar renderizado`,
            ).toBe(true)
          }

          wrapper.unmount()
        },
      ),
      { numRuns: 40, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 3.5**
   *
   * Concreto: Button com disabled=true não emite click ao ser clicado.
   */
  it('Button com disabled=true: não emite evento click ao ser clicado', async () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'default',
        disabled: true,
      },
    })
    await nextTick()

    await wrapper.trigger('click')

    expect(
      wrapper.emitted('click'),
      'Button com disabled=true não deve emitir evento click',
    ).toBeFalsy()

    wrapper.unmount()
  })

  /**
   * **Validates: Requirements 3.5**
   *
   * Concreto: Button com isSelected=true — classes ring-2 e ring-ring presentes.
   */
  it('Button com isSelected=true: classes ring-2 e ring-ring presentes', async () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'default',
        isSelected: true,
      },
    })
    await nextTick()

    const classes = wrapper.element.className
    expect(classes).toContain('ring-2')
    expect(classes).toContain('ring-ring')

    wrapper.unmount()
  })

  /**
   * **Validates: Requirements 3.5**
   *
   * Concreto: Button com loading=true — aria-busy="true" e spinner renderizado.
   */
  it('Button com loading=true: aria-busy="true" e spinner renderizado', async () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'default',
        loading: true,
      },
    })
    await nextTick()

    const el = wrapper.element as HTMLElement
    expect(el.getAttribute('aria-busy')).toBe('true')

    const spinner = wrapper.find('.animate-spin')
    expect(spinner.exists()).toBe(true)

    wrapper.unmount()
  })

  /**
   * **Validates: Requirements 3.5**
   *
   * Concreto: Button com shouldFitContainer=true — classe w-full presente.
   */
  it('Button com shouldFitContainer=true: classe w-full presente', async () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'default',
        shouldFitContainer: true,
      },
    })
    await nextTick()

    const classes = wrapper.element.className
    expect(classes).toContain('w-full')

    wrapper.unmount()
  })
})

// ─── Preservation 4: Flag — aria-live por severidade ─────────────────────────

describe('Preservation — Flag: aria-live por severidade de variant', () => {
  /**
   * **Validates: Requirements 3.3**
   *
   * Para qualquer variant de Flag:
   *   - aria-live é "assertive" ↔ variant é 'error'
   *   - aria-live é "polite" para todas as demais variants
   */
  it('para qualquer variant de Flag: aria-live é "assertive" ↔ variant é "error"', async () => {
    await fc.assert(
      fc.asyncProperty(
        flagVariants,
        async (variant) => {
          const wrapper = mount(Flag, {
            props: {
              title: 'Test',
              variant,
            },
          })
          await nextTick()

          const el = wrapper.element as HTMLElement
          const ariaLive = el.getAttribute('aria-live')
          const expectedAriaLive = variant === 'error' ? 'assertive' : 'polite'

          expect(
            ariaLive,
            `Flag variant="${variant}": esperado aria-live="${expectedAriaLive}", recebeu "${ariaLive}"`,
          ).toBe(expectedAriaLive)

          wrapper.unmount()
        },
      ),
      { numRuns: 5, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 3.3**
   *
   * Concreto: Flag variant='error' → aria-live="assertive".
   */
  it('Flag com variant="error": aria-live="assertive"', async () => {
    const wrapper = mount(Flag, {
      props: { title: 'Error flag', variant: 'error' },
    })
    await nextTick()

    expect((wrapper.element as HTMLElement).getAttribute('aria-live')).toBe('assertive')
    wrapper.unmount()
  })

  /**
   * **Validates: Requirements 3.3**
   *
   * Concreto: Flag com variants não-error → aria-live="polite".
   */
  it('Flag com variants não-error: aria-live="polite"', async () => {
    const nonErrorVariants = ['normal', 'warning', 'success', 'discovery'] as const

    for (const variant of nonErrorVariants) {
      const wrapper = mount(Flag, {
        props: { title: 'Non-error flag', variant },
      })
      await nextTick()

      expect(
        (wrapper.element as HTMLElement).getAttribute('aria-live'),
        `Flag variant="${variant}": esperado "polite"`,
      ).toBe('polite')

      wrapper.unmount()
    }
  })
})

// ─── Preservation 5: SectionMessage — aria-live por severidade ───────────────

describe('Preservation — SectionMessage: aria-live por severidade de variant', () => {
  /**
   * **Validates: Requirements 3.4**
   *
   * Para qualquer variant de SectionMessage:
   *   - aria-live é "assertive" ↔ variant é 'error'
   *   - aria-live é "polite" para todas as demais variants
   */
  it('para qualquer variant de SectionMessage: aria-live é "assertive" ↔ variant é "error"', async () => {
    await fc.assert(
      fc.asyncProperty(
        sectionMessageVariants,
        async (variant) => {
          const wrapper = mount(SectionMessage, {
            props: { variant },
          })
          await nextTick()

          const el = wrapper.element as HTMLElement
          const ariaLive = el.getAttribute('aria-live')
          const expectedAriaLive = variant === 'error' ? 'assertive' : 'polite'

          expect(
            ariaLive,
            `SectionMessage variant="${variant}": esperado aria-live="${expectedAriaLive}", recebeu "${ariaLive}"`,
          ).toBe(expectedAriaLive)

          wrapper.unmount()
        },
      ),
      { numRuns: 6, seed: 42 },
    )
  })

  /**
   * **Validates: Requirements 3.4**
   *
   * Concreto: SectionMessage variant='error' → aria-live="assertive".
   */
  it('SectionMessage com variant="error": aria-live="assertive"', async () => {
    const wrapper = mount(SectionMessage, {
      props: { variant: 'error' },
    })
    await nextTick()

    expect((wrapper.element as HTMLElement).getAttribute('aria-live')).toBe('assertive')
    wrapper.unmount()
  })

  /**
   * **Validates: Requirements 3.4**
   *
   * Concreto: SectionMessage com variants não-error → aria-live="polite".
   */
  it('SectionMessage com variants não-error: aria-live="polite"', async () => {
    const nonErrorVariants = ['information', 'warning', 'success', 'discovery', 'change'] as const

    for (const variant of nonErrorVariants) {
      const wrapper = mount(SectionMessage, {
        props: { variant },
      })
      await nextTick()

      expect(
        (wrapper.element as HTMLElement).getAttribute('aria-live'),
        `SectionMessage variant="${variant}": esperado "polite"`,
      ).toBe('polite')

      wrapper.unmount()
    }
  })
})
