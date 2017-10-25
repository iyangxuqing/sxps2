import { http } from '../../../utils/http.js'
import { Shop } from '../../../utils/shop.js'

let app = getApp()

Page({

  hasChanged: false,

  data: {
    youImageMode: app.youImageMode,
  },

  onShopNameBlur: function (e) {
    let name = e.detail.value
    let oldName = this.data.shop.Name
    if (name != oldName) {
      this.setData({
        'shop.name': name
      })
      this.hasChanged = true
    }
  },

  onShopPhoneBlur: function (e) {
    let phone = e.detail.value
    let oldPhone = this.data.shop.phone
    if (phone != oldPhone) {
      this.setData({
        'shop.phone': phone
      })
      this.hasChanged = true
    }
  },

  onShopAddressBlur: function (e) {
    let address = e.detail.value
    let oldAddress = this.data.shop.address
    if (address != oldAddress) {
      this.setData({
        'shop.address': address
      })
      this.hasChanged = true
    }
  },

  onShopLogoTap: function (e) {
    let page = this
    http.chooseImage().then(function (image) {
      page.setData({
        'shop.logo': image
      })
      page.hasChanged = true
    })
  },

  onShopImageTap: function (e) {
    let index = e.currentTarget.dataset.index
    let images = this.data.shop.images
    let page = this
    http.chooseImage().then(function(image){
      images[index] = image
      page.setData({
        'shop.images': images
      })
      page.hasChanged = true
    })
  },

  onAddressMapTap: function (e) {
    let page = this
    wx.chooseLocation({
      success: function (res) {
        let latitude = res.latitude.toFixed(5)
        let longitude = res.longitude.toFixed(5)
        page.setData({
          'shop.latitude': latitude,
          'shop.longitude': longitude,
        })
        page.hasChanged = true
      }
    })
  },

  saveShop: function () {
    if (this.hasChanged) {
      let shop = this.data.shop
      Shop.set(shop)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let page = this
    Shop.get().then(function (shop) {
      page.setData({
        shop: shop,
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
    this.saveShop()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.saveShop()
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