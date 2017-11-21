import { Toptip } from '../../../template/toptip/toptip.js'
import { Shop } from '../../../utils/shop.js'

Page({

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
    wx.redirectTo({
      url: '../login/index',
    })
  },

  onLoad: function (options) {
    this.toptip = new Toptip()
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