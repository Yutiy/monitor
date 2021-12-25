/**
 * Why not First Meaningful Paint (FMP)
 * In the past we've recommended performance metrics like First Meaningful Paint (FMP) and Speed Index (SI) (both available
 * in Lighthouse) to help capture more of the loading experience after the initial paint,
 * but these metrics are complex, hard to explain,
 * and often wrong—meaning they still do not identify when the main content of the page has loaded.
 * (https://web.dev/lcp/)
 *
 * The Largest Contentful Paint (LCP) metric reports the render time of the largest image or text block visible within the viewport,
 * relative to when the page first started loading.
 * */
import { isPerformanceObserverSupported } from '../utils/isSupported'
import getFirstHiddenTime from '../lib/getFirstHiddenTime'
import { onHidden } from '../lib/onHidden'
import { MetricsName } from '../constants'
import { IMetrics, IReportHandler } from '../types'
import metricsStore from '../lib/store'
import { roundByFour } from '../utils'
import observe from '../lib/observe'

const getLCP = (lcp): PerformanceObserver | undefined => {
  if (!isPerformanceObserverSupported()) {
    console.warn('browser do not support performanceObserver')
    return
  }

  const firstHiddenTime = getFirstHiddenTime()

  const entryHandler = (entry: PerformanceEntry) => {
    if (entry.startTime < firstHiddenTime.timeStamp) {
      lcp.value = entry
    }
  }

  return observe('largest-contentful-paint', entryHandler)
}

/**
 * @param {metricsStore} store
 * @param {Function} report
 * @param {boolean} immediately, if immediately is true,data will report immediately
 * */
export const initLCP = (store: metricsStore, report: IReportHandler, immediately = true): void => {
  const lcp = { value: {} as PerformanceEntry }
  const po = getLCP(lcp)

  const stopListening = () => {
    if (po) {
      if (po.takeRecords) {
        // 返回当前存储在性能观察器中的 性能条目 列表，将其清空
        po.takeRecords().forEach((entry: PerformanceEntry) => {
          const firstHiddenTime = getFirstHiddenTime()
          if (entry.startTime < firstHiddenTime.timeStamp) {
            lcp.value = entry
          }
        })
      }
      po.disconnect()

      if (!store.has(MetricsName.LCP)) {
        const value = lcp.value
        const metrics = { name: MetricsName.LCP, value: roundByFour(value.startTime, 2) } as IMetrics

        if (immediately) {
          report(metrics)
        }

        store.set(MetricsName.LCP, metrics)
      }
    }
  }

  onHidden(stopListening, true)
  ;['click', 'keydown'].forEach((event: string) => {
    addEventListener(event, stopListening, { once: true, capture: true })
  })
}
