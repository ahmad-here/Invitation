import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { BackToTop } from '../components/BackToTop/BackToTop.tsx'
import { ContentErrorBoundary } from '../components/InvitationContent/ContentErrorBoundary.tsx'
import { InvitationIntro } from '../components/InvitationIntro/InvitationIntro.tsx'
import { MusicControl } from '../components/MusicControl/MusicControl.tsx'
import { useBackgroundMusic } from '../components/MusicControl/useBackgroundMusic.ts'
import { useReducedMotion } from '../hooks/useReducedMotion.ts'
import { resolveVersion } from '../lib/version.ts'

type Stage = 'closed' | 'opening' | 'revealing' | 'open'

// Loaded in the background while the envelope is on screen.
let contentPromise: ReturnType<typeof importContent> | undefined
const importContent = () => import('../components/InvitationContent/InvitationContent.tsx')
const loadContent = () => (contentPromise ??= importContent())
const InvitationContent = lazy(loadContent)

const version = resolveVersion(window.location.pathname, window.location.search)

/** Timings (ms) matching InvitationIntro.css. */
const TIMING = {
  normal: { reveal: 2300, done: 1000 },
  reduced: { reveal: 250, done: 550 },
}

export default function InvitationPage() {
  const [stage, setStage] = useState<Stage>('closed')
  const reducedMotion = useReducedMotion()
  const music = useBackgroundMusic()
  const timers = useRef<number[]>([])

  // Prefetch the invitation content once the envelope has painted.
  useEffect(() => {
    const id = window.setTimeout(() => void loadContent().catch(() => {}), 600)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('is-locked', stage !== 'open')
  }, [stage])

  useEffect(() => () => timers.current.forEach(window.clearTimeout), [])

  function handleOpen() {
    if (stage !== 'closed') return
    setStage('opening')
    music.play() // inside the tap gesture so mobile browsers allow audio

    const t = reducedMotion ? TIMING.reduced : TIMING.normal
    const minDelay = new Promise((resolve) => timers.current.push(window.setTimeout(resolve, t.reveal)))
    // Reveal only when both the animation has played and the content chunk is ready.
    Promise.all([minDelay, loadContent().catch(() => null)]).then(() => {
      window.scrollTo(0, 0)
      setStage('revealing')
      timers.current.push(window.setTimeout(() => setStage('open'), t.done))
    })
  }

  return (
    <>
      {stage !== 'closed' && (
        <ContentErrorBoundary>
          <Suspense fallback={null}>
            <InvitationContent version={version} revealed={stage === 'revealing' || stage === 'open'} />
          </Suspense>
        </ContentErrorBoundary>
      )}

      {stage !== 'open' && <InvitationIntro stage={stage} onOpen={handleOpen} />}

      {music.available && stage !== 'closed' && <MusicControl playing={music.playing} onToggle={music.toggle} />}

      {stage === 'open' && <BackToTop />}
    </>
  )
}
