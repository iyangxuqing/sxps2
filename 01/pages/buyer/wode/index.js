import { Loading } from '../../../template/loading/loading.js'
import { Toptip } from '../../../template/toptip/toptip.js'
import { Mobile } from '../../../template/mobile/mobile.js'
import { User } from '../../../utils/user.js'
import { Buyer } from '../../../utils/buyer.js'

let app = getApp()

Page({

  data: {
    youImageMode: app.youImageMode_v2,
    sellerInfo: {
      title: '义乌市铱星生鲜配送',
      logo: '/images/logo/logo_v1.png',
      phone: '13757950478',
    },
    tradeLinks: [{
      title: '已提交',
      status: '买家提交',
      icon: '/images/icon/order-uncommitted.png',
    }, {
      title: '已发货',
      status: '卖家发货',
      icon: '/images/icon/order-submitted.png',
    }, {
      title: '已收货',
      status: '买家收货',
      icon: '/images/icon/order-shipped.png',
    }, {
      title: '已完成',
      status: '订单完成',
      icon: '/images/icon/order-completed.png',
    }]
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
    wx.navigateTo({
      url: '../address/index'
    })
  },

  onToptip: function (message) {
    this.toptip.show({
      title: message
    })
  },

  onBuyerUpdate: function (buyer) {
    this.setData({ buyer })
  },

  onLinkTap: function (e) {
    let index = e.currentTarget.dataset.index
    let tradeLinks = this.data.tradeLinks
    let status = ''
    if (index >= 0) status = tradeLinks[index].status
    wx.setStorageSync('tradeStatus', status)
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
    app.listener.on('buyerUpdate', this.onBuyerUpdate)

    this.loading.show()
    Promise.all([
      User.getUser({ fields: 'avatarUrl, nickName, mobileNumber, mobileVerified' }),
      Buyer.getBuyer(),
    ]).then(function (res) {
      let user = res[0] || {}
      let buyer = res[1] || {}
      this.setData({
        'ready': true,
        'buyer': buyer,
        'userInfo.nickName': user.nickName,
        'userInfo.avatarUrl': user.avatarUrl,
        'mobile.number': user.mobileNumber,
        'mobile.verified': user.mobileVerified == '1',
      })
      this.loading.hide()
    }.bind(this)).catch(function (res) {
      this.loading.hide()
    })

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