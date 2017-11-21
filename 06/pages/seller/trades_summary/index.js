import { DateTimes } from '../../../template/datetimes/datetimes.js'
import { Trade } from '../../../utils/trades.js'

Page({

  data: {

  },

  onSearch: function (options) {
    this.setData({
      startTime: options.time1,
      endTime: options.time2,
    })
    this.loadTrades()
  },

  loadTrades: function (options = {}) {
    let startTime = this.data.startTime / 1000
    let endTime = this.data.endTime / 1000
    Trade.getTradesSummary_seller({
      startTime: startTime,
      endTime: endTime,
    }).then(function (orders) {
      this.setData({
        trades: orders
      })
      options.success && options.success(orders)
    }.bind(this))
  },

  onLoad: function (options) {
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