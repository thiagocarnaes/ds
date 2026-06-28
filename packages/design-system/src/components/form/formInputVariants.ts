import { cva, type VariantProps } from 'class-variance-authority'

export const formInputVariants = cva(
  'flex w-full rounded-[var(--ds-radius-input)] border bg-input-background text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 read-only:cursor-default',
  {
    variants: {
      size: {
        compact: 'h-7 px-2 text-xs',
        sm: 'h-8 px-2 text-xs',
        md: 'h-9 px-3 text-sm',
        lg: 'h-10 px-4 text-base',
      },
      error: {
        true: 'border-destructive focus-visible:ring-destructive/30',
        false: 'border-border',
      },
      success: {
        true: 'border-success focus-visible:ring-success/30',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      error: false,
      success: false,
    },
  },
)

export const formTextareaVariants = cva(
  'flex w-full rounded-[var(--ds-radius-input)] border bg-input-background text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 read-only:cursor-default resize-y',
  {
    variants: {
      size: {
        sm: 'min-h-16 px-2 py-1.5 text-xs',
        md: 'min-h-20 px-3 py-2 text-sm',
        lg: 'min-h-24 px-4 py-3 text-base',
      },
      error: {
        true: 'border-destructive focus-visible:ring-destructive/30',
        false: 'border-border',
      },
    },
    defaultVariants: {
      size: 'md',
      error: false,
    },
  },
)

export type FormInputVariants = VariantProps<typeof formInputVariants>
export type FormTextareaVariants = VariantProps<typeof formTextareaVariants>
