import { http } from '../../../utils/http.js'
import { Category } from '../../../utils/categorys.js'
import { Product } from '../../../utils/products.js'
import { SwiperImagesEditor } from '../../../template/swiperImagesEditor/swiperImagesEditor.js'

let app = getApp()

Page({

  hasChanged: false,

  data: {
    youImageMode: app.youImageMode,
  },

  onImagesChanged: function (images) {
    this.setData({
      'product.images': images
    })
    this.hasChanged = true
  },

  onTitleBlur: function (e) {
    let title = e.detail.value
    let oldTitle = this.data.product.title
    if (title == '' || title == oldTitle) {
      this.setData({
        'product.title': oldTitle
      })
    } else {
      this.setData({
        'product.title': title
      })
      this.hasChanged = true
    }
  },

  onDescsBlur: function (e) {
    let descs = e.detail.value
    let oldDescs = this.data.product.descs
    if (descs == '' || descs == oldDescs) {
      this.setData({
        'product.descs': oldDescs
      })
    } else {
      this.setData({
        'product.descs': descs
      })
      this.hasChanged = true
    }
  },

  onPriceBlur: function (e) {
    let price = e.detail.value
    let oldPrice = this.data.product.price
    if (price == '' || price == oldPrice) {
      this.setData({
        'product.price': oldPrice
      })
    } else {
      this.setData({
        'product.price': price
      })
      this.hasChanged = true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let cid = options.cid

    let product = {}
    if (id) {
      product = Product.getProduct({ cid, id })
    } else {
      product = {
        id: Date.now(),
        cid: cid,
        title: '',
        images: [],
        descs: '',
        price: '',
      }
    }

    this.swiperImagesEditor = new SwiperImagesEditor({
      maxImagesLength: 1,
      images: product.images,
      onImagesChanged: this.onImagesChanged
    })

    this.setData({
      ready: true,
      product: product,
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
  onHide: function (e) {
    let product = this.data.product
    if (this.hasChanged) Product.set(product)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (e) {
    let product = this.data.product
    if (this.hasChanged) Product.set(product)
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