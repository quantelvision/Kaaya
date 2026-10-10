import Link from 'next/link'
import { LookHotspots } from '@/components/home/look-hotspots'
import { ProductCard } from '@/components/product/product-card'
import { buttonClasses } from '@/components/ui/button'
import { SanityImage } from '@/components/ui/sanity-image'
import { cn } from '@/lib/cn'
import type { HomeEditData } from '@/lib/sanity/models'

const PORTRAIT = 4 / 5

export function EditsGallery({ edits }: { edits: HomeEditData[] }) {
  if (edits.length === 0) return null

  return (
    <section aria-labelledby="edits-heading" className="mx-auto mt-section max-w-page gutter-x">
      <div className="mb-10 flex items-end justify-between gap-6">
        <h2 id="edits-heading" className="heading-display text-2xl md:text-3xl">
          Edits
        </h2>
        <Link href="/edits" className="text-sm text-ink underline underline-offset-4">
          View all edits
        </Link>
      </div>

      <div className="flex flex-col gap-section">
        {edits.map((edit, index) => {
          const lookImage = edit.look?.image ?? edit.coverImage
          return (
            <article
              key={edit._id}
              className="grid items-center gap-8 md:grid-cols-12 md:gap-12"
              aria-labelledby={`edit-${edit.slug}`}
            >
              <div
                className={cn(
                  'relative aspect-portrait overflow-hidden rounded-card bg-wash md:col-span-7',
                  index % 2 === 1 && 'md:order-2 md:col-start-6',
                )}
              >
                <SanityImage
                  image={lookImage}
                  alt={`${edit.title} look`}
                  aspectRatio={PORTRAIT}
                  sizes="(min-width: 768px) 58vw, 100vw"
                />
                {edit.look && <LookHotspots hotspots={edit.look.hotspots} />}
              </div>

              <div
                className={cn(
                  'flex flex-col gap-6 md:col-span-5',
                  index % 2 === 1 && 'md:order-1 md:col-start-1',
                )}
              >
                <p className="label-caps text-muted">Edit {String(index + 1).padStart(2, '0')}</p>
                <h3 id={`edit-${edit.slug}`} className="heading-display text-3xl md:text-4xl">
                  {edit.title}
                </h3>
                <p className="max-w-prose text-base text-muted">{edit.story}</p>
                <div className="grid grid-cols-2 gap-4">
                  {edit.products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      sizes="(min-width: 768px) 20vw, 45vw"
                    />
                  ))}
                </div>
                <Link
                  href={`/edits/${edit.slug}`}
                  className={buttonClasses({ variant: 'secondary', className: 'self-start' })}
                >
                  Shop the edit
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
