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
    this.startTime = options.time1
    this.endTime = options.time2
    this.loadTrades()
  },

  onOrderTap: function (e) {
    let tid = e.currentTarget.dataset.tid
    let oid = e.currentTarget.dataset.oid
    let trades = this.data.trades
    let order = {}
    for (let i in trades) {
      if (trades[i].id == tid) {
        for (let j in trades[i].orders) {
          if (trades[i].orders[j].id == oid) {
            order = trades[i].orders[j]
            order.tid = tid
            break
          }
        }
        break
      }
    }
    this.distribute.show(order)
  },

  onDistributed: function (order) {
    let id = order.id
    let tid = order.tid
    Trade.setTrades_seller_v4({
      oid: id,
      realNum: order.realNum
    }).then(function (res) {
      let trades = this.data.trades
      for (let i in trades) {
        if (trades[i].id == tid) {
          for (let j in trades[i].orders) {
            if (trades[i].orders[j].id == id) {
              trades[i].orders[j].realNum = order.realNum
              break
            }
          }
          trades[i].distributed = true
          for (let j in trades[i].orders) {
            if (trades[i].orders[j].realNum === '') {
              trades[i].distributed = false
              break
            }
          }
          break
        }
      }
      this.setData({
        trades: trades
      })
    }.bind(this))
  },

  onTradeTap: function (e) {
    let tid = e.currentTarget.dataset.tid
    let trades = this.data.trades
    let trade = {}
    for (let i in trades) {
      if (trades[i].id == tid) {
        trade = trades[i]
        break
      }
    }
    if (!trade.distributed) return

    wx.showActionSheet({
      itemList: ['将当前点击的订单发货', '将所有配好的订单发货'],
      success: function (res) {
        let _trades = []
        if (res.tapIndex === 0) {
          _trades.push({
            tid: tid,
            status: '卖家发货'
          })
        } else if (res.tapIndex === 1) {
          for (let i in trades) {
            if (trades[i].distributed) {
              _trades.push({
                tid: trades[i].id,
                status: '卖家发货'
              })
            }
          }
        }
        Trade.setTrades_seller_v4(_trades).then(function (res) {
          for (let i in _trades) {
            for (let j in trades) {
              if (_trades[i].tid == trades[j].id) {
                trades.splice(j, 1)
                break
              }
            }
          }
          this.setData({
            trades: trades
          })
        }.bind(this))
      }.bind(this),
    })
  },

  loadTrades: function (options = {}) {
    let startTime = this.startTime
    let endTime = this.endTime
    let trades = []
    let lastRowId = 0
    if (options.noRefresh) {
      trades = this.data.trades || []
      if (trades.length) lastRowId = trades[trades.length - 1].id
    }
    wx.showNavigationBarLoading()
    Trade.getTrades_seller_v4({
      startTime: startTime / 1000,
      endTime: endTime / 1000,
      status: '买家提交',
      lastRowId: lastRowId,
    }).then(function (_trades) {
      trades = trades.concat(_trades)
      for (let i in trades) {
        trades[i].distributed = true
        for (let j in trades[i].orders) {
          if (trades[i].orders[j].realNum === '') {
            trades[i].distributed = false
            break
          }
        }
      }
      this.setData({
        trades: trades,
        ready: true,
      })
      options.success && options.success(trades)
      wx.hideNavigationBarLoading()
    }.bind(this)).catch(function (res) {
      wx.hideNavigationBarLoading()
    })
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

  },

  onReachBottom: function () {
    this.loadTrades({
      noRefresh: true
    })
  },

  onShareAppMessage: function () {

  }

})