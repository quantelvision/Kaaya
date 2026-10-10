'use client'

import { CaretLeft, CaretRight, Pause, Play } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { buttonClasses } from '@/components/ui/button'
import { SanityImage } from '@/components/ui/sanity-image'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/cn'
import type { HeroSlideData } from '@/lib/sanity/models'

const AUTOPLAY_MS = 6000
const SWIPE_THRESHOLD_PX = 40
const PORTRAIT = 4 / 5

const controlButtonClasses =
  'inline-flex size-tap shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-wash'

type SlideControlsProps = {
  slides: HeroSlideData[]
  activeIndex: number
  isAutoplaying: boolean
  isStopped: boolean
  canAutoplay: boolean
  onSelect: (index: number) => void
  onToggleStopped: () => void
}

function SlideControls({
  slides,
  activeIndex,
  isAutoplaying,
  isStopped,
  canAutoplay,
  onSelect,
  onToggleStopped,
}: SlideControlsProps) {
  const progressStyle = { '--progress-duration': `${AUTOPLAY_MS}ms` } as CSSProperties

  return (
    <div className="absolute bottom-3 left-1/2 z-10 inline-flex -translate-x-1/2 items-center rounded-full border border-line bg-surface/90 px-1 shadow-float backdrop-blur-sm md:bottom-5">
      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => onSelect(activeIndex - 1)}
        className={controlButtonClasses}
      >
        <CaretLeft weight="light" className="size-5" aria-hidden />
      </button>
      <div className="flex items-center gap-1.5 px-1">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex
          return (
            <button
              key={slide._id}
              type="button"
              aria-label={`Show slide ${index + 1} of ${slides.length}`}
              aria-current={isActive}
              onClick={() => onSelect(index)}
              className="flex h-tap w-8 cursor-pointer items-center"
            >
              <span className="relative h-0.5 w-full overflow-hidden rounded-full bg-line">
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
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => onSelect(activeIndex + 1)}
        className={controlButtonClasses}
      >
        <CaretRight weight="light" className="size-5" aria-hidden />
      </button>
      {canAutoplay && (
        <button
          type="button"
          aria-label={isStopped ? 'Play slideshow' : 'Pause slideshow'}
          onClick={onToggleStopped}
          className={cn(controlButtonClasses, 'rounded-l-none border-l border-line')}
        >
          {isStopped ? (
            <Play weight="light" className="size-4" aria-hidden />
          ) : (
            <Pause weight="light" className="size-4" aria-hidden />
          )}
        </button>
      )}
    </div>
  )
}

export function HeroCarousel({ slides }: { slides: HeroSlideData[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isStopped, setIsStopped] = useState(false)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const didSwipe = useRef(false)
  const slideCount = slides.length
  const canAutoplay = slideCount > 1 && !prefersReducedMotion
  const isAutoplaying = canAutoplay && !isPaused && !isStopped

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

  const endDrag = (x: number, y: number) => {
    const start = dragStart.current
    dragStart.current = null
    if (!start) return
    const deltaX = x - start.x
    const deltaY = y - start.y
    if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX && Math.abs(deltaX) > Math.abs(deltaY)) {
      didSwipe.current = true
      goTo(activeIndex + (deltaX < 0 ? 1 : -1))
    }
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured looks"
      className="mx-auto max-w-page gutter-x pt-6 md:pt-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false)
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') goTo(activeIndex + 1)
        if (event.key === 'ArrowLeft') goTo(activeIndex - 1)
      }}
    >
      <div
        className="grid touch-pan-y select-none"
        onDragStart={(event) => event.preventDefault()}
        onPointerDown={(event) => {
          if (event.button !== 0) return
          didSwipe.current = false
          dragStart.current = { x: event.clientX, y: event.clientY }
          if (event.pointerType !== 'mouse') setIsPaused(true)
        }}
        onPointerUp={(event) => {
          endDrag(event.clientX, event.clientY)
          if (event.pointerType !== 'mouse') setIsPaused(false)
        }}
        onPointerCancel={() => {
          dragStart.current = null
          setIsPaused(false)
        }}
        onClickCapture={(event) => {
          // a swipe that ends on the button or a control should not also activate it
          if (!didSwipe.current) return
          didSwipe.current = false
          event.preventDefault()
          event.stopPropagation()
        }}
      >
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
                'grid items-center gap-8 transition-opacity duration-700 ease-out [grid-area:1/1] motion-reduce:transition-none md:grid-cols-2 md:gap-14',
                isActive ? 'opacity-100' : 'pointer-events-none opacity-0',
              )}
            >
              <div className="relative aspect-portrait w-full overflow-hidden rounded-card bg-wash md:order-2 lg:h-hero lg:w-auto lg:max-w-full lg:justify-self-end">
                <SanityImage
                  image={slide.image}
                  alt={slide.headline}
                  aspectRatio={PORTRAIT}
                  sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                  isPriority={index === 0}
                  className="pointer-events-none"
                />
                {slideCount > 1 && (
                  <SlideControls
                    slides={slides}
                    activeIndex={activeIndex}
                    isAutoplaying={isAutoplaying}
                    isStopped={isStopped}
                    canAutoplay={canAutoplay}
                    onSelect={goTo}
                    onToggleStopped={() => setIsStopped((value) => !value)}
                  />
                )}
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
    </section>
  )
}
