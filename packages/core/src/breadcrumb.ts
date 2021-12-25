import { ToStringTypes } from '@bdw/monitor-shared'
import { BaseOptionsFieldsIntegrationType, BreadcrumbPushData } from '@bdw/monitor-types'
import { getTimestamp, logger, silentConsoleScope, toStringValidateOption } from '@bdw/monitor-utils'

export class Breadcrumb<T extends BaseOptionsFieldsIntegrationType = BaseOptionsFieldsIntegrationType> {
  private maxBreadcrumbs = 10
  private beforePushBreadcrumb: unknown = null
  private stack: BreadcrumbPushData[] = []

  constructor(options: Partial<T> = {}) {
    this.bindOptions(options)
  }

  /**
   * 添加用户行为栈
   *
   * @param {BreadcrumbPushData} data
   * @memberof Breadcrumb
   */
  push(data: BreadcrumbPushData): BreadcrumbPushData[] {
    if (typeof this.beforePushBreadcrumb === 'function') {
      let result: BreadcrumbPushData = null
      const beforePushBreadcrumb = this.beforePushBreadcrumb
      silentConsoleScope(() => {
        result = beforePushBreadcrumb.call(this, this, data)
      })
      if (!result) return this.stack
      return this.immediatePush(result)
    }
    return this.immediatePush(data)
  }

  private immediatePush(data: BreadcrumbPushData): BreadcrumbPushData[] {
    data.time || (data.time = getTimestamp())
    if (this.stack.length >= this.maxBreadcrumbs) {
      this.shift()
    }
    this.stack.push(data)
    // make sure xhr fetch is behind button click
    this.stack.sort((a, b) => a.time - b.time)
    logger.log(this.stack)
    return this.stack
  }

  private shift(): boolean {
    return this.stack.shift() !== undefined
  }

  clear(): void {
    this.stack = []
  }

  getStack(): BreadcrumbPushData[] {
    return this.stack
  }

  bindOptions(options: Partial<T> = {}): void {
    const { maxBreadcrumbs, beforePushBreadcrumb } = options
    toStringValidateOption(maxBreadcrumbs, 'maxBreadcrumbs', ToStringTypes.Number) && (this.maxBreadcrumbs = maxBreadcrumbs)
    toStringValidateOption(beforePushBreadcrumb, 'beforePushBreadcrumb', ToStringTypes.Function) &&
      (this.beforePushBreadcrumb = beforePushBreadcrumb)
  }
}
