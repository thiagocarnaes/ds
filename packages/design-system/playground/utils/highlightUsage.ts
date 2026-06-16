function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Lightweight JSX/Vue snippet highlighter for Usage blocks. */
export function highlightUsage(code: string): string {
  let html = escapeHtml(code)

  html = html.replace(/(&quot;[^&]*?&quot;)/g, '<span class="pg-usage-str">$1</span>')
  html = html.replace(
    /(&lt;\/?)([A-Z][A-Za-z0-9]*)/g,
    '$1<span class="pg-usage-tag">$2</span>',
  )
  html = html.replace(
    /(\s)([a-zA-Z][\w-]*)(=)/g,
    '$1<span class="pg-usage-attr">$2</span>=',
  )
  html = html.replace(
    /(&gt;\s*\n\s*)([^&<\n][^<\n]*)(\s*\n\s*&lt;\/)/g,
    '$1<span class="pg-usage-text">$2</span>$3',
  )

  return html
}
