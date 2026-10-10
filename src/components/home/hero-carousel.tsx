'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { buttonClasses } from '@/components/ui/button'
import { SanityImage } from '@/components/ui/sanity-image'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/cn'
import type { HeroSlideData } from '@/lib/sanity/models'

const AUTOPLAY_MS = 6000
const SWIPE_THRESHOLD_PX = 50
const PORTRAIT = 4 / 5

export function HeroCarousel({ slides }: { slides: HeroSlideData[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const pointerStartX = useRef<number | null>(null)
  const slideCount = slides.length
  const isAutoplaying = slideCount > 1 && !isPaused && !prefersReducedMotion

  const goTo = useCallback(
    (index: number) => setActiveIndex((index + slideCount) % slideCount),
    [slideCount],
  )

  useEffect(() => {
    if (!isAutoplaying) return
    const timer = window.setTimeout(() => goTo(activeIndex + 1), AUTOPLAY_MS)
    return () => window.clearTimeout(timer)
  }, [activeIndex, isAutoplaying, goTo])

  if (slideCount === 0) return null

  const progressStyle = { '--progress-duration': `${AUTOPLAY_MS}ms` } as CSSProperties

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured edits"
      className="mx-auto max-w-page gutter-x pt-6 md:pt-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onPointerDown={(event) => {
        pointerStartX.current = event.clientX
      }}
      onPointerUp={(event) => {
        if (pointerStartX.current === null) return
        const delta = event.clientX - pointerStartX.current
        pointerStartX.current = null
        if (Math.abs(delta) > SWIPE_THRESHOLD_PX) goTo(activeIndex + (delta < 0 ? 1 : -1))
      }}
    >
      <div className="grid">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex
          return (
            <div
              key={slide._id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slideCount}`}
              aria-hidden={!isActive}
              inert={!isActive}
              className={cn(
                'grid items-center gap-8 transition-opacity duration-700 ease-out [grid-area:1/1] md:grid-cols-2 md:gap-14',
                isActive ? 'opacity-100' : 'pointer-events-none opacity-0',
              )}
            >
              <div className="relative aspect-portrait overflow-hidden rounded-card bg-wash md:order-2">
                <SanityImage
                  image={slide.image}
                  alt={slide.headline}
                  aspectRatio={PORTRAIT}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  isPriority={index === 0}
                />
              </div>
              <div className="flex flex-col items-start gap-5 md:order-1 md:pr-8">
                {slide.badge && <p className="label-caps text-primary">{slide.badge}</p>}
                <h2 className="heading-display text-4xl text-ink md:text-5xl">{slide.headline}</h2>
                {slide.subtext && (
                  <p className="max-w-prose text-base text-muted">{slide.subtext}</p>
                )}
                <Link href={slide.ctaHref} className={buttonClasses({ size: 'lg' })}>
                  {slide.ctaLabel}
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {slideCount > 1 && (
        <div className="mt-8 flex gap-2 md:mt-10">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={slide._id}
                type="button"
                aria-label={`Show slide ${index + 1}`}
                aria-current={isActive}
                onClick={() => goTo(index)}
                className="group flex h-tap w-14 items-center"
              >
                <span className="relative h-0.5 w-full overflow-hidden bg-line">
                  {isActive && (
                    <span
                      key={`${activeIndex}-${isAutoplaying}`}
                      style={progressStyle}
                      className={cn(
                        'absolute inset-0 origin-left bg-ink',
                        isAutoplaying ? 'animate-progress' : 'scale-x-100',
                      )}
                    />
                  )}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
