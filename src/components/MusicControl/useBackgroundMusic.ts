import { useEffect, useRef, useState } from 'react'
import { weddingConfig } from '../../config/wedding.ts'
import { publicUrl } from '../../lib/links.ts'

/**
 * Background music that is only created and started from a user tap
 * (mobile browsers block autoplay). Nothing is downloaded before that.
 * If the file is missing or fails, the control simply disappears.
 */
export function useBackgroundMusic() {
  const { enabled, url, volume } = weddingConfig.music
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [available, setAvailable] = useState(enabled && url.trim() !== '')
  const [playing, setPlaying] = useState(false)

  function play() {
    if (!available) return
    let audio = audioRef.current
    if (!audio) {
      audio = new Audio(publicUrl(url))
      audio.loop = true
      audio.volume = volume
      audio.addEventListener('play', () => setPlaying(true))
      audio.addEventListener('pause', () => setPlaying(false))
      audio.addEventListener('error', () => {
        setAvailable(false)
        setPlaying(false)
      })
      audioRef.current = audio
    }
    audio.play().catch(() => setPlaying(false))
  }

  function toggle() {
    if (playing) audioRef.current?.pause()
    else play()
  }

  // Pause when the guest switches apps / locks the phone.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) audioRef.current?.pause()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      audioRef.current?.pause()
    }
  }, [])

  return { available, playing, play, toggle }
}
