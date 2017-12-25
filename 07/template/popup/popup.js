let defaults = {

}

let methods = {
  onPopupCancel: function (e) {
    let page = getCurrentPages().pop()
    page.setData({
      'popup.show': false
    })
  },
  onPopupConfirm: function (e) {
    let page = getCurrentPages().pop()
    page.setData({
      'popup.show': false
    })
    this.onPopupConfirm && this.onPopupConfirm()
  }
}

export class Popup {
  constructor(options = {}) {
    let page = getCurrentPages().pop()
    options = Object.assign({}, defaults, options)
    this.onPopupConfirm = options.onPopupConfirm

    page.setData({
      'popup.show': false,
    })
    for (let key in methods) {
      page['popup.' + key] = methods[key].bind(this)
      page.setData({
        ['popup.' + key]: 'popup.' + key
      })
    }
  }

  show() {
    let page = getCurrentPages().pop()
    page.setData({
      'popup.show': true
    })
  }
}