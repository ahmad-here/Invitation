import type { WeddingEvent } from '../../config/wedding.ts'
import { useInView } from '../../hooks/useInView.ts'
import { Ornament } from '../DecorativeElements/DecorativeElements.tsx'
import { EventCard } from '../EventCard/EventCard.tsx'
import './EventTimeline.css'

export function EventTimeline({ events }: { events: WeddingEvent[] }) {
  const [ref, inView] = useInView<HTMLElement>()
  const single = events.length === 1

  return (
    <section id="events" className="events section" aria-labelledby="events-title">
      <header ref={ref} className={`section-head reveal ${inView ? 'is-visible' : ''}`}>
        <p className="eyebrow">{single ? 'Save the date' : 'Save the dates'}</p>
        <h2 id="events-title" className="section-title">
          {single ? `The ${events[0].name}` : 'Wedding Celebrations'}
        </h2>
        <Ornament />
      </header>

      <ol className={`events__list events__list--${events.length}`}>
        {events.map((event, i) => (
          <li key={event.id} className="events__item">
            <EventCard event={event} index={i} />
          </li>
        ))}
      </ol>
    </section>
  )
}
