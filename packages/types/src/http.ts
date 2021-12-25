import { HttpTypes } from '@bdw/monitor-shared'
import { BaseTransformType } from './transport'

export interface HttpCollectedType {
  elapsedTime?: number
  request: {
    httpType?: HttpTypes
    traceId?: string
    method?: string
    url?: string
    data?: any
  }
  response: {
    status?: number
    data?: any
  }
  // for wx
  errMsg?: string
  time?: number
}

export interface HttpTransformedType extends HttpCollectedType, BaseTransformType {}
