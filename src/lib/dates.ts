import { weddingConfig, type WeddingEvent } from '../config/wedding.ts'

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
]

export interface ParsedDate {
  day: number
  /** 1-12 */
  month: number
  monthName: string
}

/** "6 November" → { day: 6, month: 11 } */
export function parseDate(date: string): ParsedDate | null {
  const m = date.trim().match(/^(\d{1,2})\s+([A-Za-z]+)$/)
  if (!m) return null
  const monthIndex = MONTHS.indexOf(m[2].toLowerCase())
  if (monthIndex < 0) return null
  const name = MONTHS[monthIndex]
  return { day: Number(m[1]), month: monthIndex + 1, monthName: name[0].toUpperCase() + name.slice(1) }
}

/** "7:00 PM" → { hours: 19, minutes: 0 } */
export function parseTime(time: string): { hours: number; minutes: number } | null {
  const m = time.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i)
  if (!m) return null
  let hours = Number(m[1]) % 12
  if (m[3].toUpperCase() === 'PM') hours += 12
  return { hours, minutes: Number(m[2] ?? 0) }
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Absolute start instant of an event, interpreted in Pakistan time (UTC+5)
 * regardless of the guest's device timezone. Events without a time start at
 * 00:00 PKT. Returns null while the year is not configured.
 */
export function eventStart(event: WeddingEvent, year = weddingConfig.year): Date | null {
  if (!year) return null
  const d = parseDate(event.date)
  if (!d) return null
  const t = parseTime(event.time) ?? { hours: 0, minutes: 0 }
  const iso = `${year}-${pad(d.month)}-${pad(d.day)}T${pad(t.hours)}:${pad(t.minutes)}:00${weddingConfig.timezone.utcOffset}`
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : date
}

/** Weekday name for a calendar date. Uses UTC maths so the device timezone can't shift the day. */
export function weekday(event: WeddingEvent, year = weddingConfig.year): string | null {
  if (!year) return null
  const d = parseDate(event.date)
  if (!d) return null
  return new Date(Date.UTC(year, d.month - 1, d.day)).toLocaleDateString('en-GB', {
    weekday: 'long',
    timeZone: 'UTC',
  })
}

/** "6 – 8 November 2026", "6 & 8 November", "8 November" … for the events in a version. */
export function dateRangeLabel(events: WeddingEvent[], year = weddingConfig.year): string {
  const parsed = events.map((e) => parseDate(e.date))
  const suffix = year ? ` ${year}` : ''
  if (parsed.some((d) => !d)) return events.map((e) => e.date).join(' · ') + suffix
  const dates = parsed as ParsedDate[]
  const sameMonth = dates.every((d) => d.month === dates[0].month)
  if (dates.length === 1) return `${dates[0].day} ${dates[0].monthName}${suffix}`
  if (!sameMonth) return events.map((e) => e.date).join(' · ') + suffix
  const days = dates.map((d) => d.day)
  const consecutive = days.every((d, i) => i === 0 || d === days[i - 1] + 1)
  const range = consecutive
    ? `${days[0]} – ${days[days.length - 1]}`
    : `${days.slice(0, -1).join(', ')} & ${days[days.length - 1]}`
  return `${range} ${dates[0].monthName}${suffix}`
}

export { pad }
