import { Cate } from '../../../utils/cates.js'
import { Item } from '../../../utils/items.js'
import { Cates } from '../../../template/cates/cates.js'
import { Items } from '../../../template/items/items.js'
import { ItemDetail } from '../../../template/itemDetail/itemDetail.js'

let app = getApp()

Page({

  data: {
    youImageMode_v2: app.youImageMode_v2,
  },

  getActiveCateId() {
    let cates = this.data.cates.cates
    for (let i in cates) {
      if (cates[i].active == true) {
        for (let j in cates[i].children) {
          if (cates[i].children[j].active == true) {
            return cates[i].children[j].id
          }
        }
      }
    }
  },

  getItem(id) {
    let items = this.data.items.items
    for (let i in items) {
      if (items[i].id == id) {
        return items[i]
      }
    }
  },

  onItemsUpdate(items) {
    let searching = this.data.searching
    let searchWord = this.data.searchWord
    let cid = this.getActiveCateId()
    let _items = []
    if (searching) {
      for (let i in items) {
        if (items[i].title.indexOf(searchWord) >= 0) {
          _items.push(items[i])
        }
      }
    } else {
      for (let i in items) {
        if (items[i].cid == cid) {
          _items.push(items[i])
        }
      }
    }
    this.setData({
      'items.items': _items
    })
  },

  onSearchInput: function (e) {
    let value = e.detail.value
    this.setData({
      searchWord: value,
    })
  },

  onSearchCancel: function (e) {
    let _items = []
    let cid = this.getActiveCateId()
    Item.getItems_seller().then(function (items) {
      for (let i in items) {
        if (items[i].cid == cid) {
          _items.push(items[i])
        }
      }
      this.setData({
        searchWord: '',
        searching: false,
        'items.items': _items
      })
    }.bind(this))
  },

  onSearch: function (e) {
    let searchWord = this.data.searchWord
    if (!searchWord) return
    Item.getItems_seller().then(function (items) {
      let _items = []
      for (let i in items) {
        if (items[i].title.indexOf(searchWord) >= 0) {
          _items.push(items[i])
        }
      }
      this.setData({
        searching: true,
        'items.items': _items
      })
    }.bind(this))
  },

  onCateChanged: function (cid) {
    Item.getItems_seller().then(function (items) {
      let _items = []
      let cid = this.getActiveCateId()
      for (let i in items) {
        if (items[i].cid == cid) {
          _items.push(items[i])
        }
      }
      this.setData({
        searching: false,
        'items.items': _items
      })
    }.bind(this))
  },

  onItemTap: function (item) {
    if (!item.cid) item.cid = this.getActiveCateId()
    if (item.cid) {
      this.itemDetail.show(item)
    }
  },

  loadData: function (options = {}) {
    Promise.all([
      Cate.getCates_seller(options),
      Item.getItems_seller(options),
    ]).then(function (res) {
      let cates = res[0]
      let items = res[1]
      this.cates.update(cates)
      let cid = this.getActiveCateId()
      let _items = []
      for (let i in items) {
        if (items[i].cid == cid) {
          _items.push(items[i])
        }
      }
      this.setData({
        ready: true,
        'items.items': _items,
      })
      options.success && options.success()
    }.bind(this))
  },

  onLoad: function (options) {
    app.listener.on('items', this.onItemsUpdate.bind(this))
    this.cates = new Cates({
      cateChanged: this.onCateChanged
    })
    this.items = new Items({
      itemTap: this.onItemTap
    })
    this.itemDetail = new ItemDetail()
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

  },

  onReachBottom: function () {

  }
})