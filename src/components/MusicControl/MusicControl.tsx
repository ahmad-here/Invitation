import './MusicControl.css'

interface Props {
  playing: boolean
  onToggle: () => void
}

export function MusicControl({ playing, onToggle }: Props) {
  return (
    <button
      type="button"
      className={`music-control ${playing ? 'is-playing' : ''}`}
      onClick={onToggle}
      aria-label={playing ? 'Music on. Tap to turn music off' : 'Music off. Tap to turn music on'}
    >
      <span className="music-control__bars" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span>{playing ? 'Music On' : 'Music Off'}</span>
    </button>
  )
}
