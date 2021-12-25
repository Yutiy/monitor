import { LogTypes } from '@bdw/monitor-types'
import { BaseClient, Breadcrumb } from '@bdw/monitor-core'
import {
  EventTypes,
  ErrorTypes,
  BrowserEventTypes,
  BrowserBreadcrumbTypes,
  MitoLog,
  MitoLogEmptyTag,
  MitoLogEmptyMsg,
  Silent
} from '@bdw/monitor-shared'
import {
  firstStrToUppercase,
  Severity,
  isError,
  extractErrorStack,
  unknownToString,
  getTimestamp,
  getLocationHref,
  getBreadcrumbCategoryInBrowser
} from '@bdw/monitor-utils'
import { BrowserOptions } from './options'
import { BrowserTransport } from './transport'
import { BrowserOptionsFieldsTypes } from '../types'

export class BrowserClient extends BaseClient<BrowserOptionsFieldsTypes, EventTypes> {
  transport: BrowserTransport
  options: BrowserOptions
  breadcrumb: Breadcrumb<BrowserOptionsFieldsTypes>

  constructor(options: BrowserOptionsFieldsTypes = {}) {
    super(options)
    this.options = new BrowserOptions(options)
    this.transport = new BrowserTransport(options)
    this.breadcrumb = new Breadcrumb(options)
  }

  /**
   * 判断当前插件是否启用，用于browser的option
   *
   * @param {BrowserEventTypes} name
   * @return {*}
   * @memberof BrowserClient
   */
  isPluginEnable(name: BrowserEventTypes): boolean {
    const silentField = `${Silent}${firstStrToUppercase(name)}`
    return !this.options[silentField]
  }

  log(data: LogTypes) {
    const { message = MitoLogEmptyMsg, tag = MitoLogEmptyTag, level = Severity.Critical, ex = '' } = data
    let errorInfo = {}
    if (isError(ex)) {
      errorInfo = extractErrorStack(ex, level)
    }
    const error = {
      type: ErrorTypes.LOG,
      level,
      message: unknownToString(message),
      name: MitoLog,
      customTag: unknownToString(tag),
      time: getTimestamp,
      url: getLocationHref(),
      ...errorInfo
    }
    const breadcrumb = this.breadcrumb.push({
      type: BrowserBreadcrumbTypes.CUSTOMER,
      category: getBreadcrumbCategoryInBrowser(BrowserBreadcrumbTypes.CUSTOMER),
      data: message,
      level: Severity.fromString(level.toString())
    })
    this.transport.send(error, breadcrumb)
  }
}
