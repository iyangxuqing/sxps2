import { Item } from '../../../utils/items.js'
import { Trade } from '../../../utils/trades.js'

let app = getApp()

Page({

  data: {
    youImageMode_v2: app.youImageMode_v2
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
    let num = parseInt(e.detail.value || 0)
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
    wx.showModal({
      title: '订单提交',
      content: '　　确定把购物车中的商品进行提交吗？',
      success: function (res) {
        if (res.confirm) {
          let orders = this.data.orders
          Trade.addTrade_buyer_v3(orders).then(function () {
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
        let oldNum = orders[i].num
        if (options.inc) {
          if (orders[i].num < 9999) orders[i].num++
        } else if (options.dec) {
          if (orders[i].num > 0) orders[i].num--
        } else if ('num' in options) {
          orders[i].num = options.num
        }
        console.log(orders[i].num)
        if (orders[i].num == 0) {
          wx.showModal({
            title: '购物车',
            content: '购买数量为0将从购物车中删除这个商品，确定要删除这个商品吗？',
            success: function (res) {
              if (res.confirm) {
                orders.splice(i, 1)
              } else {
                orders[i].num = oldNum
              }
              let shoppings = []
              for (let j in orders) {
                shoppings.push({
                  iid: orders[j].iid,
                  num: orders[j].num
                })
              }
              this.setData({ orders })
              this.refreshSummary()
              wx.setStorageSync('shoppings', shoppings)
              app.listener.trigger('shoppings')
            }.bind(this)
          })
        } else {
          let shoppings = []
          for (let j in orders) {
            shoppings.push({
              iid: orders[j].iid,
              num: orders[j].num
            })
          }
          this.setData({ orders })
          this.refreshSummary()
          wx.setStorageSync('shoppings', shoppings)
          app.listener.trigger('shoppings')
        }
        break
      }
    }
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

  onShoppingsUpdate: function () {
    this.loadData()
  },

  onLoad: function (options) {
    app.listener.on('shoppings', this.onShoppingsUpdate)
    this.loadData()
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