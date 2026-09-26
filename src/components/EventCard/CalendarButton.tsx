import { useId, useState } from 'react'
import type { WeddingEvent } from '../../config/wedding.ts'
import { googleCalendarLink, icsFile } from '../../lib/links.ts'

/** "Add to Calendar" with Google Calendar + .ics (Apple/Outlook). Hidden until the year is configured. */
export function CalendarButton({ event }: { event: WeddingEvent }) {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const google = googleCalendarLink(event)
  if (!google) return null

  function downloadIcs() {
    const ics = icsFile(event)
    if (!ics) return
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `${event.id}-invitation.ics`
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setOpen(false)
  }

  return (
    <div className="calendar">
      <button
        type="button"
        className="btn btn--outline btn--block"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
      >
        <svg className="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
          <path d="M3.5 10h17M8 3v4M16 3v4" />
        </svg>
        Add to Calendar
      </button>
      {open && (
        <div id={menuId} className="calendar__menu">
          <a className="calendar__option" href={google} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
            Google Calendar
          </a>
          <button type="button" className="calendar__option" onClick={downloadIcs}>
            Apple / Outlook (.ics)
          </button>
        </div>
      )}
    </div>
  )
}
