import { onPageChangeCallback } from '../types'
import { proxyHistory } from './proxyHandler'

const unifiedHref = (href: string) => {
  return decodeURIComponent(href?.replace(`${location?.protocol}//${location?.host}`, ''))
}

const lastHref = decodeURIComponent(unifiedHref(location.href))

/**
 * when page is loaded, listen page change
 */
export const onPageChange = (cb: onPageChangeCallback) => {
  window.addEventListener('hashchange', function (e) {
    cb(e)
  })

  window.addEventListener('popstate', function (e) {
    cb(e)
  })

  proxyHistory((...args) => {
    const currentHref = unifiedHref(args?.[2])
    if (lastHref !== currentHref) {
      cb()
    }
  })
}
