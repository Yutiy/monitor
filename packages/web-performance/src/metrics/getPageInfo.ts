/**
 * Page Info
 * host
 * hostname
 * href
 * protocol
 * origin
 * port
 * pathname
 * search
 * hash
 * screen resolution
 * */
import MetricsStore from '../lib/store'
import { MetricsName } from '../constants'
import { IMetrics, IPageInformation, IReportHandler } from '../types'

const getPageInfo = (): IPageInformation => {
  if (!location) {
    console.warn('browser do not support location')
    return
  }

  const { host, hostname, href, protocol, origin, port, pathname, search, hash } = location
  const { width, height } = window.screen

  return {
    host,
    hostname,
    href,
    protocol,
    origin,
    port,
    pathname,
    search,
    hash,
    userAgent: 'userAgent' in navigator ? navigator.userAgent : '',
    screenResolution: `${width}x${height}`
  }
}

/**
 * @param {metricsStore} store
 * @param {Function} report
 * @param {boolean} immediately, if immediately is true,data will report immediately
 * */
export const initPageInfo = (store: MetricsStore, report: IReportHandler, immediately = true): void => {
  const pageInfo: IPageInformation = getPageInfo()

  const metrics = { name: MetricsName.PI, value: pageInfo } as IMetrics

  if (immediately) {
    report(metrics)
  }

  store.set(MetricsName.PI, metrics)
}
