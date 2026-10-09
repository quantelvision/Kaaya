import { categoryIconPaths, type CategoryIconKey } from '@/components/icons/category-icon-paths'
import { cn } from '@/lib/cn'

type CategoryIconProps = {
  iconKey: CategoryIconKey
  className?: string
}

export function CategoryIcon({ iconKey, className }: CategoryIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn('size-6 shrink-0', className)}
    >
      {categoryIconPaths[iconKey].map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  )
}
