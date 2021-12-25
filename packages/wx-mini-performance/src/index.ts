import { isWxMiniEnv } from '@bdw/monitor-utils'
import { initBatteryInfo, initMemoryWarning, initNetworkInfo, initWxHideReport, initWxPerformance, initWxNetwork } from './wx'
import { WxPerformanceInitOptions } from './types'
import Store from './core/store'
import { version } from '../package.json'

class WxPerformance {
  appId: string
  version: string
  private readonly store: Store

  constructor(options: WxPerformanceInitOptions) {
    if (!isWxMiniEnv) {
      return
    }
    const {
      appId,
      report,
      immediately = true,
      ignoreUrl,
      maxBreadcrumbs = 10,
      needNetworkStatus = true,
      needBatteryInfo = true,
      needMemoryWarning = true,
      onAppHideReport = true
    } = options

    this.appId = appId
    this.version = version

    const store = new Store({ appId, report, immediately, ignoreUrl, maxBreadcrumbs })
    this.store = store

    initBatteryInfo(store, needBatteryInfo)
    initNetworkInfo(store, needNetworkStatus)
    initMemoryWarning(store, needMemoryWarning)
    // 如果 immediately 为 false，会在appHide的时候发送数据
    initWxHideReport(store, immediately, onAppHideReport)
    initWxPerformance(store)
    initWxNetwork(store)
  }

  customPaint() {
    this.store.customPaint()
  }
}

export { WxPerformance }
