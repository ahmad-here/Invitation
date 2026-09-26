import { weddingConfig, type VersionId, type WeddingEvent } from '../config/wedding.ts'
import { eventStart, parseDate, pad } from './dates.ts'
import { invitePath } from './version.ts'

/** Configured Google Maps link, or a Google Maps search for the venue name (never guessed coordinates). */
export function mapsLink(event: WeddingEvent): string {
  if (event.mapsUrl.trim()) return event.mapsUrl.trim()
  const query = encodeURIComponent(`${event.venue}, ${event.city}, Pakistan`)
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

/** The public link to this version of the invitation. */
export function inviteUrl(version: VersionId): string {
  // BASE_URL is "/" or e.g. "/Invitation/" on GitHub Pages.
  const base = (weddingConfig.siteUrl || window.location.origin + import.meta.env.BASE_URL).replace(/\/$/, '')
  return base + invitePath(version)
}

/** Prefixes a root-relative public path ("/audio/x.mp3") with the deploy base path. */
export function publicUrl(path: string): string {
  return path.startsWith('/') ? import.meta.env.BASE_URL + path.slice(1) : path
}

export function whatsappShareLink(version: VersionId): string {
  const text = weddingConfig.shareMessage.replace('{url}', inviteUrl(version))
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

// ---------------------------------------------------------------- calendar

interface CalendarRange {
  allDay: boolean
  start: string
  end: string
}

const utcStamp = (d: Date) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`

function calendarRange(event: WeddingEvent): CalendarRange | null {
  const year = weddingConfig.year
  const d = parseDate(event.date)
  const start = eventStart(event)
  if (!year || !d || !start) return null
  if (!event.time) {
    // All-day: date-only values, end date is exclusive.
    const next = new Date(Date.UTC(year, d.month - 1, d.day + 1))
    return {
      allDay: true,
      start: `${year}${pad(d.month)}${pad(d.day)}`,
      end: `${next.getUTCFullYear()}${pad(next.getUTCMonth() + 1)}${pad(next.getUTCDate())}`,
    }
  }
  const end = new Date(start.getTime() + weddingConfig.eventDurationHours * 3_600_000)
  return { allDay: false, start: utcStamp(start), end: utcStamp(end) }
}

const eventTitle = (e: WeddingEvent) => `${e.name}: ${weddingConfig.groom} & ${weddingConfig.bride}`

export function googleCalendarLink(event: WeddingEvent): string | null {
  const range = calendarRange(event)
  if (!range) return null
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventTitle(event),
    dates: `${range.start}/${range.end}`,
    ctz: weddingConfig.timezone.iana,
    location: `${event.venue}, ${event.city}`,
    details: `${event.tagline}\nLocation: ${mapsLink(event)}`,
  })
  return `https://calendar.google.com/calendar/render?${params}`
}

const icsEscape = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1')

export function icsFile(event: WeddingEvent): string | null {
  const range = calendarRange(event)
  if (!range) return null
  const dt = (name: string, v: string) => (range.allDay ? `${name};VALUE=DATE:${v}` : `${name}:${v}`)
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}-${range.start}@wedding-invitation`,
    `DTSTAMP:${utcStamp(new Date())}`,
    dt('DTSTART', range.start),
    dt('DTEND', range.end),
    `SUMMARY:${icsEscape(eventTitle(event))}`,
    `LOCATION:${icsEscape(`${event.venue}, ${event.city}`)}`,
    `DESCRIPTION:${icsEscape(`${event.tagline}\nLocation: ${mapsLink(event)}`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}
