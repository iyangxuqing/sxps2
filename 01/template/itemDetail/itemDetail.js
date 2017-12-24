import { Item } from '../../utils/items.js'

let defaults = {}

let methods = {

  onItemDetailCancel: function (e) {
    let page = getCurrentPages().pop()
    page.setData({
      'itemDetail.show': false
    })
  },

  onItemDetailConfirm: function (e) {
    let page = getCurrentPages().pop()
    let item = this.item
    page.setData({
      'itemDetail.show': false
    })
    Item.setItem_seller(item, 'update')
  },

  onItemTitleInput: function (e) {
    this.item.title = e.detail.value
  },

  onItemDescsInput: function (e) {
    this.item.descs = e.detail.value
  },

  onItemPriceInput: function (e) {
    this.item.price = e.detail.value
  },

}

export class ItemDetail {

  constructor(options = {}) {
    let page = getCurrentPages().pop()
    options = Object.assign({}, defaults, options)
    for (let key in methods) {
      this[key] = methods[key].bind(this)
      page['itemDetail.' + key] = methods[key].bind(this)
      page.setData({
        ['itemDetail.' + key]: 'itemDetail.' + key
      })
    }
  }

  show(item) {
    let page = getCurrentPages().pop()
    this.item = JSON.parse(JSON.stringify(item))
    page.setData({
      'itemDetail.item': item,
      'itemDetail.show': true,
    })
  }

}