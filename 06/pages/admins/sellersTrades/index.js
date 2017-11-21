import { http } from '../../../utils/http.js'

Page({

  data: {

  },

  onSearchInput: function (e) {
    let value = e.detail.value
    this.setData({
      searchKey: value
    })
  },

  onSearchCancel: function (e) {
    this.setData({
      searchKey: ''
    })
    this.onSearch()
  },

  onSearch: function (e) {
    let searchKey = this.data.searchKey
    let sellers = this.sellers
    let _sellers = []
    for (let i in sellers) {
      if (sellers[i].name.indexOf(searchKey) >= 0 || sellers[i].title.indexOf(searchKey) >= 0) {
        _sellers.push(sellers[i])
      }
    }
    this.setData({
      sellers: _sellers
    })
  },

  onSellerTap: function (e) {
    let sid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../sellerTrades?sid=' + sid,
    })
  },

  onLoad: function (options) {
    http.get({
      url: 'sxps/delivery.php?m=getSellers'
    }).then(function (res) {
      console.log(res)
      if (res.errno === 0) {
        let sellers = res.sellers
        this.sellers = sellers
        this.setData({
          sellers: sellers,
        })
      }
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