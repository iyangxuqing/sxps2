// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    links: [
      {
        id: 1,
        text: '卖家版',
        url: '/pages/seller/login/index'
      },
      {
        id: 2,
        text: '买家版',
        url: '/pages/buyer/index/index'
      },
      {
        id: 3,
        text: '管理版',
        url: '/pages/admins/index/index'
      }
    ]
  },

  onLinkTap: function (e) {
    let index = e.currentTarget.dataset.index
    let url = this.data.links[index].url
    wx.navigateTo({
      url: url,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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