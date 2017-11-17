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
    let trades = this.data.trades
    let distributedOrders = wx.getStorageSync('distributedOrders') || []
    let index = -1
    for (let i in distributedOrders) {
      if (distributedOrders[i].id == id) {
        index = i
        break
      }
    }
    if (index < 0) {
      index = distributedOrders.length
      distributedOrders.push({
        id: id
      })
    }
    distributedOrders[index].realNum = order.realNum
    wx.setStorageSync('distributedOrders', distributedOrders)

    for (let i in trades) {
      if (trades[i].id == tid) {
        for (let j in trades[i].orders) {
          if (trades[i].orders[j].id == id) {
            trades[i].orders[j].realNum = order.realNum
            break
          }
        }
        let finished = true
        for (let j in trades[i].orders) {
          if (trades[i].orders[j].realNum === '') {
            finished = false
            break
          }
        }
        if (finished) {
          trades[i].distributed = true
        }
        break
      }
    }
    this.setData({
      trades: trades
    })
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
        if (res.tapIndex === 0) {
          this.saveTrades(trade)
        } else if (res.tapIndex === 1) {
          this.saveTrades(trades)
        }
      }.bind(this),
    })
  },

  saveTrades: function (trades) {
    if (!('length' in trades)) trades = [trades]
    let savedTrades = []
    let orders = []
    for (let i in trades) {
      if (!trades[i].distributed) continue
      savedTrades.push({
        id: trades[i].id,
      })
      for (let j in trades[i].orders) {
        orders.push({
          id: trades[i].orders[j].id,
          realNum: trades[i].orders[j].realNum,
          status: '卖家发货',
        })
      }
    }
    wx.showNavigationBarLoading()
    Trade.setTrades_seller(orders).then(function (res) {
      let distributedOrders = wx.getStorageSync('distributedOrders') || []
      for (let i in orders) {
        for (let j in distributedOrders) {
          if (orders[i].id == distributedOrders[j].id) {
            distributedOrders.splice(j, 1)
            break
          }
        }
      }
      wx.setStorageSync('distributedOrders', distributedOrders)
      for (let i in orders) {
        for (let j in this.orders) {
          if (orders[i].id == this.orders[j].id) {
            this.orders.splice(j, 1)
            break
          }
        }
      }
      let pageTrades = Trade.getBuyerTrades(this.orders)
      this.setData({ trades: pageTrades })
      wx.hideNavigationBarLoading()
    }.bind(this)).catch(function (res) {
      wx.hideNavigationBarLoading()
    })
  },

  loadTrades: function (options = {}) {
    let startTime = this.data.startTime / 1000
    let endTime = this.data.endTime / 1000
    let orders = []
    let lastRowId = 0
    if (options.noRefresh) {
      orders = this.orders || []
      if (orders.length) lastRowId = orders[orders.length - 1].id
    }
    wx.showNavigationBarLoading()
    Trade.getTrades_seller_v3({
      startTime: startTime,
      endTime: endTime,
      status: '买家提交',
      lastRowId: lastRowId,
    }).then(function (res) {
      orders = orders.concat(res.orders)
      this.orders = orders
      let distributedOrders = wx.getStorageSync('distributedOrders') || []
      for (let i in orders) {
        for (let j in distributedOrders) {
          if (orders[i].id == distributedOrders[j].id) {
            orders[i].realNum = distributedOrders[j].realNum
          }
        }
      }
      let trades = Trade.getBuyerTrades(orders)
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

  },

  onReachBottom: function () {
    this.loadTrades({
      noRefresh: true
    })
  },

  onShareAppMessage: function () {

  }

})