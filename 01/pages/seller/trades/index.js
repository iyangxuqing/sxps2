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
          price: order.price,
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
    for(let i in buyerOrders){
      if(buyerOrders[i].bid == bid){
        for(let j in buyerOrders[i].orders){
          if(buyerOrders[i].orders[j].iid == iid){
            distributeOrder = buyerOrders[i].orders[j]
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