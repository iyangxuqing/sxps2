import { Item } from '../../../utils/items.js'
import { Trade } from '../../../utils/trades.js'

let app = getApp()

Page({

  data: {
    youImageMode_v2: app.youImageMode_v2,
  },

  loadData: function (options) {
    Promise.all([
      Item.getItems(),
      Trade.getTrades_buyer_v3(),
    ]).then(function (res) {
      let items = res[0]
      let trades = res[1]
      for (let i in trades) {
        let trade = trades[i]
        let num = 0;
        let amount = 0;
        let realNum = 0;
        let realAmount = 0;
        for (let j in trade.orders) {
          let order = trade.orders[j]
          order.amount = (Number(order.num) * order.price).toFixed(2)
          order.realAmount = (Number(order.realNum) * order.price).toFixed(2)
          num = num + Number(order.num)
          amount = amount + Number(order.amount)
          realNum = realNum + Number(order.realNum)
          realAmount = realAmount + Number(order.realAmount)
        }
        trade.num = num
        trade.amount = amount.toFixed(2)
        trade.realNum = realNum
        trade.realAmount = realAmount.toFixed(2)
      }
      this.setData({
        trades,
        ready: true
      })
      options && options.success && options.success()
    }.bind(this))
  },

  onLoad: function () {

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
    this.loadData({
      success: function () {
        wx.stopPullDownRefresh()
      }
    })
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})