import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Nothing here</h1>
      <p className="mt-3 max-w-md text-fg-muted">
        That page does not exist. All of the projects are on the home page.
      </p>
      <Link to="/" className="btn btn-primary mt-8">
        Back home
      </Link>
    </section>
  )
}
