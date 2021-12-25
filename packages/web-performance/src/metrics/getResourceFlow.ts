import { isPerformanceObserverSupported } from '../utils/isSupported'
import metricsStore from '../lib/store'
import observe from '../lib/observe'
import { IMetrics, IReportHandler } from '../types'
import { MetricsName } from '../constants'

const getResourceFlow = (resourceFlow: Array<PerformanceEntry>): PerformanceObserver | undefined => {
  if (!isPerformanceObserverSupported()) {
    console.warn('browser do not support performanceObserver')
    return
  }

  const entryHandler = (entry: PerformanceEntry) => {
    resourceFlow.push(entry)
  }

  return observe('resource', entryHandler)
}

/**
 * @param {metricsStore} store
 * @param {Function} report
 * @param {string} customCompleteEvent
 * @param {boolean} immediately, if immediately is true,data will report immediately
 * */
export const initResourceFlow = (store: metricsStore, report: IReportHandler, customCompleteEvent: string, immediately = true): void => {
  let resourceFlow = []
  const po = getResourceFlow(resourceFlow)

  const completeEvent = customCompleteEvent || 'pageshow'

  const stopListening = () => {
    if (po) {
      if (po.takeRecords) {
        resourceFlow = po.takeRecords().concat(resourceFlow)
      }

      po.disconnect()
    }

    const metrics = { name: MetricsName.RL, value: resourceFlow } as IMetrics

    if (immediately) {
      report(metrics)
    }

    store.set(MetricsName.RL, metrics)
  }

  addEventListener(completeEvent, stopListening, { once: true, capture: true })
}
