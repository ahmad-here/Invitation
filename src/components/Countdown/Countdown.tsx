import { useEffect, useState } from 'react'
import { weddingConfig, type WeddingEvent } from '../../config/wedding.ts'
import { useInView } from '../../hooks/useInView.ts'
import { dateRangeLabel, eventStart } from '../../lib/dates.ts'
import { Ornament } from '../DecorativeElements/DecorativeElements.tsx'
import './Countdown.css'

interface Target {
  event: WeddingEvent
  start: number
}

/**
 * Counts down to the next upcoming event of this version (in Pakistan time).
 * While `weddingConfig.year` is null it shows a "Save the date" card instead,
 * so no wrong countdown is ever displayed.
 */
export function Countdown({ events }: { events: WeddingEvent[] }) {
  const [ref, inView] = useInView<HTMLElement>()
  const targets: Target[] = []
  for (const event of events) {
    const start = eventStart(event)
    if (start) targets.push({ event, start: start.getTime() })
  }
  const ready = weddingConfig.year !== null && targets.length === events.length

  return (
    <section
      ref={ref}
      className={`countdown section reveal ${inView ? 'is-visible' : ''}`}
      aria-labelledby="countdown-title"
    >
      <p className="eyebrow">{ready ? 'Counting down' : 'Save the date'}</p>
      {ready ? (
        <Timer targets={targets} />
      ) : (
        <>
          <h2 id="countdown-title" className="section-title">
            {dateRangeLabel(events)}
          </h2>
          <p className="countdown__note">{weddingConfig.city} · {weddingConfig.region}</p>
        </>
      )}
      <Ornament className="countdown__ornament" />
    </section>
  )
}

function Timer({ targets }: { targets: Target[] }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const next = targets.find((t) => t.start > now)

  if (!next) {
    return (
      <h2 id="countdown-title" className="section-title countdown__done">
        The celebrations have begun. Thank you for your love &amp; prayers.
      </h2>
    )
  }

  const diff = next.start - now
  const units = [
    { label: 'Days', value: Math.floor(diff / 86_400_000) },
    { label: 'Hours', value: Math.floor(diff / 3_600_000) % 24 },
    { label: 'Minutes', value: Math.floor(diff / 60_000) % 60 },
    { label: 'Seconds', value: Math.floor(diff / 1000) % 60 },
  ]

  return (
    <>
      <h2 id="countdown-title" className="section-title">
        Until the {next.event.name}
      </h2>
      <div className="countdown__grid" role="timer" aria-live="off">
        {units.map((u) => (
          <div key={u.label} className="countdown__tile">
            <span className="countdown__value">{String(u.value).padStart(2, '0')}</span>
            <span className="countdown__label">{u.label}</span>
          </div>
        ))}
      </div>
      <p className="countdown__note">
        {next.event.date} {weddingConfig.year}
        {next.event.time ? ` · ${next.event.time}` : ''} (Pakistan time)
      </p>
    </>
  )
}
