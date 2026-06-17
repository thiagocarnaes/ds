export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function parseIsoDate(iso: string): Date | null {
  if (!ISO_DATE.test(iso)) return null
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function resolveIntlLocale(locale?: string): string {
  return locale === 'pt-BR' ? 'pt-BR' : 'en-US'
}

export function formatIsoForLocale(iso: string, locale?: string): string {
  const date = parseIsoDate(iso)
  if (!date) return ''
  return new Intl.DateTimeFormat(resolveIntlLocale(locale), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function dateInputPlaceholder(locale?: string): string {
  return locale === 'pt-BR' ? 'dd/mm/aaaa' : 'mm/dd/yyyy'
}

export function parseLocaleDateInput(value: string, locale?: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return ''

  const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/)
  if (!match) return null

  const first = Number(match[1])
  const second = Number(match[2])
  let year = Number(match[3])
  if (year < 100) year += 2000

  const day = locale === 'pt-BR' ? first : second
  const month = locale === 'pt-BR' ? second : first

  if (month < 1 || month > 12 || day < 1 || day > 31) return null

  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return toIsoDate(date)
}

export function getWeekdayLabels(locale?: string): string[] {
  const intlLocale = resolveIntlLocale(locale)
  const sunday = new Date(2024, 0, 7)
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(sunday)
    date.setDate(sunday.getDate() + index)
    return new Intl.DateTimeFormat(intlLocale, { weekday: 'narrow' }).format(date)
  })
}

export function formatMonthYear(year: number, month: number, locale?: string): string {
  const intlLocale = resolveIntlLocale(locale)
  const formatted = new Intl.DateTimeFormat(intlLocale, {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month, 1))
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export interface CalendarDayCell {
  iso: string
  day: number
  inMonth: boolean
  isToday: boolean
  isSelected: boolean
}

export function buildCalendarMonthGrid(
  year: number,
  month: number,
  selectedIso: string,
  locale?: string,
): CalendarDayCell[] {
  void locale
  const todayIso = toIsoDate(new Date())
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPreviousMonth = new Date(year, month, 0).getDate()
  const cells: CalendarDayCell[] = []

  for (let index = firstDay - 1; index >= 0; index -= 1) {
    const day = daysInPreviousMonth - index
    const date = new Date(year, month - 1, day)
    const iso = toIsoDate(date)
    cells.push({
      iso,
      day,
      inMonth: false,
      isToday: iso === todayIso,
      isSelected: iso === selectedIso,
    })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day)
    const iso = toIsoDate(date)
    cells.push({
      iso,
      day,
      inMonth: true,
      isToday: iso === todayIso,
      isSelected: iso === selectedIso,
    })
  }

  let nextMonthDay = 1
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const date = new Date(year, month + 1, nextMonthDay)
    nextMonthDay += 1
    const iso = toIsoDate(date)
    cells.push({
      iso,
      day: date.getDate(),
      inMonth: false,
      isToday: iso === todayIso,
      isSelected: iso === selectedIso,
    })
  }

  return cells
}
