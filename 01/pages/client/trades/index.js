// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navs: [
      {
        title: '全部',
        active: true
      },
      {
        title: '未提交'
      },
      {
        title: '待发货'
      },
      {
        title: '待收货'
      },
      {
        title: '已完成'
      }
    ]
  },

  onNavTap: function (e) {
    let index = e.currentTarget.dataset.index
    console.log(index)
    let navs = this.data.navs
    for (let i in navs) {
      navs[i].active = false
    }
    navs[index].active = true
    this.setData({
      navs: navs
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