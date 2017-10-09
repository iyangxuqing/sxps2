import { Cates, Products } from './cates.data.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  loadData(options) {
    let page = this
    Cates.getCates().then(function (cates) {
      let cateId = options.cateId
      if (!cateId) {
        cateId = cates[0].id
        for (let i in cates) {
          if (cates[i].active) {
            cateId = cates[i].id
            break
          }
        }
      }
      for (let i in cates) {
        cates[i].active = false
        if (cates[i].id == cateId) {
          cates[i].active = true
        }
      }
      Cates.getCate2s({ id: cateId }).then(function (cate2s) {
        let cate2Id = options.cate2Id
        if (!cate2Id) {
          if (cate2s.length) cate2Id = cate2s[0].id
          for (let i in cate2s) {
            if (cate2s[i].active) {
              cate2Id = cate2s[i].id
              break
            }
          }
        }
        for (let i in cate2s) {
          cate2s[i].active = false
          if (cate2s[i].id == cate2Id) {
            cate2s[i].active = true
          }
        }
        Products.getProducts({ cid: cate2Id }).then(function (products) {
          page.setData({
            cates,
            cate2s,
            products
          })
        })
      })
    })
  },

  onCateTap: function (e) {
    let id = e.currentTarget.dataset.id
    this.loadData({
      cateId: id
    })
  },

  onCate2Tap: function (e) {
    let currentCateId = -1
    let cates = this.data.cates
    for (let i in cates) {
      if (cates[i].active) {
        currentCateId = cates[i].id
        break
      }
    }
    let id = e.currentTarget.dataset.id
    Cates.getCate2s({ id: currentCateId }).then(function (cate2s) {
      for (let i in cate2s) {
        cate2s[i].active = false
        if (cate2s[i].id == id) {
          cate2s[i].active = true
        }
      }
      this.setData({
        cate2s: cate2s
      })
      Products.getProducts({ cid: id }).then(function (products) {
        this.setData({
          products
        })
      }.bind(this))
    }.bind(this))
  },

  onNumBlur: function(e){
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
    this.loadData({})
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