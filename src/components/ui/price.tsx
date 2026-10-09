import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/cn'
import { formatPrice, percentOff } from '@/lib/format'

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
} as const

type PriceProps = {
  price: number
  salePrice?: number | null
  size?: keyof typeof sizeClasses
  showPercentOff?: boolean
  className?: string
}

export function Price({
  price,
  salePrice,
  size = 'sm',
  showPercentOff = false,
  className,
}: PriceProps) {
  const isOnSale = typeof salePrice === 'number' && salePrice < price

  if (!isOnSale) {
    return (
      <span className={cn('text-ink tabular-nums', sizeClasses[size], className)}>
        {formatPrice(price)}
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex flex-wrap items-center gap-x-2 gap-y-1',
        sizeClasses[size],
        className,
      )}
    >
      <span className="text-ink tabular-nums">
        <span className="sr-only">Sale price </span>
        {formatPrice(salePrice)}
      </span>
      <s className="text-muted tabular-nums">
        <span className="sr-only">Original price </span>
        {formatPrice(price)}
      </s>
      {showPercentOff && <Badge tone="sale">{percentOff(price, salePrice)}% off</Badge>}
    </span>
  )
}
