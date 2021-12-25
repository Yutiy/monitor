/**
 * Network Info
 * downlink: 返回以兆比特/秒为单位的有效带宽估计，四舍五入到最接近的 25 千比特/秒的倍数
 * effectiveType: 返回连接的有效类型，表示“slow-2g”、“2g”、“3g”或“4g”之一。 该值是使用最近观察到的往返时间和下行链路值的组合来确定的
 * rtt: 返回当前连接的估计有效往返时间，四舍五入到最接近的 25 毫秒的倍数
 * */
import { INetworkInformation, IMetrics, IReportHandler, IConnection } from '../types'
import { isNavigatorSupported } from '../utils/isSupported'
import { MetricsName } from '../constants'
import metricsStore from '../lib/store'

const getNetworkInfo = (): INetworkInformation | undefined => {
  if (!isNavigatorSupported()) {
    console.warn('browser do not support performance')
    return
  }

  const connection = ('connection' in navigator ? navigator['connection'] : {}) as IConnection

  const { downlink, effectiveType, rtt } = connection

  return {
    downlink,
    effectiveType,
    rtt
  }
}

/**
 * @param {metricsStore} store
 * @param {Function} report
 * @param {boolean} immediately, if immediately is true,data will report immediately
 * */
export const initNetworkInfo = (store: metricsStore, report: IReportHandler, immediately = true): void => {
  const networkInfo: INetworkInformation = getNetworkInfo()

  const metrics = { name: MetricsName.NI, value: networkInfo } as IMetrics

  if (immediately) {
    report(metrics)
  }

  store.set(MetricsName.NI, metrics)
}
