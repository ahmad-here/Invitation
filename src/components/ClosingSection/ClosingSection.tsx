import { weddingConfig, type VersionId } from '../../config/wedding.ts'
import { useInView } from '../../hooks/useInView.ts'
import { CornerFlorals, Ornament } from '../DecorativeElements/DecorativeElements.tsx'
import { ShareButton } from '../ShareButton/ShareButton.tsx'
import './ClosingSection.css'

export function ClosingSection({ version }: { version: VersionId }) {
  const [ref, inView] = useInView<HTMLElement>()
  const { groom, bride, text } = weddingConfig

  return (
    <section ref={ref} className={`closing section reveal ${inView ? 'is-visible' : ''}`} aria-labelledby="closing-title">
      <div className="closing__card paper-card">
        <CornerFlorals />
        <Ornament />
        <h2 id="closing-title" className="closing__line">
          “{text.closingLine}”
        </h2>
        <p className="closing__names">
          <span>{groom}</span>
          <span className="closing__amp">&amp;</span>
          <span>{bride}</span>
        </p>
        <p className="closing__wish">{text.closingWish}</p>
        <Ornament />
        <div className="closing__share">
          <p className="closing__share-label">Share the joy with family</p>
          <ShareButton version={version} />
        </div>
      </div>
    </section>
  )
}
