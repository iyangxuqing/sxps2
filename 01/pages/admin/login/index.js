import { Toptip } from '../../../template/toptip/toptip.js'
import { Shop } from '../../../utils/shop.js'

Page({

  /**
   * 页面的初始数据
   */
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
      console.log(res, res.errno, res.errno === 0)
      if (res.errno === 0) {
        console.log('t')
        wx.setStorageSync('shopName', accountName)
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
    wx.navigateTo({
      url: '../shopRegister/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.toptip = new Toptip()
    let shopName = wx.getStorageSync('shopName') || ''
    if (shopName) {
      wx.redirectTo({
        url: '../index/index',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '登录',
      })
    }
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