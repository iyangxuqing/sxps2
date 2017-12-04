import { Loading } from '../../../template/loading/loading.js'
import { Toptip } from '../../../template/toptip/toptip.js'
import { Mobile } from '../../../template/mobile/mobile.js'
import { User } from '../../../utils/user.js'

let app = getApp()

Page({

  data: {
    youImageMode: app.youImageMode_v2,
    serviceProvider: {
      title: '义乌市铱星生鲜配送',
      logo: '/images/logo/logo_v1.png',
      phone: '13757950478',
    }
  },

  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo
      })
      User.setUser(e.detail.userInfo)
    }
  },

  onAddressTap: function (e) {
    let address = this.data.address || {}
    let province = address.province || ''
    let city = address.city || ''
    let district = address.district || ''
    let detail = address.detail || ''
    let name = address.name || ''
    wx.navigateTo({
      url: '../address/index?province=' + province + '&city=' + city + '&district=' + district + '&detail=' + detail + '&name=' + name,
    })
  },

  onToptip: function (message) {
    this.toptip.show({
      title: message
    })
  },

  onUserUpdate: function (user) {
    this.setData({
      'userInfo.nickName': user.nickName,
      'userInfo.avatarUrl': user.avatarUrl,
      'mobile.number': user.mobileNumber,
      'mobile.verified': user.mobileVerified == '1',
      address: {
        province: user.address_province,
        city: user.address_city,
        district: user.address_district,
        detail: user.address_detail,
        name: user.address_name,
      },
    })
  },

  onUserAddressUpdate: function (address) {
    this.setData({
      address,
    })
  },

  onLinkTap: function (e) {
    let index = e.currentTarget.dataset.index
    wx.setStorageSync('orderIndex', index)
    wx.switchTab({
      url: '../trades/index',
    })
  },

  onShopLongPress: function (e) {
    if (app.user.role == 'admin') {
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }
  },

  onShopTeleTap: function (e) {
    let phoneNumber = e.currentTarget.dataset.phoneNumber
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    })
  },

  onLoad: function (options) {
    this.loading = new Loading()
    this.toptip = new Toptip()
    this.mobile = new Mobile()
    app.listener.on('toptip', this.onToptip)
    app.listener.on('user', this.onUserUpdate)
    app.listener.on('userAddressUpdate', this.onUserAddressUpdate)

    this.loading.show()
    User.getUser({
      fields: 'avatarUrl, nickName, mobileNumber, mobileVerified, address_province, address_city, address_district, address_detail',
    }).then(function (user) {
      if (!user) user = {}
      this.setData({
        'ready': true,
        'userInfo.nickName': user.nickName,
        'userInfo.avatarUrl': user.avatarUrl,
        'mobile.number': user.mobileNumber,
        'mobile.verified': user.mobileVerified == '1',
        address: {
          province: user.address_province,
          city: user.address_city,
          district: user.address_district,
          detail: user.address_detail,
          name: user.address_name,
        },
      })
      this.loading.hide()
    }.bind(this))

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