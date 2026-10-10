import { Skeleton } from '@/components/ui/skeleton'

const PLACEHOLDER_CARDS = 8

export function ListingSkeleton() {
  return (
    <div aria-hidden>
      <div className="border-b border-line">
        <div className="mx-auto flex max-w-page items-center gap-3 gutter-x py-2">
          <Skeleton className="h-tap w-28 rounded-btn" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <div className="mx-auto grid max-w-page grid-cols-2 gap-x-4 gap-y-10 gutter-x pt-8 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
        {Array.from({ length: PLACEHOLDER_CARDS }, (_, index) => (
          <div key={index} className="flex flex-col gap-3">
            <Skeleton className="aspect-portrait w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  )
}
