import MiniProgram from 'miniprogram-automator/out/MiniProgram'
import Page from 'miniprogram-automator/out/Page'
import { BreadcrumbPushData, ReportDataType, TransportDataType, RouteChangeCollectType } from '@bdw/monitor-types'
import automator from 'miniprogram-automator'
import { resolve } from 'path'
import { Severity } from '@bdw/monitor-utils'
import { BreadcrumbCategorys, WxBreadcrumbTypes, ErrorTypes, HttpTypes, MethodTypes, SDK_NAME, SDK_VERSION } from '@bdw/monitor-shared'
import { ServerUrls } from '../../../examples/server/config'

describe('Min e2e:', () => {
  const timeout = 60000 // 打开开发工具较慢
  const waitFor = 1000
  let _miniProgram: MiniProgram
  let _page: Page

  async function getStack(): Promise<BreadcrumbPushData[]> {
    return await _miniProgram.evaluate(() => {
      return wx['__MITO__'].breadcrumb.stack as BreadcrumbPushData[]
    })
  }

  async function getRequestOptions(): Promise<WechatMiniprogram.RequestOption> {
    return await _miniProgram.evaluate(() => {
      const options = wx['__MITO_REQUEST__']
      return {
        method: options.method,
        header: options.header,
        url: options.url,
        data: typeof options.data === 'object' ? options.data : JSON.parse(options.data)
      } as WechatMiniprogram.RequestOption
    })
  }

  async function reset() {
    // 小程序没有保留拦截请求的方法， 暂时使用全局变量存储，每个用例清空一次
    return await _miniProgram.evaluate(() => {
      wx['__MITO__'].breadcrumb.stack = []
      wx['__MITO_REQUEST__'] = undefined
      return
    })
  }

  /**
   * 请确保本地安装了开发工具并打开了安全端口
   * 如何打开端口
   * 微信开发工具设置 -> 安全设置 -> 安全 -> 打开服务端口
   */
  beforeAll(async () => {
    const miniProgram: MiniProgram = await automator.launch({
      projectPath: resolve(__dirname, '../../../examples/Mini')
    })
    _miniProgram = miniProgram
    const page: Page = await miniProgram.reLaunch('/pages/automator/automator')
    await page.waitFor(waitFor)
    _page = page
  }, timeout)

  beforeEach(async () => {
    await reset()
  }, timeout)

  it(
    'Code Error btn click，breadcrumb stack should add two and upload this error',
    async (done) => {
      const element = await _page.$('#click-err-btn')
      await element.tap()
      await _page.waitFor(waitFor)

      // 请求体
      const options = await getRequestOptions()
      const { authInfo, data } = options.data as TransportDataType

      expect((data as ReportDataType).type).toBe(ErrorTypes.JAVASCRIPT)
      expect((data as ReportDataType).level).toBe(Severity.Normal)
      expect(Array.isArray((data as ReportDataType).stack)).toBeTruthy()
      expect(authInfo.sdkName).toBe(SDK_NAME)
      expect(authInfo.sdkVersion).toBe(SDK_VERSION)

      const stack: BreadcrumbPushData[] = await getStack()

      //  click
      expect(stack[0].type).toBe(WxBreadcrumbTypes.TAP)
      expect(stack[0].category).toBe(BreadcrumbCategorys.USER)
      expect(stack[0].level).toBe(Severity.Info)

      // code error
      expect(stack[1].type).toBe(WxBreadcrumbTypes.CODE_ERROR)
      expect(stack[1].category).toBe(BreadcrumbCategorys.EXCEPTION)
      expect(stack[1].level).toBe(Severity.Error)
      expect(stack.length).toBe(2)
      done()
    },
    timeout
  )

  it(
    'PromiseError，breadcrumb should add two and upload this error',
    async (done) => {
      const element = await _page.$('#click-promise-btn')
      await element.tap()

      await _page.waitFor(waitFor)

      const options = await getRequestOptions()

      const { authInfo, data } = options.data as TransportDataType

      expect((data as ReportDataType).name).toBe('unhandledrejection')
      expect((data as ReportDataType).type).toBe(ErrorTypes.PROMISE)
      expect((data as ReportDataType).level).toBe(Severity.Low)
      expect((data as ReportDataType).message).toBe('Promise reject str')
      expect(authInfo.sdkName).toBe(SDK_NAME)
      expect(authInfo.sdkVersion).toBe(SDK_VERSION)

      const stack: BreadcrumbPushData[] = await getStack()

      expect(stack[1].category).toBe(BreadcrumbCategorys.EXCEPTION)
      expect(stack[1].type).toBe(WxBreadcrumbTypes.UNHANDLEDREJECTION)
      expect(stack[1].level).toBe(Severity.Error)
      expect(stack.length).toBe(2)
      done()
    },
    timeout
  )

  // 没发请求
  it(
    'A exception get XHR request，breadcrumb stack should add two and upload this error',
    async (done) => {
      const element = await _page.$('#click-request-btn')
      await element.tap()

      await _page.waitFor(waitFor)

      const options = await getRequestOptions()

      const { authInfo, data } = options.data as TransportDataType

      expect((data as ReportDataType).type).toBe(ErrorTypes.HTTP)
      expect((data as ReportDataType).level).toBe(Severity.Low)
      expect(authInfo.sdkName).toBe(SDK_NAME)
      expect(authInfo.sdkVersion).toBe(SDK_VERSION)

      const stack: BreadcrumbPushData[] = await getStack()

      expect(stack[1].category).toBe(BreadcrumbCategorys.HTTP)
      expect(stack[1].type).toBe(WxBreadcrumbTypes.XHR)
      expect(stack[1].level).toBe(Severity.Info)
      expect((stack[1].data as ReportDataType).message).toBe(`http请求失败，失败原因：跨域限制或域名不存在 ${ServerUrls.exceptionGet}`)
      expect((stack[1].data as ReportDataType).request.httpType).toBe(HttpTypes.XHR)
      expect((stack[1].data as ReportDataType).request.method).toBe(MethodTypes.Get)
      expect((stack[1].data as ReportDataType).request.url).toBe(ServerUrls.exceptionGet)

      expect(stack[2].category).toBe(BreadcrumbCategorys.EXCEPTION)
      expect(stack[2].type).toBe(WxBreadcrumbTypes.XHR)
      expect(stack[2].level).toBe(Severity.Error)
      expect((stack[2].data as ReportDataType).request.httpType).toBe(HttpTypes.XHR)
      expect((stack[2].data as ReportDataType).message).toBe(`http请求失败，失败原因：跨域限制或域名不存在 ${ServerUrls.exceptionGet}`)
      expect((stack[2].data as ReportDataType).request.method).toBe(MethodTypes.Get)
      expect((stack[2].data as ReportDataType).request.url).toBe(ServerUrls.exceptionGet)
      done()
    },
    timeout
  )

  it(
    'Router error, should add two and upload this error',
    async (done) => {
      const element = await _page.$('#click-router-btn')
      await element.tap()

      await _page.waitFor(waitFor)

      const options = await getRequestOptions()

      const { authInfo, data } = options.data as TransportDataType

      expect((data as ReportDataType).name).toBe('ROUTE_ERROR')
      expect((data as ReportDataType).type).toBe(ErrorTypes.ROUTE)
      expect((data as ReportDataType).level).toBe(Severity.Error)
      expect(authInfo.sdkName).toBe(SDK_NAME)
      expect(authInfo.sdkVersion).toBe(SDK_VERSION)

      const stack: BreadcrumbPushData[] = await getStack()

      expect(stack[1].category).toBe(BreadcrumbCategorys.USER)
      expect(stack[1].type).toBe(WxBreadcrumbTypes.ROUTE)
      expect(stack[1].level).toBe(Severity.Info)
      expect((stack[1].data as RouteChangeCollectType).from).toBe('pages/automator/automator?')
      expect((stack[1].data as RouteChangeCollectType).to).toBe('/pages/noRoute/index')

      expect(stack[2].category).toBe(BreadcrumbCategorys.EXCEPTION)
      expect(stack[2].type).toBe(WxBreadcrumbTypes.ROUTE)
      expect(stack[2].level).toBe(Severity.Error)
      expect((stack[2].data as RouteChangeCollectType).from).toBe('pages/automator/automator?')
      expect((stack[2].data as RouteChangeCollectType).to).toBe('/pages/noRoute/index')
      done()
    },
    timeout
  )

  it(
    'Download File error, should add three and upload this error',
    async (done) => {
      const element = await _page.$('#click-file-btn')
      await element.tap()

      await _page.waitFor(waitFor)

      const options = await getRequestOptions()

      const { authInfo, data } = options.data as TransportDataType

      expect((data as ReportDataType).name).toBe('xhr--GET')
      expect((data as ReportDataType).type).toBe(ErrorTypes.HTTP)
      expect((data as ReportDataType).level).toBe(Severity.Low)
      expect((data as ReportDataType).message).toBe('not_found https://www.baidu.com/downloadFile')
      expect(authInfo.sdkName).toBe(SDK_NAME)
      expect(authInfo.sdkVersion).toBe(SDK_VERSION)

      const stack: BreadcrumbPushData[] = await getStack()

      expect(stack[1].category).toBe(BreadcrumbCategorys.HTTP)
      expect(stack[1].type).toBe(WxBreadcrumbTypes.XHR)
      expect(stack[1].level).toBe(Severity.Info)
      expect((stack[1].data as ReportDataType).message).toBe('not_found https://www.baidu.com/downloadFile')
      expect((stack[1].data as ReportDataType).request.httpType).toBe(HttpTypes.XHR)
      expect((stack[1].data as ReportDataType).request.method).toBe(MethodTypes.Get)
      expect((stack[1].data as ReportDataType).request.url).toBe('https://www.baidu.com/downloadFile')

      expect(stack[2].category).toBe(BreadcrumbCategorys.EXCEPTION)
      expect(stack[2].type).toBe(WxBreadcrumbTypes.XHR)
      expect(stack[2].level).toBe(Severity.Error)
      expect((stack[2].data as ReportDataType).request.httpType).toBe(HttpTypes.XHR)
      expect((stack[2].data as ReportDataType).message).toBe('not_found https://www.baidu.com/downloadFile')
      expect((stack[2].data as ReportDataType).request.method).toBe(MethodTypes.Get)
      expect((stack[2].data as ReportDataType).request.url).toBe('https://www.baidu.com/downloadFile')
      expect(stack.length).toBe(3)
      done()
    },
    timeout
  )
})
