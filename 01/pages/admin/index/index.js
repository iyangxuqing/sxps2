import { Shop } from '../../../utils/shop.js'
import { Product } from '../../../utils/products.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: {
      logo: '',
      name: '田歌农产品批发公司'
    },
    links: [
      {
        text: '店铺信息',
        url: '../shop/index',
      },
      {
        text: '菜品管理',
        url: '../categorys/categorys'
      },
      {
        text: '订单管理',
        url: '../trades/index'
      }
    ]
  },

  onLogout: function (e) {
    wx.showModal({
      title: '账号管理',
      content: '要退出当前登录的账号吗？',
      success: function (e) {
        if (e.confirm) {
          wx.setStorageSync('sellerId', '')
          wx.redirectTo({
            url: '../login/index',
          })
        }
      }
    })
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

    Product.getProducts()

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
    let sellerId = wx.getStorageSync('sellerId')
    Shop.get({
      id: sellerId,
      nocache: true
    }).then(function (shop) {
      this.setData({ shop })
    }.bind(this))
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