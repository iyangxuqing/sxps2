import { Toptip } from '../../../template/toptip/toptip.js'
import { SwiperImagesEditor } from '../../../template/swiperImagesEditor/swiperImagesEditor.js'
import { http } from '../../../utils/http.js'
import { Cate } from '../../../utils/cates.js'
import { Item } from '../../../utils/items.js'

let app = getApp()

Page({

  data: {
    youImageMode: app.youImageMode_v5
  },

  onCatesPickerChange: function (e) {
    let value = e.detail.value
    this.setData({
      value
    })
    this.onCateChanged(value)
  },

  onCatesPickerColumnChange: function (e) {
    let column = e.detail.column
    let value = e.detail.value
    if (column == 0) {
      let range = [this.cates, this.cates[value].children]
      this.setData({
        range
      })
    }
  },

  onCateChanged: function (value) {
    let level1Index = value[0]
    let level2Index = value[1]
    let cid = this.cates[level1Index].children[level2Index].id
    let oldCid = this.data.item.cid
    if (cid != oldCid) {
      this.setData({
        'item.cid': cid,
        hasChanged: true
      })
    }
  },

  onImagesChanged: function (images) {
    this.setData({
      'item.images': images,
      hasChanged: true
    })
  },

  onTitleBlur: function (e) {
    let title = e.detail.value
    let oldTitle = this.data.item.title
    if (title == '' || title == oldTitle) {
      this.setData({
        'item.title': oldTitle
      })
    } else {
      this.setData({
        'item.title': title,
        hasChanged: true
      })
    }
  },

  onDescsBlur: function (e) {
    let descs = e.detail.value
    let oldDescs = this.data.item.descs
    if (descs != oldDescs) {
      this.setData({
        'item.descs': descs,
        hasChanged: true
      })
    }
  },

  onPriceBlur: function (e) {
    let price = e.detail.value
    let oldPrice = this.data.item.price
    if (price != oldPrice) {
      this.setData({
        'item.price': price,
        hasChanged: true
      })
    }
  },

  onItemCancel: function (e) {
    wx.navigateBack()
  },

  onItemConfirm: function (e) {
    let hasChanged = this.data.hasChanged
    if (hasChanged) {
      let item = this.data.item
      Item.set_seller(item, item.id ? 'update' : 'insert').then(function () {
        this.toptip.show({
          title: '保存成功',
          success: function () {
            wx.navigateBack()
          }
        })
      }.bind(this))
    }
  },

  onLoad: function (options) {
    let id = options.id
    let cid = options.cid
    let sort = options.sort
    let item = Item.getItem_seller({ id })
    if (!item) item = { cid, sort }
    if (item.price) item.price = Number(item.price).toFixed(2)
    this.setData({ item })

    this.toptip = new Toptip()
    this.swiperImagesEditor = new SwiperImagesEditor({
      maxImagesLength: 1,
      images: item.images,
      onImagesChanged: this.onImagesChanged
    })

    Cate.getCates().then(function (cates) {
      this.cates = cates
      let level1Index = -1
      let level2Index = -1
      for (let i in cates) {
        for (let j in cates[i].children) {
          if (cates[i].children[j].id == item.cid) {
            level1Index = i
            level2Index = j
            break
          }
        }
        if (level1Index >= 0) break
      }
      let range = []
      if (level1Index < 0) {
        range = [cates, cates[0].children]
      } else {
        range = [cates, cates[level1Index].children]
      }
      let value = [level1Index, level2Index]
      this.setData({
        range,
        value,
        ready: true
      })
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

})