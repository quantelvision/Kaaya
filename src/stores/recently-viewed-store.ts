import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toCardSnapshot } from '@/lib/product-snapshot'
import type { ProductCardData } from '@/lib/sanity/models'
import { sessionJSONStorage } from '@/stores/session-storage'

export const RECENTLY_VIEWED_LIMIT = 8

type PersistedRecentlyViewed = { items: ProductCardData[] }

type RecentlyViewedState = PersistedRecentlyViewed & {
  add: (product: ProductCardData) => void
  clear: () => void
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product) =>
        set({
          items: [
            toCardSnapshot(product),
            ...get().items.filter((item) => item._id !== product._id),
          ].slice(0, RECENTLY_VIEWED_LIMIT),
        }),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'kaaya-recently-viewed',
      version: 1,
      storage: sessionJSONStorage<PersistedRecentlyViewed>(),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
    },
  ),
)
