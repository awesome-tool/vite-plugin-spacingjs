export interface Spacing {
  start: () => void
  stop: () => void
}

export interface PluginOptions {
  shape: 'thin' | 'normal' | 'fat'
  px2rem: boolean
  remRatio: number
  hotKey: string
}

export type LineBorder = 'none' | 'x' | 'y'
export type Direction = 'top' | 'right' | 'bottom' | 'left'
export type PlaceholderType = 'selected' | 'target'
