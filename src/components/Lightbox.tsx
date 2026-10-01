import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import type { Image } from '../data/types'

type Props = {
  images: Image[]
  /** Index of the open image, or null when closed. */
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

/** Full-screen image viewer with keyboard navigation. */
export function Lightbox({ images, index, onClose, onNavigate }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const isOpen = index !== null

  const step = useCallback(
    (delta: number) => {
      if (index === null) return
      onNavigate((index + delta + images.length) % images.length)
    },
    [index, images.length, onNavigate],
  )

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }

    document.addEventListener('keydown', onKeyDown)
    // Stop the page behind the overlay from scrolling.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen, onClose, step])

  if (index === null) return null
  const image = images[index]
  if (!image) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.caption ?? image.alt}
      className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between gap-4 p-4 text-white/80">
        <span className="font-mono text-sm tabular-nums">
          {index + 1} / {images.length}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="rounded-full p-2 transition hover:bg-white/15 hover:text-white"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center gap-2 px-2 sm:gap-4 sm:px-4">
        {images.length > 1 && (
          <button
            type="button"
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation()
              step(-1)
            }}
            className="shrink-0 rounded-full p-2 text-white/70 transition hover:bg-white/15 hover:text-white"
          >
            <ChevronLeft className="size-7" aria-hidden />
          </button>
        )}

        <img
          src={image.src}
          alt={image.alt}
          onClick={(event) => event.stopPropagation()}
          className="max-h-full min-h-0 w-auto max-w-full rounded-lg object-contain shadow-2xl"
        />

        {images.length > 1 && (
          <button
            type="button"
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation()
              step(1)
            }}
            className="shrink-0 rounded-full p-2 text-white/70 transition hover:bg-white/15 hover:text-white"
          >
            <ChevronRight className="size-7" aria-hidden />
          </button>
        )}
      </div>

      <p className="mx-auto max-w-2xl px-6 py-5 text-center text-sm text-white/70">
        {image.caption ?? image.alt}
      </p>
    </div>
  )
}
