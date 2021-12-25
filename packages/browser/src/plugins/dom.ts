import { BasePluginType } from '@bdw/monitor-types'
import { BrowserEventTypes, BrowserBreadcrumbTypes } from '@bdw/monitor-shared'
import { _global, throttle, on, htmlElementAsString } from '@bdw/monitor-utils'
import { BrowserClient } from '../implement/client'
import { addBreadcrumbInBrowser } from '../utils'

export interface DomCollectedType {
  // maybe will add doubleClick or other in the future
  category: 'click'
  data: Document
}

const domPlugin: BasePluginType<BrowserEventTypes, BrowserClient> = {
  name: BrowserEventTypes.DOM,
  monitor(notify) {
    if (!('document' in _global)) return
    const clickThrottle = throttle(notify, this.options.throttleDelayTime)
    on(
      _global.document,
      'click',
      function () {
        clickThrottle(BrowserEventTypes.DOM, {
          category: 'click',
          data: this
        })
      },
      true
    )

    // 暂时不需要keypress的重写
    // on(
    //   _global.document,
    //   'keypress',
    //   function (e: MITOElement) {
    //     keypressThrottle('dom', {
    //       category: 'keypress',
    //       data: this
    //     })
    //   },
    //   true
    // )
  },
  transform(collectedData: DomCollectedType) {
    const htmlString = htmlElementAsString(collectedData.data.activeElement as HTMLElement)
    return htmlString
  },
  consumer(transformedData: string) {
    if (transformedData) {
      addBreadcrumbInBrowser.call(this, transformedData, BrowserBreadcrumbTypes.CLICK)
    }
  }
}

export default domPlugin
