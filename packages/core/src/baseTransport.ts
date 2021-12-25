import { SDK_NAME, SDK_VERSION, ToStringTypes } from '@bdw/monitor-shared'
import {
  AuthInfo,
  DeviceInfo,
  BaseOptionsFieldsIntegrationType,
  TransportDataType,
  ReportDataType,
  TrackReportDataType,
  FinalReportType,
  BreadcrumbPushData
} from '@bdw/monitor-types'
import { Queue, validateOptionsAndSet, variableTypeDetection, _support, logger, createErrorId, isEmpty } from '@bdw/monitor-utils'

export function isReportDataType(data: FinalReportType): data is ReportDataType {
  return (<TrackReportDataType>data).actionType === undefined && !data.isTrackData
}

/**
 * 传输数据抽象类
 *
 * @export
 * @abstract
 * @class BaseTransport
 * @template O
 */
export abstract class BaseTransport<T extends BaseOptionsFieldsIntegrationType = BaseOptionsFieldsIntegrationType> {
  dsn = ''
  trackDsn = ''
  apikey = ''
  trackKey = ''
  queue: Queue
  maxDuplicateCount = 3
  backTrackerId: unknown = null
  configReportUrl: unknown = null
  beforeDataReport: Promise<TransportDataType | null | undefined | boolean> | TransportDataType | any | null | undefined | boolean = null

  constructor() {
    this.queue = new Queue()
  }

  getRecord(): any[] {
    const recordData = _support.record
    if (recordData && variableTypeDetection.isArray(recordData) && recordData.length > 2) {
      return recordData
    }
    return []
  }

  getDeviceInfo(): DeviceInfo | any {
    return _support.deviceInfo || {}
  }

  async beforePost(data: FinalReportType) {
    if (isReportDataType(data)) {
      const errorId = createErrorId(data, this.apikey, this.maxDuplicateCount)
      if (!errorId) return false
      data.errorId = errorId
    }
    let transportData = this.getTransportData(data)
    if (typeof this.beforeDataReport === 'function') {
      transportData = await this.beforeDataReport(transportData)
      if (!transportData) return false
    }
    return transportData
  }

  getAuthInfo(): AuthInfo {
    const trackerId = this.getTrackerId()
    const result: AuthInfo = {
      trackerId: String(trackerId),
      sdkVersion: SDK_VERSION,
      sdkName: SDK_NAME
    }
    this.apikey && (result.apikey = this.apikey)
    this.trackKey && (result.trackKey = this.trackKey)
    return result
  }

  getApikey() {
    return this.apikey
  }

  getTrackKey() {
    return this.trackKey
  }

  /**
   * 获取hooks中返回的trackId，没有就返回''
   *
   * @return {*}  {(string | number)}
   * @memberof BaseTransport
   */
  getTrackerId(): string | number {
    if (typeof this.backTrackerId === 'function') {
      const trackerId = this.backTrackerId()
      if (typeof trackerId === 'string' || typeof trackerId === 'number') {
        return trackerId
      } else {
        logger.error(`trackerId:${trackerId} 期望 string 或 number 类型，但是传入 ${typeof trackerId}`)
      }
    }
    return ''
  }

  isSdkTransportUrl(targetUrl: string): boolean {
    let isSdkDsn = false
    if (this.dsn && targetUrl.indexOf(this.dsn) !== -1) {
      isSdkDsn = true
    }
    if (this.trackDsn && targetUrl.indexOf(this.trackDsn) !== -1) {
      isSdkDsn = true
    }
    return isSdkDsn
  }

  /**
   * 绑定配置项
   *
   * @param {Partial<O>} [options={}]
   * @memberof BaseTransport
   */
  bindOptions(options: Partial<T> = {}): void {
    const { dsn, trackDsn, beforeDataReport, apikey, trackKey, maxDuplicateCount, backTrackerId, configReportUrl } = options
    const functionType = ToStringTypes.Function
    const optionArr = [
      [apikey, 'apikey', ToStringTypes.String],
      [trackKey, 'trackKey', ToStringTypes.String],
      [dsn, 'dsn', ToStringTypes.String],
      [trackDsn, 'trackDsn', ToStringTypes.String],
      [maxDuplicateCount, 'maxDuplicateCount', ToStringTypes.Number],
      [beforeDataReport, 'beforeDataReport', functionType],
      [configReportUrl, 'configReportUrl', functionType],
      [backTrackerId, 'backTrackerId', functionType]
    ]
    validateOptionsAndSet.call(this, optionArr)
  }

  /**
   * 发送数据到服务端
   *
   * @param data 错误上报数据格式
   * @returns
   */
  async send(data: FinalReportType, breadcrumb: BreadcrumbPushData[] = []) {
    let dsn = ''
    if (isReportDataType(data)) {
      dsn = this.dsn
      if (isEmpty(dsn)) {
        logger.error('dsn为空，没有传入监控错误上报的dsn地址，请在init中传入')
        return
      }
    } else {
      dsn = this.trackDsn
      if (isEmpty(dsn)) {
        logger.error('trackDsn为空，没有传入埋点上报的dsn地址，请在init中传入')
        return
      }
    }
    const result = await this.beforePost(data)
    if (!result) return

    const transportData = {
      ...result,
      breadcrumb
    }
    if (typeof this.configReportUrl === 'function') {
      dsn = this.configReportUrl(transportData, dsn)
      if (!dsn) return
    }
    return this.sendToServer(transportData, dsn)
  }

  /**
   * post方式，子类需要重写
   *
   * @abstract
   * @param {(TransportDataType | any)} data
   * @param {string} url
   * @memberof BaseTransport
   */
  abstract post(data: TransportDataType | any, url: string): void
  /**
   * 最终上报到服务器的方法，需要子类重写
   *
   * @abstract
   * @param {(TransportDataType | any)} data
   * @param {string} url
   * @memberof BaseTransport
   */
  abstract sendToServer(data: TransportDataType | any, url: string): void
  /**
   * 获取上报的格式
   *
   * @abstract
   * @param {FinalReportType} data
   * @return {TransportDataType}  {TransportDataType}
   * @memberof BaseTransport
   */
  abstract getTransportData(data: FinalReportType): TransportDataType
}
