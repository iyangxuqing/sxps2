let defaults = {

}

let methods = {

  onMinusTap: function (e) {
    let page = getCurrentPages().pop()
    let order = page.data.orderDetail.order
    if (order.realNum > 0) {
      order.realNum--
    }
    if (order.realNum < 0) {
      order.realNum = 0
    }
    page.setData({
      'orderDetail.order': order
    })
  },

  onRealNumInput: function (e) {
    let realNum = e.detail.value
    let page = getCurrentPages().pop()
    let order = page.data.orderDetail.order
    if (realNum >= 0 && realNum < 9999) {
      order.realNum = realNum
    } else {
      order.realNum = order.num
    }
    page.setData({
      'orderDetail.order': order
    })
  },

  onPlusTap: function (e) {
    let page = getCurrentPages().pop()
    let order = page.data.orderDetail.order
    if (order.realNum < 9999) {
      order.realNum++
    }
    if (order.realNum >= 9999) {
      order.realNum = 9999
    }
    page.setData({
      'orderDetail.order': order
    })
  },

  onCancel: function (e) {
    let page = getCurrentPages().pop()
    page.setData({
      'orderDetail.popup.show': false
    })
  },

  onConfirm: function (e) {
    let page = getCurrentPages().pop()
    let order = page.data.orderDetail.order
    page.setData({
      'orderDetail.popup.show': false,
    })
    this.orderUpdated && this.orderUpdated(order)
  },

}

export class OrderDetail {

  constructor(options = {}) {
    let page = getCurrentPages().pop()
    options = Object.assign({}, defaults, options)
    this.orderUpdated = options.orderUpdated
    page.setData({
      'orderDetail.popup.show': false,
    })
    for (let key in methods) {
      page['orderDetail.' + key] = methods[key].bind(this)
      page.setData({
        ['orderDetail.' + key]: 'orderDetail.' + key
      })
    }
  }

  show(order) {
    let page = getCurrentPages().pop()
    order.price = Number(order.price).toFixed(2)
    if (order.realNum === '') order.realNum = order.num
    page.setData({
      'orderDetail.order': order,
      'orderDetail.popup.show': true,
    })
  }

}