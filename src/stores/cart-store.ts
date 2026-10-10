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
import type { CouponRule } from '@/lib/pricing/coupons'
import { sessionJSONStorage } from '@/stores/session-storage'

type PersistedCart = {
  lines: CartLine[]
  couponCode: string | null
  coupon: CouponRule | null
  usePoints: boolean
}

type CartState = PersistedCart & {
  isOpen: boolean
  lastAddedAt: number | null
  addLine: (input: CartLineInput, quantity?: number) => AddResult['status']
  setQuantity: (id: string, quantity: number) => void
  removeLine: (id: string) => void
  setOpen: (isOpen: boolean) => void
  setCoupon: (code: string, coupon: CouponRule) => void
  removeCoupon: () => void
  setUsePoints: (usePoints: boolean) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      couponCode: null,
      coupon: null,
      usePoints: false,
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
      setCoupon: (couponCode, coupon) => set({ couponCode, coupon }),
      removeCoupon: () => set({ couponCode: null, coupon: null }),
      setUsePoints: (usePoints) => set({ usePoints }),
      clear: () =>
        set({ lines: [], couponCode: null, coupon: null, usePoints: false, lastAddedAt: null }),
    }),
    {
      name: 'kaaya-cart',
      version: 2,
      storage: sessionJSONStorage<PersistedCart>(),
      partialize: (state) => ({
        lines: state.lines,
        couponCode: state.couponCode,
        coupon: state.coupon,
        usePoints: state.usePoints,
      }),
      migrate: (persisted) => ({
        couponCode: null,
        coupon: null,
        usePoints: false,
        ...(persisted as Partial<PersistedCart>),
        lines: (persisted as Partial<PersistedCart>).lines ?? [],
      }),
      skipHydration: true,
    },
  ),
)
