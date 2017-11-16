import { DateTimes } from '../../../template/datetimes/datetimes.js'
import { Distribute } from '../../../template/distribute/distribute.js'
import { Trade } from '../../../utils/trades.js'

let app = getApp()

Page({

  data: {
    youImageMode_v2: app.youImageMode_v2,
    youImageMode_v5: app.youImageMode_v5,
  },

  onSearch: function (options) {
    this.setData({
      startTime: options.time1,
      endTime: options.time2,
    })
    this.loadTrades()
  },

  onOrderTap: function (e) {
    let id = e.currentTarget.dataset.id
    let trades = this.data.trades
    let order = null
    for (let i in trades) {
      for (let j in trades[i].orders) {
        if (trades[i].orders[j].id == id) {
          order = trades[i].orders[j]
          break
        }
      }
      if (order) break
    }
    this.distribute.show(order)
  },

  onDistributed: function (order) {
    let id = order.id
    let trades = this.data.trades
    let finished = false
    for (let i in trades) {
      for (let j in trades[i].orders) {
        if (trades[i].orders[j].id == id) {
          trades[i].orders[j].realNum = order.realNum
          finished = true
          break
        }
      }
      if (finished) break
    }
    this.setData({
      trades: trades
    })
  },

  loadTrades: function (options = {}) {
    let startTime = this.data.startTime / 1000
    let endTime = this.data.endTime / 1000
    Trade.getTrades_seller_v3({
      startTime: startTime,
      endTime: endTime,
    }).then(function (orders) {
      this.orders = orders
      let trades = Trade.getBuyerTrades(orders)
      this.setData({
        trades,
      })
      options.success && options.success(trades)
    }.bind(this))
  },

  onLoad: function (options) {
    this.distribute = new Distribute({
      onDistributed: this.onDistributed
    })

    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()
    let hour = date.getHours()
    let startDate = new Date(year, month, day)
    if (hour < 10) {
      startDate = new Date(startDate.getTime() - 86400000)
    }
    let endDate = new Date(startDate.getTime() + 86400000)

    startDate = new Date(2017, 10, 10)
    endDate = new Date(2017, 10, 11)

    this.datetimes = new DateTimes({
      date1: startDate,
      date2: endDate,
      onSearch: this.onSearch
    })
    this.setData({
      startTime: startDate.getTime(),
      endTime: endDate.getTime(),
    })
    this.loadTrades()
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
    this.loadTrades({
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