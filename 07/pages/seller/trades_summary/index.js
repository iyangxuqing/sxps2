import { DateTimes } from '../../../template/datetimes/datetimes.js'
import { Trade } from '../../../utils/trades.js'

let app = getApp()

Page({

  data: {
    youImageMode_v2: app.youImageMode_v2
  },

  onSearch: function (options) {
    this.startTime = options.time1
    this.endTime = options.time2
    this.loadTrades({
      nocache: true,
    })
  },

  loadTrades: function (options = {}) {
    options.startTime = this.startTime / 1000
    options.endTime = this.endTime / 1000
    Trade.getTrades_seller_v4(options).then(function (trades) {
      let items = []
      for (let i in trades) {
        for (let j in trades[i].orders) {
          let order = trades[i].orders[j]
          let iid = order.iid
          let index = -1
          for (let k in items) {
            if (items[k].iid == iid) {
              index = k
              break
            }
          }
          if (index < 0) {
            index = items.length
            items.push({
              iid: iid,
              title: order.title,
              image: order.image,
              descs: order.descs,
              price: order.price,
              num: 0,
              realNum: 0,
            })
          }
          items[index].num += Number(order.num)
          items[index].realNum += Number(order.realNum)
        }
      }
      for (let i in items) {
        items[i].num = Number(items[i].num).toFixed(2)
        items[i].realNum = Number(items[i].realNum).toFixed(2)
        items[i].underNum = Number(items[i].num - items[i].realNum).toFixed(2)
      }
      this.setData({
        items: items,
        ready: true,
      })
      options.success && options.success(items)
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
    this.startTime = startDate.getTime()
    this.endTime = endDate.getTime()
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
      nocache: true,
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