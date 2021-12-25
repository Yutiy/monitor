/**
 * FPS
 * fps: a frame rate is the speed at which the browser is able to recalculate, layout and paint content to the display.
 */
import { IReportHandler } from '../types'
import { MetricsName } from '../constants'
import metricsStore from '../lib/store'
import calculateFps from '../lib/calculateFps'

const getFPS = (logFpsCount: number): Promise<number> => {
  return calculateFps(logFpsCount)
}

/**
 * @param {metricsStore} store
 * @param {Function} report
 * @param {number} logFpsCount
 * @param {boolean} immediately, if immediately is true,data will report immediately
 * */
export const initFPS = (store: metricsStore, report: IReportHandler, logFpsCount: number, immediately = true): void => {
  getFPS(logFpsCount).then((fps: number) => {
    const metries = { name: MetricsName.FPS, value: fps }

    if (immediately) {
      report(metries)
    }

    store.set(MetricsName.FPS, metries)
  })
}
