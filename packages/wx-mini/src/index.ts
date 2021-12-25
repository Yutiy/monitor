import { BasePluginType } from '@bdw/monitor-types'
import wxAppPlugins from './plugins/app'
import wxConsolePlugin from './plugins/console'
import wxDomPlugin from './plugins/dom'
import wxPagePlugins from './plugins/page'
import wxRequestPlugin from './plugins/request'
import wxRoutePlugin from './plugins/route'
import { WxClient } from './implement/client'
import { WxOptionsFieldsTypes } from './types'

function createWxInstance(options: WxOptionsFieldsTypes, plugins: BasePluginType[] = []) {
  const wxClient = new WxClient(options)
  const wxPlugins = [wxRequestPlugin, wxRoutePlugin, wxConsolePlugin, wxDomPlugin, ...wxAppPlugins, ...wxPagePlugins, ...plugins]
  wxClient.use(wxPlugins)
  return wxClient
}

const init = createWxInstance
export { init, WxClient }
