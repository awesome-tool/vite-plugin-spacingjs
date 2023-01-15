# Vite plugin spacingjs

> 一个检测页面间距的工具，灵感来自 [spacingjs](git@github.com:stevenlei/spacingjs.git)

## 安装与使用

```shell
npm i vite-plugin-spacingjs --save-dev
```

```ts
import SpacingJs from 'vite-plugin-spacingjs'

defineConfig({
  plugins: [SpacingJs(options)],
})
```

## options 默认配置

| 属性      | 默认值         | 描述                                                       |
| --------- | -------------- | ---------------------------------------------------------- |
| lineWidth | 1px            | 线条宽度                                                   |
| px2rem    | false          | 是否将像素转为 rem，默认 4 位小数                          |
| remRatio  | 16px           | px 转换成 rem 的换算比例，仅在 px2rem 为 true 的情况下生效 |
| hotKey    | `Alt`/`Option` | 唤起工具的热键                                             |
