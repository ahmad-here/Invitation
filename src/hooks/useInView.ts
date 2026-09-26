import { useEffect, useRef, useState } from 'react'

/** True once the element has scrolled into view (never flips back, so each reveal plays once). */
export function useInView<T extends Element>(rootMargin = '0px 0px -12% 0px') {
  const ref = useRef<T>(null)
  // Very old browsers without IntersectionObserver just show everything.
  const [inView, setInView] = useState(() => !('IntersectionObserver' in window))

  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin, threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [inView, rootMargin])

  return [ref, inView] as const
}
