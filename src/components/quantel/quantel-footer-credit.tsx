import Image from 'next/image'
import { QUANTEL_SITE_URL } from '@/lib/quantel'

export function QuantelFooterCredit() {
  return (
    <a
      href={QUANTEL_SITE_URL}
      target="_blank"
      rel="noopener"
      className="group inline-flex flex-col items-start gap-3 font-q-body text-q-text"
    >
      <Image
        src="/brand/quantelvision/quantelvision-logo-black.png"
        alt="Quantel Vision"
        width={800}
        height={343}
        className="h-8 w-auto"
      />
      <span className="text-xs text-q-text-light transition-colors group-hover:text-q-text">
        Designed and engineered by Quantel Vision
      </span>
    </a>
  )
}
