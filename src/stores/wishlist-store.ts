import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toCardSnapshot } from '@/lib/product-snapshot'
import type { ProductCardData } from '@/lib/sanity/models'
import { sessionJSONStorage } from '@/stores/session-storage'

type PersistedWishlist = { items: ProductCardData[] }

type WishlistState = PersistedWishlist & {
  toggle: (product: ProductCardData) => boolean
  remove: (productId: string) => void
  clear: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const isSaved = get().items.some((item) => item._id === product._id)
        set({
          items: isSaved
            ? get().items.filter((item) => item._id !== product._id)
            : [toCardSnapshot(product), ...get().items],
        })
        return !isSaved
      },
      remove: (productId) => set({ items: get().items.filter((item) => item._id !== productId) }),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'kaaya-wishlist',
      version: 1,
      storage: sessionJSONStorage<PersistedWishlist>(),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
    },
  ),
)
