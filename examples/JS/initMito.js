const instance = MITO.init({
  debug: true,
  apikey: 'sdasda',
  silentConsole: true,
  silentXhr: false,
  maxBreadcrumbs: 10,
  dsn: 'http://localhost:2021/errors/upload',
  throttleDelayTime: 0,
  enableTraceId: true,
  configReportXhr(xhr, reportData) {
    xhr.setRequestHeader('mito-header', 'test123')
  },
  onRouteChange(from, to) {
    console.log('onRouteChange: _', from, to);
  }
})
window._MITO_ = instance
