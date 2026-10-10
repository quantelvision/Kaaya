'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/stores/cart-store'
import { useHydrationStore } from '@/stores/hydration-store'
import { useLoyaltyStore } from '@/stores/loyalty-store'
import { useOrdersStore } from '@/stores/orders-store'
import { useRecentlyViewedStore } from '@/stores/recently-viewed-store'
import { useSearchStore } from '@/stores/search-store'
import { useThemeStore } from '@/stores/theme-store'
import { useWishlistStore } from '@/stores/wishlist-store'

const persistedStores = [
  useCartStore,
  useWishlistStore,
  useRecentlyViewedStore,
  useSearchStore,
  useLoyaltyStore,
  useOrdersStore,
  useThemeStore,
]

// stores skip automatic hydration so the server html and the first client render match
export function StoreHydration() {
  const markHydrated = useHydrationStore((state) => state.markHydrated)

  useEffect(() => {
    void Promise.all(persistedStores.map((store) => store.persist.rehydrate())).then(markHydrated)
  }, [markHydrated])

  return null
}
