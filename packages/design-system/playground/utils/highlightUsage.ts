function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Lightweight JSX/Vue snippet highlighter for Usage blocks. */
export function highlightUsage(code: string): string {
  const strings: string[] = []
  let html = escapeHtml(code)

  html = html.replace(/&quot;[^&]*?&quot;/g, (match) => {
    strings.push(match)
    return `\0STR${strings.length - 1}\0`
  })

  html = html.replace(
    /(\s)((?:[@#][\w-]+)|(?:[a-zA-Z][\w:-]*))(=)/g,
    '$1<span class="pg-usage-attr">$2</span>=',
  )

  html = html.replace(
    /(&lt;\/?)([A-Z][A-Za-z0-9]*)/g,
    '$1<span class="pg-usage-tag">$2</span>',
  )

  html = html.replace(
    /(&gt;\s*\n\s*)([^&<\n][^<\n]*)(\s*\n\s*&lt;\/)/g,
    '$1<span class="pg-usage-text">$2</span>$3',
  )

  html = html.replace(/\0STR(\d+)\0/g, (_, index) => {
    return `<span class="pg-usage-str">${strings[Number(index)]}</span>`
  })

  return html
}
