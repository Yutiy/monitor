/**
 * Performance monitoring entry
 *
 * @class WebVitals
 * */
import 'core-js/es/array/includes'
import 'core-js/es/object/values'
import MetricsStore from './lib/store'
import { onHidden } from './lib/onHidden'
import createReporter from './lib/createReporter'
import { measure } from './lib/measureCustomMetrics'
import { hasMark, getMark, setMark, clearMark } from './lib/makeHandler'
import { initNavigationTiming } from './metrics/getNavigationTiming'
import { initNetworkInfo } from './metrics/getNetworkInfo'
import { initDeviceInfo } from './metrics/getDeviceInfo'
import { initPageInfo } from './metrics/getPageInfo'
import { initCCP } from './metrics/getCCP'
import { initCLS } from './metrics/getCLS'
import { initFCP } from './metrics/getFCP'
import { initFID } from './metrics/getFID'
import { initFP } from './metrics/getFP'
import { initFPS } from './metrics/getFPS'
import { initLCP } from './metrics/getLCP'
import { IConfig, IMetricsObj, IWebVitals } from './types'
import { afterLoad, beforeUnload, unload } from './utils'
import generateUniqueID from './utils/generateUniqueID'

let metricsStore: MetricsStore
let reporter: ReturnType<typeof createReporter>

class WebVitals implements IWebVitals {
  immediately: boolean

  constructor(config: IConfig) {
    const {
      appId,
      version,
      reportCallback,
      immediately = false,
      needCCP = false,
      logFpsCount = 5,
      apiConfig = {},
      hashHistory = true,
      excludeRemotePath = []
    } = config

    this.immediately = immediately

    const sectionId = generateUniqueID()
    reporter = createReporter(sectionId, appId, version, reportCallback)
    metricsStore = new MetricsStore()

    initPageInfo(metricsStore, reporter, immediately)
    initDeviceInfo(metricsStore, reporter, immediately)
    initNetworkInfo(metricsStore, reporter, immediately)
    initCLS(metricsStore, reporter, immediately)
    initCCP(metricsStore, reporter, needCCP, apiConfig, hashHistory, excludeRemotePath, immediately)

    afterLoad(() => {
      initNavigationTiming(metricsStore, reporter, immediately)
      initFP(metricsStore, reporter, immediately)
      initFCP(metricsStore, reporter, immediately)
      initFID(metricsStore, reporter, immediately)
      initLCP(metricsStore, reporter, immediately)
      initFPS(metricsStore, reporter, logFpsCount, immediately)
    })

    // if immediately is false,report metrics when visibility and unload
    ;[beforeUnload, unload, onHidden].forEach((fn) => {
      fn(() => {
        const metrics = this.getCurrentMetrics()
        if (Object.keys(metrics).length > 0 && !immediately) {
          reporter(metrics)
        }
      })
    })
  }

  getCurrentMetrics(): IMetricsObj {
    return metricsStore.getValues()
  }

  setStartMark(markName: string) {
    setMark(`${markName}_start`)
  }

  setEndMark(markName: string) {
    setMark(`${markName}_end`)

    if (hasMark(`${markName}_start`)) {
      const value = measure(`${markName}Metrics`, markName)
      this.clearMark(markName)

      const metrics = { name: `${markName}Metrics`, value }

      if (this.immediately) {
        reporter(metrics)
      }

      metricsStore.set(`${markName}Metrics`, metrics)
    } else {
      const value = getMark(`${markName}_end`)?.startTime
      this.clearMark(markName)

      const metrics = { name: `${markName}Metrics`, value }

      if (this.immediately) {
        reporter(metrics)
      }

      metricsStore.set(`${markName}Metrics`, metrics)
    }
  }

  clearMark(markName: string) {
    clearMark(`${markName}_start`)
    clearMark(`${markName}_end`)
  }

  customContentfulPaint() {
    setTimeout(() => WebVitals.dispatchCustomEvent())
  }

  private static dispatchCustomEvent(): void {
    const event = document.createEvent('Events')
    event.initEvent('custom-contentful-paint', false, true)
    document.dispatchEvent(event)
  }
}

export { WebVitals }
