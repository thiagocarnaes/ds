import { describe, expect, it } from 'vitest'
import {
  buildCalendarMonthGrid,
  dateInputPlaceholder,
  formatIsoForLocale,
  parseLocaleDateInput,
  toIsoDate,
} from '@/lib/dateUtils'

describe('dateUtils', () => {
  it('formats and parses pt-BR dates', () => {
    expect(formatIsoForLocale('2026-06-15', 'pt-BR')).toBe('15/06/2026')
    expect(parseLocaleDateInput('15/06/2026', 'pt-BR')).toBe('2026-06-15')
    expect(dateInputPlaceholder('pt-BR')).toBe('dd/mm/aaaa')
  })

  it('formats and parses en-US dates', () => {
    expect(formatIsoForLocale('2026-06-15', 'en')).toBe('06/15/2026')
    expect(parseLocaleDateInput('06/15/2026', 'en')).toBe('2026-06-15')
    expect(dateInputPlaceholder('en')).toBe('mm/dd/yyyy')
  })

  it('builds a 6-week calendar grid', () => {
    const grid = buildCalendarMonthGrid(2026, 5, '2026-06-16', 'pt-BR')
    expect(grid).toHaveLength(42)
    expect(grid.some((day) => day.iso === '2026-06-16' && day.isSelected)).toBe(true)
    expect(grid.some((day) => day.iso === toIsoDate(new Date()) && day.isToday)).toBe(true)
  })
})
