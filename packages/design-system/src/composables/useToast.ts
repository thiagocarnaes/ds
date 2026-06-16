import { reactive } from 'vue'

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export const TOAST_POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const

export type ToastPosition = (typeof TOAST_POSITIONS)[number]

export interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
  position: ToastPosition
  dismissible: boolean
}

export interface ShowToastOptions {
  position?: ToastPosition
  dismissible?: boolean
}

type ToastShowArg = ToastPosition | ShowToastOptions | undefined

const TOAST_DURATION_MS = 3000
const DEFAULT_TOAST_POSITION: ToastPosition = 'top-right'

const state = reactive({
  toasts: [] as ToastItem[],
})

const timeouts = new Map<string, number>()

let nextId = 0

function resolveShowOptions(arg?: ToastShowArg): {
  position: ToastPosition
  dismissible: boolean
} {
  if (typeof arg === 'string') {
    return { position: arg, dismissible: false }
  }

  return {
    position: arg?.position ?? DEFAULT_TOAST_POSITION,
    dismissible: arg?.dismissible ?? false,
  }
}

function removeToast(id: string): void {
  const timeoutId = timeouts.get(id)

  if (timeoutId !== undefined) {
    window.clearTimeout(timeoutId)
    timeouts.delete(id)
  }

  const index = state.toasts.findIndex((toast) => toast.id === id)

  if (index !== -1) {
    state.toasts.splice(index, 1)
  }
}

function addToast(variant: ToastVariant, message: string, options?: ToastShowArg): void {
  const { position, dismissible } = resolveShowOptions(options)
  const id = String(++nextId)

  state.toasts.push({ id, message, variant, position, dismissible })

  const timeoutId = window.setTimeout(() => {
    removeToast(id)
  }, TOAST_DURATION_MS)

  timeouts.set(id, timeoutId)
}

export function useToast() {
  return {
    toasts: state.toasts,
    success: (message: string, options?: ToastShowArg) =>
      addToast('success', message, options),
    error: (message: string, options?: ToastShowArg) =>
      addToast('error', message, options),
    info: (message: string, options?: ToastShowArg) =>
      addToast('info', message, options),
    warning: (message: string, options?: ToastShowArg) =>
      addToast('warning', message, options),
    dismiss: removeToast,
  }
}
