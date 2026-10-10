import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ListingHeader } from '@/components/listing/listing-header'
import { ListingSkeleton } from '@/components/listing/listing-skeleton'
import { ListingView } from '@/components/listing/listing-view'
import { getCategoryPage, getCategorySlugs } from '@/lib/sanity/data'

export async function generateStaticParams() {
  const slugs = await getCategorySlugs()
  return slugs.map(({ slug }) => ({ category: slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/shop/[category]'>): Promise<Metadata> {
  const { category: slug } = await params
  const category = await getCategoryPage(slug)
  if (!category) return {}
  return { title: category.title, description: category.description ?? undefined }
}

export default async function CategoryPage({ params }: PageProps<'/shop/[category]'>) {
  const { category: slug } = await params
  const category = await getCategoryPage(slug)
  if (!category) notFound()

  return (
    <>
      <ListingHeader
        title={category.title}
        description={category.description}
        productCount={category.products.length}
        crumbs={[{ label: 'Shop', href: '/shop' }]}
      />
      <Suspense fallback={<ListingSkeleton />}>
        <ListingView products={category.products} showCategoryFacet={false} />
      </Suspense>
    </>
  )
}
