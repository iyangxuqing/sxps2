// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onMinusTap: function (e) {
    let id = e.currentTarget.dataset.id
    let products = this.data.products
    let product = this.getProduct(products, id)
    if (product.num > 0) product.num--
    this.refreshProducts(products)
  },

  onPlusTap: function (e) {
    let id = e.currentTarget.dataset.id
    let products = this.data.products
    let product = this.getProduct(products, id)
    if (product.num < 999) product.num++
    this.refreshProducts(products)
  },

  onNumBlur: function (e) {
    let id = e.currentTarget.dataset.id
    let num = e.detail.value
    let products = this.data.products
    let product = this.getProduct(products, id)
    product.num = num
    this.refreshProducts(products)
  },

  getProduct(products, id) {
    for (let i in products) {
      if (products[i].id == id) {
        return products[i]
      }
    }
  },

  refreshProducts(products) {
    let num = 0;
    let amount = 0;
    for (let i in products) {
      let _num = Number(products[i].num)
      let _price = Number(products[i].price)
      if (_num == 0) {
        products.splice(i, 1)
        continue
      }
      num = num + _num
      amount = Number(amount) + _num * _price
      amount = amount.toFixed(2)
    }
    this.setData({
      num: num,
      amount: amount,
      products: products
    })
    wx.setStorageSync('shoppings', products)
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
    let products = wx.getStorageSync('shoppings')
    this.refreshProducts(products)
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