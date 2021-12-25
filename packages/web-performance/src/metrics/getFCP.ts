/**
 * FCP: 从页面加载开始到页面内容的任何部分在屏幕上完成渲染的时间。对于该指标，"内容"指的是文本、图像（包括背景图像）、<svg>元素或非白色的<canvas>元素
 * providing the first feedback to the user that the page is actually loading(https://developer.mozilla.org/en-US/docs/Glossary/First_contentful_paint)
 * */
import { isPerformanceObserverSupported } from '../utils/isSupported'
import { IMetrics, IReportHandler } from '../types'
import { roundByFour } from '../utils'
import { MetricsName } from '../constants'
import metricsStore from '../lib/store'
import observe from '../lib/observe'
import getFirstHiddenTime from '../lib/getFirstHiddenTime'

const getFCP = (): Promise<PerformanceEntry> | undefined => {
  if (!isPerformanceObserverSupported()) {
    console.warn('browser do not support performanceObserver')
    return
  }

  return new Promise((resolve) => {
    const entryHandler = (entry: PerformanceEntry) => {
      if (entry.name === 'first-contentful-paint') {
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
export const initFCP = (store: metricsStore, report: IReportHandler, immediately = true): void => {
  getFCP()?.then((entry: PerformanceEntry) => {
    const metrics = { name: MetricsName.FCP, value: roundByFour(entry.startTime, 2) } as IMetrics

    if (immediately) {
      report(metrics)
    }

    store.set(MetricsName.FCP, metrics)
  })
}
