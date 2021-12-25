import { BasePluginType } from '@bdw/monitor-types'
import { BrowserClient } from './implement/client'
import { BrowserOptionsFieldsTypes } from './types'
import consolePlugin from './plugins/console'
import domPlugin from './plugins/dom'
import errorPlugin from './plugins/error'
import xhrPlugin from './plugins/xhr'
import fetchPlugin from './plugins/fetch'
import hashRoutePlugin from './plugins/hashRoute'
import historyRoutePlugin from './plugins/historyRoute'
import unhandledRejectionPlugin from './plugins/unhandledRejection'

function createBrowserInstance(options: BrowserOptionsFieldsTypes = {}, plugins: BasePluginType[] = []) {
  const browserClient = new BrowserClient(options)
  const browserPlugins = [
    consolePlugin,
    domPlugin,
    fetchPlugin,
    xhrPlugin,
    hashRoutePlugin,
    historyRoutePlugin,
    errorPlugin,
    unhandledRejectionPlugin
  ]
  browserClient.use([...browserPlugins, ...plugins])
  return browserClient
}

const init = createBrowserInstance

export * from './types'
export { createBrowserInstance, init, BrowserClient }
