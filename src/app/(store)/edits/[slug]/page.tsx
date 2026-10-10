import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { LookHotspots } from '@/components/home/look-hotspots'
import { ListingHeader } from '@/components/listing/listing-header'
import { ListingSkeleton } from '@/components/listing/listing-skeleton'
import { ListingView } from '@/components/listing/listing-view'
import { SanityImage } from '@/components/ui/sanity-image'
import { getEditPage, getEditSlugs } from '@/lib/sanity/data'

const PORTRAIT = 4 / 5

export async function generateStaticParams() {
  const slugs = await getEditSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps<'/edits/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const edit = await getEditPage(slug)
  if (!edit) return { title: 'Page not found' }
  return { title: edit.title, description: edit.story }
}

export default async function EditPage({ params }: PageProps<'/edits/[slug]'>) {
  const { slug } = await params
  const edit = await getEditPage(slug)
  if (!edit) notFound()

  const look = edit.looks?.[0]

  return (
    <>
      <ListingHeader
        eyebrow="Edit"
        title={edit.title}
        description={edit.story}
        productCount={edit.products.length}
        crumbs={[{ label: 'Edits', href: '/edits' }]}
      />
      {look && (
        <section
          aria-label={`Shop the ${edit.title} look`}
          className="mx-auto mb-10 max-w-page gutter-x"
        >
          <div className="relative mx-auto aspect-portrait max-w-xl overflow-hidden rounded-card bg-wash">
            <SanityImage
              image={look.image}
              alt={`${edit.title} look`}
              aspectRatio={PORTRAIT}
              sizes="(min-width: 640px) 36rem, 100vw"
              isPriority
            />
            <LookHotspots hotspots={look.hotspots} />
          </div>
          <p className="mt-3 text-center text-xs text-muted">Tap a dot to see the piece.</p>
        </section>
      )}
      <Suspense fallback={<ListingSkeleton />}>
        <ListingView products={edit.products} showCategoryFacet />
      </Suspense>
    </>
  )
}
