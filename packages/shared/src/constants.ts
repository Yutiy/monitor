import { BrowserBreadcrumbTypes, BrowserEventTypes } from './browser'
import { WxBreadcrumbTypes, WxEventTypes } from './wx'

export const MitoLog = 'Monitor.log'
export const MitoLogEmptyMsg = 'empty.msg'
export const MitoLogEmptyTag = 'empty.tag'

export const enum BaseEventTypes {
  VUE = 'vue',
  REACT = 'react'
}

export const enum BaseBreadcrumbTypes {
  VUE = 'Vue',
  REACT = 'React'
}

export type EventTypes = BrowserEventTypes | WxEventTypes | BaseEventTypes
export type BreadcrumbTypes = BrowserBreadcrumbTypes | WxBreadcrumbTypes | BaseBreadcrumbTypes

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

// 上报错误类型
export const enum ErrorTypes {
  UNKNOWN = 'UNKNOWN',
  UNKNOWN_FUNCTION = 'UNKNOWN_FUNCTION',
  JAVASCRIPT = 'JAVASCRIPT',
  LOG = 'LOG',
  HTTP = 'HTTP',
  VUE = 'VUE',
  REACT = 'REACT',
  RESOURCE = 'RESOURCE',
  PROMISE = 'PROMISE',
  ROUTE = 'ROUTE'
}

// 用户行为类型
export const enum BreadcrumbCategorys {
  HTTP = 'http',
  USER = 'user',
  DEBUG = 'debug',
  EXCEPTION = 'exception',
  LIFECYCLE = 'lifecycle'
}

export const enum HttpTypes {
  XHR = 'xhr',
  FETCH = 'fetch'
}

export const enum MethodTypes {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE'
}

export const enum HTTP_CODE {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  INTERNAL_EXCEPTION = 500
}

export type voidFun = () => void
export const enum ToStringTypes {
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean',
  RegExp = 'RegExp',
  Null = 'Null',
  Undefined = 'Undefined',
  Symbol = 'Symbol',
  Object = 'Object',
  Array = 'Array',
  process = 'process',
  Window = 'Window',
  Function = 'Function'
}

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

export const ERROR_TYPE_RE = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/
const globalVar = {
  isLogAddBreadcrumb: true,
  crossOriginThreshold: 1000
}

export const Silent = 'silent'
export { globalVar }
