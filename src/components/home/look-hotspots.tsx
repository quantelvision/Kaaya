'use client'

import * as Popover from '@radix-ui/react-popover'
import Link from 'next/link'
import { Price } from '@/components/ui/price'
import { SanityImage } from '@/components/ui/sanity-image'
import type { LookData } from '@/lib/sanity/models'

const PORTRAIT = 4 / 5

export function LookHotspots({ hotspots }: { hotspots: LookData['hotspots'] }) {
  return (
    <>
      {hotspots.map((hotspot) => {
        const product = hotspot.product
        if (!product) return null
        const variant = product.variants[0]
        const image = variant?.images[0]

        return (
          <Popover.Root key={hotspot._key}>
            <Popover.Trigger
              aria-label={`Show ${product.title}`}
              className="group absolute flex size-tap -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            >
              <span className="flex size-6 items-center justify-center rounded-full border border-ink bg-surface shadow-float transition-transform duration-200 group-hover:scale-110 group-data-[state=open]:scale-110">
                <span className="size-1.5 rounded-full bg-ink" />
              </span>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                side="top"
                sideOffset={8}
                collisionPadding={16}
                className="z-40 flex w-64 gap-3 rounded-card border border-line bg-surface p-3 shadow-float outline-none"
              >
                {image && (
                  <div className="relative aspect-portrait w-16 shrink-0 overflow-hidden rounded-control bg-surface">
                    <SanityImage
                      image={image}
                      alt=""
                      aspectRatio={PORTRAIT}
                      sizes="64px"
                      className="mix-blend-multiply"
                    />
                  </div>
                )}
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="text-sm text-ink">{product.title}</p>
                  <Price price={product.price} salePrice={product.salePrice} size="sm" />
                  <Link
                    href={`/product/${product.slug}`}
                    className="mt-1 text-xs font-medium text-primary underline underline-offset-4"
                  >
                    View
                  </Link>
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        )
      })}
    </>
  )
}
