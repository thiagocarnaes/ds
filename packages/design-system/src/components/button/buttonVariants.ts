import { cva, type VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--ds-radius-button)] text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-primary hover:bg-primary/90 hover:shadow-primary-hover',
        primary: 'bg-primary text-primary-foreground shadow-primary hover:bg-primary/90 hover:shadow-primary-hover',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-border bg-background hover:bg-[--ds-color-bg-hovered] hover:text-accent-foreground',
        ghost: 'hover:bg-[--ds-color-bg-hovered] hover:text-accent-foreground',
        destructive:
          'bg-destructive text-destructive-foreground shadow-destructive hover:bg-destructive/90 hover:shadow-destructive-hover',
        link: 'text-primary underline-offset-4 hover:underline',
        warning: 'bg-warning text-white hover:bg-warning/90',
        discovery: 'bg-[--ds-color-purple-400] text-white hover:bg-[--ds-color-purple-400]/90',
        subtle: 'hover:bg-[--ds-color-bg-hovered] text-foreground',
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
