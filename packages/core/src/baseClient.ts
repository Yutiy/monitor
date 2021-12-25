import { EventTypes, SDK_VERSION } from '@bdw/monitor-shared'
import { BaseClientType, BasePluginType, BaseOptionsFieldsIntegrationType, LogTypes } from '@bdw/monitor-types'
import { logger } from '@bdw/monitor-utils'
import { BaseTransport } from './baseTransport'
import { Breadcrumb } from './breadcrumb'
import { Subscribe } from './subscribe'

export abstract class BaseClient<
  T extends BaseOptionsFieldsIntegrationType = BaseOptionsFieldsIntegrationType,
  E extends EventTypes = EventTypes
> implements BaseClientType
{
  SDK_NAME: string
  SDK_VERSION = SDK_VERSION
  options: BaseOptionsFieldsIntegrationType
  abstract breadcrumb: Breadcrumb
  abstract transport: BaseTransport

  constructor(options: T) {
    this.options = options
    logger.bindOptions(options.debug)
  }

  /**
   * 引用插件
   *
   * @param {BasePluginType<E>[]} plugins
   * @memberof BaseClient
   */
  use(plugins: BasePluginType<E>[]) {
    if (this.options.disabled) return
    // 新建发布订阅实例
    const subscribe = new Subscribe<E>()
    plugins.forEach((item) => {
      if (!this.isPluginEnable(item.name)) return
      // 调用插件中的monitor并将发布函数传入
      item.monitor.call(this, subscribe.notify.bind(subscribe))
      const wrapperTranform = (...args: any[]) => {
        // 先执行transform
        const res = item.transform?.apply(this, args)
        // 拿到transform返回的数据并传入
        item.consumer?.call(this, res)
        // 如果需要新增hook，可在这里添加逻辑
      }
      // 订阅插件中的名字，并传入回调函数
      subscribe.watch(item.name, wrapperTranform)
    })
  }

  getOptions() {
    return this.options
  }

  /**
   * 判断当前插件是否启用，每个端的可选字段不同，需要子类实现
   *
   * @abstract
   * @param {EventTypes} name
   * @return {*}  {boolean}
   * @memberof BaseClient
   */
  abstract isPluginEnable(name: EventTypes): boolean

  /**
   * 手动上报方法，每个端需要自己实现
   *
   * @abstract
   * @param {LogTypes} data
   * @memberof BaseClient
   */
  abstract log(data: LogTypes): void
}
