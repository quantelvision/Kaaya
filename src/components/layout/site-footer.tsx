import Link from 'next/link'
import type { ReactNode } from 'react'
import { KaayaLockup } from '@/components/brand/kaaya-lockup'
import { HelpSheetLink } from '@/components/layout/help-sheet-link'
import type { NavCategory, NavEdit, StoreHelpSettings } from '@/components/layout/nav-types'
import { QuantelFooterCredit } from '@/components/quantel/quantel-footer-credit'
import { formatPrice } from '@/lib/format'

type SiteFooterProps = {
  categories: NavCategory[]
  edits: NavEdit[]
  helpSettings: StoreHelpSettings
}

const footerLinkClasses =
  'inline-flex min-h-tap items-center text-sm text-ink underline-offset-4 hover:underline'

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="mb-2 label-caps text-muted">{title}</h2>
      <ul className="flex flex-col">{children}</ul>
    </div>
  )
}

export function SiteFooter({ categories, edits, helpSettings }: SiteFooterProps) {
  return (
    <footer className="mt-section border-t border-line bg-surface">
      <div className="mx-auto max-w-page gutter-x pt-14 pb-28 md:pb-24">
        <Link href="/" aria-label="Kaaya home" className="inline-flex">
          <KaayaLockup layout="stacked" size="lg" />
        </Link>

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          <FooterColumn title="Shop">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/shop/${category.slug}`} className={footerLinkClasses}>
                  {category.title}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Edits">
            {edits.map((edit) => (
              <li key={edit.slug}>
                <Link href={`/edits/${edit.slug}`} className={footerLinkClasses}>
                  {edit.title}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Help">
            <li>
              <HelpSheetLink label="Shipping" title="Shipping">
                <p>
                  Delivery is free on orders of {formatPrice(helpSettings.freeShippingThreshold)} or
                  more. Below that, delivery costs {formatPrice(helpSettings.shippingFee)}.
                </p>
                <p>
                  Cash on delivery adds {formatPrice(helpSettings.codFee)}. Orders are packed the
                  next day and usually arrive within 4 days.
                </p>
              </HelpSheetLink>
            </li>
            <li>
              <HelpSheetLink label="Returns" title="Returns and exchanges">
                <p>
                  You can return or exchange a piece within {helpSettings.returnWindowDays} days of
                  delivery. Start the request from your order page and pick a pickup slot.
                </p>
                <p>
                  Refunds go back to the original payment method, or to your Kaaya points with a 10%
                  bonus.
                </p>
              </HelpSheetLink>
            </li>
            <li>
              <HelpSheetLink label="Size help" title="Size help">
                <p>
                  Apparel runs from XS to XXL. Ethnic wear runs from S to XXL. Footwear runs from UK
                  5 to UK 11.
                </p>
                <p>
                  Every product page lists the fit and the size the model wears. If you are between
                  sizes, take the larger one for relaxed and oversized fits.
                </p>
              </HelpSheetLink>
            </li>
          </FooterColumn>

          <div className="col-span-2 md:col-span-1">
            <QuantelFooterCredit />
          </div>
        </div>

        <p className="mt-14 border-t border-line pt-6 text-xs text-muted">
          Kaaya is a demo store. No real orders are placed.
        </p>
      </div>
    </footer>
  )
}
