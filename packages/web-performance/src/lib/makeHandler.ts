import { isPerformanceSupported } from '../utils/isSupported'

export const hasMark = (markName: string) => {
  if (!isPerformanceSupported()) {
    console.error('browser do not support performance')
    return
  }

  return performance.getEntriesByName(markName).length > 0
}

export const getMark = (markName: string) => {
  if (!isPerformanceSupported()) {
    console.error('browser do not support performance')
    return
  }

  return performance.getEntriesByName(markName).pop()
}

export const setMark = (markName: string): undefined => {
  if (!isPerformanceSupported()) {
    console.error('browser do not support performance')
    return
  }

  performance.mark(markName)
}

export const clearMark = (markName: string): undefined => {
  if (!isPerformanceSupported()) {
    return
  }

  performance.clearMarks(markName)
}
