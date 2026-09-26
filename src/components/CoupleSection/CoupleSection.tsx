import type { CSSProperties } from 'react'
import { weddingConfig } from '../../config/wedding.ts'
import { ArchFrame, CornerFlorals, Ornament } from '../DecorativeElements/DecorativeElements.tsx'
import './CoupleSection.css'

const stagger = (i: number) => ({ '--i': i }) as CSSProperties

export function CoupleSection({ dateLabel }: { dateLabel: string }) {
  const { groom, bride, city, region, text } = weddingConfig

  return (
    <section className="couple" aria-labelledby="couple-names">
      <div className="couple__card paper-card">
        <CornerFlorals />
        <ArchFrame className="couple__arch">
          <p className="couple__bismillah stagger" lang="ar" dir="rtl" style={stagger(0)}>
            {text.bismillah}
          </p>
          <p className="couple__family stagger" style={stagger(1)}>
            {text.familyLine},
          </p>
          <h1 id="couple-names" className="couple__names stagger" style={stagger(2)}>
            <span className="couple__name">{groom}</span>
            <span className="couple__amp">&amp;</span>
            <span className="couple__name">{bride}</span>
          </h1>
          <div className="couple__ornament stagger" style={stagger(3)}>
            <Ornament />
          </div>
          <p className="couple__request stagger" style={stagger(4)}>
            {text.requestLine}.
          </p>
          <p className="couple__date stagger" style={stagger(5)}>
            {dateLabel}
          </p>
          <p className="couple__place stagger" style={stagger(5)}>
            {city} · {region}
          </p>
        </ArchFrame>
      </div>

      <a className="couple__scroll stagger" href="#events" style={stagger(7)}>
        <span>View the celebrations</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </a>
    </section>
  )
}
