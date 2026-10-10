import { Skeleton } from '@/components/ui/skeleton'

export function ProductPageSkeleton() {
  return (
    <div aria-hidden className="mx-auto max-w-page gutter-x pt-6 md:pt-10">
      <Skeleton className="mb-6 h-4 w-48" />
      <div className="grid gap-8 md:grid-cols-12 md:gap-12">
        <Skeleton className="aspect-portrait w-full md:col-span-7" />
        <div className="flex flex-col gap-5 md:col-span-5">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-28" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="size-tap rounded-btn" />
            ))}
          </div>
          <Skeleton className="h-14 w-full rounded-btn" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  )
}
