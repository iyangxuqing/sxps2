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

  onItemsUpdate: function (_items) {
    let cid = this.cid
    let items = []
    for (let i in _items) {
      if (_items[i].cid == cid) {
        items.push(_items[i])
      }
    }
    this.setData({
      'itemsGrid.items': items
    })
  },

  onLoad: function (options) {
    app.listener.on('items', this.onItemsUpdate)
    let cid = options.cid
    this.cid = options.cid
    Cate.getCates().then(function (cates) {
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
    })

    Item.getItems().then(function (_items) {
      let items = []
      for (let i in _items) {
        if (_items[i].cid == cid) {
          items.push(_items[i])
        }
      }
      this.itemsGrid = new itemsGrid({
        items: items,
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
    Item.getItems({
      nocache: true
    }).then(function (_items) {
      let items = []
      for (let i in _items) {
        if (_items[i].cid == cid) {
          items.push(_items[i])
        }
      }
      this.itemsGrid = new itemsGrid({
        items: items,
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