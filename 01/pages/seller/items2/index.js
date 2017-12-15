import { http } from '../../../utils/http.js'
import { Cate } from '../../../utils/cates.js'
import { Item } from '../../../utils/items.js'
import { Cates } from '../../../template/cates/cates.js'

let app = getApp()

Page({

  data: {
    youImageMode_v2: app.youImageMode_v2,
  },

  onItemLongPress: function (e) {
    let id = e.currentTarget.dataset.id
    let item = {}
    let items = this.data.items
    for (let i in items) {
      if (items[i].id == id) {
        item = items[i]
        break
      }
    }
    let actionSheetItemList = ['往前移', '往后移', '下架', '插入', '删除']
    if (item.onShelf == 0) {
      actionSheetItemList[2] = '上架'
    }
    wx.showActionSheet({
      itemList: actionSheetItemList,
      success: function (res) {
        switch (res.tapIndex) {
          case 0:
            this.itemSortUp(item)
            break
          case 1:
            this.itemSortDown(item)
            break
          case 2:
            this.itemOnShelf(item)
            break
          case 3:
            this.itemInsert(item)
            break
          case 4:
            this.itemDelete(item)
            break
          default:
        }
      }.bind(this)
    })
  },

  itemSortUp(item) {
    Item.set_seller(item, 'sortUp')
  },

  itemSortDown(item) {
    Item.set_seller(item, 'sortDown')
  },

  itemOnShelf(item) {
    item.onShelf = item.onShelf == 0 ? 1 : 0
    Item.set_seller(item, 'onShelf')
  },

  itemInsert(item) {
    let sort = Number(item.sort) + 1
    wx.navigateTo({
      url: '../item/index?cid=' + item.cid + '&sort=' + sort,
    })
  },

  itemDelete(item) {
    Item.set_seller(item, 'delete')
  },

  onItemsUpdate(items) {
    this.loadItems()
  },

  onLevel1CateLongPress: function (e) {
    console.log(e)
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
      Cate.getCates(options),
      Item.getItems_seller(options),
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
      this.cates = new Cates({
        cates: cates,
        onCateChanged: function (cid) {
          console.log(cid)
        }
      })
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
      options.success && options.success()
    }.bind(this))
  },

  onLoad: function (options) {
    app.listener.on('items', this.onItemsUpdate)
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