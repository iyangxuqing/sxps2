export class Toptip {

  constructor() {
    this.timer = null
  }

  show(options = {}) {
    let page = getCurrentPages().pop()
    if (page) {
      page.setData({
        'toptip.show': 'show',
        'toptip.title': options.title,
      })
      clearTimeout(this.timer)
      this.timer = setTimeout(function () {
        page.setData({
          'toptip.show': ''
        })
        options.success && options.success()
      }, 1500)
    }
  }

}