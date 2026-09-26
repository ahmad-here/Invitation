import type { EventId } from '../../config/wedding.ts'

/** Line icons per event: mehndi (henna paisley), barat (doli dome), walima (lantern). */
export function EventIcon({ id }: { id: EventId }) {
  return (
    <svg
      className="event-icon"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {id === 'mehndi' && (
        <>
          <path d="M16 3.5c6 0 10 4.6 10 10.5 0 7-5.6 12.6-13 14.5 2.6-2.6 3.8-5.4 2.6-8-1.4-2.2-5.4-2.2-7.4-5C5.6 11 9.4 3.5 16 3.5Z" />
          <path d="M17 9.5c2.8.4 4.6 2.8 4.2 5.6" />
          <circle cx="16.4" cy="13.8" r="1.6" fill="currentColor" />
          <path d="M11.4 9.2c.6-1 1.6-1.8 2.8-2.2" />
        </>
      )}
      {id === 'barat' && (
        <>
          <path d="M5 27.5h22" />
          <path d="M7.5 27.5v-10h17v10" />
          <path d="M7.5 17.5c0-5 4-7.8 8.5-10.5 4.5 2.7 8.5 5.5 8.5 10.5" />
          <path d="M16 7V4" />
          <circle cx="16" cy="3" r="1" fill="currentColor" />
          <path d="M13 27.5v-5.5a3 3 0 0 1 6 0v5.5" />
          <path d="M3 29.5h26" />
        </>
      )}
      {id === 'walima' && (
        <>
          <path d="M16 2.5v3.5" />
          <path d="M12 6h8l-1 3h-6Z" />
          <path d="M10 9h12l-1.6 11H11.6Z" />
          <path d="M16 11.5v6" />
          <path d="M13 12.5l.8 5M19 12.5l-.8 5" />
          <path d="M11.6 20l1.4 4h6l1.4-4" />
          <path d="M16 24v3" />
          <circle cx="16" cy="28.5" r="1.2" fill="currentColor" />
        </>
      )}
    </svg>
  )
}
