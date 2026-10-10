import { Heart } from '@phosphor-icons/react/ssr'
import { cn } from '@/lib/cn'

type WishlistButtonProps = {
  productTitle: string
  className?: string
}

export function WishlistButton({ productTitle, className }: WishlistButtonProps) {
  return (
    <button
      type="button"
      aria-label={`Save ${productTitle} to wishlist`}
      aria-pressed={false}
      className={cn(
        'inline-flex size-tap items-center justify-center rounded-full text-ink transition-colors hover:text-primary',
        className,
      )}
    >
      <Heart weight="light" className="size-5" aria-hidden />
    </button>
  )
}
