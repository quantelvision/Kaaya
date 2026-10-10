import { useCartStore } from '@/stores/cart-store'
import { useLoyaltyStore } from '@/stores/loyalty-store'
import { useOrdersStore } from '@/stores/orders-store'
import { useRecentlyViewedStore } from '@/stores/recently-viewed-store'
import { useSearchStore } from '@/stores/search-store'
import { useThemeStore } from '@/stores/theme-store'
import { useWishlistStore } from '@/stores/wishlist-store'

export const persistedStores = [
  useCartStore,
  useWishlistStore,
  useRecentlyViewedStore,
  useSearchStore,
  useLoyaltyStore,
  useOrdersStore,
  useThemeStore,
]

// clearing state writes an empty copy, so the storage keys are removed afterwards
export function resetDemoSession(): void {
  useCartStore.getState().clear()
  useWishlistStore.getState().clear()
  useRecentlyViewedStore.getState().clear()
  useSearchStore.getState().clear()
  useLoyaltyStore.getState().clear()
  useOrdersStore.getState().clear()
  useThemeStore.getState().reset()
  for (const store of persistedStores) store.persist.clearStorage()
}
