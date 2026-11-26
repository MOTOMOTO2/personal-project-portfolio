import { useEffect, useRef, useState } from 'react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+/<>=_'

/**
 * Text that "decodes" from random glyphs the first time it scrolls into view,
 * like a signal locking on. Meant for mono labels, so nothing shifts while it
 * runs. Only the in-between frames are state: the real text shows whenever no
 * decode is running (first render, screen readers, tests, no JS, reduced
 * motion), so a changed label is never stale.
 */
export function Scramble({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  // Each in-between frame remembers which text it belongs to, so one left over
  // from a previous label is never shown.
  const [decoding, setDecoding] = useState<{ of: string; value: string } | null>(null)

  useEffect(() => {
    const element = ref.current
    if (
      !element ||
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }

    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const duration = 260 + text.length * 22
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration)
          const settled = Math.floor(progress * text.length)
          if (progress >= 1) {
            setDecoding(null)
            return
          }
          setDecoding({
            of: text,
            value: [...text]
              .map((char, index) =>
                index < settled || char === ' ' ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
              )
              .join(''),
          })
          frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.8 },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [text])

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{decoding?.of === text ? decoding.value : text}</span>
    </span>
  )
}
