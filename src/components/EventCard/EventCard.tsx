import type { CSSProperties } from 'react'
import { weddingConfig, type WeddingEvent } from '../../config/wedding.ts'
import { useInView } from '../../hooks/useInView.ts'
import { parseDate, weekday } from '../../lib/dates.ts'
import { Ornament } from '../DecorativeElements/DecorativeElements.tsx'
import { EventIcon } from '../DecorativeElements/EventIcon.tsx'
import { LocationButton } from '../LocationButton/LocationButton.tsx'
import { CalendarButton } from './CalendarButton.tsx'
import './EventCard.css'

export function EventCard({ event, index }: { event: WeddingEvent; index: number }) {
  const [ref, inView] = useInView<HTMLElement>()
  const date = parseDate(event.date)
  const day = weekday(event)
  const year = weddingConfig.year

  return (
    <article
      ref={ref}
      className={`event-card event-card--${event.id} reveal ${inView ? 'is-visible' : ''}`}
      style={{ '--i': index } as CSSProperties}
      aria-labelledby={`event-${event.id}`}
    >
      <div className="event-card__inner">
        <div className="event-card__medallion">
          <EventIcon id={event.id} />
        </div>

        <p className="event-card__date">
          {day && <span className="event-card__weekday">{day}</span>}
          <span className="event-card__day">{date ? String(date.day).padStart(2, '0') : event.date}</span>
          {date && (
            <span className="event-card__month">
              {date.monthName}
              {year ? ` ${year}` : ''}
            </span>
          )}
        </p>

        <h3 id={`event-${event.id}`} className="event-card__name">
          {event.name}
        </h3>
        <p className="event-card__tagline">{event.tagline}</p>

        <Ornament className="event-card__ornament" />

        <dl className="event-card__details">
          {event.time && (
            <div className="event-card__row">
              <dt>Time</dt>
              <dd className="event-card__time">{event.time}</dd>
            </div>
          )}
          <div className="event-card__row">
            <dt>Venue</dt>
            <dd>
              <span className="event-card__venue">{event.venue}</span>
              <span className="event-card__city">{event.city}</span>
            </dd>
          </div>
        </dl>

        <div className="event-card__actions">
          <LocationButton event={event} />
          <CalendarButton event={event} />
        </div>
      </div>
    </article>
  )
}
