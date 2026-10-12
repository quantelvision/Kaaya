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
  pointsToUse: number
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
  setPointsToUse: (points: number) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      couponCode: null,
      coupon: null,
      pointsToUse: 0,
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
      setPointsToUse: (points) => set({ pointsToUse: Math.max(0, Math.floor(points)) }),
      clear: () =>
        set({ lines: [], couponCode: null, coupon: null, pointsToUse: 0, lastAddedAt: null }),
    }),
    {
      name: 'kaaya-cart',
      version: 4,
      storage: sessionJSONStorage<PersistedCart>(),
      partialize: (state) => ({
        lines: state.lines,
        couponCode: state.couponCode,
        coupon: state.coupon,
        pointsToUse: state.pointsToUse,
      }),
      migrate: (persisted) => {
        const state = persisted as Partial<PersistedCart>
        return {
          couponCode: state.couponCode ?? null,
          coupon: state.coupon ?? null,
          pointsToUse: typeof state.pointsToUse === 'number' ? state.pointsToUse : 0,
          lines: (state.lines ?? []).map((line) => ({
            ...line,
            availableSizes: line.availableSizes ?? [{ size: line.size, stock: line.stock }],
          })),
        }
      },
      skipHydration: true,
    },
  ),
)
