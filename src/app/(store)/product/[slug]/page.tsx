import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductCard } from '@/components/product/product-card'
import { ProductView } from '@/components/product/product-view'
import { Accordion, type AccordionEntry } from '@/components/ui/accordion'
import { formatPrice } from '@/lib/format'
import { getFestiveSale, getProductPage, getProductSlugs, getSiteSettings } from '@/lib/sanity/data'
import { imageUrlWithAspect } from '@/lib/sanity/image'
import type { ProductCardData, ProductDetailData, SiteSettingsData } from '@/lib/sanity/models'

const COMPLETE_THE_LOOK_LIMIT = 4

export async function generateStaticParams() {
  const slugs = await getProductSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/product/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductPage(slug)
  if (!product) return { title: 'Page not found' }
  const image = product.variants[0]?.images[0]
  return {
    title: product.title,
    description: product.description,
    openGraph: image?.asset
      ? { images: [{ url: imageUrlWithAspect(image, 1200, 1500), width: 1200, height: 1500 }] }
      : undefined,
  }
}

function completeTheLook(product: ProductDetailData): ProductCardData[] {
  const seen = new Set<string>([product._id])
  const picks: ProductCardData[] = []
  for (const edit of product.edits) {
    for (const candidate of edit.products) {
      if (seen.has(candidate._id)) continue
      seen.add(candidate._id)
      picks.push(candidate)
    }
  }
  return picks.slice(0, COMPLETE_THE_LOOK_LIMIT)
}

function detailItems(product: ProductDetailData, settings: SiteSettingsData | null) {
  const items: AccordionEntry[] = [
    { id: 'description', title: 'Description', content: <p>{product.description}</p> },
    {
      id: 'fabric',
      title: 'Fabric and composition',
      content: (
        <div className="flex flex-col gap-1">
          <p>{product.composition}</p>
          <p>
            Material: {product.material}. Fit: {product.fit}.
          </p>
        </div>
      ),
    },
  ]

  if (product.care && product.care.length > 0) {
    items.push({
      id: 'care',
      title: 'Care',
      content: (
        <ul className="flex list-disc flex-col gap-1 pl-4">
          {product.care.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ),
    })
  }

  items.push({ id: 'origin', title: 'Origin', content: <p>{product.origin}</p> })

  if (settings) {
    items.push({
      id: 'shipping',
      title: 'Shipping and returns',
      content: (
        <div className="flex flex-col gap-2">
          <p>
            Free delivery on orders of {formatPrice(settings.freeShippingThreshold)} or more. Below
            that, delivery costs {formatPrice(settings.shippingFee)}. Cash on delivery adds{' '}
            {formatPrice(settings.codFee)}.
          </p>
          <p>
            Return or exchange within {settings.returnWindowDays} days of delivery from your order
            page.
          </p>
        </div>
      ),
    })
  }

  return items
}

export default async function ProductPage({ params }: PageProps<'/product/[slug]'>) {
  const { slug } = await params
  const [product, settings, festiveSale] = await Promise.all([
    getProductPage(slug),
    getSiteSettings(),
    getFestiveSale(),
  ])
  if (!product) notFound()

  const isInFestiveSale = Boolean(
    festiveSale?.isActive && festiveSale.edit?.productIds?.includes(product._id),
  )
  const lookProducts = completeTheLook(product)

  return (
    <div className="mx-auto max-w-page gutter-x pt-6 md:pt-10">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <li className="flex items-center gap-2">
            <Link href="/shop" className="hover:text-ink">
              Shop
            </Link>
            <span aria-hidden>/</span>
          </li>
          <li className="flex items-center gap-2">
            <Link href={`/shop/${product.category.slug}`} className="hover:text-ink">
              {product.category.title}
            </Link>
            <span aria-hidden>/</span>
          </li>
          <li aria-current="page" className="text-ink">
            {product.title}
          </li>
        </ol>
      </nav>

      <ProductView
        product={product}
        lowStockThreshold={settings?.lowStockThreshold ?? 0}
        festiveSale={
          isInFestiveSale && festiveSale
            ? {
                title: festiveSale.title,
                mode: festiveSale.mode,
                rollingHours: festiveSale.rollingHours,
                endsAt: festiveSale.endsAt,
              }
            : null
        }
        details={
          <Accordion items={detailItems(product, settings)} defaultOpenIds={['description']} />
        }
      />

      {lookProducts.length > 0 && (
        <section aria-labelledby="complete-the-look" className="mt-section">
          <h2 id="complete-the-look" className="mb-8 heading-display text-2xl md:text-3xl">
            Complete the look
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {lookProducts.map((lookProduct) => (
              <ProductCard
                key={lookProduct._id}
                product={lookProduct}
                sizes="(min-width: 768px) 25vw, 50vw"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
