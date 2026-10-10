'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type RailProps = {
  label: string
  className?: string
  children: ReactNode
}

export function Rail({ label, className, children }: RailProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState({ size: 1, offset: 0 })

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scroller
      const size = scrollWidth > 0 ? Math.min(1, clientWidth / scrollWidth) : 1
      const maxScroll = scrollWidth - clientWidth
      const offset = maxScroll > 0 ? (scrollLeft / maxScroll) * (1 - size) : 0
      setProgress({ size, offset })
    }

    update()
    scroller.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(scroller)
    return () => {
      scroller.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [])

  return (
    <div className={className}>
      <div
        ref={scrollerRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="scrollbar-none flex snap-x snap-mandatory scroll-px-gutter gap-4 overflow-x-auto gutter-x"
      >
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          'mx-gutter mt-5 h-px overflow-hidden bg-line',
          progress.size >= 1 && 'invisible',
        )}
      >
        <div
          className="h-full origin-left bg-ink transition-transform duration-150"
          style={{
            width: `${progress.size * 100}%`,
            transform: `translateX(${(progress.offset / progress.size) * 100}%)`,
          }}
        />
      </div>
    </div>
  )
}
