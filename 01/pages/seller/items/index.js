import { itemsGrid } from '../../../template/itemsGrid/index.js'
import { Cate } from '../../../utils/cates.js'
import { Item } from '../../../utils/items.js'

let app = getApp()

Page({

  data: {
    youImageMode: app.youImageMode_v2,
  },

  onItemTap: function (item) {
    wx.navigateTo({
      url: '../item/index?id=' + item.id + '&cid=' + this.cid,
    })
  },

  onItemDel: function (item) {
    Item.delItem(item)
  },

  onItemSort: function (items, item1, item2) {
    Item.sortItems(items, item1, item2)
  },

  onItemsUpdate: function (items) {
    let cid = this.cid
    let _items = []
    for (let i in items) {
      if (items[i].cid == cid) {
        _items.push(items[i])
      }
    }
    this.setData({
      'itemsGrid.items': _items
    })
  },

  onLoad: function (options) {
    app.listener.on('items', this.onItemsUpdate)
    let cid = options.cid
    this.cid = options.cid
    Promise.all([
      Cate.getCates(),
      Item.getItems(),
    ]).then(function (res) {
      let cates = res[0]
      let items = res[1]

      let cateTitle = ''
      let childCateTitle = ''
      for (let i in cates) {
        for (let j in cates[i].children) {
          if (cates[i].children[j].id == cid) {
            cateTitle = cates[i].title
            childCateTitle = cates[i].children[j].title
            wx.setNavigationBarTitle({
              title: childCateTitle
            })
            break
          }
        }
        if (cateTitle) break
      }

      let _items = []
      for (let i in items) {
        if (items[i].cid == cid) {
          _items.push(items[i])
        }
      }
      this.itemsGrid = new itemsGrid({
        items: _items,
        onItemTap: this.onItemTap,
        onItemDel: this.onItemDel,
        onItemSort: this.onItemSort
      })
      this.setData({
        ready: true
      })
    }.bind(this))
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onPullDownRefresh: function () {
    let cid = this.cid
    Item.getItems({ nocache: true }).then(function (items) {
      let _items = []
      for (let i in items) {
        if (items[i].cid == cid) {
          _items.push(items[i])
        }
      }
      this.itemsGrid = new itemsGrid({
        items: _items,
        onItemTap: this.onItemTap,
        onItemDel: this.onItemDel,
        onItemSort: this.onItemSort
      })
      this.setData({
        ready: true
      })
      wx.stopPullDownRefresh()
    }.bind(this))
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})