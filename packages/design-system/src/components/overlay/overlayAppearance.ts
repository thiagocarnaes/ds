import { semanticSurfaceClasses } from '@/lib/semanticSurfaceClasses'

export type OverlayAppearance = 'primary' | 'ghost' | 'outline' | 'danger'

export const overlayAppearanceClasses: Record<OverlayAppearance, string> = {
  outline: semanticSurfaceClasses.outline,
  primary: 'border-transparent bg-popover text-popover-foreground',
  ghost: semanticSurfaceClasses.ghost,
  danger:
    'border-destructive/40 bg-destructive/45 text-destructive-foreground backdrop-blur-sm [&_*]:text-destructive-foreground',
}

/** @deprecated Use OverlayAppearance */
export type TooltipAppearance = OverlayAppearance

/** @deprecated Use OverlayAppearance */
export type PopoverAppearance = OverlayAppearance
