import Link from 'next/link'
import { Countdown } from '@/components/home/countdown'
import { buttonClasses } from '@/components/ui/button'
import type { FestiveSaleData } from '@/lib/sanity/models'

export function FestiveStrip({ sale }: { sale: FestiveSaleData }) {
  if (!sale.isActive || !sale.edit) return null

  return (
    <section aria-label={sale.title} className="mt-section bg-wash">
      <div className="mx-auto flex max-w-page flex-col gap-6 gutter-x py-8 md:flex-row md:items-center md:justify-between md:py-10">
        <div className="flex flex-col gap-2">
          <p className="label-caps text-primary">Ends in</p>
          <h2 className="heading-display text-2xl text-ink md:text-3xl">{sale.title}</h2>
          {sale.subtitle && <p className="text-sm text-muted">{sale.subtitle}</p>}
        </div>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Countdown sale={sale} variant="blocks" />
          <Link
            href={`/looks/${sale.edit.slug}`}
            className={buttonClasses({ variant: 'secondary' })}
          >
            Shop the sale
          </Link>
        </div>
      </div>
    </section>
  )
}
