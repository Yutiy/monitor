import {
  WxBreadcrumbTypes,
  ErrorTypes,
  globalVar,
  HttpTypes,
  HTTP_CODE,
  MethodTypes,
  WxEventTypes,
  BreadcrumbCategorys,
  WxBaseEventTypes
} from '@bdw/monitor-shared'
import { BasePluginType, HttpCollectedType, HttpTransformedType } from '@bdw/monitor-types'
import { fromHttpStatus, getCurrentRoute, getRealPath, getTimestamp, Severity, SpanStatus, variableTypeDetection } from '@bdw/monitor-utils'
import { WxClient } from '../implement/client'
import { addBreadcrumbInWx } from '../utils'

enum WxXhrTypes {
  request = 'request',
  downloadFile = 'downloadFile',
  uploadFile = 'uploadFile'
}

const wxRequestPlugin: BasePluginType<WxEventTypes, WxClient> = {
  name: WxBaseEventTypes.REQUEST,
  monitor(notify) {
    monitorWxXhr.call(this, notify)
  },
  transform(collectedData: HttpCollectedType) {
    return httpTransform(collectedData)
  },
  consumer(transformedData: HttpTransformedType) {
    httpTransformedDataConsumer.call(this, transformedData)
  }
}

function monitorWxXhr(this: WxClient, notify: (eventName: WxEventTypes, data: any) => void) {
  const hookMethods = Object.keys(WxXhrTypes)
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const { options: wxOptions } = this
  hookMethods.forEach((hook) => {
    const originRequest = wx[hook]
    Object.defineProperty(wx, hook, {
      writable: true,
      enumerable: true,
      configurable: true,
      value: function (...args: any[]) {
        const options: WechatMiniprogram.RequestOption | WechatMiniprogram.DownloadFileOption | WechatMiniprogram.UploadFileOption = args[0]
        const { url } = options
        let method: string,
          reqData = undefined

        if ((options as WechatMiniprogram.RequestOption).method) {
          method = (options as WechatMiniprogram.RequestOption).method
        } else if (hook === WxXhrTypes.downloadFile) {
          method = MethodTypes.Get
        } else {
          method = MethodTypes.Post
        }
        let header = options.header
        !header && (header = {})

        if ((method === MethodTypes.Post && this.transport.isSdkTransportUrl(url)) || wxOptions.isFilterHttpUrl(url)) {
          return originRequest.call(this, options)
        }

        switch (hook) {
          case WxXhrTypes.request:
            reqData = (options as WechatMiniprogram.RequestOption).data
            break
          case WxXhrTypes.downloadFile:
            reqData = {
              filePath: (options as WechatMiniprogram.DownloadFileOption).filePath
            }
            break
          default:
            // uploadFile
            reqData = {
              filePath: (options as WechatMiniprogram.UploadFileOption).filePath,
              name: (options as WechatMiniprogram.UploadFileOption).name
            }
        }

        // ??????????????????????????????
        const httpCollect: HttpCollectedType = {
          request: {
            httpType: HttpTypes.XHR,
            url,
            method,
            data: reqData
          },
          response: {},
          time: getTimestamp()
        }
        wxOptions.setTraceId(url, (headerFieldName, traceId) => {
          httpCollect.request.traceId = traceId
          header[headerFieldName] = traceId
        })
        function setRequestHeader(key: string, value: string) {
          header[key] = value
        }
        wxOptions.beforeAppAjaxSend && wxOptions.beforeAppAjaxSend({ method, url }, { setRequestHeader })

        // ????????????
        const successHandler:
          | WechatMiniprogram.RequestSuccessCallback
          | WechatMiniprogram.DownloadFileSuccessCallback
          | WechatMiniprogram.UploadFileFailCallback = function (res) {
          const endTime = getTimestamp()
          httpCollect.response.data = (variableTypeDetection.isString(res.data) || variableTypeDetection.isObject(res.data)) && res.data
          httpCollect.elapsedTime = endTime - httpCollect.time
          httpCollect.response.status = res.statusCode
          httpCollect.errMsg = res.errMsg
          notify(WxBaseEventTypes.REQUEST, httpCollect)
          if (variableTypeDetection.isFunction(options.success)) {
            return options.success(res)
          }
        }

        // ????????????
        const failHandler:
          | WechatMiniprogram.RequestFailCallback
          | WechatMiniprogram.DownloadFileFailCallback
          | WechatMiniprogram.UploadFileFailCallback = function (err) {
          // ??????????????????????????????
          const endTime = getTimestamp()
          httpCollect.elapsedTime = endTime - httpCollect.time
          httpCollect.errMsg = err.errMsg
          httpCollect.response.status = 0
          notify(WxBaseEventTypes.REQUEST, httpCollect)
          if (variableTypeDetection.isFunction(options.fail)) {
            return options.fail(err)
          }
        }
        const actOptions = {
          ...options,
          success: successHandler,
          fail: failHandler
        }
        // return ????????????
        return originRequest.call(this, actOptions)
      }
    })
  })
}

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
      elapsedTime <= globalVar.crossOriginThreshold ? 'http????????????????????????????????????????????????????????????' : 'http????????????????????????????????????'
  } else {
    message = fromHttpStatus(status)
  }
  message = message === SpanStatus.Ok ? message : `${message} ${getRealPath(url)}`
  return {
    ...httpCollectedData,
    type: ErrorTypes.HTTP,
    url: getCurrentRoute(),
    level: Severity.Low,
    message,
    name
  }
}

export function httpTransformedDataConsumer(this: WxClient, transformedData: HttpTransformedType) {
  const type = WxBreadcrumbTypes.XHR
  // time ???????????????????????????????????????????????????
  const {
    response: { status },
    time
  } = transformedData
  const isError = status === 0 || status === HTTP_CODE.BAD_REQUEST || status > HTTP_CODE.UNAUTHORIZED
  addBreadcrumbInWx.call(this, transformedData, type, Severity.Info, { time })
  if (isError) {
    const breadcrumbStack = this.breadcrumb.push({
      type,
      category: BreadcrumbCategorys.EXCEPTION,
      data: { ...transformedData },
      level: Severity.Error,
      time
    })
    this.transport.send(transformedData, breadcrumbStack)
  }
}

export default wxRequestPlugin
