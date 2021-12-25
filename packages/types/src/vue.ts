import { IAnyObject } from '@bdw/monitor-types'

export interface VueInstance {
  // mixin(hooks: { [key: string]: () => void }): void
  config?: VueConfiguration
  version: string
  // fix in Vue3 typescript's declaration file error
  [key: string]: any
}

export interface VueConfiguration {
  // for Vue2.x
  silent?: boolean

  errorHandler?(err: Error, vm: ViewModel | any, info: string): void
  warnHandler?(msg: string, vm: ViewModel | any, trace: string): void
  [key: string]: any
}

export interface ViewModel {
  [key: string]: any
  $root?: Record<string, unknown>
  $options?: {
    [key: string]: any
    name?: string
    // vue2.6
    propsData?: IAnyObject
    _componentTag?: string
    __file?: string
    props?: IAnyObject
  }
  $props?: Record<string, unknown>
}
