import { Shop } from '../../../utils/shop.js'
import { Item } from '../../../utils/items.js'

let app = getApp()

Page({

  data: {
    youImageMode_v2: app.youImageMode_v2,
    youImageMode_v5: app.youImageMode_v5,
  },

  onItemTap: function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../item/index?id=' + id,
    })
  },

  onShoppingsUpdate: function () {
    let shoppings = wx.getStorageSync('shoppings') || []
    let items = this.data.items
    for (let i in shoppings) {
      for (let j in items) {
        if (shoppings[i].iid == items[j].id) {
          items[j].num = shoppings[i].num
          break
        }
      }
    }
    this.setData({ items })
  },

  onLoad: function (options) {

    app.listener.on('shoppings', this.onShoppingsUpdate)

    let id = options.id
    Promise.all([
      Shop.getShops(),
      Item.getItems(),
    ]).then(function (res) {
      let shops = res[0]
      let _items = res[1]
      let seller = {}
      let items = []
      for (let i in shops) {
        if (shops[i].id == id) {
          seller = shops[i]
          break
        }
      }
      for (let i in _items) {
        if (_items[i].sid == id) {
          items.push(_items[i])
        }
      }
      let shoppings = wx.getStorageSync('shoppings') || []
      for (let i in shoppings) {
        for (let j in items) {
          if (shoppings[i].iid == items[j].id) {
            items[j].num = shoppings[i].num
            break
          }
        }
      }
      wx.setNavigationBarTitle({
        title: seller.title,
      })
      this.setData({
        seller,
        items,
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