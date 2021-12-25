import { BasePluginType, ReportDataType, HttpTransformedType } from '@bdw/monitor-types'
import { BrowserEventTypes, BrowserBreadcrumbTypes, ErrorTypes } from '@bdw/monitor-shared'
import { _global, on, unknownToString, getLocationHref, getTimestamp, Severity, isError, extractErrorStack } from '@bdw/monitor-utils'
import { BrowserClient } from '../implement/client'
import { addBreadcrumbInBrowser } from '../utils'

const name = BrowserEventTypes.UNHANDLEDREJECTION
const unhandledRejectionPlugin: BasePluginType<BrowserEventTypes, BrowserClient> = {
  name,
  monitor(notify) {
    on(_global, name, function (ev: PromiseRejectionEvent) {
      // ev.preventDefault() 阻止默认行为后，控制台就不会再报红色错误
      notify(name, ev)
    })
  },
  transform(collectedData: PromiseRejectionEvent) {
    let data: ReportDataType = {
      type: ErrorTypes.PROMISE,
      message: unknownToString(collectedData.reason),
      url: getLocationHref(),
      name: collectedData.type,
      time: getTimestamp(),
      level: Severity.Low
    }
    if (isError(collectedData.reason)) {
      data = {
        ...data,
        ...extractErrorStack(collectedData.reason, Severity.Low)
      }
    }
    return data
  },
  consumer(transformedData: HttpTransformedType) {
    const breadcrumbStack = addBreadcrumbInBrowser.call(this, transformedData, BrowserBreadcrumbTypes.UNHANDLEDREJECTION, Severity.Error)
    this.transport.send(transformedData, breadcrumbStack)
  }
}

export default unhandledRejectionPlugin
