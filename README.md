[中文文档](./README.zh_CN.md)


## 👋 Features

✔️ 🔨 monitor Xhr、Fetch、wx.request

✔️ 🔨 monitor console、wx.console

✔️ 🔨 monitor route change(hashroute、browser route、wx route)

✔️ 🔨 monitor code error、resource load error

✔️ 🔨 monitor click、wx:tab、wx:touchmove

✔️ 👌 rich hooks and options

✔️ 👌 support web(>= IE8)

✔️ 👌 support framework with Vue3、Vue2.6、React@latest

✔️ 👌 support native wxmini、uni-app、remax framework etc

## 😎 Get Started

Build your first demo in 2 min or less:

### browser

#### 🛠️ Install

```bash
# using npm
npm i @bdw/monitor-browser
# using yarn
yarn add @bdw/monitor-browser
```

#### 🥳 Usage

```ts
import { init } from '@bdw/monitor-browser'

const MitoInstance = init({
  // set debug true to convenient debugger in dev,set false in prod
  debug:true,
  dsn: 'https://test.com/yourInterface',
  maxBreadcrumbs: 100
})
```

more usage info of `@bdw/monitor-browser`

## 🧐 Demo for SDK

**here are some demo for sdk of collecting data**

[react-sdk-demo](https://www.baidu.com):Use @bdw/monitor-react  in react@next

[vue3-sdk-demo](https://www.baidu.com):Use @bdw/monitor-vue in Vue3.x
