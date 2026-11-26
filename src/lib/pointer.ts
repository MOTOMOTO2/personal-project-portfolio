import { useCallback, useRef } from 'react'

/**
 * Pointer effects that write CSS variables straight onto the element, so moving
 * the mouse never re-renders React. Touch and pen input are ignored, and the
 * CSS that reads the variables does nothing under reduced motion.
 */

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

/** Sets --mx / --my (pointer position inside the element) for `card-spotlight`. */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const onPointerMove = useCallback((event: React.PointerEvent<T>) => {
    const element = ref.current
    if (!element || event.pointerType !== 'mouse') return
    const rect = element.getBoundingClientRect()
    element.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    element.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }, [])
  return { ref, onPointerMove }
}

/** Tilts the element a few degrees towards the pointer, and back when it leaves. */
export function useTilt<T extends HTMLElement>(degrees = 3.5) {
  const ref = useRef<T>(null)
  const onPointerMove = useCallback(
    (event: React.PointerEvent<T>) => {
      const element = ref.current
      if (!element || event.pointerType !== 'mouse' || reducedMotion()) return
      const rect = element.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      element.style.transform = `perspective(1200px) rotateX(${(-y * degrees).toFixed(2)}deg) rotateY(${(x * degrees).toFixed(2)}deg)`
    },
    [degrees],
  )
  const onPointerLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = ''
  }, [])
  return { ref, onPointerMove, onPointerLeave }
}
