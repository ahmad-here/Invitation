import { weddingConfig } from '../../config/wedding.ts'
import { Ornament, Particles } from '../DecorativeElements/DecorativeElements.tsx'
import './InvitationIntro.css'

export type IntroStage = 'closed' | 'opening' | 'revealing'

interface Props {
  stage: IntroStage
  onOpen: () => void
}

/** Opening scene: a floating 3D envelope; tapping "Open Invitation" breaks the seal, lifts the flap and raises the card. */
export function InvitationIntro({ stage, onOpen }: Props) {
  const { groom, bride, text } = weddingConfig

  return (
    <section className={`intro intro--${stage}`} aria-label="Wedding invitation envelope">
      <div className="intro__bg" aria-hidden="true" />
      <Particles count={12} />

      <div className="intro__inner">
        <p className="intro__bismillah intro__fade" lang="ar" dir="rtl">
          {text.bismillah}
        </p>
        <p className="intro__eyebrow intro__fade">The wedding celebrations of</p>
        <p className="intro__names intro__fade">
          <span>{groom}</span>
          <span className="intro__amp">&amp;</span>
          <span>{bride}</span>
        </p>

        <div className="envelope-stage" aria-hidden="true">
          <div className="envelope">
            <div className="envelope__back" />

            <div className="envelope__card">
              <p className="envelope__card-eyebrow">Wedding Invitation</p>
              <p className="envelope__card-monogram">
                {groom[0]}
                <span>&amp;</span>
                {bride[0]}
              </p>
              <Ornament className="envelope__card-ornament" />
              <p className="envelope__card-names">
                {groom} &amp; {bride}
              </p>
            </div>

            <div className="envelope__front">
              <svg viewBox="0 0 300 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="env-pocket" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="var(--c-cream)" />
                    <stop offset="1" stopColor="var(--c-cream-dark)" />
                  </linearGradient>
                </defs>
                <path d="M0 0 150 104 300 0V200H0Z" fill="url(#env-pocket)" />
                <path d="M0 0 150 104 300 0" fill="none" stroke="var(--c-gold)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
                <path d="M0 200 128 118M300 200 172 118" fill="none" stroke="var(--c-gold)" strokeOpacity=".45" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </svg>
              <span className="envelope__shine" />
            </div>

            <div className="envelope__flap">
              <svg viewBox="0 0 300 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="env-flap" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="var(--c-cream-dark)" />
                    <stop offset="1" stopColor="var(--c-cream)" />
                  </linearGradient>
                </defs>
                <path d="M0 0H300L150 116Z" fill="url(#env-flap)" />
                <path d="M0 0 150 116 300 0" fill="none" stroke="var(--c-gold)" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
                <path d="M22 6 150 104 278 6" fill="none" stroke="var(--c-gold)" strokeOpacity=".55" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>

            <div className="envelope__seal">
              <span>
                {groom[0]}
                <small>&amp;</small>
                {bride[0]}
              </span>
            </div>
          </div>
          <div className="envelope__shadow" />
        </div>

        <p className="intro__message intro__fade">{text.envelopeLine}</p>
        <button type="button" className="btn btn--gold intro__button intro__fade" onClick={onOpen} disabled={stage !== 'closed'}>
          Open Invitation
        </button>
      </div>
    </section>
  )
}
