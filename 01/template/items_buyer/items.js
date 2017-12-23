import { Item } from '../../utils/items.js'

let defaults = {}

let methods = {

  onItemTap: function (e) {
    let id = e.currentTarget.dataset.id
    let page = getCurrentPages().pop()
    let items = page.data.items.items
    let item = {}
    for (let i in items) {
      if (items[i].id == id) {
        item = items[i]
        break
      }
    }
    this.itemTap && this.itemTap(item)
  },

}

export class Items {

  constructor(options = {}) {
    let page = getCurrentPages().pop()
    options = Object.assign({}, defaults, options)
    this.itemTap = options.itemTap
    page.setData({
      'items.items': options.items
    })
    for (let key in methods) {
      this[key] = methods[key].bind(this)
      page['items.' + key] = methods[key].bind(this)
      page.setData({
        ['items.' + key]: 'items.' + key
      })
    }
  }

  update(items, fliter = {}) {
    let page = getCurrentPages().pop()
    let cid = fliter.cid
    let ids = fliter.ids
    let searchWord = fliter.searchWord
    let _items = []
    if (cid) {
      for (let i in items) {
        if (items[i].cid == cid) {
          _items.push(items[i])
        }
      }
    } else if (ids) {
      for (let i in items) {
        for (let j in ids) {
          if (items[i].id == ids[j].id) {
            _items.push(items[i])
            break
          }
          if (items[i].id == ids[j].iid) {
            items[i].num = ids[j].num
            _items.push(items[i])
            break
          }
        }
      }
    } else if (searchWord) {
      for (let i in items) {
        if (items[i].title.indexOf(searchWord) > -1) {
          _items.push(items[i])
        }
      }
    }
    let shoppings = wx.getStorageSync('shoppings')
    for (let i in _items) {
      for (let j in shoppings) {
        if (_items[i].id == shoppings[j].iid) {
          _items[i].num = shoppings[j].num
          _items[i].message = shoppings[j].message
          break
        }
      }
    }
    page.setData({
      'items.items': _items,
    })
  }

}