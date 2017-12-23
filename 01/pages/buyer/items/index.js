import { Cate } from '../../../utils/cates.js'
import { Item } from '../../../utils/items.js'
import { Cates } from '../../../template/cates_buyer/cates.js'
import { Items } from '../../../template/items_buyer/items.js'
import { Purchase } from '../../../template/purchase/purchase.js'

let app = getApp()

Page({

  data: {
    youImageMode_v2: app.youImageMode_v2,
    showItemsType: 'category'
  },

  onSearchInput: function (e) {
    let value = e.detail.value
    this.setData({
      searchWord: value,
    })
  },

  onSearchCancel: function (e) {
    this.setData({
      searchWord: '',
      searching: false,
    })
    let showItemsType = this.data.showItemsType
    if (showItemsType == 'history') {
      this.onSearchHistory()
    } else {
      this.onCateChanged()
    }
  },

  onSearch: function (e) {
    let searchWord = this.data.searchWord
    if (!searchWord) return
    Item.getItems().then(function (items) {
      this.items.update(items, { searchWord })
      this.setData({ searching: true })
    }.bind(this))
  },

  onSearchHistory: function (e) {
    let historyItems = wx.getStorageSync('historyItems')
    Item.getItems().then(function (items) {
      this.items.update(items, { ids: historyItems })
      this.setData({
        searching: false,
        showItemsType: 'history',
      })
    }.bind(this))
  },

  onCateChanged: function (cid) {
    if (!cid) cid = this.cates.getActiveCId()
    Item.getItems().then(function (items) {
      this.items.update(items, { cid })
      this.setData({
        searching: false,
        showItemsType: 'category',
      })
    }.bind(this))
  },

  onItemTap: function (item) {
    this.purchase.show(item)
  },

  onShoppingsUpdate: function () {
    let items = this.data.items.items
    let shoppings = wx.getStorageSync('shoppings')
    for (let i in items) {
      items[i].num = 0
      for (let j in shoppings) {
        if (items[i].id == shoppings[j].iid) {
          items[i].num = shoppings[j].num
          items[i].message = shoppings[j].message
          break
        }
      }
    }
    this.setData({
      'items.items': items,
    })
  },

  loadData: function (options = {}) {
    Promise.all([
      Cate.getCates(options),
      Item.getItems(options),
    ]).then(function (res) {
      let cates = res[0]
      let items = res[1]
      this.cates.update(cates)
      let cid = this.cates.getActiveCId()
      this.items.update(items, { cid })
      this.setData({ ready: true })
      options.success && options.success()
    }.bind(this))
  },

  onLoad: function (options) {
    app.listener.on('shoppings', this.onShoppingsUpdate)
    this.cates = new Cates({
      cateChanged: this.onCateChanged
    })
    this.items = new Items({
      itemTap: this.onItemTap
    })
    this.purchase = new Purchase({
      purchaseConfirm: this.onPurchaseConfirm
    })
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