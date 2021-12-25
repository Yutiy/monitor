# @bdw/monitor-vue

## ⚠️ attention

**If you want to import in weixin miniprograme,please replace `@bdw/monitor-browser` to `@bdw/monitor-wx-mini`**

## 🛠️ Install

```bash
# using npm
npm i @bdw/monitor-vue @bdw/monitor-browser
# using yarn
yarn add @bdw/monitorvue @bdw/monitor-browser
```

read the [mito-doc](https://www.baidu.com) to konw more info

## 🥳 Usage

### Vue2.X

```typescript
// main.js
import Vue from 'vue'
import { init } from '@bdw/monitor-browser'
import { vuePlugin } from '@bdw/monitor-vue'

// multiple instances
const MitoInstance = init({
  // set debug true to convenient debugger in dev,set false in prod
  debug:true,
  vue: Vue,
  dsn: 'https://test.com/yourInterface',
  maxBreadcrumbs: 100
}, [vuePlugin])

```

### Vue3.x

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { init } from "@bdw/monitor-browser";
import { vuePlugin } from "@bdw/monitor-vue";

const app = createApp(App)
const MitoInstance = init({
  // set debug true to convenient debugger in dev,set false in prod
  debug:true,
  vue: app,
  dsn: 'https://test.com/yourInterface',
  maxBreadcrumbs: 100
}, [vuePlugin])
```
