import { BaseTransport } from '@bdw/monitor-core'
import { MethodTypes, ToStringTypes } from '@bdw/monitor-shared'
import { safeStringify, toStringValidateOption } from '@bdw/monitor-utils'
import { FinalReportType } from 'packages/types/src/transport'
import { BrowserOptionsFieldsTypes } from '../types'

export class BrowserTransport extends BaseTransport<BrowserOptionsFieldsTypes> {
  useImgUpload = false
  configReportXhr: unknown

  constructor(options: BrowserOptionsFieldsTypes) {
    super()
    super.bindOptions(options)
    this.bindOptions(options)
  }

  bindOptions(options: BrowserOptionsFieldsTypes = {}) {
    const { configReportXhr, useImgUpload } = options
    toStringValidateOption(configReportXhr, 'configReportXhr', ToStringTypes.Function) && (this.configReportXhr = configReportXhr)
    toStringValidateOption(useImgUpload, 'useImgUpload', ToStringTypes.Boolean) && (this.useImgUpload = useImgUpload)
  }

  imgRequest(data: any, url: string): void {
    const requestFun = () => {
      let img = new Image()
      const spliceStr = url.indexOf('?') === -1 ? '?' : '&'
      img.src = `${url}${spliceStr}data=${encodeURIComponent(JSON.stringify(data))}`
      img = null
    }
    this.queue.addFn(requestFun)
  }

  /**
   * @override
   */
  post(data: any, url: string): void {
    const requestFn = (): void => {
      const xhr = new XMLHttpRequest()
      xhr.open(MethodTypes.Post, url)
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      xhr.withCredentials = true
      if (typeof this.configReportUrl === 'function') {
        this.configReportUrl(xhr, data)
      }
      xhr.send(safeStringify(data))
    }
    this.queue.addFn(requestFn)
  }

  /**
   * @override
   */
  sendToServer(data: any, url: string) {
    return this.useImgUpload ? this.imgRequest(data, url) : this.post(data, url)
  }

  /**
   * @override
   */
  getTransportData(data: FinalReportType) {
    return {
      authInfo: this.getAuthInfo(),
      data
    }
  }
}
