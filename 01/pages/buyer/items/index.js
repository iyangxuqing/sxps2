import { Cate } from '../../../utils/cates.js'
import { Item } from '../../../utils/items.js'

let app = getApp()

Page({

  showItemsTypes: [],
  data: {
    youImageMode_v2: app.youImageMode_v2,
    showItemsType: 'category'
  },

  onSearchInput: function (e) {
    let value = e.detail.value
    this.setData({
      searchKey: value,
    })
  },

  onSearchCancel: function (e) {
    this.setData({
      searchKey: '',
      searching: false,
    })
    let showItemsType = this.data.showItemsType
    if (showItemsType == 'history') {
      this.onSearchHistory()
    } else {
      this.loadItems()
    }
  },

  onSearch: function (e) {
    let searchKey = this.data.searchKey
    if (!searchKey) return
    this.setData({
      searching: true
    })
    this.searchItems(searchKey)
  },

  onSearchHistory: function (e) {
    let historyItems = wx.getStorageSync('historyItems')
    Item.getItems().then(function (items) {
      let _items = []
      for (let i in historyItems) {
        for (let j in items) {
          if (historyItems[i].id == items[j].id) {
            _items.push(items[j])
            break
          }
        }
      }
      this.setData({
        ready: true,
        items: _items,
        showItemsType: 'history',
      })
      this.onShoppingsUpdate()
    }.bind(this))
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
    Item.getItems().then(function (items) {
      let _items = []
      for (let i in items) {
        if (items[i].cid == cid) {
          _items.push(items[i])
        }
      }
      this.setData({
        ready: true,
        items: _items,
        showItemsType: 'category',
      })
      this.onShoppingsUpdate()
    }.bind(this))
  },

  searchItems: function (searchKey) {
    Item.getItems().then(function (items) {
      let _items = []
      for (let i in items) {
        if (items[i].title.indexOf(searchKey) >= 0) {
          _items.push(items[i])
        }
      }
      this.setData({
        ready: true,
        items: _items,
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

  loadData: function (options = {}) {
    Promise.all([
      Cate.getCates(options),
      Item.getItems(options),
    ]).then(function (res) {
      let cates = res[0]
      let items = res[1]
      cates[0].active = true
      for (let i in cates) {
        if (i == 0) {
          cates[i].active = true
        } else {
          cates[i].active = false
        }
        for (let j in cates[i].children) {
          if (j == 0) {
            cates[i].children[j].active = true
          } else {
            cates[i].children[j].active = false
          }
        }
      }
      let level1Cates = cates
      let level2Cates = level1Cates[0].children
      this.setData({
        level1Cates,
        level2Cates,
      })

      let cid = level1Cates[0].children[0].id
      let _items = []
      for (let i in items) {
        if (items[i].cid == cid) {
          _items.push(items[i])
        }
      }
      this.setData({
        items: _items,
        ready: true
      })
      this.onShoppingsUpdate()
      options.success && options.success()
    }.bind(this))
  },

  onLoad: function (options) {
    app.listener.on('shoppings', this.onShoppingsUpdate)
    this.loadData()
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
    this.loadData({
      nocache: true,
      success: function (res) {
        wx.stopPullDownRefresh()
      }.bind(this)
    })
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})