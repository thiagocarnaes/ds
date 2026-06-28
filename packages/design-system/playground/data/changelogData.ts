// playground/data/changelogData.ts

export type ChangelogType = 'Added' | 'Changed' | 'Fixed'

export interface ChangelogChange {
  type: ChangelogType
  descKey: string  // chave i18n
}

export interface ChangelogEntry {
  version: string
  date: string  // ISO 8601: 'YYYY-MM-DD'
  changes: ChangelogChange[]  // 1–3 itens
}

export const changelogEntries: ChangelogEntry[] = [
  {
    version: '0.17.0',
    date: '2025-01-15',
    changes: [
      { type: 'Added', descKey: 'changelog.v0170.added1' },
      { type: 'Changed', descKey: 'changelog.v0170.changed1' },
    ],
  },
  {
    version: '0.16.0',
    date: '2024-12-10',
    changes: [
      { type: 'Added', descKey: 'changelog.v0160.added1' },
      { type: 'Fixed', descKey: 'changelog.v0160.fixed1' },
    ],
  },
  {
    version: '0.15.0',
    date: '2024-11-05',
    changes: [
      { type: 'Added', descKey: 'changelog.v0150.added1' },
    ],
  },
  {
    version: '0.14.0',
    date: '2024-10-01',
    changes: [
      { type: 'Changed', descKey: 'changelog.v0140.changed1' },
      { type: 'Fixed', descKey: 'changelog.v0140.fixed1' },
    ],
  },
]
