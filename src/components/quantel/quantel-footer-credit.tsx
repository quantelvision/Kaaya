import Image from 'next/image'
import {
  QUANTEL_EMAIL,
  QUANTEL_PHONE_DISPLAY,
  QUANTEL_PHONE_URL,
  QUANTEL_SITE_URL,
} from '@/lib/quantel'

const contactLinkClasses =
  'inline-flex min-h-tap items-center text-sm text-q-text underline-offset-4 tabular-nums hover:underline'

export function QuantelFooterCredit() {
  return (
    <div className="flex flex-col items-start gap-3 font-q-body text-q-text">
      <a
        href={QUANTEL_SITE_URL}
        target="_blank"
        rel="noopener"
        className="group inline-flex flex-col items-start gap-3"
      >
        <Image
          src="/brand/quantelvision/quantelvision-logo-black.png"
          alt="Quantel Vision"
          width={800}
          height={343}
          className="h-10 w-auto"
        />
        <span className="text-xs text-q-text-light transition-colors group-hover:text-q-text">
          Designed and engineered by Quantel Vision
        </span>
      </a>
      <ul className="flex flex-col">
        <li>
          <a href={QUANTEL_PHONE_URL} className={contactLinkClasses}>
            {QUANTEL_PHONE_DISPLAY}
          </a>
        </li>
        <li>
          <a href={`mailto:${QUANTEL_EMAIL}`} className={contactLinkClasses}>
            {QUANTEL_EMAIL}
          </a>
        </li>
      </ul>
    </div>
  )
}
