import type { Metadata } from 'next'
import Link from 'next/link'
import { KaayaLockup } from '@/components/brand/kaaya-lockup'
import { RetryButton } from '@/components/pwa/retry-button'
import { buttonClasses } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Offline' }

export default function OfflinePage() {
  return (
    <main className="bg-bg flex flex-1 flex-col text-ink">
      <header className="gutter-x py-5">
        <KaayaLockup layout="horizontal" />
      </header>
      <section className="mx-auto flex w-full max-w-page flex-1 flex-col items-start justify-center gap-6 gutter-x py-section">
        <p className="label-caps text-muted">Offline</p>
        <h1 className="max-w-3xl heading-display text-4xl md:text-5xl">You are offline</h1>
        <p className="max-w-prose text-base text-muted">
          This page has not been saved on this device yet. Pages you opened before still work
          without a connection, and the rest of the store comes back as soon as you are online.
        </p>
        <div className="flex flex-wrap gap-3">
          <RetryButton />
          <Link href="/" className={buttonClasses({ variant: 'secondary', size: 'lg' })}>
            Go to the home page
          </Link>
        </div>
      </section>
      <footer className="gutter-x py-6 text-xs text-muted">Built by Quantel Vision</footer>
    </main>
  )
}
