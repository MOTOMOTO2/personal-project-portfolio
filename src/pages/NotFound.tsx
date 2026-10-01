import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-sm tracking-widest text-accent uppercase">404</p>
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Nothing here</h1>
      <p className="mt-3 max-w-md text-fg-muted">
        That page does not exist. The projects are all on the home page.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition hover:opacity-90"
      >
        Back home
      </Link>
    </section>
  )
}
