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

  onKeywordsInput: function (e) {
    this.keywords = e.detail.value
  },

  onSearchSubmit: function () {
    let keywords = this.keywords
    let products = app.Products
    let _products = []
    for (let i in products) {
      for (let j in products[i]) {
        if (products[i][j].title.indexOf(keywords) >= 0) {
          _products.push(products[i][j])
        }
      }
    }
    let shoppings = wx.getStorageSync('shoppings') || []
    for (let i in shoppings) {
      let iid = shoppings[i].iid
      let num = shoppings[i].num
      for (let j in _products) {
        if (_products[j].id == iid) {
          _products[j].num = num
          break
        }
      }
    }
    this.setData({
      products: _products
    })
  },

  onSearchTap: function (e) {
    let searchBarExpand = !this.data.searchBarExpand
    this.setData({
      searchBarExpand
    })
  },

  onLevel1CateTap: function (e) {
    let id = e.currentTarget.dataset.id
    this.loadCates({
      level1CateId: id
    })
  },

  onLevel2CateTap: function (e) {
    let id = e.currentTarget.dataset.id
    this.loadCates({
      level2CateId: id
    })
    this.setData({
      'topbar.expand': false
    })
  },

  loadCates: function (options) {
    if (options.cates) {
      this.cates = options.cates
      let cates = this.cates
      if (!('active' in cates[0])) {
        cates[0].active = true
        for (let i in cates) {
          if (cates[i].children && cates[i].children.length) {
            cates[i].children[0].active = true
          }
        }
      }
    }

    let cates = this.cates
    if (options.level1CateId) {
      for (let i in cates) {
        cates[i].active = false
        if (cates[i].id == options.level1CateId) {
          cates[i].active = true
        }
      }
    }

    if (options.level2CateId) {
      for (let i in cates) {
        if (cates[i].active) {
          for (let j in cates[i].children) {
            cates[i].children[j].active = false
            if (cates[i].children[j].id == options.level2CateId) {
              cates[i].children[j].active = true
            }
          }
          break
        }
      }
    }

    let level1Cates = []
    let level2Cates = []
    for (let i in cates) {
      level1Cates.push({
        id: cates[i].id,
        title: cates[i].title,
        active: cates[i].active
      })
      if (cates[i].active) {
        for (let j in cates[i].children) {
          level2Cates.push({
            id: cates[i].children[j].id,
            title: cates[i].children[j].title,
            active: cates[i].children[j].active
          })
        }
      }
    }

    this.setData({
      level1Cates,
      level2Cates,
    })

    this.loadProducts()
  },

  loadProducts: function () {
    let cates = this.cates
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
      this.loadCates({
        cates: cates,
        'topbar.expand': true
      })
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