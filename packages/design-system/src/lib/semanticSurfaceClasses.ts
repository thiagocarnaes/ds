/** Semantic surfaces — border and fill share the same token and opacity. */
export const semanticSurfaceClasses = {
  outline: 'border-border bg-popover text-popover-foreground',
  ghost: 'border-transparent bg-muted/45 text-muted-foreground backdrop-blur-sm',
  primary: 'border-primary/50 bg-primary/50 text-foreground',
  info: 'border-primary/50 bg-primary/50 text-foreground',
  success: 'border-success/50 bg-success/50 text-foreground',
  warning: 'border-warning/50 bg-warning/50 text-foreground',
  danger: 'border-destructive/50 bg-destructive/50 text-destructive-foreground [&_*]:text-destructive-foreground',
  error: 'border-destructive/50 bg-destructive/50 text-destructive-foreground [&_*]:text-destructive-foreground',
} as const
