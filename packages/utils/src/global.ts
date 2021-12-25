import { EventTypes } from '@bdw/monitor-shared'
import { DeviceInfo } from '@bdw/monitor-types'
import { variableTypeDetection } from './is'
import { Logger } from './logger'

// MITO的全局变量
export interface MitoSupport {
  logger: Logger
  record?: any[]
  deviceInfo?: DeviceInfo
  replaceFlag: { [key in EventTypes]?: boolean }
  track?: any
}

interface MITOGlobal {
  console?: Console
  __MITO__?: MitoSupport
}

export const isNodeEnv = variableTypeDetection.isProcess(typeof process !== 'undefined' ? process : 0)

export const isWxMiniEnv =
  variableTypeDetection.isObject(typeof wx !== 'undefined' ? wx : 0) &&
  variableTypeDetection.isFunction(typeof App !== 'undefined' ? App : 0)

export const isBrowserEnv = variableTypeDetection.isWindow(typeof window !== 'undefined' ? window : 0)

/**
 * 获取全局变量
 *
 * ../returns Global scope object
 */
export function getGlobal<T>() {
  if (isBrowserEnv) return window as unknown as MITOGlobal & T
  if (isWxMiniEnv) return wx as unknown as MITOGlobal & T
  // it's true when run e2e
  if (isNodeEnv) return process as unknown as MITOGlobal & T
}

/**
 * 获取全部变量__MITO__的引用地址
 *
 * ../returns global variable of MITO
 */
export function getGlobalMitoSupport(): MitoSupport {
  _global.__MITO__ = _global.__MITO__ || ({} as MitoSupport)
  return _global.__MITO__
}

const _global = getGlobal<Window & WechatMiniprogram.Wx>()
const _support = getGlobalMitoSupport()

export { _global, _support }

///////////////////////////////////////////////////////////////////////////////////////////////////
// others
///////////////////////////////////////////////////////////////////////////////////////////////////

export function supportsHistory(): boolean {
  // NOTE: in Chrome App environment, touching history.pushState, *even inside
  //       a try/catch block*, will cause Chrome to output an error to console.error
  // borrowed from: https://github.com/angular/angular.js/pull/13945/files
  const chrome = (_global as any).chrome
  // tslint:disable-next-line:no-unsafe-any
  const isChromePackagedApp = chrome && chrome.app && chrome.app.runtime
  const hasHistoryApi = 'history' in _global && !!_global.history.pushState && !!_global.history.replaceState

  return !isChromePackagedApp && hasHistoryApi
}
