import { Item } from '../../../utils/items.js'

let app = getApp()

Page({

  data: {
    youImageMode_v5: app.youImageMode_v5,
    note: {
      title: '老菜农蔬菜批发',
      phone: '0579-86633138',
      address: '东阳市吴宁中路38号'
    }
  },

  onItemNumberMinus: function (e) {
    let item = this.data.item
    if (item.num > 0) {
      item.num--
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
    item.amount = Number(item.num * item.price).toFixed(2)
    this.setData({ item })
    this.setShopping()
  },

  onItemNumberInput: function (e) {
    let num = e.detail.value
    let item = this.data.item
    if (num <= 0) {
      num = 0
    }
    item.num = parseInt(num)
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
    Item.getItems().then(function (items) {
      let item = {}
      for (let i in items) {
        if (items[i].id == id) {
          item = items[i]
          item.num = 0
          item.amount = Number(0).toFixed(2)
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