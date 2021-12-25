import { BrowserBreadcrumbTypes, BrowserEventTypes } from '@bdw/monitor-shared'
import { BasePluginType, RouteChangeCollectType } from '@bdw/monitor-types'
import { isExistProperty, on, parseUrlToObj, _global } from '@bdw/monitor-utils'
import { BrowserClient } from '../implement/client'
import { addBreadcrumbInBrowser } from '../utils'

const hashRoutePlugin: BasePluginType<BrowserEventTypes, BrowserClient> = {
  name: BrowserEventTypes.HASHCHANGE,
  monitor(notify) {
    if (isExistProperty(_global, 'onpopstate')) {
      on(_global, BrowserEventTypes.HASHCHANGE, function (e: HashChangeEvent) {
        const { oldURL: from, newURL: to } = e
        notify(BrowserEventTypes.HASHCHANGE, { from, to })
      })
    }
  },
  transform(collectedData: RouteChangeCollectType) {
    const { from, to } = collectedData
    const { relative: parsedFrom } = parseUrlToObj(from)
    const { relative: parsedTo } = parseUrlToObj(to)
    return {
      from: parsedFrom ? parsedFrom : '/',
      to: parsedTo ? parsedTo : '/'
    }
  },
  consumer(transformedData: RouteChangeCollectType) {
    const { from, to } = transformedData
    if (from === to) return
    addBreadcrumbInBrowser.call(this, transformedData, BrowserBreadcrumbTypes.ROUTE)

    const { onRouteChange } = this.options
    if (onRouteChange) {
      onRouteChange(from, to)
    }
  }
}

export default hashRoutePlugin
