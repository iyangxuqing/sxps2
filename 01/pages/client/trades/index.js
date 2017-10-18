import { Trade } from '../../../utils/trades.js'
import { Product } from '../../../utils/products.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navs: [
      {
        title: '全部',
        active: true
      },
      {
        title: '未提交'
      },
      {
        title: '已提交'
      },
      {
        title: '已发货'
      },
      {
        title: '已完成'
      }
    ]
  },

  onNavTap: function (e) {
    let index = e.currentTarget.dataset.index
    let navs = this.data.navs
    for (let i in navs) {
      navs[i].active = false
    }
    navs[index].active = true
    this.setData({
      navs: navs
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let index = 0
    if (id == 'link-0') index = 1
    if (id == 'link-1') index = 2
    if (id == 'link-2') index = 3
    if (id == 'link-3') index = 4
    let navs = this.data.navs
    for (let i in navs) {
      navs[i].active = false
    }
    navs[index].active = true
    this.setData({
      navs: navs
    })

    Product.getProducts().then(function (products) {
      console.log(products)
    })

    Trade.get().then(function (trades) {
      for (let i in trades) {
        let trade = trades[i]
        trade.id = 10000000 + Number(trade.id)
        trade.time = new Date(trade.created * 1000).Format('yyyy-MM-dd hh:mm:ss')
        let bookNum = 0;
        let realNum = 0;
        let bookAmount = 0;
        let realAmount = 0;
        for (let j in trade.orders) {
          let order = trade.orders[j]
          let iid = order.iid
          let product = Product.getProduct({ id: iid })
          order.image = product.images[0]
          order.title = product.title
          order.desc = product.desc || product.title + '(500克)'
          order.price = product.price
          order.bookAmount = (Number(order.bookNum) * order.price).toFixed(2)
          order.realAmount = (Number(order.realNum) * order.price).toFixed(2)
          bookNum = bookNum + Number(order.bookNum)
          bookAmount = bookAmount + Number(order.bookNum) * Number(order.price)
          realNum = realNum + Number(order.realNum)
          realAmount = realAmount + Number(order.realNum) * Number(order.price)
        }
        trade.bookNum = bookNum
        trade.bookAmount = bookAmount.toFixed(2)
        trade.realNum = realNum
        trade.realAmount = realAmount.toFixed(2)
      }
      this.setData({
        trades
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