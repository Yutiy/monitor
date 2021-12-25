import {
  BreadcrumbCategorys,
  BrowserBreadcrumbTypes,
  BrowserEventTypes,
  ErrorTypes,
  globalVar,
  HttpTypes,
  HTTP_CODE,
  voidFun
} from '@bdw/monitor-shared'
import {
  getTimestamp,
  replaceOld,
  Severity,
  _global,
  variableTypeDetection,
  on,
  fromHttpStatus,
  SpanStatus,
  getLocationHref,
  getRealPath
} from '@bdw/monitor-utils'
import { BasePluginType, HttpCollectedType, HttpTransformedType, MITOXMLHttpRequest } from '@bdw/monitor-types'
import { BrowserClient } from '../implement/client'
import { addBreadcrumbInBrowser } from '../utils'

export function httpTransform(httpCollectedData: HttpCollectedType): HttpTransformedType {
  let message = ''
  const {
    request: { httpType, method, url },
    response: { status },
    elapsedTime
  } = httpCollectedData
  const name = `${httpType}--${method}`
  if (status === 0) {
    message =
      elapsedTime <= globalVar.crossOriginThreshold ? 'http请求失败，失败原因：跨域限制或域名不存在' : 'http请求失败，失败原因：超时'
  } else {
    message = fromHttpStatus(status)
  }
  message = message === SpanStatus.Ok ? message : `${message} ${getRealPath(url)}`
  return {
    ...httpCollectedData,
    type: ErrorTypes.HTTP,
    url: getLocationHref(),
    level: Severity.Low,
    message,
    name
  }
}

export function httpTransformedDataConsumer(this: BrowserClient, transformedData: HttpTransformedType) {
  const type = transformedData.request.httpType === HttpTypes.FETCH ? BrowserBreadcrumbTypes.FETCH : BrowserBreadcrumbTypes.XHR
  // time 是为了保持顺序，紧跟在点击事件后面
  const {
    response: { status },
    time
  } = transformedData
  const isError = status === 0 || status === HTTP_CODE.BAD_REQUEST || status > HTTP_CODE.UNAUTHORIZED
  addBreadcrumbInBrowser.call(this, transformedData, type, Severity.Info, { time })
  if (isError) {
    const breadcrumStack = this.breadcrumb.push({
      type,
      category: BreadcrumbCategorys.EXCEPTION,
      data: transformedData,
      level: Severity.Error,
      time
    })
    this.transport.send(transformedData, breadcrumStack)
  }
}

const xhrPlugin: BasePluginType<BrowserEventTypes, BrowserClient> = {
  name: BrowserEventTypes.XHR,
  monitor(notify) {
    const { options, transport } = this
    if (!('XMLHttpRequest' in _global)) {
      return
    }
    const originalXhrProto = XMLHttpRequest.prototype
    replaceOld(originalXhrProto, 'open', (originalOpen: voidFun): voidFun => {
      return function (this: MITOXMLHttpRequest, ...args: any[]): void {
        this.httpCollect = {
          request: {
            httpType: HttpTypes.XHR,
            method: variableTypeDetection.isString(args[0]) ? args[0].toUpperCase() : args[0],
            url: args[1]
          },
          response: {},
          time: getTimestamp()
        }
        originalOpen.apply(this, args)
      }
    })
    replaceOld(originalXhrProto, 'send', (originalSend: voidFun): voidFun => {
      return function (this: MITOXMLHttpRequest, ...args: any[]): void {
        const { request } = this.httpCollect
        const { method, url } = request
        options.setTraceId(url, (headerFieldName: string, traceId: string) => {
          request.traceId = traceId
          this.setRequestHeader(headerFieldName, traceId)
        })

        options.beforeAppAjaxSend && options.beforeAppAjaxSend({ method, url }, this)
        on(this, 'loadend', function (this: MITOXMLHttpRequest) {
          const isBlock = transport.isSdkTransportUrl(url) || options.isFilterHttpUrl(url)
          if (isBlock) return
          const { responseType, response, status } = this
          request.data = args[0]
          const eTime = getTimestamp()
          if (['', 'json', 'text'].indexOf(responseType) !== -1) {
            this.httpCollect.response.data = typeof response === 'object' ? JSON.stringify(response) : response
          }
          this.httpCollect.response.status = status
          this.httpCollect.elapsedTime = eTime - this.httpCollect.time
          notify(BrowserEventTypes.XHR, this.httpCollect)
        })
        originalSend.apply(this, args)
      }
    })
  },
  transform(collectedData: HttpCollectedType) {
    return httpTransform(collectedData)
  },
  consumer(transformedData: HttpTransformedType) {
    httpTransformedDataConsumer.call(this, transformedData)
  }
}

export default xhrPlugin
