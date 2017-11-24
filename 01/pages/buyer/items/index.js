import { Cate } from '../../../utils/cates.js'
import { Item } from '../../../utils/items.js'

let app = getApp()

Page({

  data: {
    youImageMode_v2: app.youImageMode_v2
  },

  onSearchInput: function (e) {
    let value = e.detail.value
    this.setData({
      searchKey: value
    })
  },

  onSearchCancel: function (e) {
    this.setData({
      searchKey: ''
    })
    this.loadItems()
  },

  onSearch: function (e) {
    let searchKey = this.data.searchKey
    this.searchItems(searchKey)
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
    this.loadItems()
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
    this.loadItems()
  },

  onItemTap: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../item/index?id=' + id,
    })
  },

  loadItems: function () {
    let level2Cates = this.data.level2Cates
    let cid = ''
    for (let i in level2Cates) {
      if (level2Cates[i].active) {
        cid = level2Cates[i].id
        break
      }
    }
    Item.getItems_v4().then(function (_items) {
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

  searchItems: function (searchKey) {
    Item.getItems_v4().then(function (_items) {
      let items = []
      for (let i in _items) {
        if (_items[i].title.indexOf(searchKey) >= 0) {
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
      Item.getItems_v4(),
    ]).then(function (res) {
      let cates = res[0]
      let items = res[1]
      cates[0].active = true
      for (let i in cates) {
        if (cates[i].children.length) {
          cates[i].children[0].active = true
        }
      }
      let level1Cates = cates
      let level2Cates = level1Cates[0].children
      this.setData({
        level1Cates,
        level2Cates,
      })
      this.loadItems()
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