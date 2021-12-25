import { BrowserBreadcrumbTypes } from '@bdw/monitor-shared'
import { getBreadcrumbCategoryInBrowser, Severity } from '@bdw/monitor-utils'
import { BrowserClient } from './implement/client'

export function addBreadcrumbInBrowser(
  this: BrowserClient,
  data: any,
  type: BrowserBreadcrumbTypes,
  level = Severity.Info,
  params: any = {}
) {
  return this.breadcrumb.push({
    type,
    data,
    category: getBreadcrumbCategoryInBrowser(type),
    level,
    ...params
  })
}
