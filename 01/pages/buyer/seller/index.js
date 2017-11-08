import { Shop } from '../../../utils/shop.js'
import { Item } from '../../../utils/items.js'

let app = getApp()

Page({

  data: {
    youImageMode_v2: app.youImageMode_v2,
    youImageMode_v5: app.youImageMode_v5,
  },

  onItemTap: function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../item/index?id=' + id,
    })
  },

  onShoppingsUpdate: function () {
    let shoppings = wx.getStorageSync('shoppings')
    let items = this.data.items
    for (let i in items) {
      items[i].num = 0
      for (let j in shoppings) {
        if (items[i].id == shoppings[j].iid) {
          items[i].num = shoppings[j].num
          break
        }
      }
    }
    this.setData({ items })
  },

  onLoad: function (options) {
    app.listener.on('shoppings', this.onShoppingsUpdate)
    let id = options.id
    Promise.all([
      Shop.getShops(),
      Item.getItems(),
    ]).then(function (res) {
      let shops = res[0]
      let _items = res[1]
      let seller = {}
      let items = []
      for (let i in shops) {
        if (shops[i].id == id) {
          seller = shops[i]
          break
        }
      }
      for (let i in _items) {
        if (_items[i].sid == id) {
          items.push(_items[i])
        }
      }
      let shoppings = wx.getStorageSync('shoppings')
      for (let i in items) {
        for (let j in shoppings) {
          if (items[i].id == shoppings[j].iid) {
            items[i].num = shoppings[j].num
            break
          }
        }
      }
      wx.setNavigationBarTitle({
        title: seller.title,
      })
      this.setData({
        seller,
        items,
      })
    }.bind(this))
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})