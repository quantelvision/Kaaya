import { useId } from 'react'

export function GrainTexture() {
  const filterId = `grain-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 size-full opacity-12">
      <filter id={filterId}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.68"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  )
}
