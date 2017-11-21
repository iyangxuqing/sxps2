import { Toptip } from '../../../template/toptip/toptip.js'
import { Shop } from '../../../utils/shop.js'

Page({

  data: {

  },

  onAccountNameInput: function (e) {
    let accountName = e.detail.value
    this.accountName = accountName
  },

  onAccountPassInput: function (e) {
    let accountPass = e.detail.value
    this.accountPass = accountPass
  },

  onLogin: function (e) {
    let accountName = this.accountName
    let accountPass = this.accountPass
    if (!accountName && !accountPass) return

    let that = this
    Shop.login({
      name: accountName,
      password: accountPass,
    }).then(function (res) {
      if (res.errno === 0) {
        wx.setStorageSync('sellerId', res.sid)
        that.toptip.show({
          title: '登录成功',
          success: function (e) {
            wx.redirectTo({
              url: '../index/index',
            })
          }
        })
      } else {
        that.toptip.show({
          title: '账号或密码错误'
        })
      }
    }).catch(function (res) {
      that.toptip.show({
        title: '账号或密码错误'
      })
    })
  },

  onPasswordForget: function (e) {

  },

  onRegisterLink: function (e) {
    wx.redirectTo({
      url: '../register/index',
    })
  },

  onLoad: function (options) {
    this.toptip = new Toptip()
    let sid = wx.getStorageSync('sellerId')
    if (sid) {
      wx.redirectTo({
        url: '../index/index',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '登录',
      })
    }
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

  },

  onShareAppMessage: function () {

  }
})