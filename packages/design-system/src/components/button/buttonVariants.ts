import { cva, type VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--ds-radius-button)] text-sm font-medium outline-none transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-[3px] focus-visible:ring-ring/50 ds-button-shadow hover:-translate-y-0.5 active:translate-y-px active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'border-0 bg-primary text-primary-foreground shadow-[var(--ds-button-shadow)] hover:bg-primary/90 hover:shadow-[var(--ds-button-shadow-hover)] active:shadow-[var(--ds-button-shadow-pressed)]',
        primary:
          'border-0 bg-primary text-primary-foreground shadow-[var(--ds-button-shadow)] hover:bg-primary/90 hover:shadow-[var(--ds-button-shadow-hover)] active:shadow-[var(--ds-button-shadow-pressed)]',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline:
          'border-0 bg-background shadow-[var(--ds-button-shadow)] hover:bg-[--ds-color-bg-hovered] hover:text-text-hovered hover:shadow-[var(--ds-button-shadow-hover)] active:shadow-[var(--ds-button-shadow-pressed)]',
        ghost: 'bg-white/[0.03] hover:bg-[--ds-color-bg-hovered] hover:text-text-hovered',
        destructive:
          'border-0 bg-destructive text-destructive-foreground shadow-[var(--ds-button-shadow)] hover:bg-destructive/90 hover:shadow-[var(--ds-button-shadow-hover)] active:shadow-[var(--ds-button-shadow-pressed)]',
        warning: 'bg-warning text-white hover:bg-warning/90',
        discovery: 'bg-[--ds-color-purple-400] text-white hover:bg-[--ds-color-purple-400]/90',
        subtle: 'bg-white/[0.03] hover:bg-[--ds-color-bg-hovered] text-foreground',
        clean:
          'border-0 bg-transparent text-foreground !shadow-none hover:bg-[--ds-color-bg-hovered] hover:!shadow-none active:bg-[--ds-color-bg-pressed] active:!shadow-none',
        link:
          'border-0 bg-transparent text-primary decoration-current underline-offset-4 !shadow-none hover:bg-transparent hover:underline hover:!shadow-none active:bg-transparent active:underline active:!shadow-none',
      },
      size: {
        default: 'h-9 px-4 py-2',
        md: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-6',
        icon: 'size-9 rounded-md p-0',
        compact: 'h-7 px-3 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
