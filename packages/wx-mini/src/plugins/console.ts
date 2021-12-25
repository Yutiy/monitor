import { WxEventTypes, globalVar, WxBreadcrumbTypes, WxBaseEventTypes } from '@bdw/monitor-shared'
import { replaceOld, Severity, variableTypeDetection } from '@bdw/monitor-utils'
import { BasePluginType, ConsoleCollectType } from '@bdw/monitor-types'
import { WxClient } from '../implement/client'
import { addBreadcrumbInWx } from '../utils'

const wxConsolePlugin: BasePluginType<WxEventTypes, WxClient> = {
  name: WxBaseEventTypes.CONSOLE,
  monitor(notify) {
    if (console && variableTypeDetection.isObject(console)) {
      const logType = ['log', 'debug', 'info', 'warn', 'error', 'assert']
      logType.forEach(function (level: string): void {
        if (!(level in console)) return
        replaceOld(console, level, function (originalConsole): Function {
          return function (...args: any[]): void {
            if (originalConsole) {
              notify(WxBaseEventTypes.CONSOLE, { args, level })
              originalConsole.apply(console, args)
            }
          }
        })
      })
    }
  },
  transform(collectedData: ConsoleCollectType) {
    return collectedData
  },
  consumer(transformedData: ConsoleCollectType) {
    if (globalVar.isLogAddBreadcrumb) {
      addBreadcrumbInWx.call(this, transformedData, WxBreadcrumbTypes.CONSOLE, Severity.fromString(transformedData.level))
    }
  }
}

export default wxConsolePlugin
