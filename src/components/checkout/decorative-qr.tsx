const GRID = 25
const FINDER = 7

function hashSeed(seed: string): number {
  let hash = 2166136261
  for (let index = 0; index < seed.length; index++) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function isFinderCell(x: number, y: number): boolean {
  const inBox = (originX: number, originY: number) =>
    x >= originX && x < originX + FINDER && y >= originY && y < originY + FINDER
  return inBox(0, 0) || inBox(GRID - FINDER, 0) || inBox(0, GRID - FINDER)
}

function Finder({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={7} height={7} fill="currentColor" />
      <rect x={x + 1} y={y + 1} width={5} height={5} fill="var(--k-surface)" />
      <rect x={x + 2} y={y + 2} width={3} height={3} fill="currentColor" />
    </g>
  )
}

// a pattern that only looks like a qr code, there is no payload to scan
export function DecorativeQr({ seed, className }: { seed: string; className?: string }) {
  let state = hashSeed(seed)
  const cells: { x: number; y: number }[] = []
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0
      if (!isFinderCell(x, y) && state % 100 < 46) cells.push({ x, y })
    }
  }

  return (
    <svg
      viewBox={`-2 -2 ${GRID + 4} ${GRID + 4}`}
      role="img"
      aria-label="Demo QR code"
      className={className}
      shapeRendering="crispEdges"
    >
      <rect x={-2} y={-2} width={GRID + 4} height={GRID + 4} fill="var(--k-surface)" />
      {cells.map((cell) => (
        <rect
          key={`${cell.x}-${cell.y}`}
          x={cell.x}
          y={cell.y}
          width={1}
          height={1}
          fill="currentColor"
        />
      ))}
      <Finder x={0} y={0} />
      <Finder x={GRID - FINDER} y={0} />
      <Finder x={0} y={GRID - FINDER} />
    </svg>
  )
}
