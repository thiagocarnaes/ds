import { cva, type VariantProps } from 'class-variance-authority'

export const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm',
  {
    variants: {
      variant: {
        info: 'border-primary/30 bg-primary/10 text-foreground',
        success: 'border-success/30 bg-success/10 text-foreground',
        warning: 'border-warning/30 bg-warning/10 text-foreground',
        error: 'border-destructive/30 bg-destructive/10 text-foreground',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
)

export type AlertVariants = VariantProps<typeof alertVariants>
