import type { CSSProperties } from 'react'

const SECONDS_PER_LINE = 14

function MarqueeRun({ lines, isHidden }: { lines: string[]; isHidden?: boolean }) {
  return (
    <ul aria-hidden={isHidden} className="flex shrink-0 items-center">
      {lines.map((line, index) => (
        <li key={`${line}-${index}`} className="flex items-center whitespace-nowrap">
          <span className="px-8 md:px-12">{line}</span>
          <span aria-hidden className="size-2 rounded-full bg-accent" />
        </li>
      ))}
    </ul>
  )
}

export function ManifestoMarquee({ lines }: { lines: string[] }) {
  if (lines.length === 0) return null

  const style = { '--marquee-duration': `${lines.length * SECONDS_PER_LINE}s` } as CSSProperties

  return (
    <section
      aria-label="Kaaya manifesto"
      className="mt-section overflow-hidden border-y border-line py-10 md:py-14"
    >
      <div className="flex heading-display text-3xl text-ink motion-reduce:hidden md:text-5xl">
        <div className="flex w-max animate-marquee" style={style}>
          <MarqueeRun lines={lines} />
          <MarqueeRun lines={lines} isHidden />
        </div>
      </div>
      <ul className="mx-auto hidden max-w-page flex-col gap-3 gutter-x heading-display text-2xl motion-reduce:flex">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </section>
  )
}
