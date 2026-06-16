import { cn } from '@/lib/utils'

export const SIDEBAR_MENU_ROW_CLASS = 'h-8'

/** Single row layout — labels clip via parent overflow during width animation. */
export function sidebarMenuTriggerClass(): string {
  return cn(
    SIDEBAR_MENU_ROW_CLASS,
    'flex w-full min-w-0 items-center gap-2 rounded-md text-left text-xs transition-colors',
  )
}

export function sidebarMenuIconClass(): string {
  return 'flex w-8 shrink-0 items-center justify-center'
}

export function sidebarMenuLabelClass(): string {
  return 'min-w-0 flex-1 truncate whitespace-nowrap'
}

export function sidebarMenuChevronClass(): string {
  return 'size-3.5 shrink-0 text-muted-foreground'
}

export function sidebarMenuStateClass(active: boolean): string {
  if (active) {
    return 'font-medium text-primary'
  }

  return 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
}

export function sidebarMenuIconStateClass(active: boolean, collapsed: boolean): string {
  if (!active) {
    return ''
  }

  if (collapsed) {
    return 'rounded-md bg-primary/15 text-primary shadow-[0_0_10px_rgba(0,212,255,0.2)]'
  }

  return 'text-primary'
}
