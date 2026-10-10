import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Order } from '@/lib/order'
import { sessionJSONStorage } from '@/stores/session-storage'

type PersistedOrders = { orders: Order[] }

type OrdersState = PersistedOrders & {
  addOrder: (order: Order) => void
  updateOrder: (id: string, update: (order: Order) => Order) => void
  clear: () => void
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set({ orders: [order, ...get().orders] }),
      updateOrder: (id, update) =>
        set({ orders: get().orders.map((order) => (order.id === id ? update(order) : order)) }),
      clear: () => set({ orders: [] }),
    }),
    {
      name: 'kaaya-orders',
      version: 1,
      storage: sessionJSONStorage<PersistedOrders>(),
      partialize: (state) => ({ orders: state.orders }),
      skipHydration: true,
    },
  ),
)
