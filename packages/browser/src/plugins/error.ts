import { BasePluginType, ReportDataType } from '@bdw/monitor-types'
import { BrowserEventTypes, BrowserBreadcrumbTypes, ErrorTypes, ERROR_TYPE_RE } from '@bdw/monitor-shared'
import { _global, on, getLocationHref, getTimestamp, Severity, isError, extractErrorStack, interceptStr } from '@bdw/monitor-utils'
import { BrowserClient } from '../implement/client'
import { addBreadcrumbInBrowser } from '../utils'

export interface ResourceErrorTarget {
  src?: string
  href?: string
  localName?: string
}

const resourceMap = {
  img: '图片',
  script: 'JS脚本'
}

function resourceTransform(target: ResourceErrorTarget) {
  return {
    type: ErrorTypes.RESOURCE,
    url: getLocationHref(),
    message: '资源地址: ' + (interceptStr(target.src, 120) || interceptStr(target.href, 120)),
    level: Severity.Low,
    time: getTimestamp(),
    name: `${resourceMap[target.localName] || target.localName}加载失败`
  }
}

function codeErrorTransform(errorEvent: ErrorEvent) {
  const { message, filename, lineno, colno, error } = errorEvent
  let result: ReportDataType
  if (error && isError(error)) {
    result = extractErrorStack(error, Severity.Normal)
  }
  // 处理SyntaxError，stack没有lineno、colno
  result || (result = handleNotErrorInstance(message, filename, lineno, colno))
  result.type = ErrorTypes.JAVASCRIPT
  return result
}

function handleNotErrorInstance(message: string, filename: string, lineno: number, colno: number) {
  let name: string | ErrorTypes = ErrorTypes.UNKNOWN
  const url = filename || getLocationHref()
  let msg = message
  const matches = message.match(ERROR_TYPE_RE)
  if (matches[1]) {
    name = matches[1]
    msg = matches[2]
  }
  const element = {
    url,
    func: ErrorTypes.UNKNOWN_FUNCTION,
    args: ErrorTypes.UNKNOWN,
    line: lineno,
    col: colno
  }
  return {
    url,
    name,
    message: msg,
    level: Severity.Normal,
    time: getTimestamp(),
    stack: [element]
  }
}

const ErrorPlugin: BasePluginType<BrowserEventTypes, BrowserClient> = {
  name: BrowserEventTypes.ERROR,
  monitor(notify) {
    on(
      _global,
      'error',
      function (e: ErrorEvent) {
        notify(BrowserEventTypes.ERROR, e)
      },
      true
    )
  },
  transform(errorEvent: ErrorEvent) {
    const target = errorEvent.target as ResourceErrorTarget
    if (target.localName) {
      return resourceTransform(errorEvent.target as ResourceErrorTarget)
    }
    return codeErrorTransform(errorEvent)
  },
  consumer(transformedData: ReportDataType) {
    const type = transformedData.type === ErrorTypes.RESOURCE ? BrowserBreadcrumbTypes.RESOURCE : BrowserBreadcrumbTypes.CODE_ERROR
    const breadcrumbStack = addBreadcrumbInBrowser.call(this, transformedData, type, Severity.Error)
    this.transport.send(transformedData, breadcrumbStack)
  }
}

export default ErrorPlugin
