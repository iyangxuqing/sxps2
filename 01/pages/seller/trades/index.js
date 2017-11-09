import { Trade } from '../../../utils/trades.js'

let app = getApp()

Page({

  data: {
    youImageMode_v2: app.youImageMode_v2,
    youImageMode_v5: app.youImageMode_v5,
  },

  getOrderItems: function (orders) {
    let orderItems = []
    for (let i in orders) {
      let order = orders[i]
      let index = -1
      for (let j in orderItems) {
        if (orderItems[j].iid == order.iid) {
          index = j
          break
        }
      }
      if (index < 0) {
        index = orderItems.length
        orderItems.push({
          iid: order.iid,
          title: order.title,
          image: order.image,
          descs: order.descs,
          num: 0,
          buyers: [],
        })
      }
      let buyers = orderItems[index].buyers
      let buyerIndex = -1
      for (let j in buyers) {
        if (buyers[j].bid == order.bid) {
          buyerIndex = j
          break
        }
      }
      if (buyerIndex < 0) {
        buyerIndex = buyers.length
        buyers.push({
          bid: order.bid,
          name: order.name,
          phone: order.phone,
          address: order.address,
          nickName: order.nickName,
          avatarUrl: order.avatarUrl,
          num: 0,
        })
      }
      orderItems[index].buyers[buyerIndex].num += Number(order.num)
      orderItems[index].num += Number(order.num)
    }
    return orderItems
  },

  getOrderBuyers: function (orders) {
    let orderBuyers = []
    for (let i in orders) {
      let order = orders[i]
      let index = -1
      for (let j in orderBuyers) {
        if (orderBuyers[j].bid == order.bid) {
          index = j
          break
        }
      }
      if (index < 0) {
        index = orderBuyers.length
        orderBuyers.push({
          bid: order.bid,
          name: order.name,
          phone: order.phone,
          address: order.address,
          nickName: order.nickName,
          avatarUrl: order.avatarUrl,
          items: [],
          time: new Date(order.created * 1000).Format('yyyy-MM-dd hh:mm:ss'),
        })
      }
      let items = orderBuyers[index].items
      let itemIndex = -1
      for (let j in items) {
        if (items[j].iid == order.iid) {
          itemIndex = j
          break
        }
      }
      if (itemIndex < 0) {
        itemIndex = items.length
        items.push({
          iid: order.iid,
          title: order.title,
          image: order.image,
          descs: order.descs,
          price: Number(order.price).toFixed(2),
          num: 0,
        })
      }
      items[itemIndex].num += Number(order.num)
    }
    return orderBuyers
  },

  onDistributeTap: function (e) {
    let bid = e.currentTarget.dataset.bid
    let iid = e.currentTarget.dataset.iid
    let orderBuyers = this.data.orderBuyers
    let distributeItem = {}
    for (let i in orderBuyers) {
      if (orderBuyers[i].bid == bid) {
        for (let j in orderBuyers[i].items) {
          let item = orderBuyers[i].items[j]
          if (item.iid == iid) {
            distributeItem = item
            distributeItem.bid = bid
            distributeItem.realNum = item.realNum || item.num
            break
          }
        }
        break
      }
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
    let orderBuyers = this.data.orderBuyers
    let bid = dItem.bid
    let iid = dItem.iid
    for (let i in orderBuyers) {
      if (orderBuyers[i].bid == bid) {
        for (let j in orderBuyers[i].items) {
          if (orderBuyers[i].items[j].iid == iid) {
            orderBuyers[i].items[j].realNum = dItem.realNum
            break
          }
        }
        break
      }
    }
    this.setData({
      orderBuyers,
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

  onLoad: function (options) {

    Trade.getTrades_seller().then(function (orders) {
      let orderItems = this.getOrderItems(orders)
      let orderBuyers = this.getOrderBuyers(orders)
      this.setData({
        orderItems,
        orderBuyers,
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