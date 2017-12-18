import { http } from '../../../utils/http.js'
import { Cate } from '../../../utils/cates.js'
import { Item } from '../../../utils/items.js'
import { Cates } from '../../../template/cates/cates.js'
import { Items } from '../../../template/items/items.js'

let app = getApp()

Page({

  data: {
    youImageMode_v2: app.youImageMode_v2,
  },

  onItemsUpdate(items) {
    this.loadItems()
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
        searching: false,
        showItemsType: 'history',
      })
      this.onShoppingsUpdate()
    }.bind(this))
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
    Item.getItems_seller().then(function (items) {
      let _items = []
      for (let i in items) {
        if (items[i].cid == cid) {
          _items.push(items[i])
        }
      }
      this.setData({
        ready: true,
        items: _items,
        searching: false,
        showItemsType: 'category',
      })
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
        searching: true,
      })
    }.bind(this))
  },

  loadData: function (options = {}) {
    Promise.all([
      Cate.getCates_seller(options),
      Item.getItems_seller(options),
    ]).then(function (res) {
      let cates = res[0]
      let items = res[1]
      this.cates.update(cates)
      this.items.update(items)
      this.setData({ ready: true })
      options.success && options.success()
    }.bind(this))
  },

  onLoad: function (options) {
    app.listener.on('items', this.onItemsUpdate)
    this.cates = new Cates({
      onCateChanged: this.onCateChanged
    })
    this.items = new Items()
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