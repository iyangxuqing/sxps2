import { Search } from '../../../template/search/search.js'
import { Distribute } from '../../../template/distribute/distribute.js'
import { OrderDetail } from '../../../template/orderDetail/orderDetail.js'
import { Trade } from '../../../utils/trades.js'

let app = getApp()

let tradeStatuses = [{
  title: '已提交',
  value: '买家提交',
}, {
  title: '已发货',
  value: '卖家发货',
}, {
  title: '已收货',
  value: '买家收货',
}, {
  title: '已完成',
  value: '订单完成',
}]

Page({

  data: {
    youImageMode_v2: app.youImageMode_v2,
    youImageMode_v5: app.youImageMode_v5,
  },

  onSearchWordPicker: function (pickerWord) {
    this.tradeStatus = pickerWord.value
    wx.setStorageSync('tradeStatus', this.tradeStatus)
  },

  onSearchCancel: function () {
    this.searchWord = ''
  },

  onSearch: function (search) {
    this.startTime = search.time1
    this.endTime = search.time2
    this.searchWord = search.searchWord
    this.status = search.pickerWord.value
    this.lastRowId = 0
    this.loadTrades()
  },

  onOrderTap: function (e) {
    let tid = e.currentTarget.dataset.tid
    let oid = e.currentTarget.dataset.oid
    console.log(tid, oid)
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
    console.log(order)
    this.orderDetail.show(order)
  },

  loadTrades: function (options) {
    let search = {
      startTime: this.startTime / 1000,
      endTime: this.endTime / 1000,
    }
    if (this.tradeStatus) search.status = this.tradeStatus
    if (this.searchWord) search.searchWord = this.searchWord
    if (typeof this.lastRowId != 'undefined') search.lastRowId = this.lastRowId
    Trade.getTrades_seller_v4(search).then(function (trades) {
      if (this.lastRowId) {
        trades = this.data.trades.concat(trades)
      }
      this.setData({
        trades: trades,
        ready: true,
      })
    }.bind(this))
  },

  onLoad: function (options) {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()
    let hour = date.getHours()
    let startDate = new Date(year, month, day)
    if (hour < 10) startDate = new Date(startDate.getTime() - 86400000)
    let endDate = new Date(startDate.getTime() + 86400000)
    startDate = new Date(2017, 11, 1)

    this.startTime = startDate.getTime()
    this.endTime = endDate.getTime()
    this.tradeStatus = wx.getStorageSync('tradeStatus')
    for (let i in tradeStatuses) {
      tradeStatuses[i].active = false
      if (tradeStatuses[i].value == this.tradeStatus) {
        tradeStatuses[i].active = true
      }
    }
    this.search = new Search({
      date1: startDate,
      date2: endDate,
      pickerWords: tradeStatuses,
      search: this.onSearch,
      searchCancel: this.onSearchCancel,
      searchWordPicker: this.onSearchWordPicker,
    })
    this.orderDetail = new OrderDetail({

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
    let trades = this.data.trades
    this.lastRowId = trades[trades.length - 1].id
    this.loadTrades()
  },

  onShareAppMessage: function () {

  }
})