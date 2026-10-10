import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  addToLines,
  removeLine,
  setLineQuantity,
  type AddResult,
  type CartLine,
  type CartLineInput,
} from '@/lib/cart'
import { sessionJSONStorage } from '@/stores/session-storage'

type PersistedCart = { lines: CartLine[] }

type CartState = PersistedCart & {
  isOpen: boolean
  lastAddedAt: number | null
  addLine: (input: CartLineInput, quantity?: number) => AddResult['status']
  setQuantity: (id: string, quantity: number) => void
  removeLine: (id: string) => void
  setOpen: (isOpen: boolean) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      lastAddedAt: null,
      addLine: (input, quantity = 1) => {
        const result = addToLines(get().lines, input, quantity)
        if (result.lines !== get().lines) set({ lines: result.lines, lastAddedAt: Date.now() })
        return result.status
      },
      setQuantity: (id, quantity) => set({ lines: setLineQuantity(get().lines, id, quantity) }),
      removeLine: (id) => set({ lines: removeLine(get().lines, id) }),
      setOpen: (isOpen) => set({ isOpen }),
      clear: () => set({ lines: [], lastAddedAt: null }),
    }),
    {
      name: 'kaaya-cart',
      version: 1,
      storage: sessionJSONStorage<PersistedCart>(),
      partialize: (state) => ({ lines: state.lines }),
      skipHydration: true,
    },
  ),
)
