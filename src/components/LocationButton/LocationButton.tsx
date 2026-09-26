import type { WeddingEvent } from '../../config/wedding.ts'
import { mapsLink } from '../../lib/links.ts'

/** Opens the venue in Google Maps (the Maps app on phones that have it). */
export function LocationButton({ event }: { event: WeddingEvent }) {
  return (
    <a
      className="btn btn--gold btn--block"
      href={mapsLink(event)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open location of ${event.venue}, ${event.city} in Google Maps (opens in a new tab)`}
    >
      <svg className="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M12 21s-7-6.1-7-11.5a7 7 0 1 1 14 0C19 14.9 12 21 12 21Z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </svg>
      Open Location
    </a>
  )
}
