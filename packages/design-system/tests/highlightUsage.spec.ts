import { describe, expect, it } from 'vitest'
import { highlightUsage } from '../playground/utils/highlightUsage'

describe('highlightUsage', () => {
  it('highlights DataTable snippet without breaking span tags', () => {
    const code = `<DataTable
  v-model:search="search"
  row-key="id"
  @request="fetchRows"
>
  <template #cell-status="{ value }">
    <Lozenge variant="success">{{ value }}</Lozenge>
  </template>
</DataTable>`

    const html = highlightUsage(code)

    expect(html).toContain('<span class="pg-usage-tag">DataTable</span>')
    expect(html).toContain('<span class="pg-usage-attr">v-model:search</span>=<span class="pg-usage-str">&quot;search&quot;</span>')
    expect(html).not.toContain('class=class=')
    expect(html).not.toMatch(/pg-usage-str">"[^"]*"[^<]*class="pg-usage-attr">class/)
  })
})
