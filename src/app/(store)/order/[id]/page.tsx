import type { Metadata } from 'next'
import { Suspense } from 'react'
import { OrderView } from '@/components/order/order-view'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = {
  title: 'Your order',
}

async function OrderPageContent({ params }: Pick<PageProps<'/order/[id]'>, 'params'>) {
  const { id } = await params
  return <OrderView orderId={decodeURIComponent(id)} />
}

export default function OrderPage({ params }: PageProps<'/order/[id]'>) {
  return (
    <Suspense
      fallback={
        <div aria-hidden className="mx-auto flex max-w-page flex-col gap-6 gutter-x pt-8 md:pt-12">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-12 w-72" />
          <Skeleton className="h-72 w-full" />
        </div>
      }
    >
      <OrderPageContent params={params} />
    </Suspense>
  )
}
