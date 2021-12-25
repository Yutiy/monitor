<div align="center">
    <a href="#" target="_blank">
    <img src="https://i.loli.net/2021/07/28/EvPwd4NjVH3tBfO.jpg" alt="mito-logo" height="90">
    </a>
    <p>一款监控Web的轻量级SDK</p>

[![npm version](https://img.shields.io/npm/v/@bdw/monitor-web.svg?style=flat)](https://www.npmjs.com/package/@bdw/monitor-web)
[![Code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)
[![GitHub last commit](https://img.shields.io/github/last-commit/mitojs/mitojs.svg?style=flat)](https://github.com/mitojs/mitojs/commits/master)
[![build status](https://img.shields.io/travis/mitojs/mitojs/master.svg?style=flat)](https://travis-ci.com/github/mitojs/mitojs)
[![codecov](https://codecov.io/gh/mitojs/mitojs/branch/master/graph/badge.svg?token=W7JP5GDOM7)](https://codecov.io/gh/mitojs/mitojs)
[![npm downloads](https://img.shields.io/npm/dm/@bdw/monitor-core.svg?style=flat)](http://npm-stat.com/charts.html?package=@bdw/monitor-browser)
[![license](https://img.shields.io/github/license/mitojs/mitojs?style=flat)](https://github.com/mitojs/mitojs/blob/dev/LICENSE)
</div>

## 👋 功能

- ✔️ 🔨 监控xhr、fetch、wx.request
- ✔️ 🔨 监控console、wx.console
- ✔️ 🔨 监控路由跳转（hash路由、history路由、wx路由）
- ✔️ 🔨 监控代码报错、资源加载错误
- ✔️ 🔨 监控click、wx:tab、touchmove
- ✔️ 👌 丰富的hooks与配置项支持可高定制化 [基础配置](https://mitojs.github.io/mito-doc/#/zh-CN/sdk/guide/basic-configuration)
- ✔️ 👌 支持Web(>= IE8) [@bdw/monitor-browser](https://mitojs.github.io/mito-doc/#/zh-CN/sdk/guide/browser)
- ✔️ 👌 支持框架Vue3、Vue2.6[@bdw/monitor-vue](https://mitojs.github.io/mito-doc/#/zh-CN/sdk/guide/vue)、React@latest[@bdw/monitor-react](https://mitojs.github.io/mito-doc/#/zh-CN/sdk/guide/react)
- ✔️ 👌 支持原生微信小程序、支持uni-app等微信小程序框架 [@bdw/monitor-wx-mini](https://mitojs.github.io/mito-doc/#/zh-CN/sdk/guide/wx-mini)

## 文档

## 😎 快速开始

这里是 [详细文档](https://mitojs.github.io/mito-doc/#/zh-CN/sdk/guide/introduction) 花2分钟或更少时间来构建你的第一个demo:

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

更多`@bdw/monitor-browser`信息[点击这里](https://mitojs.github.io/mito-doc/#/zh-CN/sdk/guide/browser)

## 🧐 在线示例

**下面的demo展示sdk可以收集到的数据**

[react-sdk-demo](https://mitojs.github.io/react-sdk-demo):Use @bdw/monitor-react  in react@next

[vue3-sdk-demo](https://mitojs.github.io/vue3-sdk-demo):Use @bdw/monitor-vue in Vue3.x
