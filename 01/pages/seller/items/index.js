import { ListGridEditor } from '../../../template/listGridEditor/listGridEditor.js'
import { Category } from '../../../utils/categorys.js'
import { Product } from '../../../utils/products.js'
import { Item } from '../../../utils/items.js'

let app = getApp()

Page({

  data: {
    tabs: [
      {
        title: '全部商品',
        active: false,
      },
      {
        title: '上架商品',
        active: true,
      },
      {
        title: '下架商品',
        active: false,
      }
    ],
    youImageMode: app.youImageMode,
  },

  onTabTap: function (e) {
    let index = e.currentTarget.dataset.index
    let tabs = this.data.tabs
    for (let i in tabs) {
      tabs[i].active = false
    }
    tabs[index].active = true
    this.setData({
      tabs: tabs
    })
  },

  onProductTap: function (product) {
    let id = product.id || ''
    let cid = product.cid || this.data.cate.id
    wx.navigateTo({
      url: '../product/product?id=' + id + '&cid=' + cid,
    })
  },

  onProductDel: function (product) {
    Product.del(product)
  },

  onProductSort: function (products) {
    Product.sort(products)
  },

  onProductsUpdate: function (products, product) {
    this.setData({
      'listGridEditor.items': products
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    Item.getSellerItems().then(function (items) {
      console.log(items)
      this.listGridEditor = new ListGridEditor({
        items: items,
        onItemTap: this.onItemTap,
        onItemDel: this.onItemDel,
        onItemSort: this.onItemSort
      })
      this.setData({
        ready: true
      })
    }.bind(this))

    // app.listener.on('products', this.onProductsUpdate)

    // let cid = options.cid
    // let cate = Category.getCategory(cid)
    // Product.getProducts({ cid: cate.id }).then(function (products) {
    //   this.listGridEditor = new ListGridEditor({
    //     items: products,
    //     onItemTap: this.onProductTap,
    //     onItemDel: this.onProductDel,
    //     onItemSort: this.onProductSort
    //   })
    //   this.setData({
    //     cate: cate,
    //     ready: true,
    //   })
    // }.bind(this))
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