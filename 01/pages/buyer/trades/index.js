import { Topnavs } from '../../../template/topnavs/topnavs.js'
import { Item } from '../../../utils/items.js'
import { Trade } from '../../../utils/trades.js'

let app = getApp()

Page({

  data: {
    youImageMode_v2: app.youImageMode_v2,
  },

  onTopnavTap: function (index, item) {
    this.loadData()
  },

  /**
   * 在买家提交购物车中的订单时，买家的订单数据会发生变化，
   * 这时需要客户端主动刷新请求订单数据
   */
  onTradesUpdate: function (e) {
    this.loadData({ nocache: true })
  },

  loadData: function (options = {}) {
    Trade.getTrades_buyer_v4(options).then(function (trades) {
      let status = this.topnavs.getActiveItem().status
      let _trades = []
      for (let i in trades) {
        if (trades[i].status == status || !status) {
          _trades.push(trades[i])
        }
      }
      this.setData({
        trades: _trades,
        ready: true
      })
      options.success && options.success()
    }.bind(this))
  },

  onLoad: function () {
    app.listener.on('trades', this.onTradesUpdate)
    this.topnavs = new Topnavs({
      items: [{
        title: '全部',
        status: '',
      }, {
        title: '待发货',
        status: '买家提交',
      }, {
        title: '已发货',
        status: '卖家发货',
      }, {
        title: '已收货',
        status: '买家收货',
      }, {
        title: '已完成',
        status: '订单完成',
      }],
      onTopnavTap: this.onTopnavTap
    })
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
    this.loadData({
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