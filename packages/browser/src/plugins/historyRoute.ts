import { BrowserBreadcrumbTypes, BrowserEventTypes, voidFun } from '@bdw/monitor-shared'
import { BasePluginType, RouteChangeCollectType } from '@bdw/monitor-types'
import { supportsHistory, parseUrlToObj, _global, getLocationHref, replaceOld } from '@bdw/monitor-utils'
import { BrowserClient } from '../implement/client'
import { addBreadcrumbInBrowser } from '../utils'

const historyRoutePlugin: BasePluginType<BrowserEventTypes, BrowserClient> = {
  name: BrowserEventTypes.HISTORY,
  monitor(notify) {
    let lastHref: string
    if (!supportsHistory()) return
    const oldOnpopstate = _global.onpopstate
    _global.onpopstate = function (this: WindowEventHandlers, ...args: any[]): any {
      const to = getLocationHref()
      const from = lastHref
      lastHref = to
      notify(BrowserEventTypes.HISTORY, {
        from,
        to
      })
      oldOnpopstate && oldOnpopstate.apply(this, args)
    }

    function historyReplaceFn(originalHistoryFn: voidFun): voidFun {
      return function (this: History, ...args: any[]): void {
        const url = args.length > 2 ? args[2] : undefined
        if (url) {
          const from = lastHref
          const to = String(url)
          lastHref = to
          notify(BrowserEventTypes.HISTORY, {
            from,
            to
          })
          return originalHistoryFn.apply(this, args)
        }
      }
    }

    // 以下两个事件是人为调用，但是不触发onpopstate
    replaceOld(_global.history, 'pushState', historyReplaceFn)
    replaceOld(_global.history, 'replaceState', historyReplaceFn)
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

export default historyRoutePlugin
