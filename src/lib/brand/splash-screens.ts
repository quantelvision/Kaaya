export type SplashScreen = {
  cssWidth: number
  cssHeight: number
  pixelRatio: number
}

export const splashScreens: SplashScreen[] = [
  { cssWidth: 375, cssHeight: 667, pixelRatio: 2 },
  { cssWidth: 414, cssHeight: 736, pixelRatio: 3 },
  { cssWidth: 375, cssHeight: 812, pixelRatio: 3 },
  { cssWidth: 414, cssHeight: 896, pixelRatio: 2 },
  { cssWidth: 414, cssHeight: 896, pixelRatio: 3 },
  { cssWidth: 390, cssHeight: 844, pixelRatio: 3 },
  { cssWidth: 428, cssHeight: 926, pixelRatio: 3 },
  { cssWidth: 393, cssHeight: 852, pixelRatio: 3 },
  { cssWidth: 430, cssHeight: 932, pixelRatio: 3 },
  { cssWidth: 402, cssHeight: 874, pixelRatio: 3 },
  { cssWidth: 440, cssHeight: 956, pixelRatio: 3 },
  { cssWidth: 744, cssHeight: 1133, pixelRatio: 2 },
  { cssWidth: 810, cssHeight: 1080, pixelRatio: 2 },
  { cssWidth: 820, cssHeight: 1180, pixelRatio: 2 },
  { cssWidth: 834, cssHeight: 1194, pixelRatio: 2 },
  { cssWidth: 1024, cssHeight: 1366, pixelRatio: 2 },
]

export function splashFileName({ cssWidth, cssHeight, pixelRatio }: SplashScreen): string {
  return `splash-${cssWidth * pixelRatio}x${cssHeight * pixelRatio}.png`
}
