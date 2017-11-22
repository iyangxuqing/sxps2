import { DateTimes } from '../../../template/datetimes/datetimes.js'
import { Trade } from '../../../utils/trades.js'

Page({

  data: {

  },

  onSearch: function (options) {
    this.startTime = options.time1 / 1000
    this.endTime = options.time2 / 1000
    this.loadTrades({
      nocache: true,
    })
  },

  loadTrades: function (options = {}) {
    options.status = '买家提交'
    options.startTime = this.startTime
    options.endTime = this.endTime
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
    this.startTime = startDate.getTime() / 1000
    this.endTime = endDate.getTime() / 1000
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