import { http } from '../../utils/http.js'
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
    let method = item.id ? 'update' : 'insert'
    Item.setItem_seller(item, method)
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

  onItemImageTap: function (e) {
    let page = getCurrentPages().pop()
    http.chooseImage().then(function (image) {
      this.item.images = [image]
      page.setData({
        'itemDetail.item.images': [image]
      })
    }.bind(this))
  }

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