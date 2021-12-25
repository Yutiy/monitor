import { Breadcrumb } from '@bdw/monitor-core'
import { BreadcrumbPushData, TransportDataType, VueInstance } from '@bdw/monitor-types'
type CANCEL = null | undefined | boolean

type TSetRequestHeader = (key: string, value: string) => {}
export interface IBeforeAppAjaxSendConfig {
  setRequestHeader: TSetRequestHeader
}

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'OPTIONS'

interface IRequestHeaderConfig {
  url: HttpMethod
  method: string
}

export interface BaseOptionsType<O extends BaseOptionsFieldsIntegrationType> extends BaseOptionsFieldsIntegrationType {
  bindOptions(options: O): void
}

export type BaseOptionsFieldsIntegrationType = BaseOptionsFieldsType & BaseOptionsHooksType

export interface BaseOptionsFieldsType {
  /**
   * 错误监控的dsn服务器地址
   */
  dsn?: string
  /**
   * 为true时，整个sdk将禁用
   */
  disabled?: boolean
  /**
   * 每个项目有一个唯一key，给监控的dsn用的
   */
  apikey?: string
  /**
   * 每个项目有一个唯一trackKey，给埋点的dsn用的
   */
  trackKey?: string
  /**
   * 默认为关闭，为true是会打印一些信息：breadcrumb
   */
  debug?: boolean
  /**
   * 默认是关闭traceId，开启时，页面的所有请求都会生成一个uuid，放入请求头中
   */
  enableTraceId?: boolean
  /**
   * 如果开启了enableTraceId,也需要配置该配置项，includeHttpUrlTraceIdRegExp.test(xhr.url)为true时，才会在该请求头中添加traceId
   * 由于考虑部分接口如果随便加上多余的请求头会造成跨域，所以这边用的是包含关系的正则
   */
  includeHttpUrlTraceIdRegExp?: RegExp
  /**
   * traceId放入请求头中的key，默认是Trace-Id
   */
  traceIdFieldName?: string
  /**
   * 默认为空，所有ajax都会被监听，不为空时，filterXhrUrlRegExp.test(xhr.url)为true时过滤
   */
  filterXhrUrlRegExp?: RegExp
  /**
   * 忽视某些错误不上传
   */
  // ignoreErrors?: Array<string | RegExp>
  /**
   * 默认20，最大100，超过100还是设置成100
   */
  maxBreadcrumbs?: number
  /**
   * 按钮点击和微信触摸事件节流时间，默认是0
   */
  throttleDelayTime?: number
  /**
   * 在引入wx-mini的情况下，使用该参数用来开启
   */
  enableTrack?: boolean
  /**
   * 在开启enableBury后，将所有埋点信息上报到该服务端地址，如果该属性有值时才会启动无痕埋点
   */
  trackDsn?: string
  /**
   * 最多可重复上报同一个错误的次数
   */
  maxDuplicateCount?: number
  /**
   * vue's root Instance
   */
  vue?: VueInstance
}

export interface BaseOptionsHooksType {
  /**
   * 钩子函数:在每次发送事件前会调用
   *
   * @param {TransportDataType} event 上报的数据格式
   * @return {*}  {(Promise<TransportDataType | null | CANCEL> | TransportDataType | any | CANCEL | null)} 如果返回 null | undefined | boolean 时，将忽略本次上传
   * @memberof BaseOptionsHooksType
   */
  beforeDataReport?(event: TransportDataType): Promise<TransportDataType | null | CANCEL> | TransportDataType | any | CANCEL | null
  /**
   *
   * 钩子函数，每次发送前都会调用
   * @param {TransportDataType} event 上报的数据格式
   * @param {string} url 上报到服务端的地址
   * @return {*}  {string} 返回空时不上报
   * @memberof BaseOptionsHooksType
   */
  configReportUrl?(event: TransportDataType, url: string): string
  /**
   * 钩子函数:在每次添加用户行为事件前都会调用
   *
   * @param {Breadcrumb} breadcrumb Breadcrumb的实例
   * @param {BreadcrumbPushData} hint 单次推入用户行为栈的数据
   * @return {*}  {(BreadcrumbPushData | CANCEL)} 如果返回 null | undefined | boolean 时，将忽略本次的push
   * @memberof BaseOptionsHooksType
   */
  beforePushBreadcrumb?(breadcrumb: Breadcrumb, hint: BreadcrumbPushData): BreadcrumbPushData | CANCEL
  /**
   * 钩子函数:拦截用户页面的ajax请求，并在ajax请求发送前执行该hook，可以对用户发送的ajax请求做xhr.setRequestHeader
   *
   * @param {IRequestHeaderConfig} config 原本的请求头信息
   * @param {IBeforeAppAjaxSendConfig} setRequestHeader 设置请求头函数
   * @memberof BaseOptionsHooksType
   */
  beforeAppAjaxSend?(config: IRequestHeaderConfig, setRequestHeader: IBeforeAppAjaxSendConfig): void
  /**
   *钩子函数:在beforeDataReport后面调用，在整合上报数据和本身SDK信息数据前调用，当前函数执行完后立即将数据错误信息上报至服务端
   *trackerId表示用户唯一键（可以理解成userId），需要trackerId的意义可以区分每个错误影响的用户数量
   *
   * @return {*}  {(string | number)}
   * @memberof BaseOptionsHooksType
   */
  backTrackerId?(): string | number
}
