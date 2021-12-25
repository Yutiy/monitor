import { ToStringTypes } from '@bdw/monitor-shared'
import { toStringValidateOption, _support } from '@bdw/monitor-utils'
import { ReportDataType } from '@bdw/monitor-types'
import { BaseTransport } from '@bdw/monitor-core'
import { WxOptionsFieldsTypes } from '../types'

export class WxTransport extends BaseTransport<WxOptionsFieldsTypes> {
  configReportWxRequest: unknown

  constructor(options: Partial<WxOptionsFieldsTypes> = {}) {
    super()
    super.bindOptions(options)
    this.bindOptions(options)
  }

  bindOptions(options: WxOptionsFieldsTypes = {}) {
    const { configReportWxRequest } = options
    toStringValidateOption(configReportWxRequest, 'configReportWxRequest', ToStringTypes.Function) &&
      (this.configReportWxRequest = configReportWxRequest)
  }

  sendToServer(data: any, url: string) {
    return this.post(data, url)
  }

  getTransportData(data: ReportDataType) {
    return {
      authInfo: this.getAuthInfo(),
      data,
      deviceInfo: _support.deviceInfo
    }
  }

  post(data: any, url: string) {
    const requestFun = (): void => {
      let requestOptions = { method: 'POST' } as WechatMiniprogram.RequestOption
      if (typeof this.configReportWxRequest === 'function') {
        const params = this.configReportWxRequest(data)
        // default method
        requestOptions = { ...requestOptions, ...params }
      }
      requestOptions = {
        ...requestOptions,
        data: JSON.stringify(data),
        url
      }
      wx.request(requestOptions)
    }
    this.queue.addFn(requestFun)
  }
}
