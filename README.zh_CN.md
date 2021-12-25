## 👋 功能

- ✔️ 🔨 监控xhr、fetch、wx.request
- ✔️ 🔨 监控console、wx.console
- ✔️ 🔨 监控路由跳转（hash路由、history路由、wx路由）
- ✔️ 🔨 监控代码报错、资源加载错误
- ✔️ 🔨 监控click、wx:tab、touchmove
- ✔️ 👌 丰富的hooks与配置项支持可高定制化
- ✔️ 👌 支持Web(>= IE8)
- ✔️ 👌 支持框架Vue3、Vue2.6、React@latest
- ✔️ 👌 支持原生微信小程序、支持uni-app等微信小程序框架

## 文档

## 😎 快速开始

这里是花2分钟或更少时间来构建你的第一个demo:

### browser

#### 🛠️ 安装

```bash
# 使用 npm
npm i @bdw/monitor-browser
# 使用 yarn
yarn add @bdw/monitor-browser
```

#### 🥳 使用

```ts
import { init } from '@bdw/monitor-browser'

const MitoInstance = init({
  // 推荐在开发环境设置debug:true,在生产环设置为false
  debug:true,
  dsn: 'https://test.com/yourInterface',
  maxBreadcrumbs: 100
})
```
## 🧐 在线示例

**下面的demo展示sdk可以收集到的数据**

[react-sdk-demo](https://www.baidu.com):Use @bdw/monitor-react  in react@next

[vue3-sdk-demo](https://www.baidu.com):Use @bdw/monitor-vue in Vue3.x
