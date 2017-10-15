import { Cates, Products } from './cates.data.js'
import { Category } from '../../../utils/categorys.js'
import { Product } from '../../../utils/products.js'
Page({

  touch: {},

  data: {

  },

  onTopbarTouchStart: function (e) {
    this.touch.x1 = e.touches[0].clientX;
    this.touch.y1 = e.touches[0].clientY;
    this.touch.t1 = e.timeStamp;
    this.touch.x2 = e.touches[0].clientX;
    this.touch.y2 = e.touches[0].clientY;
    this.touch.t2 = e.timeStamp;
  },

  onTopbarTouchMove: function (e) {
    this.touch.x2 = e.touches[0].clientX;
    this.touch.y2 = e.touches[0].clientY;
    this.touch.t2 = e.timeStamp;
  },

  onTopbarTouchEnd: function (e) {
    this.touch.t2 = e.timeStamp
    let dx = this.touch.x2 - this.touch.x1
    let dy = this.touch.y2 - this.touch.y1
    let dt = this.touch.t2 - this.touch.t1
    if ((Math.abs(dx) < Math.abs(dy) / 2 && dt < 250)) {
      if (dy < -20) this.onTopbarSwipeUp()
      if (dy > 20) this.onTopbarSwipeDown()
    }
  },

  onTopbarSwipeUp() {
    this.setData({
      'topbar.expand': false,
    })
  },

  onTopbarSwipeDown() {
    this.setData({
      'topbar.expand': true
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
    Product.getProducts({
      cid: cid
    }).then(function (products) {
      console.log(products)
      this.setData({
        products: products
      })
    }.bind(this))
  },

  onNumBlur: function (e) {
    let id = e.currentTarget.dataset.id
    let num = e.detail.value
    console.log(e, id, num)
    let products = this.data.products
    let product = {}
    for (let i in products) {
      if (products[i].id == id) {
        product = products[i]
        product.num = num
      }
    }
    this.setData({
      products
    })
  },

  onMinusTap: function (e) {
    let id = e.currentTarget.dataset.id
    let products = this.data.products
    let product = {}
    for (let i in products) {
      if (products[i].id == id) {
        product = products[i]
        if (!product.num) product.num = 0
      }
    }
    if (product.num > 0) {
      product.num--
      this.setData({
        products
      })
    }
  },

  onPlusTap: function (e) {
    let id = e.currentTarget.dataset.id
    let products = this.data.products
    let product = {}
    for (let i in products) {
      if (products[i].id == id) {
        product = products[i]
        if (!product.num) product.num = 0
      }
    }
    if (product.num < 99) {
      product.num++
      this.setData({
        products
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    Category.getCategorys().then(function (cates) {
      this.loadCates({
        cates: cates,
        'topbar.expand': true
      })
    }.bind(this))

    // Cates.getCates().then(function (cates) {
    //   this.loadCates({
    //     cates: cates,
    //     'topbar.expand': true
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