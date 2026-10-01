import { useState } from 'react'
import { site } from '../data/site'
import { Lightbox } from './Lightbox'
import { SectionHeading } from './SectionHeading'

/** Free-form photo wall: build shots, talks, whatever is worth showing. */
export function Gallery() {
  const [open, setOpen] = useState<number | null>(null)
  const { photos } = site

  if (photos.length === 0) return null

  return (
    <section className="border-y border-border bg-surface/50 py-16 sm:py-20">
      <div className="container-page">
        <SectionHeading
          id="gallery"
          eyebrow="Pictures"
          title="Gallery"
          description="Workbenches, whiteboards, and the occasional finished thing. Click any photo to enlarge."
        />

        <ul className="reveal grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {photos.map((photo, index) => (
            <li key={photo.src}>
              <button
                type="button"
                onClick={() => setOpen(index)}
                className="group relative block w-full overflow-hidden rounded-xl border border-border bg-surface"
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width={900}
                  height={900}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                />
                {photo.caption && (
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/85 to-transparent p-3 text-left text-xs text-white transition group-hover:translate-y-0">
                    {photo.caption}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Lightbox images={photos} index={open} onClose={() => setOpen(null)} onNavigate={setOpen} />
    </section>
  )
}
