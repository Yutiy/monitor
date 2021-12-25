<div align="center">
  <a href="#" target="_blank">
    <img src="https://i.loli.net/2021/07/28/EvPwd4NjVH3tBfO.jpg" alt="mito-logo" height="90">
  </a>
  <p>A Lightweight SDK For Monitor Web</p>
[![npm version](https://img.shields.io/npm/v/@bdw/monitor-web.svg?style=flat)](https://www.npmjs.com/package/@bdw/monitor-web)
[![Code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![GitHub last commit](https://img.shields.io/github/last-commit/mitojs/mitojs.svg?style=flat)](https://github.com/mitojs/mitojs/commits/master)
[![build status](https://img.shields.io/travis/mitojs/mitojs/master.svg?style=flat)](https://travis-ci.com/github/mitojs/mitojs)
[![codecov](https://codecov.io/gh/mitojs/mitojs/branch/master/graph/badge.svg?token=W7JP5GDOM7)](https://codecov.io/gh/mitojs/mitojs)
[![npm downloads](https://img.shields.io/npm/dm/@bdw/monitor-core.svg?style=flat)](http://npm-stat.com/charts.html?package=@bdw/monitor-browser)
[![license](https://img.shields.io/github/license/mitojs/mitojs?style=flat)](https://github.com/mitojs/mitojs/blob/dev/LICENSE)
</div>

[中文文档](./README.zh_CN.md)


## 👋 Features

✔️ 🔨 monitor Xhr、Fetch、wx.request

✔️ 🔨 monitor console、wx.console

✔️ 🔨 monitor route change(hashroute、browser route、wx route)

✔️ 🔨 monitor code error、resource load error

✔️ 🔨 monitor click、wx:tab、wx:touchmove

✔️ 👌 rich hooks and options [configuration doc](https://mitojs.github.io/mito-doc/#/sdk/guide/basic-configuration)

✔️ 👌 support web(>= IE8)[@bdw/monitor-browser](https://mitojs.github.io/mito-doc/#/sdk/guide/browser)

✔️ 👌 support framework with Vue3、Vue2.6[@bdw/monitor-vue](https://mitojs.github.io/mito-doc/#/sdk/guide/vue)、React@latest[@bdw/monitor-react](https://mitojs.github.io/mito-doc/#/sdk/guide/react)

✔️ 👌 support native wxmini、uni-app、remax framework etc [@bdw/monitor-wx-mini](https://mitojs.github.io/mito-doc/#/sdk/guide/wx-mini)

## 😎 Get Started

here is [document](https://mitojs.github.io/mito-doc/#/sdk/guide/introduction).Build your first demo in 2 min or less:

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

more usage info of `@bdw/monitor-browser` [click here](https://mitojs.github.io/mito-doc/#/sdk/guide/browser)

## 🧐 Demo for SDK

**here are some demo for sdk of collecting data**

[react-sdk-demo](https://mitojs.github.io/react-sdk-demo):Use @bdw/monitor-react  in react@next

[vue3-sdk-demo](https://mitojs.github.io/vue3-sdk-demo):Use @bdw/monitor-vue in Vue3.x
