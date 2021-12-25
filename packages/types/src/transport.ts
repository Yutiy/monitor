import { ErrorTypes } from '@bdw/monitor-shared'
import { BreadcrumbPushData } from './breadcrumb'
import { HttpTransformedType } from './http'
import { DeviceInfo, TrackReportDataType } from './wx'

export interface AuthInfo {
  apikey?: string
  trackKey?: string
  sdkVersion: string
  sdkName: string
  trackerId: string
}

export interface TransportDataType {
  authInfo?: AuthInfo
  breadcrumb?: BreadcrumbPushData[]
  data?: FinalReportType
  record?: any[]
  deviceInfo?: DeviceInfo
}

export interface BaseTransformType {
  type?: ErrorTypes
  message?: string
  url: string
  name?: string
  time?: number
  level?: string
}

export interface ReportDataType extends Partial<HttpTransformedType> {
  stack?: any
  errorId?: number
  // vue
  componentName?: string
  propsData?: any
  // logError 手动报错 MITO.log
  customTag?: string
  // 是否是埋点数据
  isTrackData?: boolean
}

export type FinalReportType = ReportDataType | TrackReportDataType
