import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ReturnView } from '@/components/order/return-view'
import { Skeleton } from '@/components/ui/skeleton'
import { getLoyaltySettings, getSiteSettings } from '@/lib/sanity/data'

export const metadata: Metadata = {
  title: 'Return or exchange',
}

async function ReturnPageContent({ params }: Pick<PageProps<'/order/[id]/return'>, 'params'>) {
  const [{ id }, settings, loyalty] = await Promise.all([
    params,
    getSiteSettings(),
    getLoyaltySettings(),
  ])
  return (
    <ReturnView
      orderId={decodeURIComponent(id)}
      returnWindowDays={settings?.returnWindowDays ?? 0}
      pointValueRupees={loyalty?.pointValueRupees ?? 1}
    />
  )
}

export default function ReturnPage({ params }: PageProps<'/order/[id]/return'>) {
  return (
    <Suspense
      fallback={
        <div aria-hidden className="mx-auto flex max-w-page flex-col gap-6 gutter-x pt-8 md:pt-12">
          <Skeleton className="h-12 w-72" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <ReturnPageContent params={params} />
    </Suspense>
  )
}
