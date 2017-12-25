let app = getApp()

Page({

  data: {
    links: [{
      text: '菜品管理',
      url: '../items/index',
    }, {
      text: '订单汇总',
      url: '../trades_summary/index',
    }, {
      text: '订单管理',
      url: '../trades/index',
    }, {
      text: '前往买家版',
      url: '../../buyer/items/index',
    }]
  },

  onLinkTap: function (e) {
    let index = e.currentTarget.dataset.index
    let url = this.data.links[index].url
    if (url.indexOf('buyer') > 0) {
      wx.removeStorageSync('dataver')
      wx.reLaunch({
        url: url,
      })
    } else {
      wx.navigateTo({
        url: url,
      })
    }
  },

  onLoad: function (options) {

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