import { Trade } from '../../../utils/trades.js'

let app = getApp()

Page({

  data: {
    youImageMode_v2: app.youImageMode_v2,
    youImageMode_v5: app.youImageMode_v5,
  },

  getItemOrders: function (orders) {
    let itemOrders = []
    for (let i in orders) {
      let order = orders[i]
      let index = -1
      for (let j in itemOrders) {
        if (itemOrders[j].iid == order.iid) {
          index = j
          break
        }
      }
      if (index < 0) {
        index = itemOrders.length
        itemOrders.push({
          iid: order.iid,
          title: order.title,
          image: order.image,
          descs: order.descs,
          num: 0,
        })
      }
      itemOrders[index].num = itemOrders[index].num + Number(order.num)
    }
    return itemOrders
  },

  getBuyerOrders: function (orders) {
    let buyerOrders = []
    for (let i in orders) {
      let order = orders[i]
      let index = -1
      for (let j in buyerOrders) {
        if (buyerOrders[j].bid == order.bid) {
          index = j
          break
        }
      }
      if (index < 0) {
        index = buyerOrders.length
        buyerOrders.push({
          bid: order.bid,
          name: order.name,
          phone: order.phone,
          address: order.address,
          nickName: order.nickName,
          avatarUrl: order.avatarUrl,
          orders: [],
          time: new Date(order.created * 1000).Format('yyyy-MM-dd hh:mm:ss'),
        })
      }
      let itemOrders = buyerOrders[index].orders
      let itemIndex = -1
      for (let j in itemOrders) {
        if (itemOrders[j].iid == order.iid) {
          itemIndex = j
          break
        }
      }
      if (itemIndex < 0) {
        itemIndex = itemOrders.length
        itemOrders.push({
          iid: order.iid,
          title: order.title,
          image: order.image,
          descs: order.descs,
          price: Number(order.price).toFixed(2),
          num: 0,
        })
      }
      itemOrders[itemIndex].num = itemOrders[itemIndex].num + Number(order.num)
    }
    return buyerOrders
  },

  onOrderTap: function (e) {
    let bid = e.currentTarget.dataset.bid
    let iid = e.currentTarget.dataset.iid
    let buyerOrders = this.data.buyerOrders
    let distributeOrder = {}
    for (let i in buyerOrders) {
      if (buyerOrders[i].bid == bid) {
        for (let j in buyerOrders[i].orders) {
          let order = buyerOrders[i].orders[j]
          if (order.iid == iid) {
            distributeOrder = order
            distributeOrder.bid = bid
            distributeOrder.realNum = order.realNum || order.num
            break
          }
        }
        break
      }
    }
    this.setData({
      distributeOrder,
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
    let dOrder = this.data.distributeOrder
    if (dOrder.realNum > 0) {
      dOrder.realNum--
    }
    this.setData({
      distributeOrder: dOrder
    })
  },

  onRealNumInput: function (e) {
    let realNum = e.detail.value
    let dOrder = this.data.distributeOrder
    if (realNum >= 0 && realNum < dOrder.num * 2) {
      dOrder.realNum = realNum
    } else {
      dOrder.realNum = dOrder.num
    }
    this.setData({
      distributeOrder: dOrder
    })
  },

  onPlusTap: function (e) {
    let dOrder = this.data.distributeOrder
    if (dOrder.realNum < dOrder.num * 2) {
      dOrder.realNum++
    }
    this.setData({
      distributeOrder: dOrder
    })
  },

  onRealNumConfirm: function (e) {
    let dOrder = this.data.distributeOrder
    let buyerOrders = this.data.buyerOrders
    let bid = dOrder.bid
    let iid = dOrder.iid
    for (let i in buyerOrders) {
      if (buyerOrders[i].bid == bid) {
        for (let j in buyerOrders[i].orders) {
          if (buyerOrders[i].orders[j].iid == iid) {
            buyerOrders[i].orders[j].realNum = dOrder.realNum
            break
          }
        }
        break
      }
    }
    this.setData({
      buyerOrders,
      'popup.show': false,
    })
  },

  onBuyerSelectChange: function (e) {
    let value = e.detail.value
    let bid = e.currentTarget.dataset.bid
    let buyerOrders = this.data.buyerOrders
    for (let i in buyerOrders) {
      if (buyerOrders[i].bid == bid) {
        buyerOrders[i].selected = value
      }
    }
    this.setData({
      buyerOrders
    })
  },

  onAllSelectChange: function (e) {
    let value = e.detail.value
    let buyerOrders = this.data.buyerOrders
    for (let i in buyerOrders) {
      buyerOrders[i].selected = value
    }
    this.setData({
      buyerOrders
    })
  },

  onDeliveryTap: function (e) {
    let buyerOrders = this.data.buyerOrders
    let selectedCount = 0;
    for (let i in buyerOrders) {
      if (buyerOrders[i].selected) {
        selectedCount++
        for (let j in buyerOrders[i].orders) {
          if (!('realNum' in buyerOrders[i].orders[j])) {
            let message = "收货人：" + buyerOrders[i].name + "，"
            message = message + "订单时间：" + buyerOrders[i].time + "，"
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

  onLoad: function (options) {

    Trade.getTrades_seller().then(function (orders) {
      let itemOrders = this.getItemOrders(orders)
      let buyerOrders = this.getBuyerOrders(orders)
      console.log(orders)
      console.log(itemOrders)
      console.log(buyerOrders)
      this.setData({
        itemOrders,
        buyerOrders,
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