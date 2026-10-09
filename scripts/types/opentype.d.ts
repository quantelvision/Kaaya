declare module 'opentype.js' {
  export type BoundingBox = { x1: number; y1: number; x2: number; y2: number }

  export type RenderOptions = {
    kerning?: boolean
    letterSpacing?: number
    variation?: Record<string, number>
  }

  export type Path = {
    getBoundingBox(): BoundingBox
    toPathData(decimalPlaces?: number): string
  }

  export type Font = {
    tables: { gsub?: unknown }
    getPath(text: string, x: number, y: number, fontSize: number, options?: RenderOptions): Path
  }

  const opentype: {
    parse(buffer: ArrayBuffer): Font
  }

  export default opentype
}
