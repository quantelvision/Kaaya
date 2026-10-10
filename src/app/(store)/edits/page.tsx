import type { Metadata } from 'next'
import Link from 'next/link'
import { SanityImage } from '@/components/ui/sanity-image'
import { getAllEdits } from '@/lib/sanity/data'

const PORTRAIT = 4 / 5

export const metadata: Metadata = {
  title: 'Edits',
  description:
    'Edits from the Kaaya demo store: festive dressing, Y2K shapes, street wear and more.',
}

export default async function EditsIndexPage() {
  const edits = await getAllEdits()

  return (
    <div className="mx-auto max-w-page gutter-x pt-8 md:pt-12">
      <header className="mb-10 md:mb-14">
        <h1 className="heading-display text-4xl text-ink md:text-5xl">Edits</h1>
        <p className="mt-4 max-w-prose text-base text-muted">
          Small groups of pieces chosen to be worn together.
        </p>
      </header>
      <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {edits.map((edit, index) => (
          <li key={edit._id}>
            <Link href={`/edits/${edit.slug}`} className="group flex flex-col gap-4">
              <div className="relative aspect-portrait overflow-hidden rounded-card bg-surface">
                <SanityImage
                  image={edit.coverImage}
                  alt={edit.title}
                  aspectRatio={PORTRAIT}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  isPriority={index < 3}
                  className="mix-blend-multiply transition-transform duration-400 ease-out group-hover:scale-103 motion-reduce:transition-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="label-caps text-muted tabular-nums">
                  {edit.productCount} {edit.productCount === 1 ? 'piece' : 'pieces'}
                </p>
                <h2 className="heading-display text-2xl text-ink">{edit.title}</h2>
                <p className="text-sm text-muted">{edit.story}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
