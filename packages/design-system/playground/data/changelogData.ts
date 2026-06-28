// playground/data/changelogData.ts
// Lê e parseia o CHANGELOG.md da raiz do repositório diretamente.
// Fonte única de verdade: /CHANGELOG.md

import rawChangelog from '../../../../CHANGELOG.md?raw'

export type ChangelogType = 'Added' | 'Changed' | 'Fixed'

export interface ChangelogChange {
  type: ChangelogType
  desc: string
}

export interface ChangelogEntry {
  version: string
  date: string // ISO 8601: 'YYYY-MM-DD'
  changes: ChangelogChange[]
}

function parseChangelog(raw: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = []

  // Split into version blocks: ## [x.y.z] - YYYY-MM-DD
  const versionBlocks = raw.split(/^## /m).slice(1)

  for (const block of versionBlocks) {
    const headerMatch = block.match(/^\[([^\]]+)\]\s*-\s*(\d{4}-\d{2}-\d{2})/)
    if (!headerMatch) continue

    const version = headerMatch[1]
    const date = headerMatch[2]
    const changes: ChangelogChange[] = []

    // Split into subsections: ### Added / ### Changed / ### Fixed
    const sections = block.split(/^### /m).slice(1)

    for (const section of sections) {
      const lines = section.split('\n')
      const sectionTitle = lines[0].trim()

      let type: ChangelogType | null = null
      if (sectionTitle === 'Added') type = 'Added'
      else if (sectionTitle === 'Changed') type = 'Changed'
      else if (sectionTitle === 'Fixed') type = 'Fixed'
      if (!type) continue

      // Collect bullet items (lines starting with '- ')
      for (const line of lines.slice(1)) {
        const itemMatch = line.match(/^-\s+(.+)/)
        if (!itemMatch) continue
        // Strip markdown bold markers (**text**) for plain text display
        const desc = itemMatch[1].replace(/\*\*([^*]+)\*\*/g, '$1').trim()
        if (desc) changes.push({ type, desc })
      }
    }

    if (changes.length > 0) {
      entries.push({ version, date, changes })
    }
  }

  return entries
}

export const changelogEntries: ChangelogEntry[] = parseChangelog(rawChangelog)
