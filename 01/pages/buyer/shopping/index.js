import { Item } from '../../../utils/items.js'
import { Trade } from '../../../utils/trades.js'

let app = getApp()

Page({

  data: {
    youImageMode_v2: app.youImageMode_v2
  },

  onOrderTap: function (e) {
    let iid = e.currentTarget.dataset.iid
    wx.navigateTo({
      url: '../item/index?id=' + iid,
    })
  },

  onMinusTap: function (e) {
    let iid = e.currentTarget.dataset.iid
    this.refreshOrders({
      iid: iid,
      dec: true,
    })
  },

  onPlusTap: function (e) {
    let iid = e.currentTarget.dataset.iid
    this.refreshOrders({
      iid: iid,
      inc: true,
    })
  },

  onNumBlur: function (e) {
    let iid = e.currentTarget.dataset.iid
    let num = e.detail.value
    this.refreshOrders({
      iid: iid,
      num: num,
    })
  },

  onGotoBuy: function (e) {
    wx.switchTab({
      url: '../items/index'
    })
  },

  onOrderSubmit: function (e) {
    let orders = this.data.orders
    wx.showModal({
      title: '订单提交',
      content: '　　确定把购物车中的商品进行提交吗？',
      success: function (res) {
        if (res.confirm) {
          Trade.addTrade_buyer({ orders }).then(function (res) {
            wx.showModal({
              title: '订单提交',
              content: '　　订单提交成功，将进入采买程序。',
              showCancel: false,
              success: function () {
                wx.removeStorageSync('shoppings')
                app.listener.trigger('shoppings')
                this.setData({ orders: [] })
                this.refreshSummary()
              }.bind(this)
            })
          }.bind(this))
        }
      }.bind(this)
    })
  },

  refreshOrders: function (options) {
    let iid = options.iid
    let orders = this.data.orders
    let shoppings = wx.getStorageSync('shoppings') || []
    for (let i in orders) {
      if (orders[i].iid == iid) {
        if (options.inc) {
          if (orders[i].num < Number(orders[i].maxVol)) orders[i].num++
        } else if (options.dec) {
          if (orders[i].num > Number(orders[i].minVol)) orders[i].num--
        } else if ('num' in options) {
          if (options.num < Number(orders[i].minVol)) options.num = orders[i].minVol
          if (options.num > Number(orders[i].maxVol)) options.num = orders[i].maxVol
          orders[i].num = options.num
        }
        for (let j in shoppings) {
          if (shoppings[j].iid == iid) {
            shoppings[j].num = orders[i].num
            break
          }
        }
        wx.setStorageSync('shoppings', shoppings)
        app.listener.trigger('shoppings')
        break
      }
    }
    this.setData({ orders })
    this.refreshSummary()
  },

  refreshSummary: function () {
    let orders = this.data.orders
    let zNum = 0;
    let zAmount = 0;
    for (let i in orders) {
      zNum = zNum + Number(orders[i].num)
      zAmount = zAmount + orders[i].num * orders[i].price
    }
    zAmount = Number(zAmount).toFixed(2)
    this.setData({
      zNum,
      zAmount,
    })
  },

  loadData: function () {
    let shoppings = wx.getStorageSync('shoppings')
    Item.getItems().then(function (items) {
      let orders = []
      for (let i in shoppings) {
        for (let j in items) {
          if (shoppings[i].iid == items[j].id) {
            let order = {
              iid: items[j].id,
              sid: items[j].sid,
              title: items[j].title,
              descs: items[j].descs,
              image: items[j].images[0],
              price: items[j].price,
              minVol: items[j].minVol,
              maxVol: items[j].volumn,
              num: shoppings[i].num,
              amount: Number(items[j].price * shoppings[i].num).toFixed(2)
            }
            orders.push(order)
            break
          }
        }
      }
      this.setData({ orders })
      this.refreshSummary()
    }.bind(this))
  },

  onLoad: function (options) {

  },

  onReady: function () {

  },

  onShow: function () {
    this.loadData()
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