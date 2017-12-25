import { Search } from '../../../template/search/search.js'
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
  },

  onSearchWordPicker: function (pickerWord) {
    this.tradeStatus = pickerWord.value
    wx.setStorageSync('sellerTradeStatus', this.tradeStatus)
    this.lastRowId = 0
    this.loadTrades()
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
    let status = e.currentTarget.dataset.status
    if (status != '买家提交') return
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
    this.orderDetail.show(order)
  },

  onOrderUpdated: function (order) {
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

  onTradeOperate: function (e) {
    let tid = e.currentTarget.dataset.tid
    let oldStatus = e.currentTarget.dataset.status
    let newStatus = ''
    let tip1 = ''
    let tip2 = ''
    if (oldStatus == '买家提交') {
      newStatus = '卖家发货'
      tip1 = '确定将该笔订单发货吗？发货前应当仔细核对订单的发货地址、所发货品和数量的正确无误。'
      tip2 = '发货成功，可以前去已发货订单中查看该笔订单。'
    } else if (oldStatus == '卖家发货') {
      newStatus = '买家收货'
      tip1 = '确定要把该笔订单设置为买家已收货吗？应当在商品送达并与买家核对无误后再进行设置。'
      tip2 = '设置为买家已收货成功，可以前去“已收货”订单中查看该笔订单。'
    } else if (oldStatus == '买家收货') {
      newStatus = '订单完成'
      tip1 = '确定要把该笔订单设置为订单已完成吗？应当在收到买家付款后才可以把订单设置为已完成。'
      tip2 = '设置为订单已完成成功，可以前去“已完成”订单中查看该笔订单。'
    }
    wx.showModal({
      title: '订单管理',
      content: tip1,
      success: function (res) {
        if (res.confirm) {
          Trade.setTrades_seller_v4({
            tid: tid,
            status: newStatus
          }).then(function (res) {
            if (res.errno === 0) {
              wx.showModal({
                title: '订单管理',
                content: tip2,
                showCancel: false,
                success: function (res) {
                  let trades = this.data.trades
                  for (let i in trades) {
                    if (trades[i].id == tid) {
                      trades.splice(i, 1)
                      break
                    }
                  }
                  this.setData({
                    trades: trades
                  })
                }.bind(this)
              })
            }
          }.bind(this))
        }
      }.bind(this)
    })
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

    this.startTime = startDate.getTime()
    this.endTime = endDate.getTime()
    this.tradeStatus = wx.getStorageSync('sellerTradeStatus')
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
      orderUpdated: this.onOrderUpdated
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