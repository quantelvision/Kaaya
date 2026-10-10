import Link from 'next/link'
import { buttonClasses } from '@/components/ui/button'

export function NotFoundContent() {
  return (
    <section className="mx-auto flex max-w-page flex-col items-start gap-6 gutter-x py-section">
      <p className="label-caps text-muted">404</p>
      <h1 className="max-w-3xl heading-display text-4xl text-ink md:text-5xl">
        This page is not in the store
      </h1>
      <p className="max-w-prose text-base text-muted">
        The link may be old, or the piece has moved to another part of the store.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/shop" className={buttonClasses({ size: 'lg' })}>
          Shop all
        </Link>
        <Link href="/" className={buttonClasses({ variant: 'secondary', size: 'lg' })}>
          Go to the home page
        </Link>
      </div>
    </section>
  )
}
