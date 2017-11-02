import { Shop } from '../../../utils/shop.js'
import { Cate } from '../../../utils/cates.js'
import { Item } from '../../../utils/items.js'

let app = getApp()

Page({

  data: {
    links: [
      {
        id: 1,
        title: '分类',
        active: true
      },
      {
        id: 2,
        title: '商家',
        active: false
      }
    ],
    type: 'itemsByCategory',
    youImageMode_v2: app.youImageMode_v2
  },

  onLinkTap: function (e) {
    let id = e.currentTarget.dataset.id
    let links = this.data.links
    let type = ''
    for (let i in links) {
      links[i].active = false
      if (links[i].id == id) {
        links[i].active = true
        if (links[i].title == '分类') type = 'itemsByCategory'
        if (links[i].title == '商家') type = 'itemsBySeller'
      }
    }
    this.setData({
      search: '',
      type: type,
      links: links
    })
  },

  onSearchInput: function (e) {
    let value = e.detail.value
    let type = this.data.type
    if (type == 'itemsByCategory') {
      this.setData({
        searchTitle: value
      })
    } else if (type == 'itemsBySeller') {
      this.setData({
        searchSeller: value
      })
    }
  },

  onSearchSubmit: function (e) {
    let type = this.data.type
    let searchTitle = this.data.searchTitle
    let searchSeller = this.data.searchSeller
    if (type == 'itemsByCategory') {
      Item.getItems().then(function (items) {
        let foundItems = []
        for (let i in items) {
          if (items[i].title.indexOf(searchTitle) >= 0) {
            foundItems.push(items[i])
          }
        }
        this.setData({
          items: foundItems
        })
      }.bind(this))
    } else if (type == 'itemsBySeller') {
      this.loadSellersItems({ fliter: searchSeller })
    }
  },

  onLevel1CateTap: function (e) {
    let id = e.currentTarget.dataset.id
    let level1Cates = this.data.level1Cates
    let level2Cates = this.data.level2Cates
    for (let i in level1Cates) {
      level1Cates[i].active = !1
      if (level1Cates[i].id == id) {
        level2Cates = level1Cates[i].children
        level1Cates[i].active = !0
      }
    }
    this.setData({
      level1Cates,
      level2Cates,
    })
    this.loadCategoryItems()
  },

  onLevel2CateTap: function (e) {
    let id = e.currentTarget.dataset.id
    let level1Cates = this.data.level1Cates
    let level2Cates = []
    for (let i in level1Cates) {
      if (level1Cates[i].active) {
        for (let j in level1Cates[i].children) {
          level1Cates[i].children[j].active = !1
          if (level1Cates[i].children[j].id == id) {
            level1Cates[i].children[j].active = !0
          }
        }
        level2Cates = level1Cates[i].children
        break
      }
    }
    this.setData({
      level2Cates,
    })
    this.loadCategoryItems()
  },

  loadCategoryItems: function () {
    let level2Cates = this.data.level2Cates
    let cid = ''
    for (let i in level2Cates) {
      if (level2Cates[i].active) {
        cid = level2Cates[i].id
        break
      }
    }
    Item.getItems().then(function (items) {
      let categoryItems = []
      for (let i in items) {
        if (items[i].cid == cid) {
          categoryItems.push(items[i])
        }
      }
      this.setData({
        items: categoryItems,
        ready: true
      })
    }.bind(this))
  },

  loadSellersItems: function (options = { fliter: '' }) {
    Promise.all([Shop.getShops(), Item.getItems()]).then(function (res) {
      let shops = res[0]
      let items = res[1]
      let sellers = []
      for (let i in shops) {
        if (options.fliter && shops[i].title.indexOf(options.fliter) < 0) continue
        let id = shops[i].id
        let seller = {
          id: shops[i].id,
          logo: shops[i].logo,
          title: shops[i].title,
          address: shops[i].address,
          items: []
        }
        for (let j in items) {
          if (items[j].sid == id) {
            seller.items.push(items[j])
          }
        }
        sellers.push(seller)
      }
      this.setData({
        sellers: sellers
      })
    }.bind(this))
  },

  onSellerTap: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: './items_seller?id=' + id,
    })
  },

  onLoad: function (options) {
    Promise.all([
      Cate.getCates(),
      Shop.getShops(),
      Item.getItems(),
    ]).then(function (res) {
      let cates = res[0]
      let shops = res[1]
      let items = res[2]

      cates[0].active = !0
      for (let i in cates) {
        cates[i].children[0].active = !0
      }
      let level1Cates = cates
      let level2Cates = level1Cates[0].children
      this.setData({
        level1Cates,
        level2Cates,
      })

      this.loadSellersItems()
      this.loadCategoryItems()
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