import Image from 'next/image'
import { cn } from '@/lib/cn'

const sources = {
  onBlack: '/brand/quantelvision/quantelvision-mark-on-black.png',
  onWhite: '/brand/quantelvision/quantelvision-mark-on-white.png',
} as const

type QuantelMarkProps = {
  tone: keyof typeof sources
  className?: string
}

// the source marks sit on a padded square, so the image is scaled up inside a clipping box
export function QuantelMark({ tone, className }: QuantelMarkProps) {
  return (
    <span
      className={cn('relative inline-block size-5 shrink-0 overflow-hidden', className)}
      aria-hidden
    >
      <Image
        src={sources[tone]}
        alt=""
        width={256}
        height={256}
        sizes="40px"
        className={cn(
          'absolute inset-0 size-full scale-[1.75] object-cover',
          tone === 'onBlack' ? 'mix-blend-lighten' : 'mix-blend-darken',
        )}
      />
    </span>
  )
}
