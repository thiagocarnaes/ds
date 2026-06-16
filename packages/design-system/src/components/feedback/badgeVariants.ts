import { cva, type VariantProps } from 'class-variance-authority'

export const badgeAppearances = [
  'default',
  'primary',
  'important',
  'added',
  'removed',
] as const

export type BadgeAppearance = (typeof badgeAppearances)[number]

/** Maps legacy variant names to Figma appearances. */
export const badgeVariantToAppearance: Record<string, BadgeAppearance> = {
  default: 'default',
  secondary: 'default',
  outline: 'default',
  primary: 'primary',
  destructive: 'important',
  important: 'important',
  success: 'added',
  added: 'added',
  warning: 'removed',
  removed: 'removed',
}

export const badgeAppearanceStyles: Record<
  BadgeAppearance,
  { color: string; glow: string; bg: string }
> = {
  default: {
    color: '#7BA3C8',
    glow: 'rgba(123, 163, 200, 0.35)',
    bg: 'rgba(123, 163, 200, 0.08)',
  },
  primary: {
    color: '#00D4FF',
    glow: 'rgba(0, 212, 255, 0.45)',
    bg: 'rgba(0, 212, 255, 0.1)',
  },
  important: {
    color: '#FF3D57',
    glow: 'rgba(255, 61, 87, 0.45)',
    bg: 'rgba(255, 61, 87, 0.1)',
  },
  added: {
    color: '#00E5B0',
    glow: 'rgba(0, 229, 176, 0.45)',
    bg: 'rgba(0, 229, 176, 0.1)',
  },
  removed: {
    color: '#FF8B00',
    glow: 'rgba(255, 139, 0, 0.45)',
    bg: 'rgba(255, 139, 0, 0.1)',
  },
}

export const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full font-semibold tabular-nums leading-none',
  {
    variants: {
      size: {
        sm: 'min-h-7 min-w-7 px-2 text-xs',
        md: 'min-h-8 min-w-8 px-2.5 text-sm',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
