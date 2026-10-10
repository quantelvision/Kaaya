import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RewardsBalance } from '@/components/rewards/rewards-balance'
import { TierList } from '@/components/rewards/tier-list'
import { buttonClasses } from '@/components/ui/button'
import { formatNumber, formatPrice } from '@/lib/format'
import { minimumBagForPoints } from '@/lib/pricing/settings'
import { getLoyaltySettings } from '@/lib/sanity/data'

export const metadata: Metadata = {
  title: 'Rewards',
  description: 'How Kaaya points work: earn on every order, use them on your next bag.',
}

export default async function RewardsPage() {
  const loyalty = await getLoyaltySettings()
  if (!loyalty) notFound()

  const tiers = loyalty.tiers.map((tier) => ({
    name: tier.name,
    minPoints: tier.minPoints,
    perk: tier.perk,
  }))
  const pointValue = formatPrice(loyalty.pointValueRupees)
  const minimumBag = formatPrice(minimumBagForPoints(loyalty))

  return (
    <div className="mx-auto flex max-w-page flex-col gap-section gutter-x pt-8 md:pt-12">
      <div className="grid gap-10 md:grid-cols-12 md:items-start">
        <header className="flex flex-col gap-4 md:col-span-6">
          <p className="label-caps text-muted">Kaaya rewards</p>
          <h1 className="heading-display text-4xl text-ink md:text-5xl">Points on every order</h1>
          <p className="max-w-prose text-base text-muted">
            Every order adds to your balance, and your balance comes off your next bag. Points stay
            with you for this visit.
          </p>
          <Link href="/shop" className={buttonClasses({ className: 'self-start' })}>
            Shop all
          </Link>
        </header>
        <div className="md:col-span-5 md:col-start-8">
          <RewardsBalance tiers={tiers} startingPoints={loyalty.startingPoints} />
        </div>
      </div>

      <section aria-labelledby="earn-heading" className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h2 id="earn-heading" className="heading-display text-2xl text-ink md:text-3xl">
            How to earn
          </h2>
          <p className="max-w-prose text-base text-muted">
            You earn 1 point for every {formatPrice(loyalty.earnRupeesPerPoint)} you pay, counted
            after codes and points and before delivery. Points reach your balance as soon as your
            order is placed.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="heading-display text-2xl text-ink md:text-3xl">How to use them</h2>
          <p className="max-w-prose text-base text-muted">
            One point is worth {pointValue}. Use {formatNumber(loyalty.minRedeemPoints)} points or
            more, for up to {loyalty.maxRedeemPercent}% of your bag after a code, on bags of{' '}
            {minimumBag} or more. Turn points on in your bag or at checkout.
          </p>
        </div>
      </section>

      <section aria-labelledby="tiers-heading" className="flex flex-col gap-6">
        <h2 id="tiers-heading" className="heading-display text-2xl text-ink md:text-3xl">
          Tiers
        </h2>
        <TierList tiers={tiers} startingPoints={loyalty.startingPoints} />
      </section>
    </div>
  )
}
