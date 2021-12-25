import { ToStringTypes } from '@bdw/monitor-shared'
import { generateUUID, validateOptionsAndSet } from '@bdw/monitor-utils'
import { BaseOptionsFieldsIntegrationType, BaseOptionsType, VueInstance } from '@bdw/monitor-types'

export class BaseOptions<T extends BaseOptionsFieldsIntegrationType = BaseOptionsFieldsIntegrationType> implements BaseOptionsType<T> {
  enableTraceId = false
  filterXhrUrlRegExp: RegExp
  includeHttpUrlTraceIdRegExp = /.*/
  traceIdFieldName = 'Trace-Id'
  throttleDelayTime = 0
  vue: VueInstance = null
  beforeAppAjaxSend = null

  constructor() {}

  setTraceId(httpUrl: string, callback: (headerFieldName: string, traceId: string) => void) {
    const { includeHttpUrlTraceIdRegExp, enableTraceId } = this
    if (enableTraceId && includeHttpUrlTraceIdRegExp && includeHttpUrlTraceIdRegExp.test(httpUrl)) {
      const traceId = generateUUID()
      callback(this.traceIdFieldName, traceId)
    }
  }

  isFilterHttpUrl(url: string): boolean {
    return this.filterXhrUrlRegExp && this.filterXhrUrlRegExp.test(url)
  }

  bindOptions(options: T) {
    const { enableTraceId, vue, filterXhrUrlRegExp, traceIdFieldName, throttleDelayTime, includeHttpUrlTraceIdRegExp, beforeAppAjaxSend } =
      options
    const optionArr = [
      [enableTraceId, 'enableTraceId', ToStringTypes.Boolean],
      [traceIdFieldName, 'traceIdFieldName', ToStringTypes.String],
      [throttleDelayTime, 'throttleDelayTime', ToStringTypes.Number],
      [filterXhrUrlRegExp, 'filterXhrUrlRegExp', ToStringTypes.RegExp],
      [includeHttpUrlTraceIdRegExp, 'includeHttpUrlTraceIdRegExp', ToStringTypes.RegExp],
      [beforeAppAjaxSend, 'beforeAppAjaxSend', ToStringTypes.Function]
    ]
    validateOptionsAndSet.call(this, optionArr)
    // for vue
    this.vue = vue
  }
}
