import { PerformanceEntryHandler } from '../types'

const observe = (type: string, callback: PerformanceEntryHandler): PerformanceObserver | undefined => {
  if (PerformanceObserver.supportedEntryTypes?.includes(type)) {
    const po: PerformanceObserver = new PerformanceObserver((l) => l.getEntries().map(callback))

    // buffered 属性表示是否观察缓存数据，也就是说观察代码添加时机比事情触发时机晚也没关系。
    po.observe({ type, buffered: true })
    return po
  }
}

export default observe
