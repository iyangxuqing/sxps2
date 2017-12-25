import { Item } from '../../utils/items.js'

let defaults = {}

let methods = {

  onItemTap: function (e) {
    let page = getCurrentPages().pop()
    let id = e.currentTarget.dataset.id
    let item = {}
    let items = page.data.items.items
    for (let i in items) {
      if (items[i].id == id) {
        item = items[i]
        break
      }
    }
    this.itemTap && this.itemTap(item)
  },

  onItemLongPress: function (e) {
    let page = getCurrentPages().pop()
    let id = e.currentTarget.dataset.id
    let item = {}
    let items = page.data.items.items
    for (let i in items) {
      if (items[i].id == id) {
        item = items[i]
        break
      }
    }
    page.setData({
      'items.editor.item': item,
      'items.editor.show': true,
    })
  },

  onEditorSortUp: function (e) {
    let page = getCurrentPages().pop()
    let item = page.data.items.editor.item
    Item.setItem_seller(item, 'sortUp')
    this.onEditorCancel()
  },

  onEditorSortDown: function (e) {
    let page = getCurrentPages().pop()
    let item = page.data.items.editor.item
    Item.setItem_seller(item, 'sortDown')
    this.onEditorCancel()
  },

  onEditorOnShelf: function (e) {
    let page = getCurrentPages().pop()
    let item = page.data.items.editor.item
    item.onShelf = item.onShelf == 0 ? 1 : 0
    Item.setItem_seller({ id: item.id, onShelf: item.onShelf }, 'update')
    this.onEditorCancel()
  },

  onEditorInsertAfter: function (e) {
    let page = getCurrentPages().pop()
    let item = page.data.items.editor.item
    let sort = Number(item.sort) + 1
    this.itemTap && this.itemTap({ sort: Number(item.sort) + 1 })
    this.onEditorCancel()
  },

  onEditorDelete: function (e) {
    wx.showModal({
      title: '类目管理',
      content: '确定要删除该商品吗？删除后将不可恢复。',
      success: function (res) {
        if (res.confirm) {
          let page = getCurrentPages().pop()
          let item = page.data.items.editor.item
          Item.setItem_seller(item, 'delete')
        }
      },
      complete: function (res) {
        this.onEditorCancel()
      }.bind(this)
    })
  },

  onEditorCancel: function (e) {
    let page = getCurrentPages().pop()
    let items = page.data.items.items
    for (let i in items) {
      items[i].editing = false
    }
    page.setData({
      'items.items': items,
      'items.editor.show': false,
    })
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

}