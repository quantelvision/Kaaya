'use client'

import { Handbag } from '@phosphor-icons/react/ssr'
import { CountBadge } from '@/components/layout/count-badge'
import { IconButton } from '@/components/ui/icon-button'
import { cartItemCount } from '@/lib/cart'
import { useCartStore } from '@/stores/cart-store'
import { useHasHydrated } from '@/stores/hydration-store'

export function BagButton() {
  const hasHydrated = useHasHydrated()
  const lines = useCartStore((state) => state.lines)
  const lastAddedAt = useCartStore((state) => state.lastAddedAt)
  const setOpen = useCartStore((state) => state.setOpen)
  const count = hasHydrated ? cartItemCount(lines) : 0

  return (
    <IconButton
      label={count > 0 ? `Bag, ${count} ${count === 1 ? 'item' : 'items'}` : 'Bag'}
      aria-haspopup="dialog"
      onClick={() => setOpen(true)}
    >
      <Handbag weight="light" className="size-6" aria-hidden />
      <CountBadge count={count} bounceKey={lastAddedAt} />
    </IconButton>
  )
}
