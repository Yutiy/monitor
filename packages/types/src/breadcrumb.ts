import { Severity } from '@bdw/monitor-utils'
import { BreadcrumbTypes, BreadcrumbCategorys } from '@bdw/monitor-shared'
import { TNumStrObj } from './common'
import { ReportDataType } from './transport'
import { RouteChangeCollectType, ConsoleCollectType } from './basePluginType'

export interface BreadcrumbPushData {
  /**
   * 事件类型
   */
  type: BreadcrumbTypes
  // string for click dom
  data: ReportDataType | RouteChangeCollectType | ConsoleCollectType | TNumStrObj
  /**
   * 分为user action、debug、http、
   */
  category?: BreadcrumbCategorys
  time?: number
  level: Severity
}
