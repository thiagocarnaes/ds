/** Convert camelCase prop names to kebab-case for Vue template examples. */
export function propTemplateName(name: string): string {
  if (name.includes('-')) return name
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

/** Format prop names as template bindings (:show-header). */
export function propTemplateBinding(name: string): string {
  return `:${propTemplateName(name)}`
}

/** Format string literal prop bindings (:variant="'primary'"). */
export function templateStringAttr(name: string, value: string | number): string {
  if (typeof value === 'number') {
    return `${propTemplateBinding(name)}="${value}"`
  }
  const escaped = value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  return `${propTemplateBinding(name)}="'${escaped}'"`
}

/** Format boolean prop bindings for snippets (:disabled="false"). */
export function templateBooleanAttr(name: string, value: boolean): string {
  return `${propTemplateBinding(name)}="${value}"`
}

/** Format dynamic prop bindings for snippets (:columns="columns"). */
export function templateBoundAttr(name: string, expression: string): string {
  return `${propTemplateBinding(name)}="${expression}"`
}

/** Playground usage snippets — embed the current control value with : bindings. */
export function playgroundSnippetAttr(name: string, value: string | number | boolean): string {
  if (typeof value === 'boolean') return templateBooleanAttr(name, value)
  return templateStringAttr(name, value)
}

const ALLOWED_BARE_ATTRS = new Set(['class'])

/** Find component prop names in usage templates that are missing a : binding prefix. */
export function findBareComponentProps(template: string): string[] {
  const violations: string[] = []

  for (const line of template.split('\n')) {
    const trimmed = line.trim()
    if (
      !trimmed ||
      trimmed.startsWith('<!--') ||
      trimmed.startsWith('//') ||
      trimmed.startsWith('v-model')
    ) {
      continue
    }

    const leadingAttr = trimmed.match(/^([a-z][-a-z0-9]*)="/)
    if (leadingAttr && !ALLOWED_BARE_ATTRS.has(leadingAttr[1])) {
      violations.push(leadingAttr[1])
    }

    for (const tag of trimmed.matchAll(/<([A-Z][A-Za-z0-9]*)\s([^>]+)>/g)) {
      for (const attr of tag[2].matchAll(/(?:^|\s)(?!v-model(?::[\w-]+)?=)([a-z][-a-z0-9]*)="/g)) {
        if (!ALLOWED_BARE_ATTRS.has(attr[1])) {
          violations.push(`${tag[1]}.${attr[1]}`)
        }
      }
    }
  }

  return violations
}

/** Convert event names like update:modelValue to update:model-value. */
export function eventTemplateName(name: string): string {
  const colon = name.indexOf(':')
  if (colon === -1) return propTemplateName(name)
  return `${name.slice(0, colon + 1)}${propTemplateName(name.slice(colon + 1))}`
}

/** Format v-model names for template docs (v-model:menu-collapsed). */
export function modelTemplateName(name: string): string {
  return `v-model:${propTemplateName(name)}`
}

/** Format slot scope bindings for template docs. */
export function slotBindingsTemplate(bindings: string | undefined): string {
  if (!bindings) return '—'
  return bindings.replace(/\b([a-z][a-zA-Z0-9]*)\b/g, (_, word: string) => propTemplateName(word))
}
