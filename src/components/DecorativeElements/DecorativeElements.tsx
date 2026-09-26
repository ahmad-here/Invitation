import type { CSSProperties, ReactNode } from 'react'
import './DecorativeElements.css'

/** Gold divider: fading lines with a jewel motif in the centre. */
export function Ornament({ className = '' }: { className?: string }) {
  return (
    <div className={`ornament ${className}`} aria-hidden="true">
      <span className="ornament__line" />
      <svg className="ornament__motif" viewBox="0 0 64 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M32 2.5 39.5 12 32 21.5 24.5 12Z" />
        <path d="M32 7.5 35.5 12 32 16.5 28.5 12Z" fill="currentColor" />
        <path d="M22 12c-2.5-4.5-7.5-5-10-2.5S11 15 14 15s3-3 1-3.5" />
        <path d="M42 12c2.5-4.5 7.5-5 10-2.5S53 15 50 15s-3-3-1-3.5" />
        <circle cx="4" cy="12" r="1.3" fill="currentColor" />
        <circle cx="60" cy="12" r="1.3" fill="currentColor" />
      </svg>
      <span className="ornament__line ornament__line--end" />
    </div>
  )
}

/** Floral corner vine. Position with `corner` (mirrored via CSS). */
export function CornerFloral({ corner }: { corner: 'tl' | 'tr' | 'bl' | 'br' }) {
  return (
    <svg className={`corner-floral corner-floral--${corner}`} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
        <path d="M4 116C6 64 36 22 116 4" />
        <path d="M4 84c12-6 20-18 20-34" />
        <path d="M36 4c4 14 16 22 32 22" />
        <path d="M22 60c-6 2-10 0-13-4" />
        <path d="M58 22c2-6 0-10-4-13" />
      </g>
      <g fill="currentColor">
        <path d="M30 46c7-11 18-12 26-9-6 9-16 14-26 9Z" opacity=".55" />
        <path d="M46 30c11-7 12-18 9-26-9 6-14 16-9 26Z" opacity=".35" />
        <path d="M14 76c10-4 13-12 12-19-8 3-13 10-12 19Z" opacity=".45" />
        <path d="M76 14c-4 10-12 13-19 12 3-8 10-13 19-12Z" opacity=".45" />
      </g>
      <g transform="translate(22 22)" fill="currentColor">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} cx="0" cy="-6.5" rx="3.6" ry="6" transform={`rotate(${r})`} opacity=".7" />
        ))}
        <circle r="3" className="corner-floral__center" />
      </g>
      <g transform="translate(8 104)" fill="currentColor" opacity=".8">
        {[0, 90, 180, 270].map((r) => (
          <ellipse key={r} cx="0" cy="-3.4" rx="2" ry="3.4" transform={`rotate(${r})`} />
        ))}
      </g>
      <g transform="translate(104 8)" fill="currentColor" opacity=".8">
        {[45, 135, 225, 315].map((r) => (
          <ellipse key={r} cx="0" cy="-3.4" rx="2" ry="3.4" transform={`rotate(${r})`} />
        ))}
      </g>
    </svg>
  )
}

export function CornerFlorals() {
  return (
    <>
      <CornerFloral corner="tl" />
      <CornerFloral corner="tr" />
      <CornerFloral corner="bl" />
      <CornerFloral corner="br" />
    </>
  )
}

/** Mughal (cusped ogee) arch frame around children. */
export function ArchFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`arch-frame ${className}`}>
      <svg className="arch-frame__top" viewBox="0 0 300 110" preserveAspectRatio="none" fill="none" aria-hidden="true">
        <path
          vectorEffect="non-scaling-stroke"
          d="M2 110C2 70 40 52 90 40c32-8 52-20 60-38 8 18 28 30 60 38 50 12 88 30 88 70"
        />
        <path
          vectorEffect="non-scaling-stroke"
          d="M10 110c0-34 36-50 84-62 30-8 49-19 56-34 7 15 26 26 56 34 48 12 84 28 84 62"
        />
        <circle cx="150" cy="2" r="2.2" fill="currentColor" stroke="none" />
      </svg>
      <div className="arch-frame__body">{children}</div>
    </div>
  )
}

/**
 * Floating gold dust. Positions are deterministic (golden-ratio spread),
 * so there is no randomness during render and no layout cost: transform/opacity only.
 */
export function Particles({ count = 14, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`particles ${className}`} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const style = {
          '--x': `${(i * 61.8) % 100}%`,
          '--size': `${2 + ((i * 7) % 4)}px`,
          '--delay': `${-((i * 1.9) % 12)}s`,
          '--duration': `${11 + ((i * 3.7) % 9)}s`,
          '--drift': `${((i % 5) - 2) * 14}px`,
        } as CSSProperties
        return <span key={i} className="particle" style={style} />
      })}
    </div>
  )
}

/** A few slow-falling petals for the revealed invitation. */
export function Petals({ count = 7 }: { count?: number }) {
  return (
    <div className="petals" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => {
        const style = {
          '--x': `${(i * 38.2 + 7) % 100}%`,
          '--delay': `${i * 2.3}s`,
          '--duration': `${14 + ((i * 2.9) % 8)}s`,
          '--drift': `${((i % 3) - 1) * 60}px`,
          '--scale': `${0.7 + ((i * 0.13) % 0.5)}`,
        } as CSSProperties
        return <span key={i} className={`petal petal--${i % 3}`} style={style} />
      })}
    </div>
  )
}
