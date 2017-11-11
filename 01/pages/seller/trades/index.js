import { Topnavs } from '../../../template/topnavs/topnavs.js'
import { Trade } from '../../../utils/trades.js'

let app = getApp()

Page({

  data: {
    youImageMode_v2: app.youImageMode_v2,
    youImageMode_v5: app.youImageMode_v5,
  },

  onDistributeTap: function (e) {
    let oid = e.currentTarget.dataset.oid
    let orders = this.orders
    let order = {}
    for (let i in orders) {
      if (orders[i].id == oid) {
        order = orders[i]
        break
      }
    }
    let distributeItem = {
      oid: oid,
      iid: order.iid,
      title: order.title,
      image: order.image,
      descs: order.descs,
      price: order.price,
      num: order.num,
      realNum: order.realNum || order.num
    }
    this.setData({
      distributeItem,
      'popup.show': true
    })
  },

  onPopupMaskTap: function (e) {
    this.setData({
      'popup.show': false
    })
  },

  onPopupClose: function (e) {
    this.setData({
      'popup.show': false
    })
  },

  onMinusTap: function (e) {
    let dItem = this.data.distributeItem
    if (dItem.realNum > 0) {
      dItem.realNum--
    }
    this.setData({
      distributeItem: dItem
    })
  },

  onRealNumInput: function (e) {
    let realNum = e.detail.value
    let dItem = this.data.distributeItem
    if (realNum >= 0 && realNum < dItem.num * 2) {
      dItem.realNum = realNum
    } else {
      dItem.realNum = dItem.num
    }
    this.setData({
      distributeItem: dItem
    })
  },

  onPlusTap: function (e) {
    let dItem = this.data.distributeItem
    if (dItem.realNum < dItem.num * 2) {
      dItem.realNum++
    }
    this.setData({
      distributeItem: dItem
    })
  },

  onRealNumConfirm: function (e) {
    let dItem = this.data.distributeItem
    let orders = this.orders
    for (let i in orders) {
      if (orders[i].id == dItem.oid) {
        orders[i].realNum = dItem.realNum
        break
      }
    }
    let itemTrades = Trade.getItemTrades(orders)
    let buyerTrades = Trade.getBuyerTrades(orders)
    this.setData({
      itemTrades,
      buyerTrades,
      'popup.show': false,
    })
  },

  onBuyerSelectChange: function (e) {
    let value = e.detail.value
    let bid = e.currentTarget.dataset.bid
    let orderBuyers = this.data.orderBuyers
    for (let i in orderBuyers) {
      if (orderBuyers[i].bid == bid) {
        orderBuyers[i].selected = value
      }
    }
    this.setData({
      orderBuyers
    })
  },

  onAllSelectChange: function (e) {
    let value = e.detail.value
    let orderBuyers = this.data.orderBuyers
    for (let i in orderBuyers) {
      orderBuyers[i].selected = value
    }
    this.setData({
      orderBuyers
    })
  },

  onDeliveryTap: function (e) {
    let orderBuyers = this.data.orderBuyers
    let selectedCount = 0;
    for (let i in orderBuyers) {
      if (orderBuyers[i].selected) {
        selectedCount++
        for (let j in orderBuyers[i].orders) {
          if (!('realNum' in orderBuyers[i].orders[j])) {
            let message = "收货人：" + orderBuyers[i].name + "，"
            message = message + "订单时间：" + orderBuyers[i].time + "，"
            message = message + "该订单有商品没有配货，请先完成配货。"
            wx.showModal({
              title: '订单发货',
              content: message,
              showCancel: false,
              success: function () {
                return
              }
            })
          }
        }
      }
    }
    if (selectedCount == 0) {
      wx.showModal({
        title: '订单发货',
        content: '请选选择需要发货的订单。在订单可以发货之前，需要先完成对该订单的配货。',
        showCancel: false,
        success: function () {
          return
        }
      })
    }
  },

  onTopnavTap: function(index, item){
    console.log(index, item)
  },

  onLoad: function (options) {
    this.topnavs = new Topnavs({
      items: [{
        title: '待发货订单',
        status: '1'
      },
      {
        title: '已发货订单',
        status: '2'
      },
      {
        title: '已完成订单',
        status: '3'
      }],
      justify: 'justify-left',
      onTopnavTap: this.onTopnavTap
    })

    Trade.getTrades_seller_v3().then(function (orders) {
      this.orders = orders
      let itemTrades = Trade.getItemTrades(orders)
      let buyerTrades = Trade.getBuyerTrades(orders)
      this.setData({
        itemTrades,
        buyerTrades,
      })
    }.bind(this))
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})