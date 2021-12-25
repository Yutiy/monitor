import { MetricsName } from '../constants'
import { IMetrics, IMetricsObj } from '../types'

/**
 * store metrics
 *
 * @class
 * */
class MetricsStore {
  state: Map<MetricsName | string, IMetrics>

  constructor() {
    this.state = new Map<MetricsName | string, IMetrics>()
  }

  set(key: MetricsName | string, value: IMetrics) {
    this.state.set(key, value)
  }

  get(key: MetricsName | string): IMetrics {
    return this.state.get(key)
  }

  has(key: MetricsName | string): boolean {
    return this.state.has(key)
  }

  clear() {
    this.state.clear()
  }

  getValues(): IMetricsObj {
    return Array.from(this.state).reduce((obj, [key, value]) => {
      obj[key] = value
      return obj
    }, {})
  }
}

export default MetricsStore
