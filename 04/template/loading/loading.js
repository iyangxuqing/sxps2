export class Loading {

  constructor() {
    this.timer = null
  }

  show(options = { mask: false }) {
    let page = getCurrentPages().pop()
    this.timer = setTimeout(function () {
      page.setData({
        'loading.show': true,
        'loading.mask': options.mask,
      })
    }, 500)
  }

  hide() {
    let page = getCurrentPages().pop()
    clearTimeout(this.timer)
    page.setData({
      'loading.show': false,
      'loading.mask': false,
    })
  }
}