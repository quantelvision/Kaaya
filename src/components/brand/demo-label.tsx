import { cn } from '@/lib/cn'

export function DemoLabel({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-btn border border-line px-2 py-0.5 label-caps whitespace-nowrap text-muted',
        className,
      )}
    >
      Demo store
    </span>
  )
}
