import { Item } from '../../../utils/items.js'
import { Shop } from '../../../utils/shop.js'

let app = getApp()

Page({

  data: {
    youImageMode_v5: app.youImageMode_v5
  },

  onItemNumberMinus: function (e) {
    let item = this.data.item
    if (item.num > item.minVol) {
      item.num--
    } else {
      item.num = 0
    }
    item.amount = Number(item.num * item.price).toFixed(2)
    this.setData({ item })
    this.setShopping()
  },

  onItemNumberPlus: function (e) {
    let item = this.data.item
    if (item.num < 9999) {
      item.num = Number(item.num) + 1
    }
    if (item.num < item.minVol) item.num = item.minVol
    item.amount = Number(item.num * item.price).toFixed(2)
    this.setData({ item })
    this.setShopping()
  },

  onItemNumberInput: function (e) {
    let num = e.detail.value
    let item = this.data.item
    if (num <= 0) {
      num = 0
    } else if (num < Number(item.minVol)) {
      num = item.minVol
    }
    item.num = num
    item.amount = Number(item.num * item.price).toFixed(2)
    this.setData({ item })
    this.setShopping()
  },

  onGotoBuy: function (e) {
    wx.switchTab({
      url: '../items/index',
    })
  },

  onGotoShoppings: function (e) {
    wx.switchTab({
      url: '../shopping/index',
    })
  },

  setShopping: function () {
    let item = this.data.item
    let shoppings = wx.getStorageSync('shoppings') || []
    let shopping = {
      iid: item.id,
      num: item.num
    }
    let index = -1
    for (let i in shoppings) {
      if (shoppings[i].iid == item.id) {
        shoppings[i] = shopping
        index = i
        break
      }
    }
    if (index < 0) shoppings.push(shopping)
    if (shopping.num == 0) shoppings.splice(index, 1)
    wx.setStorageSync('shoppings', shoppings)
    app.listener.trigger('shoppings')
    this.rotateShoppingTag()
  },

  rotateShoppingTag: function () {
    let item = this.data.item
    if (item.num == 0) {
      this.setData({
        shoppingTagRotate: ''
      })
      return
    }
    let shoppingTagRotate = this.data.shoppingTagRotate
    if (shoppingTagRotate) return
    let degrees = []
    degrees[0] = 10 + Math.random() * 20
    degrees[1] = 150 + Math.random() * 20
    degrees[2] = 190 + Math.random() * 20
    degrees[3] = 330 + Math.random() * 20
    let index = Math.floor(Math.random() * 4)
    this.setData({
      shoppingTagRotate: degrees[index]
    })
  },

  onLoad: function (options) {
    let id = options.id
    let item = {}
    let seller = {}
    Promise.all([
      Item.getItems(),
      Shop.getShops(),
    ]).then(function (res) {
      let items = res[0]
      let shops = res[1]
      for (let i in items) {
        if (items[i].id == id) {
          item = items[i]
          item.num = 0
          item.amount = 0
          break
        }
      }
      let sid = item.sid
      for (let i in shops) {
        if (shops[i].id == sid) {
          seller = shops[i]
          break
        }
      }

      wx.setNavigationBarTitle({
        title: item.title,
      })

      let shoppings = wx.getStorageSync('shoppings')
      for (let i in shoppings) {
        if (shoppings[i].iid == item.id) {
          item.num = shoppings[i].num
          item.amount = Number(item.num * item.price).toFixed(2)
          break
        }
      }

      this.setData({
        item: item,
        seller: seller,
        ready: true,
      })
      this.rotateShoppingTag()
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