type StartupImage = { url: string; media: string }

const screens = [
  { width: 750, height: 1334, ratio: 2 },
  { width: 828, height: 1792, ratio: 2 },
  { width: 1125, height: 2436, ratio: 3 },
  { width: 1170, height: 2532, ratio: 3 },
  { width: 1179, height: 2556, ratio: 3 },
  { width: 1206, height: 2622, ratio: 3 },
  { width: 1242, height: 2208, ratio: 3 },
  { width: 1242, height: 2688, ratio: 3 },
  { width: 1284, height: 2778, ratio: 3 },
  { width: 1290, height: 2796, ratio: 3 },
  { width: 1320, height: 2868, ratio: 3 },
  { width: 1488, height: 2266, ratio: 2 },
  { width: 1620, height: 2160, ratio: 2 },
  { width: 1640, height: 2360, ratio: 2 },
  { width: 1668, height: 2388, ratio: 2 },
  { width: 2048, height: 2732, ratio: 2 },
] as const

export const startupImages: StartupImage[] = screens.map(({ width, height, ratio }) => ({
  url: `/splash/splash-${width}x${height}.png`,
  media: `(device-width: ${width / ratio}px) and (device-height: ${height / ratio}px) and (-webkit-device-pixel-ratio: ${ratio}) and (orientation: portrait)`,
}))
