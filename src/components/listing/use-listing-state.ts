'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { parseListingState, serializeListingState, type ListingState } from '@/lib/listing'

export function useListingState() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const state = useMemo(() => parseListingState(searchParams), [searchParams])

  const setState = useCallback(
    (next: ListingState) => {
      const query = serializeListingState(next)
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    },
    [pathname, router],
  )

  return [state, setState] as const
}
