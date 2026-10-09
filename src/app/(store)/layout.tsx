import { CustomizerButton } from '@/components/customizer/customizer-button'
import { AnnouncementTicker } from '@/components/layout/announcement-ticker'
import type { NavCategory, NavEdit, StoreHelpSettings } from '@/components/layout/nav-types'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'
import { QuantelCreditPill } from '@/components/quantel/quantel-credit-pill'

const tickerMessages = [
  'Free delivery on orders above ₹1,499',
  'The Festive Edit Sale is live. Up to 30% off',
  'Use WELCOME250 for ₹250 off your first order',
]

const categories: NavCategory[] = [
  { title: 'Ethnic', slug: 'ethnic', iconKey: 'ethnic' },
  { title: 'Dresses and Sets', slug: 'dresses-and-sets', iconKey: 'dresses' },
  { title: 'Tops', slug: 'tops', iconKey: 'tops' },
  { title: 'Outerwear', slug: 'outerwear', iconKey: 'outerwear' },
  { title: 'Bottoms', slug: 'bottoms', iconKey: 'bottoms' },
  { title: 'Footwear', slug: 'footwear', iconKey: 'footwear' },
]

const edits: NavEdit[] = [
  { title: 'The Festive Edit', slug: 'festive-edit' },
  { title: 'Y2K Revival', slug: 'y2k-revival' },
  { title: 'Street Uniform', slug: 'street-uniform' },
  { title: 'Summer Resort', slug: 'summer-resort' },
  { title: 'Smart Casual', slug: 'smart-casual' },
]

const helpSettings: StoreHelpSettings = {
  freeShippingThreshold: 1499,
  shippingFee: 99,
  codFee: 49,
  returnWindowDays: 7,
}

export default function StoreLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <AnnouncementTicker messages={tickerMessages} />
      <SiteHeader categories={categories} edits={edits} />
      <main className="flex-1">{children}</main>
      <SiteFooter categories={categories} edits={edits} helpSettings={helpSettings} />
      <QuantelCreditPill />
      <CustomizerButton />
    </>
  )
}
