import Spacing from './spacing'
import type { PluginOptions } from './type'

export default function VitePluginSpacingJs(options: PluginOptions) {
  return {
    name: 'vite-plugin-spacingjs',
    config(config: any, { env }: any) {
      if (env === 'development') {
        const spacing = new Spacing(options)
        spacing.start()
      }
    },
  }
}
