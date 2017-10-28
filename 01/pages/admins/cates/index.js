import { Category } from '../../../utils/categorys.js'

Page({

  data: {

  },

  onExpandTap: function (e) {
    let id = e.currentTarget.dataset.id
    let cates = this.data.cates
    for (let i in cates) {
      if (cates[i].id == id) {
        cates[i].active = !cates[i].active
      } else {
        cates[i].active = false
      }
    }
    this.setData({
      cates: cates
    })
  },

  onEditorLongPress: function (e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      editId: id
    })
  },

  onLoad: function (options) {

    let page = this
    Category.getCategorys().then(function (cates) {
      page.setData({
        cates,
        ready: true,
      })
    })

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