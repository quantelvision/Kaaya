import type { CSSProperties } from 'react'

const SECONDS_PER_MESSAGE = 9

function TickerRun({ messages, isHidden }: { messages: string[]; isHidden?: boolean }) {
  return (
    <ul aria-hidden={isHidden} className="flex shrink-0 items-center">
      {[...messages, ...messages].map((message, index) => (
        <li key={`${message}-${index}`} className="flex items-center whitespace-nowrap">
          <span className="px-6">{message}</span>
          <span aria-hidden className="size-1 rounded-full bg-on-primary/50" />
        </li>
      ))}
    </ul>
  )
}

export function AnnouncementTicker({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null

  const style = {
    '--marquee-duration': `${messages.length * SECONDS_PER_MESSAGE * 2}s`,
  } as CSSProperties

  return (
    <section aria-label="Store announcements" className="bg-primary text-xs text-on-primary">
      <div className="flex h-9 overflow-hidden pause-children-on-hover motion-reduce:hidden">
        <div className="flex w-max animate-marquee" style={style}>
          <TickerRun messages={messages} />
          <TickerRun messages={messages} isHidden />
        </div>
      </div>
      <p className="hidden h-9 items-center justify-center gutter-x text-center motion-reduce:flex">
        {messages[0]}
      </p>
    </section>
  )
}
