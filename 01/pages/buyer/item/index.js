import { Item } from '../../../utils/items.js'
import { Shop } from '../../../utils/shop.js'

let app = getApp()

Page({

  data: {
    youImageMode_v5: app.youImageMode_v5
  },

  onItemNumberMinus: function (e) {
    let item = this.data.item
    let shopping = this.data.shopping
    if (shopping.num > item.minVol) {
      shopping.num--
    } else {
      shopping.num = 0
    }
    shopping.amount = Number(shopping.num * item.price).toFixed(2)
    this.addShopping(shopping)
  },

  onItemNumberPlus: function (e) {
    let item = this.data.item
    let shopping = this.data.shopping
    if (shopping.num < 9999) {
      shopping.num = Number(shopping.num) + 1
    }
    if (shopping.num < item.minVol) shopping.num = item.minVol
    shopping.amount = Number(shopping.num * item.price).toFixed(2)
    this.addShopping(shopping)
  },

  onItemNumberInput: function (e) {
    let num = e.detail.value
    let item = this.data.item
    let shopping = this.data.shopping
    if (num <= 0) {
      num = 0
    } else if (num < Number(item.minVol)) {
      num = item.minVol
    }
    shopping.num = num
    shopping.amount = Number(shopping.num * item.price).toFixed(2)
    this.addShopping(shopping)
  },

  onGotoBuy: function (e) {
    wx.navigateBack()
  },

  onGotoShoppings: function (e) {

  },

  addShopping: function (shopping) {
    let oldShopping = this.data.shopping
    console.log(oldShopping)
    let shoppings = wx.getStorageSync('shoppings') || []
    let index = -1
    for (let i in shoppings) {
      if (shoppings[i].iid == shopping.iid) {
        shoppings[i] = shopping
        index = i
        break
      }
    }
    if (index < 0) shoppings.push(shopping)
    if (shopping.num == 0) shoppings.splice(index, 1)
    wx.setStorageSync('shoppings', shoppings)

    this.setData({ shopping })
    this.rotateShoppingTag()
    app.listener.trigger('shoppings')
  },

  rotateShoppingTag: function () {
    let shopping = this.data.shopping
    let shoppingTagRotate = this.data.shoppingTagRotate
    if (shoppingTagRotate && shopping.num) return
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

      let shopping = {
        iid: item.id,
        price: item.price,
        num: 0,
        amount: 0,
      }
      let shoppings = wx.getStorageSync('shoppings') || []
      for (let i in shoppings) {
        if (shoppings[i].iid == id) {
          shopping = shoppings[i]
        }
      }
      shopping.price = item.price
      shopping.amount = Number(shopping.price * shopping.num).toFixed(2)

      this.setData({
        item: item,
        seller: seller,
        shopping: shopping,
        ready: true,
      })
      this.rotateShoppingTag()
    }.bind(this))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})