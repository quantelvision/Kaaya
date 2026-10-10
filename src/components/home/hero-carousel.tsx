'use client'

import { ArrowRight, CaretLeft, CaretRight, Pause, Play } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { buttonClasses } from '@/components/ui/button'
import { Price } from '@/components/ui/price'
import { SanityImage } from '@/components/ui/sanity-image'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/cn'
import type { HeroSlideData } from '@/lib/sanity/models'

const AUTOPLAY_MS = 6000
const SWIPE_THRESHOLD_PX = 40
const PORTRAIT = 4 / 5
const RISE_STEP_MS = 90

type LookProduct = NonNullable<HeroSlideData['look']>['products'][number]

const controlButtonClasses =
  'inline-flex size-tap shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-wash'

function riseStyle(step: number): CSSProperties {
  return { animationDelay: `${step * RISE_STEP_MS}ms` }
}

function formatCount(value: number) {
  return String(value).padStart(2, '0')
}

function LookProductTile({ product }: { product: LookProduct }) {
  const image = product.variants[0]?.images[0]
  return (
    <li className="min-w-0">
      <Link
        href={`/product/${product.slug}`}
        className="group flex items-center gap-3 rounded-card border border-line bg-surface/70 p-2 pr-3 backdrop-blur-sm transition-colors hover:border-ink"
      >
        <span className="relative aspect-portrait w-12 shrink-0 overflow-hidden rounded-control bg-surface">
          {image && (
            <SanityImage
              image={image}
              alt=""
              aspectRatio={PORTRAIT}
              sizes="48px"
              className="mix-blend-multiply transition-transform duration-400 ease-out group-hover:scale-105 motion-reduce:transition-none"
            />
          )}
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-xs text-ink">{product.title}</span>
          <Price price={product.price} salePrice={product.salePrice} size="sm" />
        </span>
      </Link>
    </li>
  )
}

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
    <div className="mt-8 flex justify-center md:mt-10">
      <div className="inline-flex items-center rounded-full border border-line bg-surface/90 px-1 shadow-float backdrop-blur-sm">
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
                className="flex h-tap w-8 items-center md:w-10"
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
      className="relative isolate"
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
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hero-glow" />
      <div className="mx-auto max-w-page gutter-x pt-6 md:pt-10">
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
            // a swipe that ends on the button or a product should not also open it
            if (!didSwipe.current) return
            didSwipe.current = false
            event.preventDefault()
            event.stopPropagation()
          }}
        >
          {slides.map((slide, index) => {
            const isActive = index === activeIndex
            const rise = isActive ? 'animate-rise' : undefined
            const products = slide.look?.products ?? []
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
                <div className="relative aspect-portrait w-full overflow-hidden rounded-card bg-wash shadow-float md:order-2 lg:h-hero lg:w-auto lg:max-w-full lg:justify-self-end">
                  <div className={cn('absolute inset-0', isActive && 'animate-hero-zoom')}>
                    <SanityImage
                      image={slide.image}
                      alt={slide.headline}
                      aspectRatio={PORTRAIT}
                      sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                      isPriority={index === 0}
                      className="pointer-events-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-start gap-5 md:order-1 md:pr-4">
                  <div className={cn('flex items-center gap-3', rise)} style={riseStyle(0)}>
                    <span className="text-xs text-muted tabular-nums">
                      <span className="text-ink">{formatCount(index + 1)}</span> /{' '}
                      {formatCount(slideCount)}
                    </span>
                    {slide.badge && (
                      <>
                        <span aria-hidden className="h-px w-8 bg-line" />
                        <p className="label-caps text-primary">{slide.badge}</p>
                      </>
                    )}
                  </div>
                  <h2
                    className={cn('heading-display text-4xl text-ink md:text-5xl', rise)}
                    style={riseStyle(1)}
                  >
                    {slide.headline}
                  </h2>
                  {slide.subtext && (
                    <p
                      className={cn('max-w-prose text-base text-muted', rise)}
                      style={riseStyle(2)}
                    >
                      {slide.subtext}
                    </p>
                  )}
                  <div
                    className={cn('flex flex-wrap items-center gap-x-6 gap-y-3', rise)}
                    style={riseStyle(3)}
                  >
                    <Link href={slide.ctaHref} className={buttonClasses({ size: 'lg' })}>
                      {slide.ctaLabel}
                    </Link>
                    <Link
                      href="/shop"
                      className="group inline-flex h-tap items-center gap-2 text-sm text-ink"
                    >
                      <span className="underline decoration-line underline-offset-4 transition-colors group-hover:decoration-ink">
                        Shop all
                      </span>
                      <ArrowRight
                        weight="light"
                        className="size-4 transition-transform duration-300 ease-out-soft group-hover:translate-x-1 motion-reduce:transition-none"
                        aria-hidden
                      />
                    </Link>
                  </div>
                  {products.length > 0 && (
                    <div
                      className={cn('mt-2 flex w-full flex-col gap-3', rise)}
                      style={riseStyle(4)}
                    >
                      <p className="label-caps text-muted">In this look</p>
                      <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                        {products.map((product) => (
                          <LookProductTile key={product._id} product={product} />
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

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
    </section>
  )
}
