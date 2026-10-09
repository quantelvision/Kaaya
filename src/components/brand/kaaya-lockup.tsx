import { DemoLabel } from '@/components/brand/demo-label'
import { KaayaWordmark } from '@/components/brand/kaaya-wordmark'
import { cn } from '@/lib/cn'

type KaayaLockupProps = {
  layout: 'horizontal' | 'stacked'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function KaayaLockup({ layout, size = 'md', className }: KaayaLockupProps) {
  return (
    <span
      className={cn(
        'inline-flex',
        layout === 'horizontal' ? 'items-center gap-3' : 'flex-col items-start gap-2',
        className,
      )}
    >
      <KaayaWordmark size={size} />
      <DemoLabel className={layout === 'stacked' ? 'border-0 px-0 py-0' : undefined} />
    </span>
  )
}
