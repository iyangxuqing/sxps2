import { Item } from '../../../utils/items.js'
import { Shop } from '../../../utils/shop.js'

let app = getApp()

Page({

  data: {
    youImageMode_v5: app.youImageMode_v5
  },

  onLoad: function (options) {
    let id = options.id || 68
    let item = {}
    let seller = {}
    Promise.all([
      Item.getItems(),
      Shop.getShops(),
    ]).then(function (res) {
      let items = res[0]
      let shops = res[1]
      for (let i in items) {
        if (items[i].id == id) {
          item = items[i]
          break
        }
      }
      let sid = item.sid
      for (let i in shops) {
        if (shops[i].id == sid) {
          seller = shops[i]
          break
        }
      }
      wx.setNavigationBarTitle({
        title: item.title,
      })
      this.setData({
        item: item,
        seller: seller,
      })
    }.bind(this))
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