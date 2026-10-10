import { ListingSkeleton } from '@/components/listing/listing-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

export function ListingPageSkeleton() {
  return (
    <div aria-hidden>
      <div className="mx-auto flex max-w-page flex-col gap-4 gutter-x pt-8 pb-6 md:pt-12 md:pb-8">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-5 w-full max-w-prose" />
      </div>
      <ListingSkeleton />
    </div>
  )
}
