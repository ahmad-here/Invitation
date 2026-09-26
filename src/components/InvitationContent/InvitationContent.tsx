import { weddingConfig, type VersionId } from '../../config/wedding.ts'
import { dateRangeLabel } from '../../lib/dates.ts'
import { eventsFor } from '../../lib/version.ts'
import { ClosingSection } from '../ClosingSection/ClosingSection.tsx'
import { CoupleSection } from '../CoupleSection/CoupleSection.tsx'
import { Countdown } from '../Countdown/Countdown.tsx'
import { Particles, Petals } from '../DecorativeElements/DecorativeElements.tsx'
import { EventTimeline } from '../EventTimeline/EventTimeline.tsx'

interface Props {
  version: VersionId
  revealed: boolean
}

/** Everything after the envelope opens. Lazy-loaded while the guest looks at the envelope. */
export default function InvitationContent({ version, revealed }: Props) {
  const events = eventsFor(version)

  return (
    <div className={`content ${revealed ? 'is-revealed' : ''}`}>
      <div className="page-bg" aria-hidden="true" />
      <Particles count={10} className="content__particles" />
      {revealed && <Petals />}

      <main className="content__main">
        <CoupleSection dateLabel={dateRangeLabel(events)} />
        <EventTimeline events={events} />
        <Countdown events={events} />
        <ClosingSection version={version} />
      </main>

      <footer className="footer">
        <p>
          {weddingConfig.groom} &amp; {weddingConfig.bride}
        </p>
        <p className="footer__place">{weddingConfig.city} · {weddingConfig.region}</p>
      </footer>
    </div>
  )
}
