import type { PlaygroundMessages } from '../i18n/types'

type ChatReplies = PlaygroundMessages['chatPlayground']['replies']

export function resolveChatReply(text: string, replies: ChatReplies): string {
  const lower = text.toLowerCase()

  if (
    lower.includes('button') ||
    lower.includes('botão') ||
    lower.includes('botao')
  ) {
    return replies.button
  }

  if (lower.includes('token')) {
    return replies.tokens
  }

  if (
    lower.includes('spacing') ||
    lower.includes('espaçamento') ||
    lower.includes('espacamento')
  ) {
    return replies.spacing
  }

  if (
    lower.includes('color') ||
    lower.includes('cor') ||
    lower.includes('palette') ||
    lower.includes('paleta')
  ) {
    return replies.colors
  }

  return replies.default
}
