import { Toptip } from '../../../template/toptip/toptip.js'
import { Shop } from '../../../utils/shop.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onRegisterNameInput: function (e) {
    this.RegisterName = e.detail.value
  },

  onRegisterPasswordInput: function (e) {
    this.RegisterPassword = e.detail.value
  },

  onRegisterPassword2Input: function (e) {
    this.RegisterPassword2 = e.detail.value
  },

  onRegisterTap: function (e) {
    if (!this.RegisterName) {
      this.toptip.show({
        title: '请输入用户名'
      })
      return
    }

    if (/^(\w){6,20}$/.test(this.RegisterName) == false) {
      this.toptip.show({
        title: '用户名应为6-20位字母、数字或下滑线'
      })
      retutn
    }

    if (!this.RegisterPassword) {
      this.toptip.show({
        title: '请输入密码'
      })
      return
    }

    if (/^(\w){6,20}$/.test(this.RegisterPassword) == false) {
      this.toptip.show({
        title: '密码应为6-20位字母、数字或下滑线'
      })
      retutn
    }

    if (!(this.RegisterPassword == this.RegisterPassword2)) {
      this.toptip.show({
        title: '两次输入的密码不一致'
      })
      return
    }

    let that = this
    Shop.register({
      name: this.RegisterName,
      password: this.RegisterPassword
    }).then(function (res) {
      if (res.errno === 0) {
        let sid = res.insertId
        wx.setStorageSync('sellerId', sid)
        that.toptip.show({
          title: '用户注册成功',
          success: function () {
            wx.redirectTo({
              url: '../index/index',
            })
          }
        })
      }
    }).catch(function (res) {
      if (res.data.errno === 1001) {
        that.toptip.show({
          title: '用户名已经存在'
        })
      }
    })

  },

  onLoginLinkTap: function (e) {
    wx.navigateTo({
      url: '../login/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.toptip = new Toptip()
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