let defaults = {

}

let methods = {

  onPopupClose: function (e) {
    let page = getCurrentPages().pop()
    page.setData({
      'distribute.popup.show': false
    })
  },

  onMinusTap: function (e) {
    let page = getCurrentPages().pop()
    let order = page.data.distribute.order
    if (order.realNum > 0) {
      order.realNum--
    }
    page.setData({
      'distribute.order': order
    })
  },

  onRealNumInput: function (e) {
    let realNum = e.detail.value
    let page = getCurrentPages().pop()
    let order = page.data.distribute.order
    if (realNum >= 0 && realNum < order.num * 2) {
      order.realNum = realNum
    } else {
      order.realNum = order.num
    }
    page.setData({
      'distribute.order': order
    })
  },

  onPlusTap: function (e) {
    let page = getCurrentPages().pop()
    let order = page.data.distribute.order
    if (order.realNum < order.num * 2) {
      order.realNum++
    }
    page.setData({
      'distribute.order': order
    })
  },

  onConfirm: function (e) {
    let page = getCurrentPages().pop()
    let order = page.data.distribute.order
    page.setData({
      'distribute.popup.show': false,
    })
    this.onDistributed && this.onDistributed(order)
  },

}

export class Distribute {

  constructor(options = {}) {
    let page = getCurrentPages().pop()
    options = Object.assign({}, defaults, options)
    this.onDistributed = options.onDistributed
    page.setData({
      'distribute.popup.show': false,
    })
    for (let key in methods) {
      page['distribute.' + key] = methods[key].bind(this)
      page.setData({
        ['distribute.' + key]: 'distribute.' + key
      })
    }
  }

  show(order) {
    let page = getCurrentPages().pop()
    order.price = Number(order.price).toFixed(2)
    if (order.realNum === '') order.realNum = order.num
    page.setData({
      'distribute.order': order,
      'distribute.popup.show': true,
    })
  }

}