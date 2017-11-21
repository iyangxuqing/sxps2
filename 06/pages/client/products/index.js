import { Category } from '../../../utils/categorys.js'
import { Product } from '../../../utils/products.js'

let app = getApp()

Page({

  data: {
    youImageMode: app.youImageMode,
    popup: {
      show: false
    },
  },

  onSearchWordsInput: function (e) {
    this.searchWords = e.detail.value
  },

  onSearchButtonTap: function (e) {
    let searchWords = this.searchWords
    if (!searchWords) return
    let products = []
    let _products = app.Products
    for (let i in _products) {
      for (let j in _products[i]) {
        if (_products[i][j].title.indexOf(searchWords) >= 0) {
          products.push(_products[i][j])
        }
      }
    }
    let shoppings = wx.getStorageSync('shoppings') || []
    for (let i in shoppings) {
      let iid = shoppings[i].iid
      let num = shoppings[i].num
      for (let j in products) {
        if (products[j].id == iid) {
          products[j].num = num
          break
        }
      }
    }
    this.setData({
      products: products
    })
  },

  onCateTap: function (e) {
    let id = e.currentTarget.dataset.id
    let cates = this.data.cates
    for (let i in cates) {
      cates[i].active = false
      if (cates[i].id == id) {
        cates[i].active = true
      }
    }
    this.setData({
      cates: cates
    })
    this.loadProducts()
  },

  onChildCateTap: function (e) {
    let id = e.currentTarget.dataset.id
    let cates = this.data.cates
    for (let i in cates) {
      if (cates[i].active) {
        for (let j in cates[i].children) {
          cates[i].children[j].active = false
          if (cates[i].children[j].id == id) {
            cates[i].children[j].active = true
          }
        }
        break
      }
    }
    this.setData({
      cates: cates
    })
    this.loadProducts()
  },

  onProductTap: function (e) {
    let id = e.currentTarget.dataset.id
    let products = this.data.products
    let product = {}
    for (let i in products) {
      if (products[i].id == id) {
        product = products[i]
        break
      }
    }
    let shopping = {
      iid: product.id,
      title: product.title,
      image: product.images[0],
      price: product.price,
      descs: product.descs,
      num: product.num || 1
    }
    shopping.price = Number(shopping.price).toFixed(2)
    shopping.amount = (shopping.price * shopping.num).toFixed(2)
    this.setData({
      'popup.show': true,
      shopping: shopping
    })
  },

  onPopupMaskTap: function (e) {
    this.setData({
      'popup.show': false
    })
  },

  onPopupClose: function (e) {
    this.setData({
      'popup.show': false
    })
  },

  onNumInput: function (e) {
    let num = e.detail.value
    let shopping = this.data.shopping
    shopping.amount = (Number(num) * shopping.price).toFixed(2)
    this.setData({
      'shopping.num': num,
      'shopping.amount': shopping.amount
    })
  },

  onMinusTap: function (e) {
    let shopping = this.data.shopping
    if (!shopping.num) shopping.num = 0
    if (shopping.num > 0) {
      shopping.num--
      shopping.amount = (shopping.price * shopping.num).toFixed(2)
      this.setData({
        'shopping.num': shopping.num,
        'shopping.amount': shopping.amount
      })
    }
  },

  onPlusTap: function (e) {
    let shopping = this.data.shopping
    if (!shopping.num) shopping.num = 0
    if (shopping.num < 999) {
      shopping.num++
      shopping.amount = (shopping.price * shopping.num).toFixed(2)
      this.setData({
        'shopping.num': shopping.num,
        'shopping.amount': shopping.amount
      })
    }
  },

  onAddShopping: function (e) {
    let shopping = this.data.shopping
    let products = this.data.products
    for (let i in products) {
      if (products[i].id == shopping.iid) {
        products[i].num = Number(shopping.num)
      }
    }
    let shoppings = wx.getStorageSync('shoppings') || []
    let index = -1
    for (let i in shoppings) {
      if (shoppings[i].iid == shopping.iid) {
        shoppings[i] = shopping
        index = i
        break
      }
    }
    if (index < 0) {
      index = shoppings.length
      shoppings.push(shopping)
    }
    if (shopping.num == 0) shoppings.splice(index, 1)
    wx.setStorageSync('shoppings', shoppings)

    this.setData({
      'products': products,
      'popup.show': false
    })
  },

  loadProducts: function () {
    let cates = this.data.cates
    let cid = ''
    for (let i in cates) {
      if (cates[i].active) {
        for (let j in cates[i].children) {
          if (cates[i].children[j].active) {
            cid = cates[i].children[j].id
            break
          }
        }
        break
      }
    }
    Product.getProducts({ cid }).then(function (_products) {
      let products = JSON.parse(JSON.stringify(_products))
      let shoppings = wx.getStorageSync('shoppings') || []
      for (let i in shoppings) {
        let iid = shoppings[i].iid
        let num = shoppings[i].num
        for (let j in products) {
          if (products[j].id == iid) {
            products[j].num = num
            break
          }
        }
      }
      this.setData({
        products: products,
      })
    }.bind(this))
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
    Category.getCategorys().then(function (cates) {
      cates[0].active = true
      for (let i in cates) {
        cates[i].children[0].active = true
      }
      this.setData({
        cates: cates
      })
      this.loadProducts()
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