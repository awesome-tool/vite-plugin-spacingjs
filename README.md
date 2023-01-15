# Vite plugin spacingjs

[中文文档](./README-CN.md)

> A tool to detect page gaps, inspired by [spacingjs](git@github.com:stevenlei/spacingjs.git)

## Useage

```shell
npm i vite-plugin-spacingjs --save-dev
```

```ts
import SpacingJs from 'vite-plugin-spacingjs'

defineConfig({
  plugins: [SpacingJs(options)],
})
```

## options default setting

| attributes | defaults       | describe                                                                   |
| ---------- | -------------- | -------------------------------------------------------------------------- |
| lineWidth  | 'normal'       | 'thin'/'normal'/'fat'                                                      |
| px2rem     | false          | Whether to convert pixels to rem, 4 decimal places are reserved by default |
| remRatio   | 16px           | The conversion ratio of px to rem takes effect only when px2rem is true    |
| hotKey     | `Alt`/`Option` | Invoke the tool's hotkey                                                   |
