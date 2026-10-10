import Link from 'next/link'

type Crumb = { label: string; href: string }

type ListingHeaderProps = {
  eyebrow?: string
  title: string
  description?: string | null
  productCount: number
  crumbs?: Crumb[]
}

export function ListingHeader({
  eyebrow,
  title,
  description,
  productCount,
  crumbs = [],
}: ListingHeaderProps) {
  return (
    <header className="mx-auto max-w-page gutter-x pt-8 pb-6 md:pt-12 md:pb-8">
      {crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-muted">
            {crumbs.map((crumb) => (
              <li key={crumb.href} className="flex items-center gap-2">
                <Link href={crumb.href} className="hover:text-ink">
                  {crumb.label}
                </Link>
                <span aria-hidden>/</span>
              </li>
            ))}
            <li aria-current="page" className="text-ink">
              {title}
            </li>
          </ol>
        </nav>
      )}
      {eyebrow && <p className="mb-3 label-caps text-muted">{eyebrow}</p>}
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <h1 className="heading-display text-4xl text-ink md:text-5xl">{title}</h1>
        <span className="text-sm text-muted tabular-nums">
          {productCount} {productCount === 1 ? 'piece' : 'pieces'}
        </span>
      </div>
      {description && <p className="mt-4 max-w-prose text-base text-muted">{description}</p>}
    </header>
  )
}
