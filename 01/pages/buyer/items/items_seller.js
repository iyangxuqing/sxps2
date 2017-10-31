
import { Shop } from '../../../utils/shop.js'
import { Item } from '../../../utils/items.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let t1 = Date.now()
    Promise.all([Shop.getShops(), Item.getItems()]).then(function (res) {
      let t2 = Date.now()
      let shops = res[0]
      let items = res[1]
      for (let i in shops) {
        let id = shops[i].id
        shops[i].items = []
        for (let j in items) {
          if (items[j].sid == id) {
            items[j].price = Number(items[j].price).toFixed(2)
            shops[i].items.push(items[j])
          }
        }
      }
      let t3 = Date.now()
      console.log(t2 - t1, t3 - t2)
      console.log(shops)
      this.setData({
        shops
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