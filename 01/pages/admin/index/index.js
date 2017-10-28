import { Shop } from '../../../utils/shop.js'

let app = getApp()

Page({

  data: {
    links: [
      {
        text: '店铺信息',
        url: '../shop/index',
      },
      {
        text: '菜品管理',
        url: '../../seller/items/index'
      },
      {
        text: '订单管理',
        url: '../trades/index'
      }
    ]
  },

  onLogout: function (e) {
    wx.showModal({
      title: '账号管理',
      content: '要退出当前登录的账号吗？',
      success: function (e) {
        if (e.confirm) {
          app.sellerItems = null
          wx.setStorageSync('sellerId', '')
          wx.redirectTo({
            url: '../login/index',
          })
        }
      }
    })
  },

  onLinkTap: function (e) {
    let index = e.currentTarget.dataset.index
    let url = this.data.links[index].url
    wx.navigateTo({
      url: url,
    })
  },

  onLoad: function (options) {

  },

  onReady: function () {

  },

  onShow: function () {
    let sid = wx.getStorageSync('sellerId')
    Shop.get({
      id: sid,
      nocache: true
    }).then(function (shop) {
      this.setData({
        shop: shop
      })
    }.bind(this))
  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})