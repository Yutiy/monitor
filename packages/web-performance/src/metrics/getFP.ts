/**
 * First Paint: 从页面加载开始到第一个像素绘制到屏幕上的时间
 * rendering anything that is visually different from what was on the screen prior to navigation.(https://developer.mozilla.org/en-US/docs/Glossary/First_paint)
 * */
import { isPerformanceObserverSupported } from '../utils/isSupported'
import { IMetrics, IReportHandler } from '../types'
import { roundByFour } from '../utils'
import { MetricsName } from '../constants'
import metricsStore from '../lib/store'
import observe from '../lib/observe'
import getFirstHiddenTime from '../lib/getFirstHiddenTime'

const getFP = (): Promise<PerformanceEntry> | undefined => {
  if (!isPerformanceObserverSupported()) {
    console.warn('browser do not support performanceObserver')
    return
  }

  return new Promise((resolve) => {
    const entryHandler = (entry: PerformanceEntry) => {
      if (entry.name === 'first-paint') {
        if (po) {
          po.disconnect()
        }

        if (entry.startTime < getFirstHiddenTime().timeStamp) {
          resolve(entry)
        }
      }
    }

    const po = observe('paint', entryHandler)
  })
}

/**
 * @param {metricsStore} store
 * @param {Function} report
 * @param {boolean} immediately, if immediately is true,data will report immediately
 * */
export const initFP = (store: metricsStore, report: IReportHandler, immediately = true): void => {
  getFP()?.then((entry: PerformanceEntry) => {
    const metrics = { name: MetricsName.FP, value: roundByFour(entry.startTime, 2) } as IMetrics

    if (immediately) {
      report(metrics)
    }

    store.set(MetricsName.FP, metrics)
  })
}
