import { Fragment } from 'react'

/**
 * Renders content text with *asterisk* spans set in the italic accent face, so
 * the copy in src/data/site.ts can mark the words a heading leans on.
 */
export function Emphasis({ text }: { text: string }) {
  const parts = text.split(/\*([^*]+)\*/g)
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <em key={index} className="serif-accent">
            {part}
          </em>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  )
}
