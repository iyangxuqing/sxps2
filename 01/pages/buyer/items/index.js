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
        if (links[i].id == 1) type = 'itemsByCategory'
        if (links[i].id == 2) type = 'itemsBySeller'
      }
    }

    if (type == "itemsBySeller") {
      this.loadSellersItems()
    }
    this.setData({
      type: type,
      links: links
    })
  },

  onSearchInput: function (e) {
    let value = e.detail.value
    let type = this.data.type
    if (type == 'itemsByCategory') {
      this.setData({
        searchItem: value
      })
    } else if (type == 'itemsBySeller') {
      this.setData({
        searchSeller: value
      })
    }
  },

  onSearchSubmit: function (e) {
    let type = this.data.type
    if (type == 'itemsByCategory') {
      this.loadSearchItems()
    } else if (type == 'itemsBySeller') {
      this.loadSellersItems()
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

  onItemTap: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../item/index?id=' + id,
    })
  },

  onSellerTap: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../seller/index?id=' + id,
    })
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
    Item.getItems().then(function (_items) {
      let items = []
      for (let i in _items) {
        if (_items[i].cid == cid) {
          items.push(_items[i])
        }
      }
      this.setData({
        items: items,
        ready: true
      })
      this.onShoppingsUpdate()
    }.bind(this))
  },

  loadSellersItems: function () {
    let searchSeller = this.data.searchSeller
    Promise.all([
      Shop.getShops(),
      Item.getItems(),
    ]).then(function (res) {
      let shops = res[0]
      let items = res[1]
      let sellers = []
      for (let i in shops) {
        if (searchSeller && shops[i].title.indexOf(searchSeller) < 0) continue
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

  loadSearchItems: function () {
    let searchItem = this.data.searchItem
    Item.getItems().then(function (_items) {
      let items = []
      for (let i in _items) {
        if (_items[i].title.indexOf(searchItem) >= 0) {
          items.push(_items[i])
        }
      }
      this.setData({
        items: items
      })
      this.onShoppingsUpdate()
    }.bind(this))
  },

  onShoppingsUpdate: function () {
    let items = this.data.items
    let shoppings = wx.getStorageSync('shoppings')
    for (let i in items) {
      items[i].num = 0
      for (let j in shoppings) {
        if (items[i].id == shoppings[j].iid) {
          items[i].num = shoppings[j].num
          break
        }
      }
    }
    this.setData({
      items: items
    })
  },

  onLoad: function (options) {
    app.listener.on('shoppings', this.onShoppingsUpdate)
    Promise.all([
      Cate.getCates(),
      Item.getItems(),
    ]).then(function (res) {
      let cates = res[0]
      let shops = res[1]
      let items = res[2]

      cates[0].active = !0
      for (let i in cates) {
        if (cates[i].children.length) {
          cates[i].children[0].active = !0
        }
      }
      let level1Cates = cates
      let level2Cates = level1Cates[0].children
      this.setData({
        level1Cates,
        level2Cates,
      })
      this.loadCategoryItems()
    }.bind(this))
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})